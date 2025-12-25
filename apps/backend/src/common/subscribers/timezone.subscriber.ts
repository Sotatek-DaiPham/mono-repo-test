import { DataSource } from 'typeorm';

/**
 * Timezone Subscriber
 * Ensures PostgreSQL connection uses UTC timezone for all operations
 * This fixes timezone issues where timestamps are stored with wrong timezone
 * 
 * Note: This is registered as a subscriber in TypeORM config
 * and will be called automatically after connection is established
 */
export class TimezoneSubscriber {
  /**
   * Called after connection is established
   * Sets timezone to UTC for this connection
   */
  afterConnect(dataSource: DataSource): void {
    // Set timezone to UTC for this connection
    // This ensures all timestamp operations use UTC
    dataSource.query("SET timezone = 'UTC'").catch((err) => {
      console.error('Failed to set PostgreSQL timezone to UTC:', err);
    });
  }
}

