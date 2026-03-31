import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import pool from '../config/database.js';
import { createUserTable } from '../models/User.js';
import { createMentorTable } from '../models/Mentor.js';
import { createAdminTable } from '../models/Admin.js';
import { createAvailabilityTable } from '../models/Availability.js';
import { createCallTable } from '../models/Call.js';
import { createCallTypeTable, seedCallTypes } from '../models/CallType.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    console.log('Creating tables...');
    await createUserTable();
    await createMentorTable();
    await createAdminTable();
    await createCallTypeTable();
    await createAvailabilityTable();
    await createCallTable();
    console.log('Seeding admin...');
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
    await pool.query(
      'INSERT INTO admins (email, password, name) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
      [process.env.ADMIN_EMAIL || 'admin@example.com', adminPassword, process.env.ADMIN_NAME || 'Admin User']
    );

    console.log('Seeding users...');
    const userPassword = await bcrypt.hash('user123', 10);
    const userEmails = [
      'user1@example.com', 'user2@example.com', 'user3@example.com', 'user4@example.com', 'user5@example.com',
      'user6@example.com', 'user7@example.com', 'user8@example.com', 'user9@example.com', 'user10@example.com'
    ];
    const userNames = [
      'Alice Johnson', 'Bob Smith', 'Carol White', 'David Brown', 'Emma Davis',
      'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Ivy Taylor', 'Jack Anderson'
    ];
    const userDescriptions = [
      'Backend developer with 3 years experience in Python and Node.js',
      'Frontend specialist with React expertise',
      'Full stack developer interested in cloud architecture',
      'Mobile developer focused on iOS development',
      'Data scientist working with machine learning',
      'DevOps engineer with Kubernetes experience',
      'Product manager transitioning to tech',
      'QA automation specialist',
      'Systems architect with 5 years experience',
      'Junior developer looking for guidance'
    ];
    const userTags = [
      ['tech', 'backend', 'python'],
      ['tech', 'frontend', 'react'],
      ['tech', 'fullstack', 'cloud'],
      ['tech', 'mobile', 'ios'],
      ['tech', 'data science', 'machine learning'],
      ['tech', 'devops', 'kubernetes'],
      ['tech', 'product'],
      ['tech', 'qa'],
      ['tech', 'architecture'],
      ['tech', 'junior']
    ];

    for (let i = 0; i < userEmails.length; i++) {
      await pool.query(
        'INSERT INTO users (email, password, name, description, tags) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [userEmails[i], userPassword, userNames[i], userDescriptions[i], userTags[i]]
      );
    }

    console.log('Seeding mentors...');
    const mentorPassword = await bcrypt.hash('mentor123', 10);
    const mentorEmails = [
      'mentor1@example.com', 'mentor2@example.com', 'mentor3@example.com', 'mentor4@example.com', 'mentor5@example.com'
    ];
    const mentorNames = [
      'Senior Engineer Sarah', 'Tech Lead Mike', 'Product Manager Lisa', 'Architect John', 'Career Coach Emma'
    ];
    const mentorDescriptions = [
      'Senior engineer from Google with 10 years experience in backend systems',
      'Tech lead from Microsoft specializing in frontend architecture',
      'Product manager from Meta with expertise in scaling products',
      'Solutions architect from AWS with cloud expertise',
      'Career coach with experience in resume building and interviews'
    ];
    const mentorTags = [
      ['big tech', 'senior developer', 'backend', 'google'],
      ['big tech', 'frontend', 'architecture', 'microsoft'],
      ['big tech', 'product', 'communication', 'meta'],
      ['big tech', 'cloud', 'architecture', 'aws'],
      ['good communication', 'career guidance', 'interviews']
    ];

    for (let i = 0; i < mentorEmails.length; i++) {
      await pool.query(
        'INSERT INTO mentors (email, password, name, description, tags) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING',
        [mentorEmails[i], mentorPassword, mentorNames[i], mentorDescriptions[i], mentorTags[i]]
      );
    }

    console.log('Seeding call types...');
    await seedCallTypes();

    console.log('Database seeding completed!');
    console.log('\n=== Login Credentials ===');
    console.log(`Admin: ${process.env.ADMIN_EMAIL || 'admin@example.com'} / ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('Users: user1@example.com - user10@example.com / user123');
    console.log('Mentors: mentor1@example.com - mentor5@example.com / mentor123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
