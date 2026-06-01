/**
 * 综合场景 8 步流程数据
 * H1 (192.168.1.100) 访问 www.abc.com 完整通信过程
 */
export default [
  // Step 1: DNS缓存未命中 → 需要ARP解析网关MAC
  {
    id: 1,
    title: 'H1 检查 DNS 缓存',
    description: 'H1 在浏览器输入 www.abc.com，操作系统先检查本地 DNS 缓存（/etc/hosts、DNS 解析器缓存），未命中。需要向本地 DNS 服务器 192.168.1.1 发起查询，但不知道其 MAC 地址。',
    protocol: 'DNS + ARP',
    protocolColor: '#f59e0b',
    srcIP: '192.168.1.100',
    dstIP: '192.168.1.1',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: '未知（需 ARP）',
    broadcast: false,
    packetDetail: {
      type: 'DNS Query (缓存未命中)',
      domain: 'www.abc.com A记录',
      recursive: '是（RD=1）',
      note: '需先获取网关 MAC 才能发送',
    },
    protocolStack: [
      { layer: '应用层', content: 'DNS Query: www.abc.com A', color: '#00d4ff' },
      { layer: '传输层', content: 'UDP 端口 53', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 192.168.1.1', color: '#7c3aed' },
      { layer: '链路层', content: '⚠️ 目的 MAC 未知，暂缓发送', color: '#f59e0b' },
    ],
    arpTableBefore: [],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '待查询', ttl: '-', new: true },
    ],
    macTableBefore: [],
    macTableAfter: [],
    dnsCacheBefore: [],
    dnsCacheAfter: [],
    tcpState: [],
    highlightNodes: ['h1'],
    message: 'DNS缓存未命中 → 需要先 ARP 解析网关 MAC',
  },

  // Step 2: ARP Request 广播
  {
    id: 2,
    title: 'ARP Request 广播（查询网关 MAC）',
    description: 'H1 发送 ARP Request 广播帧（目的 MAC = ff:ff:ff:ff:ff:ff），询问："IP 为 192.168.1.1 的主机，请告诉我你的 MAC 地址！" 交换机收到后向所有端口泛洪。',
    protocol: 'ARP',
    protocolColor: '#f59e0b',
    srcIP: '192.168.1.100',
    dstIP: '192.168.1.1',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: 'ff:ff:ff:ff:ff:ff (广播)',
    broadcast: true,
    packetDetail: {
      type: 'ARP Request (Opcode=1)',
      '硬件类型': 'Ethernet (1)',
      '协议类型': 'IPv4 (0x0800)',
      '发送方 MAC': '00:11:22:33:44:01',
      '发送方 IP': '192.168.1.100',
      '目标 MAC': '00:00:00:00:00:00 (未知)',
      '目标 IP': '192.168.1.1',
    },
    protocolStack: [
      { layer: '链路层', content: 'ARP Request 广播帧，EtherType=0x0806', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '待查询', ttl: '-', new: true },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '待查询', ttl: '-' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '新学习', new: true },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
    ],
    dnsCacheBefore: [],
    dnsCacheAfter: [],
    tcpState: [],
    highlightNodes: ['h1', 'sw'],
    message: 'ARP Request 广播：Who has 192.168.1.1? Tell 192.168.1.100',
  },

  // Step 3: ARP Reply 单播
  {
    id: 3,
    title: 'ARP Reply 单播（网关响应）',
    description: '路由器 R（网关）收到 ARP Request 后，发现目标 IP 是自己，于是构造 ARP Reply 单播帧，直接回复给 H1："我是 192.168.1.1，我的 MAC 是 00:aa:bb:cc:dd:01！" H1 收到后将映射写入 ARP 缓存表（动态条目，TTL=20分钟）。',
    protocol: 'ARP',
    protocolColor: '#10b981',
    srcIP: '192.168.1.1',
    dstIP: '192.168.1.100',
    srcMAC: '00:aa:bb:cc:dd:01',
    dstMAC: '00:11:22:33:44:01',
    broadcast: false,
    packetDetail: {
      type: 'ARP Reply (Opcode=2)',
      '硬件类型': 'Ethernet (1)',
      '协议类型': 'IPv4 (0x0800)',
      '发送方 MAC': '00:aa:bb:cc:dd:01',
      '发送方 IP': '192.168.1.1',
      '目标 MAC': '00:11:22:33:44:01',
      '目标 IP': '192.168.1.100',
    },
    protocolStack: [
      { layer: '链路层', content: 'ARP Reply 单播帧，EtherType=0x0806', color: '#10b981' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '待查询', ttl: '-' },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态', new: true },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '新学习', new: true },
    ],
    dnsCacheBefore: [],
    dnsCacheAfter: [],
    tcpState: [],
    highlightNodes: ['r', 'sw', 'h1'],
    message: 'ARP 解析完成！192.168.1.1 → 00:aa:bb:cc:dd:01（动态条目，TTL=20分钟）',
  },

  // Step 4: 发送 DNS 查询
  {
    id: 4,
    title: '发送 DNS 查询（UDP 端口 53）',
    description: 'H1 现在知道网关 MAC，构造 DNS 查询报文（UDP 数据报，目标端口 53），目的 IP 为本地 DNS 服务器 192.168.1.1。报文经交换机转发到网关，再由网关路由到互联网上的 DNS 服务器。',
    protocol: 'DNS',
    protocolColor: '#00d4ff',
    srcIP: '192.168.1.100',
    dstIP: '192.168.1.1',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: '00:aa:bb:cc:dd:01',
    broadcast: false,
    packetDetail: {
      type: 'DNS Query (递归)',
      '事务 ID': '0x1a2b (随机)',
      '标志位': 'RD=1 (期望递归查询)',
      '问题数': '1 (www.abc.com A)',
      '回答数': '0 (查询阶段)',
      '查询类型': 'A记录 (IPv4地址)',
    },
    protocolStack: [
      { layer: '应用层', content: 'DNS Query: www.abc.com A', color: '#00d4ff' },
      { layer: '传输层', content: 'UDP Src:49152 → Dst:53', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 192.168.1.1', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:aa:bb:cc:dd:01', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态', new: true },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '新学习', new: true },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    dnsCacheBefore: [],
    dnsCacheAfter: [],
    tcpState: [],
    highlightNodes: ['h1', 'sw', 'r'],
    message: '[DNS] H1 → 本地DNS (192.168.1.1)：查询 www.abc.com 的 A 记录',
  },

  // Step 5: DNS 服务器递归查询 + 响应
  {
    id: 5,
    title: 'DNS 服务器响应（递归查询完成）',
    description: '本地 DNS 服务器（192.168.1.1）收到查询后，若为递归查询，则代替 H1 向根域名服务器、顶级域名服务器、权威域名服务器逐级查询，最终获得 www.abc.com 的 IP 地址 1.2.3.4，返回给 H1。H1 将结果写入 DNS 缓存（TTL=3600秒）。',
    protocol: 'DNS',
    protocolColor: '#10b981',
    srcIP: '192.168.1.1',
    dstIP: '192.168.1.100',
    srcMAC: '00:aa:bb:cc:dd:01',
    dstMAC: '00:11:22:33:44:01',
    broadcast: false,
    packetDetail: {
      type: 'DNS Response (递归查询完成)',
      '事务 ID': '0x1a2b (匹配查询)',
      '标志位': 'QR=1 (响应), AA=0 (非权威), RA=1 (支持递归)',
      '回答数': '1 (A记录)',
      '回答': 'www.abc.com A 1.2.3.4 TTL=3600',
      '查询类型': 'A记录 (IPv4地址)',
    },
    protocolStack: [
      { layer: '应用层', content: 'DNS Response: www.abc.com A → 1.2.3.4', color: '#10b981' },
      { layer: '传输层', content: 'UDP Src:53 → Dst:49152', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.1 → Dst: 192.168.1.100', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:aa:bb:cc:dd:01 → Dst MAC: 00:11:22:33:44:01', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    dnsCacheBefore: [],
    dnsCacheAfter: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒', new: true },
    ],
    tcpState: [],
    highlightNodes: ['r', 'sw', 'h1'],
    message: '[DNS Response] www.abc.com → 1.2.3.4 (TTL=3600秒)，已写入 DNS 缓存',
  },

  // Step 6: ARP 解析 Web 服务器 MAC（跨网段，需网关转发）
  {
    id: 6,
    title: 'ARP 解析 Web 服务器 MAC（跨网段）',
    description: 'H1 获得 www.abc.com 的 IP (1.2.3.4)，发现不在同一网段（1.2.3.4 ≠ 192.168.1.0/24），于是不直接 ARP 查询 1.2.3.4，而是将帧发给默认网关（192.168.1.1）。若 ARP 表中网关 MAC 已过期，则重新 ARP 查询。',
    protocol: 'ARP',
    protocolColor: '#7c3aed',
    srcIP: '192.168.1.100',
    dstIP: '1.2.3.4',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: '00:aa:bb:cc:dd:01 (网关)',
    broadcast: false,
    packetDetail: {
      type: 'ARP (检查网关 MAC 是否过期)',
      note: '跨网段通信：目的 IP 是外网地址，数据帧先发给网关',
      '操作': '检查 ARP 缓存 TTL',
      '网关 IP': '192.168.1.1',
      '网关 MAC': '00:aa:bb:cc:dd:01 (若过期则重新 ARP)',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP GET / (准备发送)', color: '#ec4899' },
      { layer: '传输层', content: 'TCP SYN (建立连接)', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 1.2.3.4', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:aa:bb:cc:dd:01 (网关)', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
      { ip: '1.2.3.4', mac: '未知 (跨网段不直接 ARP)', ttl: '-', note: '通过网关转发' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    dnsCacheBefore: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒', new: true },
    ],
    dnsCacheAfter: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒' },
    ],
    tcpState: ['SYN_SENT'],
    highlightNodes: ['h1', 'sw', 'r'],
    message: '跨网段通信：H1 → 网关 (192.168.1.1) → 互联网 → 1.2.3.4',
  },

  // Step 7: TCP 三次握手
  {
    id: 7,
    title: 'TCP 三次握手（建立连接）',
    description: 'H1 向 www.abc.com (1.2.3.4) 发送 TCP SYN 报文（Seq=1000），请求建立连接。Web 服务器收到后回复 SYN+ACK（Seq=5000, Ack=1001）。H1 收到后发送 ACK（Ack=5001），连接建立完成（ESTABLISHED）。',
    protocol: 'TCP',
    protocolColor: '#ec4899',
    srcIP: '192.168.1.100',
    dstIP: '1.2.3.4',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: '00:aa:bb:cc:dd:01 (网关)',
    broadcast: false,
    packetDetail: {
      type: 'TCP 三次握手',
      '第一次握手': 'SYN, Seq=1000, Src:49152 → Dst:80',
      '第二次握手': 'SYN+ACK, Seq=5000, Ack=1001, Src:80 → Dst:49152',
      '第三次握手': 'ACK, Seq=1001, Ack=5001, Src:49152 → Dst:80',
      '状态变化': 'CLOSED → SYN_SENT → ESTABLISHED',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP (等待连接建立)', color: '#ec4899' },
      { layer: '传输层', content: 'TCP SYN (Seq=1000) → SYN+ACK (Seq=5000, Ack=1001) → ACK (Ack=5001)', color: '#ec4899' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 1.2.3.4', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:aa:bb:cc:dd:01 (网关)', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
      { ip: '1.2.3.4', mac: '未知 (跨网段不直接 ARP)', ttl: '-', note: '通过网关转发' },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    dnsCacheBefore: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒' },
    ],
    dnsCacheAfter: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒' },
    ],
    tcpState: ['SYN_SENT', 'ESTABLISHED'],
    highlightNodes: ['h1', 'sw', 'r', 'www'],
    message: 'TCP 三次握手完成 → 连接已建立 (ESTABLISHED)',
  },

  // Step 8: HTTP 请求/响应
  {
    id: 8,
    title: 'HTTP 请求/响应（页面传输）',
    description: 'TCP 连接建立后，H1 发送 HTTP GET 请求（/index.html）。Web 服务器处理请求后返回 HTTP 200 OK（包含 HTML 内容）。H1 收到响应后渲染页面，完成整个访问过程。若连接关闭，则进行 TCP 四次挥手。',
    protocol: 'HTTP',
    protocolColor: '#00d4ff',
    srcIP: '192.168.1.100',
    dstIP: '1.2.3.4',
    srcMAC: '00:11:22:33:44:01',
    dstMAC: '00:aa:bb:cc:dd:01 (网关)',
    broadcast: false,
    packetDetail: {
      type: 'HTTP GET/Response',
      '请求': 'GET /index.html HTTP/1.1, Host: www.abc.com, Connection: keep-alive',
      '响应': 'HTTP/1.1 200 OK, Content-Type: text/html, Content-Length: 1024',
      '响应内容': '<html><head><title>ABC.COM</title></head><body><h1>Welcome!</h1></body></html>',
      '传输层': 'TCP PSH+ACK (推送数据)',
    },
    protocolStack: [
      { layer: '应用层', content: 'HTTP GET / → HTTP/1.1 200 OK (HTML)', color: '#00d4ff' },
      { layer: '传输层', content: 'TCP PSH+ACK (Seq=1001, Ack=5001)', color: '#10b981' },
      { layer: '网络层', content: 'Src: 192.168.1.100 → Dst: 1.2.3.4', color: '#7c3aed' },
      { layer: '链路层', content: 'Src MAC: 00:11:22:33:44:01 → Dst MAC: 00:aa:bb:cc:dd:01 (网关)', color: '#f59e0b' },
    ],
    arpTableBefore: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    arpTableAfter: [
      { ip: '192.168.1.1', mac: '00:aa:bb:cc:dd:01', ttl: '20分钟', type: '动态' },
    ],
    macTableBefore: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    macTableAfter: [
      { mac: '00:11:22:33:44:01', port: 'Port1', age: '0分钟' },
      { mac: '00:aa:bb:cc:dd:01', port: 'Port2', age: '0分钟' },
    ],
    dnsCacheBefore: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒' },
    ],
    dnsCacheAfter: [
      { domain: 'www.abc.com', ip: '1.2.3.4', ttl: '3600秒' },
    ],
    tcpState: ['ESTABLISHED', 'FIN_WAIT (若关闭)'],
    highlightNodes: ['h1', 'sw', 'r', 'www'],
    message: '✅ HTTP 页面传输完成！H1 已收到 www.abc.com 的响应，可渲染页面',
  },
]
