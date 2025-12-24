import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { SocketEvents } from '@repo/shared';

/**
 * Extended Socket interface with typed data
 */
interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    email: string;
    role: string;
  };
}

/**
 * Connection error types
 */
enum ConnectionError {
  NO_TOKEN = 'NO_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  USER_BANNED = 'USER_BANNED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Socket Gateway for real-time user notifications
 * Handles JWT authentication, room management, and event broadcasting
 */
@WebSocketGateway({
  cors: {
    origin: [
      process.env.USER_APP_URL || 'http://localhost:3000',
      process.env.ADMIN_APP_URL || 'http://localhost:3001',
    ],
    credentials: true,
  },
  namespace: '/',
})
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(SocketGateway.name);
  
  // Track active connections by userId
  private readonly activeConnections = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  /**
   * Handle socket connection with JWT authentication
   */
  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      // Extract token from handshake auth or query
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;

      if (!token || typeof token !== 'string') {
        this.handleConnectionError(
          client,
          ConnectionError.NO_TOKEN,
          'No token provided',
        );
        return;
      }

      let payload: any;
      try {
        // Verify JWT token
        payload = this.jwtService.verify(token, {
          secret: this.configService.get<string>('jwt.secret'),
        });
      } catch (jwtError) {
        this.handleConnectionError(
          client,
          ConnectionError.INVALID_TOKEN,
          'Invalid or expired token',
        );
        return;
      }

      // Load user from database to check current status
      const user = await this.userService.findOne(payload.sub);

      if (!user) {
        this.handleConnectionError(
          client,
          ConnectionError.USER_NOT_FOUND,
          `User ${payload.sub} not found`,
        );
        return;
      }

      // Check if user is banned
      if (user.isBanned) {
        this.handleConnectionError(
          client,
          ConnectionError.USER_BANNED,
          `User ${user.id} is banned`,
        );
        return;
      }

      // Attach user info to socket data with type safety
      const authenticatedClient = client as AuthenticatedSocket;
      authenticatedClient.data = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      // Join user to their personal room for targeted events
      const userRoom = `user:${user.id}`;
      await authenticatedClient.join(userRoom);

      // Track active connection
      this.trackConnection(user.id, authenticatedClient.id);

      this.logger.log(
        `User ${user.id} (${user.email}) connected to room ${userRoom} [Active connections: ${this.getActiveConnectionCount(user.id)}]`,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.handleConnectionError(
        client,
        ConnectionError.UNKNOWN_ERROR,
        errorMessage,
      );
    }
  }

  /**
   * Handle connection errors with specific error types
   */
  private handleConnectionError(
    client: Socket,
    errorType: ConnectionError,
    message: string,
  ) {
    this.logger.warn(`Connection rejected [${errorType}]: ${message}`);
    client.emit('error', { type: errorType, message });
    client.disconnect();
  }

  /**
   * Track active connection for a user
   */
  private trackConnection(userId: string, socketId: string) {
    if (!this.activeConnections.has(userId)) {
      this.activeConnections.set(userId, new Set());
    }
    this.activeConnections.get(userId)!.add(socketId);
  }

  /**
   * Remove connection tracking for a user
   */
  private untrackConnection(userId: string, socketId: string) {
    const connections = this.activeConnections.get(userId);
    if (connections) {
      connections.delete(socketId);
      if (connections.size === 0) {
        this.activeConnections.delete(userId);
      }
    }
  }

  /**
   * Get active connection count for a user
   */
  private getActiveConnectionCount(userId: string): number {
    return this.activeConnections.get(userId)?.size || 0;
  }

  /**
   * Handle socket disconnection
   */
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const authenticatedClient = client as AuthenticatedSocket;
    const userId = authenticatedClient.data?.userId;
    
    if (userId) {
      // Remove connection tracking
      this.untrackConnection(userId, authenticatedClient.id);
      
      this.logger.log(
        `User ${userId} disconnected [Remaining connections: ${this.getActiveConnectionCount(userId)}]`,
      );
    }
  }

  /**
   * Emit user.banned event to specific user
   */
  emitUserBanned(userId: string, message: string) {
    const userRoom = `user:${userId}`;
    this.server.to(userRoom).emit(SocketEvents.USER_BANNED, {
      userId,
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted ${SocketEvents.USER_BANNED} to user ${userId}`);
  }

  /**
   * Emit user.unbanned event to specific user
   */
  emitUserUnbanned(userId: string, message: string) {
    const userRoom = `user:${userId}`;
    this.server.to(userRoom).emit(SocketEvents.USER_UNBANNED, {
      userId,
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Emitted ${SocketEvents.USER_UNBANNED} to user ${userId}`);
  }

  /**
   * Emit user.tier.updated event to specific user
   */
  emitUserTierUpdated(
    userId: string,
    newTier: string,
    oldTier: string,
    message: string,
  ) {
    const userRoom = `user:${userId}`;
    this.server.to(userRoom).emit(SocketEvents.USER_TIER_UPDATED, {
      userId,
      newTier,
      oldTier,
      message,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(
      `Emitted ${SocketEvents.USER_TIER_UPDATED} to user ${userId}`,
    );
  }
}

