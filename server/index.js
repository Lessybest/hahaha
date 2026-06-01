const express = require('express')
const cors = require('cors')
const path = require('path')
const { initDb, getDb } = require('./db')
const knowledgeRoutes = require('./routes/knowledge')

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

// Initialize database
initDb()

// API routes
app.use('/api', knowledgeRoutes)

// Serve static files from Vite build in production
const distPath = path.join(__dirname, '..', 'dist')
app.use(express.static(distPath))

// SPA fallback
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(distPath, 'index.html'))
  }
})

app.listen(PORT, () => {
  console.log(`🌐 Server running at http://localhost:${PORT}`)
  console.log(`📚 API available at http://localhost:${PORT}/api`)
})
