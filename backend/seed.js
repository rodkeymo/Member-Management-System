const { sequelize, User, Role, Member, Log } = require('./models');
const bcrypt = require('bcrypt');

const db = require('./models');

(async () => {
    try {
        await db.sequelize.sync({ force: true }); // Drops and recreates all tables
        console.log('Database synced successfully.');
    } catch (err) {
        console.error('Error syncing database:', err);
    }
})();


async function seedDatabase() {
  try {
    await sequelize.sync({ force: true }); // WARNING: This will drop the tables and recreate them
    
    // Seeding roles
    const adminRole = await Role.create({ name: 'Admin' });
    const userRole = await Role.create({ name: 'User' });

    // Seeding users with hashed passwords
    const adminUser = await User.create({
      username: 'adminUser',
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10), // Hash password
      roleId: adminRole.id, // Linking role to the user
    });

    const regularUser = await User.create({
      username: 'regularUser',
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10), // Hash password
      roleId: userRole.id, // Linking role to the user
    });

    // Seeding members and linking them to the users
    const member1 = await Member.create({
      username: 'John Doe',
      userId: adminUser.id, // Linking to adminUser
    });

    const member2 = await Member.create({
      username: 'Jane Smith',
      userId: regularUser.id, // Linking to regularUser
    });

    // Seeding logs and linking them to the correct member
    const log1 = await Log.create({
      action: 'Created a new role',
      details: 'Admin created the Admin role.',
      memberId: member1.id, // Linking log to member1
      username: member1.username
    });

    const log2 = await Log.create({
      action: 'Logged in',
      details: 'User logged in successfully.',
      memberId: member2.id, // Linking log to member2
      username: member2.username
    });

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Error seeding database:', err);
  }
}

seedDatabase();
