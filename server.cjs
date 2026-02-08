const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateToken, requireAdmin, requireOwner } = require('./src/middleware/auth.cjs');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/venue-booking');

// Import routes
const adminRoutes = require('./src/api/admin.cjs');
const ownerRoutes = require('./src/api/owner.cjs');
const venueRoutes = require('./src/api/venues.cjs');
const bookingRoutes = require('./src/api/bookings.cjs');

// Protected routes with role-based access
app.use('/api/admin', authenticateToken, requireAdmin, adminRoutes);
app.use('/api/owner', authenticateToken, requireOwner, ownerRoutes);

// Legacy routes (for backward compatibility)
app.use('/api/venues', authenticateToken, requireOwner, venueRoutes);
app.use('/api/bookings', authenticateToken, requireOwner, bookingRoutes);

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Mock authentication - replace with real auth logic
  const mockUsers = {
    'admin@demo.com': { id: 'admin-001', role: 'ADMIN', name: 'Super Admin' },
    'owner@demo.com': { id: 'owner-001', role: 'OWNER', name: 'Demo Owner' },
    'customer@demo.com': { id: 'customer-001', role: 'CUSTOMER', name: 'Demo Customer' }
  };
  
  const user = mockUsers[email];
  if (user && password === 'demo123') {
    const token = jwt.sign(
      { id: user.id, email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      user: { id: user.id, email, role: user.role, name: user.name }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;