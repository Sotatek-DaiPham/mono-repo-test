import { DataSource } from 'typeorm';
import { AppDataSource } from '../data-source';
import { User, UserRole, UserTier } from '../entities/user.entity';

async function seed() {
  try {
    // Initialize DataSource
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepository = AppDataSource.getRepository(User);

    // Check if users already exist
    const existingUsers = await userRepository.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Users already exist. Skipping seed.');
      await AppDataSource.destroy();
      return;
    }

    // Create admin user
    const adminUser = userRepository.create({
      email: 'admin@example.com',
      password: 'admin123', // Will be hashed in Step 2/3
      role: UserRole.ADMIN,
      tier: UserTier.NORMAL,
      isBanned: false,
    });
    await userRepository.save(adminUser);
    console.log('✅ Created admin user: admin@example.com');

    // Create normal user
    const normalUser = userRepository.create({
      email: 'user@example.com',
      password: 'user123', // Will be hashed in Step 2/3
      role: UserRole.USER,
      tier: UserTier.NORMAL,
      isBanned: false,
    });
    await userRepository.save(normalUser);
    console.log('✅ Created normal user: user@example.com');

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

seed();

