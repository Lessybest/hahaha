const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

const dbPath = path.join(__dirname, '..', 'data', 'knowledge.db')

// Ensure data directory exists
const dataDir = path.dirname(dbPath)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

let db = null

function getDb() {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    db.pragma('foreign_keys = ON')
  }
  return db
}

function initDb() {
  const database = getDb()

  // Create layers table
  database.exec(`
    CREATE TABLE IF NOT EXISTS layers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      icon TEXT,
      color TEXT DEFAULT '#00d4ff',
      sort_order INTEGER DEFAULT 0
    )
  `)

  // Create knowledge table
  database.exec(`
    CREATE TABLE IF NOT EXISTS knowledge (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      layer_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (layer_id) REFERENCES layers(id) ON DELETE CASCADE
    )
  `)

  // Check if data exists
  const layerCount = database.prepare('SELECT COUNT(*) as count FROM layers').get()
  if (layerCount.count === 0) {
    // Seed initial data
    const insertLayer = database.prepare(
      'INSERT INTO layers (name, description, icon, color, sort_order) VALUES (?, ?, ?, ?, ?)'
    )
    const layers = [
      ['应用层', '为用户提供网络服务和接口，负责应用程序间的通信', 'globe', '#00d4ff', 1],
      ['传输层', '提供端到端的可靠数据传输服务，确保数据完整性', 'repeat', '#10b981', 2],
      ['网络层', '负责数据包的路由转发和逻辑寻址', 'map', '#7c3aed', 3],
      ['数据链路层', '提供可靠的帧传输和MAC地址寻址', 'link', '#f59e0b', 4],
      ['物理层', '负责比特的物理传输和物理介质规范', 'cpu', '#ec4899', 5],
    ]
    const insertMany = database.transaction((items) => {
      for (const item of items) insertLayer.run(...item)
    })
    insertMany(layers)

    // Seed knowledge points
    const insertKnowledge = database.prepare(
      'INSERT INTO knowledge (layer_id, title, content, tags) VALUES (?, ?, ?, ?)'
    )
    const knowledgePoints = [
      [1, 'HTTP协议', '超文本传输协议，用于Web浏览器和服务器之间的通信，默认端口80/HTTPS 443', 'HTTP,HTTPS,Web'],
      [1, 'DNS协议', '域名系统，将域名解析为IP地址，使用UDP端口53', 'DNS,域名解析,UDP'],
      [1, 'FTP协议', '文件传输协议，用于在网络上进行文件传输，支持上传和下载', 'FTP,文件传输,TCP'],
      [1, 'SMTP/POP3/IMAP', '电子邮件协议，SMTP用于发送，POP3和IMAP用于接收邮件', 'Email,SMTP,POP3,IMAP'],
      [2, 'TCP协议', '传输控制协议，提供可靠的面向连接的传输服务，三次握手建立连接，四次挥手断开连接', 'TCP,可靠传输,三次握手'],
      [2, 'UDP协议', '用户数据报协议，无连接、不可靠但高效的传输协议，常用于DNS、实时音视频', 'UDP,无连接,高效'],
      [2, '端口号', '用于区分同一主机上的不同网络应用，范围0-65535，知名端口1-1023', '端口,Socket,进程标识'],
      [3, 'IP地址', '网络层逻辑地址，用于唯一标识网络中的设备，IPv4 32位，IPv6 128位', 'IP,逻辑地址,IPv4'],
      [3, 'ARP协议', '地址解析协议，将IP地址解析为MAC地址，ARP Request广播，ARP Reply单播', 'ARP,MAC地址,广播'],
      [3, 'ICMP协议', '互联网控制消息协议，用于错误报告和诊断，如ping命令', 'ICMP,Ping,诊断'],
      [3, '路由器', '工作于网络层，根据路由表转发数据包到下一个合适的节点', '路由器,路由表,网关'],
      [4, 'MAC地址', '媒体访问控制地址，物理地址，48位，用于局域网内设备识别', 'MAC,物理地址,网卡'],
      [4, '交换机', '工作于数据链路层，根据MAC地址表进行帧的转发和泛洪操作', '交换机,MAC表,帧转发'],
      [4, '以太网', '最常见的局域网技术，使用CSMA/CD介质访问控制，帧结构包含源/目的MAC', '以太网,CSMA/CD,局域网'],
      [5, '双绞线', '最常用的传输介质，分为屏蔽（STP）和非屏蔽（UTP）双绞线，常见于以太网', '双绞线,STP,UTP'],
      [5, '光纤', '利用光信号传输数据，带宽高、抗干扰强，分为单模和多模光纤', '光纤,单模,多模'],
      [5, '调制解调器', '将数字信号转换为模拟信号（调制）和反向转换（解调），用于长距离传输', '调制,解调,Modem'],
    ]
    const insertK = database.transaction((items) => {
      for (const item of items) insertKnowledge.run(...item)
    })
    insertK(knowledgePoints)

    console.log('✅ Database seeded with initial data')
  }

  console.log('✅ Database initialized')
  return database
}

module.exports = { getDb, initDb }
