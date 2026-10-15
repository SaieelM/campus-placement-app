import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, query, getDBStatus } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database connection on boot
initDB();

// 1. Health Check & Connection Status Endpoint
app.get('/api/health', async (req, res) => {
  const status = getDBStatus();
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    db: status,
  });
});

// 2. Fetch User Listings Endpoint
app.get('/api/listings', async (req, res) => {
  try {
    const dbStatus = getDBStatus();
    if (!dbStatus.connected) {
      // Try reconnecting once if previously failed
      const reconnected = await initDB();
      if (!reconnected) {
        return res.status(503).json({
          error: 'MySQL database disconnected',
          details: getDBStatus().error,
        });
      }
    }

    const { search, category } = req.query;
    let sql = 'SELECT * FROM listings';
    const params = [];
    const conditions = [];

    if (category && category !== 'All') {
      conditions.push('category = ?');
      params.push(category);
    }

    if (search && search.trim() !== '') {
      conditions.push('(name LIKE ? OR email LIKE ? OR role LIKE ? OR organization LIKE ?)');
      const searchPattern = `%${search.trim()}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await query(sql, params);
    res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({
      error: 'Failed to retrieve listings',
      message: error.message,
    });
  }
});

// 3. Create User Listing Endpoint
app.post('/api/listings', async (req, res) => {
  try {
    const { name, email, role, category, organization, description, phone, location } = req.body;

    // Validation
    if (!name || !email || !role) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, Email, and Role/Designation are required fields.',
      });
    }

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address.',
      });
    }

    const dbStatus = getDBStatus();
    if (!dbStatus.connected) {
      const reconnected = await initDB();
      if (!reconnected) {
        return res.status(503).json({
          error: 'MySQL database disconnected',
          details: getDBStatus().error,
        });
      }
    }

    const sql = `
      INSERT INTO listings (name, email, role, category, organization, description, phone, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      name.trim(),
      email.trim().toLowerCase(),
      role.trim(),
      category || 'General',
      organization ? organization.trim() : null,
      description ? description.trim() : null,
      phone ? phone.trim() : null,
      location ? location.trim() : null,
    ];

    const result = await query(sql, params);

    // Fetch the newly inserted record
    const [inserted] = await query('SELECT * FROM listings WHERE id = ?', [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'User listing created successfully in MySQL database!',
      data: inserted,
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({
      error: 'Failed to create listing',
      message: error.message,
    });
  }
});

// 4. Delete Listing Endpoint
app.delete('/api/listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dbStatus = getDBStatus();
    if (!dbStatus.connected) {
      return res.status(503).json({ error: 'MySQL database disconnected' });
    }

    const result = await query('DELETE FROM listings WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json({
      success: true,
      message: `Listing #${id} successfully deleted from MySQL.`,
      id: parseInt(id),
    });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({
      error: 'Failed to delete listing',
      message: error.message,
    });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
