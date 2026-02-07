import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import sql from './db.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const frontendDir = path.resolve(__dirname, '..')

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(',').map(origin => origin.trim()).filter(Boolean)
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
    ]

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header) and allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
  })
)
app.use(express.json())

// Serve frontend static files
app.use(express.static(frontendDir))

app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'))
})

// ==================== USER ENDPOINTS ====================

// Create or get user
app.post('/api/user', async (req, res) => {
  try {
    const { wallet_address, email } = req.body
    
    if (!wallet_address) {
      return res.status(400).json({ error: 'wallet_address is required' })
    }

    // Check if user exists
    const existing = await sql`
      SELECT * FROM users WHERE wallet_address = ${wallet_address}
    `

    if (existing.length > 0) {
      // Update last_login
      const updated = await sql`
        UPDATE users 
        SET last_login = NOW()
        WHERE wallet_address = ${wallet_address}
        RETURNING *
      `
      return res.json(updated[0])
    }

    // Create new user
    const newUser = await sql`
      INSERT INTO users (wallet_address, email)
      VALUES (${wallet_address}, ${email || null})
      RETURNING *
    `
    
    res.status(201).json(newUser[0])
  } catch (error) {
    console.error('Error creating/updating user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get user by wallet address
app.get('/api/user/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params
    
    const user = await sql`
      SELECT * FROM users WHERE wallet_address = ${wallet_address}
    `
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user[0])
  } catch (error) {
    console.error('Error getting user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update user
app.patch('/api/user/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params
    const { email, first_name, last_name, phone } = req.body
    
    const updated = await sql`
      UPDATE users 
      SET 
        email = COALESCE(${email}, email),
        first_name = COALESCE(${first_name}, first_name),
        last_name = COALESCE(${last_name}, last_name),
        phone = COALESCE(${phone}, phone),
        updated_at = NOW()
      WHERE wallet_address = ${wallet_address}
      RETURNING *
    `
    
    if (updated.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(updated[0])
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==================== SERVICES ENDPOINTS ====================

// Get all services
app.get('/api/services', async (req, res) => {
  try {
    const services = await sql`
      SELECT s.*, sc.name as category_name
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.is_active = true
      ORDER BY s.name
    `
    
    res.json(services)
  } catch (error) {
    console.error('Error getting services:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get service by ID
app.get('/api/services/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const service = await sql`
      SELECT s.*, sc.name as category_name
      FROM services s
      LEFT JOIN service_categories sc ON s.category_id = sc.id
      WHERE s.id = ${id}
    `
    
    if (service.length === 0) {
      return res.status(404).json({ error: 'Service not found' })
    }
    
    res.json(service[0])
  } catch (error) {
    console.error('Error getting service:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==================== ORDERS ENDPOINTS ====================

// Create order
app.post('/api/orders', async (req, res) => {
  try {
    const { wallet_address, service_name, tx_hash, status, metadata } = req.body
    
    if (!wallet_address || !service_name) {
      return res.status(400).json({ error: 'wallet_address and service_name are required' })
    }

    // Get user_id from wallet_address
    const user = await sql`
      SELECT id FROM users WHERE wallet_address = ${wallet_address}
    `
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const order = await sql`
      INSERT INTO orders (user_id, service_name, tx_hash, status, metadata)
      VALUES (${user[0].id}, ${service_name}, ${tx_hash || null}, ${status || 'pending'}, ${sql.json(metadata || {})})
      RETURNING *
    `
    
    res.status(201).json(order[0])
  } catch (error) {
    console.error('Error creating order:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get orders by wallet address
app.get('/api/orders/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params
    
    const orders = await sql`
      SELECT o.* 
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE u.wallet_address = ${wallet_address}
      ORDER BY o.created_at DESC
    `
    
    res.json(orders)
  } catch (error) {
    console.error('Error getting orders:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==================== APPOINTMENTS ENDPOINTS ====================

// Create appointment
app.post('/api/appointments', async (req, res) => {
  try {
    const { wallet_address, service_id, appointment_date, notes } = req.body
    
    if (!wallet_address || !service_id || !appointment_date) {
      return res.status(400).json({ error: 'wallet_address, service_id, and appointment_date are required' })
    }

    // Get user_id
    const user = await sql`
      SELECT id FROM users WHERE wallet_address = ${wallet_address}
    `
    
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const appointment = await sql`
      INSERT INTO appointments (user_id, service_id, appointment_date, notes)
      VALUES (${user[0].id}, ${service_id}, ${appointment_date}, ${notes || null})
      RETURNING *
    `
    
    res.status(201).json(appointment[0])
  } catch (error) {
    console.error('Error creating appointment:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get appointments by wallet address
app.get('/api/appointments/:wallet_address', async (req, res) => {
  try {
    const { wallet_address } = req.params
    
    const appointments = await sql`
      SELECT a.*, s.name as service_name, s.price
      FROM appointments a
      JOIN users u ON a.user_id = u.id
      JOIN services s ON a.service_id = s.id
      WHERE u.wallet_address = ${wallet_address}
      ORDER BY a.appointment_date DESC
    `
    
    res.json(appointments)
  } catch (error) {
    console.error('Error getting appointments:', error)
    res.status(500).json({ error: error.message })
  }
})

// ==================== HEALTH CHECK ====================

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})
