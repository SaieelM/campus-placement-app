import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
};

const dbName = process.env.DB_NAME || 'campus_db';

let pool = null;
let isConnected = false;
let connectionError = null;

export async function initDB() {
  try {
    // 1. Connect without selecting database to create database if not exists
    const rootConnection = await mysql.createConnection(dbConfig);
    await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await rootConnection.end();

    // 2. Create pool connected to target database
    pool = mysql.createPool({
      ...dbConfig,
      database: dbName,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Auto-create listings table if it does not exist
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS listings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        organization VARCHAR(255),
        description TEXT,
        phone VARCHAR(50),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);

    // 4. Check if table is empty, insert sample records if empty
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM listings');
    if (rows[0].count === 0) {
      const sampleListings = [
        ['Alex Johnson', 'alex.j@example.com', 'Senior Software Engineer', 'Engineering', 'TechCorp Solutions', 'Passionate about full-stack web applications, cloud infrastructure, and modern JavaScript ecosystem.', '+1 (555) 234-5678', 'San Francisco, CA'],
        ['Sophia Chen', 'sophia.c@example.com', 'UI/UX Product Designer', 'Design', 'Creative Studio', 'Specializing in design systems, micro-interactions, and accessible user interface experiences.', '+1 (555) 876-5432', 'New York, NY'],
        ['Marcus Vance', 'marcus.v@example.com', 'Data Analyst & Placement Lead', 'Placement', 'Campus Career Hub', 'Helping students connect with top industry partners, resume workshops, and campus placement drives.', '+1 (555) 345-6789', 'Austin, TX']
      ];

      for (const item of sampleListings) {
        await pool.query(
          `INSERT INTO listings (name, email, role, category, organization, description, phone, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          item
        );
      }
      console.log('🌱 Seeded 3 initial sample user listings into MySQL database.');
    }

    isConnected = true;
    connectionError = null;
    console.log(`✅ Successfully connected to MySQL Database "${dbName}" at ${dbConfig.host}:${dbConfig.port}`);
    return true;
  } catch (error) {
    isConnected = false;
    connectionError = error.message || 'Failed to connect to MySQL';
    console.error(`⚠️ MySQL Database Initialization Notice:`, error.message);
    return false;
  }
}

export async function query(sql, params = []) {
  if (!pool) {
    throw new Error('Database pool not initialized. Please check MySQL server status and .env credentials.');
  }
  const [results] = await pool.query(sql, params);
  return results;
}

export function getDBStatus() {
  return {
    connected: isConnected,
    database: dbName,
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    error: connectionError,
  };
}
