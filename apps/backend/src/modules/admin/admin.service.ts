import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';

@Injectable()
export class AdminService {
  constructor(private userService: UserService) {}

  // Placeholder for admin operations
  // Will be implemented in Step 6
}

