const express = require('express')
const router = express.Router()
const { getDb } = require('../db')

// Get all layers
router.get('/layers', (req, res) => {
  try {
    const db = getDb()
    const layers = db.prepare('SELECT * FROM layers ORDER BY sort_order').all()
    res.json({ success: true, data: layers })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Get knowledge points for a layer
router.get('/layers/:id/knowledge', (req, res) => {
  try {
    const db = getDb()
    const items = db.prepare(
      'SELECT * FROM knowledge WHERE layer_id = ? ORDER BY id'
    ).all(req.params.id)
    res.json({ success: true, data: items })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Get all knowledge points
router.get('/knowledge', (req, res) => {
  try {
    const db = getDb()
    const items = db.prepare(`
      SELECT k.*, l.name as layer_name, l.color as layer_color
      FROM knowledge k
      JOIN layers l ON k.layer_id = l.id
      ORDER BY k.layer_id, k.id
    `).all()
    res.json({ success: true, data: items })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Create knowledge point
router.post('/knowledge', (req, res) => {
  try {
    const { layer_id, title, content, tags } = req.body
    if (!layer_id || !title) {
      return res.status(400).json({ success: false, error: 'layer_id and title are required' })
    }
    const db = getDb()
    const result = db.prepare(
      'INSERT INTO knowledge (layer_id, title, content, tags) VALUES (?, ?, ?, ?)'
    ).run(layer_id, title, content || '', tags || '')
    res.json({ success: true, id: result.lastInsertRowid })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Update knowledge point
router.put('/knowledge/:id', (req, res) => {
  try {
    const { title, content, tags } = req.body
    const db = getDb()
    const result = db.prepare(
      'UPDATE knowledge SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(title, content || '', tags || '', req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Delete knowledge point
router.delete('/knowledge/:id', (req, res) => {
  try {
    const db = getDb()
    const result = db.prepare('DELETE FROM knowledge WHERE id = ?').run(req.params.id)
    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Not found' })
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Search knowledge points
router.get('/search', (req, res) => {
  try {
    const { q } = req.query
    if (!q) return res.json({ success: true, data: [] })
    const db = getDb()
    const items = db.prepare(`
      SELECT k.*, l.name as layer_name, l.color as layer_color
      FROM knowledge k
      JOIN layers l ON k.layer_id = l.id
      WHERE k.title LIKE ? OR k.content LIKE ? OR k.tags LIKE ?
      ORDER BY k.layer_id, k.id
    `).all(`%${q}%`, `%${q}%`, `%${q}%`)
    res.json({ success: true, data: items })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
