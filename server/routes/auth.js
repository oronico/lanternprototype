const express = require('express');
const router = express.Router();

// Mock authentication - replace with real auth system
const mockUsers = [
  {
    id: 1,
    email: 'admin@sunshine-microschool.com',
    password: 'admin123', // In production, this would be hashed
    name: 'Sarah Johnson',
    role: 'director',
    schoolName: 'Sunshine Microschool',
    permissions: ['dashboard', 'payments', 'enrollment', 'calculator', 'health', 'lease']
  }
];

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, generate real JWT token
    const token = 'mock_jwt_token_' + user.id;
    
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolName: user.schoolName,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email, password, name, schoolName } = req.body;
    
    if (!email || !password || !name || !schoolName) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password, // In production, hash this
      name,
      role: 'director',
      schoolName,
      permissions: ['dashboard', 'payments', 'enrollment', 'calculator', 'health', 'lease'],
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push(newUser);
    
    const token = 'mock_jwt_token_' + newUser.id;
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        schoolName: newUser.schoolName,
        permissions: newUser.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/auth/profile
router.get('/profile', (req, res) => {
  try {
    // In production, verify JWT token and get user from database
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    // Mock token validation
    const userId = token.replace('mock_jwt_token_', '');
    const user = mockUsers.find(u => u.id === parseInt(userId));
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolName: user.schoolName,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  try {
    // In production, invalidate JWT token
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent'
      });
    }
    
    // In production, send actual reset email
    res.json({
      success: true,
      message: 'Password reset link sent to your email'
    });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
});

module.exports = router;
