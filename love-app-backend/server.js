const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MySQL配置
const DB_CONFIG = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// 数据库连接池
let pool = null;

// 初始化数据库连接池
async function initializePool() {
  if (pool) return pool;
  
  try {
    console.log('正在初始化MySQL连接池...');
    console.log(`连接到: ${DB_CONFIG.host}:${DB_CONFIG.port} 数据库: ${DB_CONFIG.database}`);
    
    pool = mysql.createPool(DB_CONFIG);
    
    // 验证连接
    const connection = await pool.getConnection();
    console.log('MySQL连接成功!');
    connection.release();
    
    // 确保表存在
    await ensureTablesExist();
    
    return pool;
  } catch (error) {
    console.error('MySQL连接失败:', error.message);
    console.error('完整错误信息:', error);
    throw error;
  }
}

// 确保所有必要的表存在
async function ensureTablesExist() {
  try {
    const connection = await pool.getConnection();
    
    // 创建表的SQL语句
    const createTables = [
      // 用户表
      `CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // 记录表
      `CREATE TABLE IF NOT EXISTS records (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(20) NOT NULL,
        date TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      
      // 星空表
      `CREATE TABLE IF NOT EXISTS starrySky (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        stars INT NOT NULL DEFAULT 0,
        lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      
      // 奖励表
      `CREATE TABLE IF NOT EXISTS rewards (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        date TIMESTAMP NOT NULL,
        isClaimed BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      
      // 记忆表
      `CREATE TABLE IF NOT EXISTS memories (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        title VARCHAR(100) NOT NULL,
        content TEXT,
        date TIMESTAMP NOT NULL,
        imageUrl VARCHAR(255),
        FOREIGN KEY (userId) REFERENCES users(id)
      )`,
      
      // 纪念日表
      `CREATE TABLE IF NOT EXISTS anniversaries (
        id VARCHAR(36) PRIMARY KEY,
        userId VARCHAR(36) NOT NULL,
        title VARCHAR(100) NOT NULL,
        date DATE NOT NULL,
        isRecurring BOOLEAN DEFAULT TRUE,
        description TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`
    ];
    
    // 执行所有创建表的SQL语句
    for (const sql of createTables) {
      await connection.execute(sql);
    }
    
    console.log('所有必要的表已创建或确认存在');
    connection.release();
  } catch (error) {
    console.error('创建表时出错:', error);
  }
}

// 健康检查端点
app.get('/api/ping', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// 获取用户数据
app.get('/api/user/:userId', async (req, res) => {
  try {
    await initializePool();
    const userId = req.params.userId;
    
    // 并行查询所有数据
    const [
      [usersResult],
      [recordsResult],
      [starrySkyResult],
      [rewardsResult],
      [memoriesResult],
      [anniversariesResult]
    ] = await Promise.all([
      // 检查用户是否存在，如果不存在则创建
      pool.execute('SELECT * FROM users WHERE id = ?', [userId]),
      // 获取记录
      pool.execute('SELECT * FROM records WHERE userId = ? ORDER BY date DESC', [userId]),
      // 获取星空数据
      pool.execute('SELECT * FROM starrySky WHERE userId = ?', [userId]),
      // 获取奖励
      pool.execute('SELECT * FROM rewards WHERE userId = ?', [userId]),
      // 获取记忆
      pool.execute('SELECT * FROM memories WHERE userId = ? ORDER BY date DESC', [userId]),
      // 获取纪念日
      pool.execute('SELECT * FROM anniversaries WHERE userId = ?', [userId])
    ]);
    
    // 如果用户不存在，创建新用户
    if (!usersResult.length) {
      await pool.execute(
        'INSERT INTO users (id, username) VALUES (?, ?)',
        [userId, `user_${userId}`]
      );
    }
    
    // 如果星空数据不存在，创建默认数据
    if (!starrySkyResult.length) {
      await pool.execute(
        'INSERT INTO starrySky (id, userId, stars) VALUES (?, ?, ?)',
        [Date.now().toString(), userId, 0]
      );
      // 重新查询星空数据
      const [newStarrySkyResult] = await pool.execute('SELECT * FROM starrySky WHERE userId = ?', [userId]);
      starrySkyResult = newStarrySkyResult;
    }
    
    // 构建返回数据
    const userData = {
      userId,
      records: recordsResult,
      starrySky: starrySkyResult[0] || { stars: 0 },
      rewards: rewardsResult,
      memories: memoriesResult,
      anniversaries: anniversariesResult
    };
    
    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('获取用户数据时出错:', error);
    res.status(500).json({
      success: false,
      message: '获取用户数据失败',
      error: error.message
    });
  }
});

// 保存用户数据
app.post('/api/user/:userId/save', async (req, res) => {
  try {
    await initializePool();
    const userId = req.params.userId;
    const data = req.body;
    
    console.log('接收到的数据迁移请求，userId:', userId);
    console.log('数据对象:', data);
    
    // 开始事务
    const connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // 确保用户存在
    const [existingUser] = await connection.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser.length) {
      // 如果用户不存在，创建用户，使用userId作为username
      const defaultUsername = `User_${userId}`;
      await connection.execute('INSERT INTO users (id, username) VALUES (?, ?)', [userId, defaultUsername]);
      console.log(`用户 ${userId} 不存在，已创建，用户名: ${defaultUsername}`);
    }
    
    try {
      // 保存记录数据
      if (data.records && Array.isArray(data.records)) {
        console.log(`保存${data.records.length}条记录数据，userId:`, userId);
        for (const record of data.records) {
          console.log('处理记录:', record);
          console.log('记录属性检查:', {
            id: record.id, 
            content: record.content, 
            type: record.type, 
            date: record.date
          });
          
          // 将ISO日期格式转换为MySQL兼容的日期时间格式
          let mysqlDate = record.date;
          if (record.date && typeof record.date === 'string') {
            // 处理ISO格式如2025-09-22T15:13:21.000Z
            if (record.date.includes('T') && record.date.includes('Z')) {
              const dateObj = new Date(record.date);
              mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
            }
          }
          
          const [existing] = await connection.execute('SELECT id FROM records WHERE id = ?', [record.id]);
          // 使用recordType字段而不是type字段
          const recordType = record.recordType || record.type || 'normal';
          if (existing.length) {
              // 更新现有记录
              await connection.execute(
                'UPDATE records SET content = ?, type = ?, date = ? WHERE id = ?',
                [record.content, recordType, mysqlDate, record.id]
              );
            } else {
              // 插入新记录
              await connection.execute(
                'INSERT INTO records (id, userId, content, type, date) VALUES (?, ?, ?, ?, ?)',
                [record.id, userId, record.content, recordType, mysqlDate]
              );
            }
        }
      }
      
      // 保存星空数据
      if (data.starrySky) {
        const [existing] = await connection.execute('SELECT id FROM starrySky WHERE userId = ?', [userId]);
        if (existing.length) {
          await connection.execute(
            'UPDATE starrySky SET stars = ?, lastUpdated = CURRENT_TIMESTAMP WHERE userId = ?',
            [data.starrySky.stars, userId]
          );
        } else {
          await connection.execute(
            'INSERT INTO starrySky (id, userId, stars) VALUES (?, ?, ?)',
            [Date.now().toString(), userId, data.starrySky.stars || 0]
          );
        }
      }
      
      // 保存奖励数据
      if (data.rewards && Array.isArray(data.rewards)) {
        for (const reward of data.rewards) {
          const [existing] = await connection.execute('SELECT id FROM rewards WHERE id = ?', [reward.id]);
          if (existing.length) {
            await connection.execute(
              'UPDATE rewards SET name = ?, description = ?, date = ?, isClaimed = ? WHERE id = ?',
              [reward.name, reward.description, reward.date, reward.isClaimed, reward.id]
            );
          } else {
            await connection.execute(
              'INSERT INTO rewards (id, userId, name, description, date, isClaimed) VALUES (?, ?, ?, ?, ?, ?)',
              [reward.id, userId, reward.name, reward.description, reward.date, reward.isClaimed || false]
            );
          }
        }
      }
      
      // 保存记忆数据
      if (data.memories && Array.isArray(data.memories)) {
        for (const memory of data.memories) {
          const [existing] = await connection.execute('SELECT id FROM memories WHERE id = ?', [memory.id]);
          if (existing.length) {
            await connection.execute(
              'UPDATE memories SET title = ?, content = ?, date = ?, imageUrl = ? WHERE id = ?',
              [memory.title || null, memory.content || null, memory.date || null, memory.imageUrl || null, memory.id]
            );
          } else {
            await connection.execute(
              'INSERT INTO memories (id, userId, title, content, date, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
              [memory.id, userId, memory.title || null, memory.content || null, memory.date || null, memory.imageUrl || null]
            );
          }
        }
      }
      
      // 保存纪念日数据
      if (data.anniversaries && Array.isArray(data.anniversaries)) {
        for (const anniversary of data.anniversaries) {
          const [existing] = await connection.execute('SELECT id FROM anniversaries WHERE id = ?', [anniversary.id]);
          if (existing.length) {
            await connection.execute(
              'UPDATE anniversaries SET title = ?, date = ?, isRecurring = ?, description = ? WHERE id = ?',
              [anniversary.title, anniversary.date, anniversary.isRecurring, anniversary.description, anniversary.id]
            );
          } else {
            await connection.execute(
              'INSERT INTO anniversaries (id, userId, title, date, isRecurring, description) VALUES (?, ?, ?, ?, ?, ?)',
              [anniversary.id, userId, anniversary.title, anniversary.date, anniversary.isRecurring || true, anniversary.description]
            );
          }
        }
      }
      
      // 提交事务
      await connection.commit();
      connection.release();
      
      res.json({
        success: true,
        message: '数据保存成功'
      });
    } catch (error) {
      // 回滚事务
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('保存用户数据时出错:', error);
    res.status(500).json({
      success: false,
      message: '保存用户数据失败',
      error: error.message
    });
  }
});

// 获取单个集合数据
app.get('/api/user/:userId/:collection', async (req, res) => {
  try {
    await initializePool();
    const { userId, collection } = req.params;
    
    // 验证集合名称
    const validCollections = ['records', 'starrySky', 'rewards', 'memories', 'anniversaries'];
    if (!validCollections.includes(collection)) {
      return res.status(400).json({
        success: false,
        message: '无效的集合名称'
      });
    }
    
    let results;
    if (collection === 'starrySky') {
      // 星空数据特殊处理，一个用户只有一条记录
      [results] = await pool.execute(`SELECT * FROM ${collection} WHERE userId = ?`, [userId]);
    } else {
      // 其他集合获取所有记录
      [results] = await pool.execute(`SELECT * FROM ${collection} WHERE userId = ?`, [userId]);
    }
    
    res.json({
      success: true,
      data: collection === 'starrySky' ? (results[0] || { stars: 0 }) : results
    });
  } catch (error) {
    console.error(`获取${collection}数据时出错:`, error);
    res.status(500).json({
      success: false,
      message: `获取${collection}数据失败`,
      error: error.message
    });
  }
});

// 保存单条记录
app.post('/api/records', async (req, res) => {
  try {
    await initializePool();
    const { userId, content, recordType, type, date, id } = req.body;
    
    // 验证必要字段
    if (!userId || !content) {
      return res.status(400).json({
        success: false,
        message: 'userId和content是必需的'
      });
    }
    
    // 确保用户存在
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser.length) {
      const defaultUsername = `User_${userId}`;
      await pool.execute('INSERT INTO users (id, username) VALUES (?, ?)', [userId, defaultUsername]);
      console.log(`用户 ${userId} 不存在，已创建，用户名: ${defaultUsername}`);
    }
    
    // 生成记录ID（如果没有提供）
    const recordId = id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // 将ISO日期格式转换为MySQL兼容的日期时间格式
    let mysqlDate = date;
    if (date && typeof date === 'string') {
      // 处理ISO格式如2025-09-22T15:13:21.000Z
      if (date.includes('T') && date.includes('Z')) {
        const dateObj = new Date(date);
        mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      } else if (date.includes('/')) {
        // 处理本地日期格式如"2023/9/22 15:13:21"
        const dateObj = new Date(date.replace(/\//g, '-'));
        mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      }
    }
    
    // 使用recordType字段而不是type字段
    const finalRecordType = recordType || type || 'normal';
    
    // 检查记录是否已存在
    const [existingRecord] = await pool.execute('SELECT id FROM records WHERE id = ?', [recordId]);
    
    if (existingRecord.length) {
      // 更新现有记录
      await pool.execute(
        'UPDATE records SET content = ?, type = ?, date = ? WHERE id = ?',
        [content, finalRecordType, mysqlDate, recordId]
      );
    } else {
      // 插入新记录
      await pool.execute(
        'INSERT INTO records (id, userId, content, type, date) VALUES (?, ?, ?, ?, ?)',
        [recordId, userId, content, finalRecordType, mysqlDate]
      );
    }
    
    res.json({
      success: true,
      message: '记录保存成功',
      data: { id: recordId }
    });
  } catch (error) {
    console.error('保存记录时出错:', error);
    res.status(500).json({
      success: false,
      message: '保存记录失败',
      error: error.message
    });
  }
});

// 保存单条回忆
app.post('/api/memories', async (req, res) => {
  try {
    await initializePool();
    const { userId, title, content, date, imageUrl, id } = req.body;
    
    // 验证必要字段并设置默认值
    if (!userId || !title) {
      return res.status(400).json({
        success: false,
        message: 'userId和title是必需的'
      });
    }
    
    // 确保content和imageUrl不是undefined
    const safeContent = content || '';
    const safeImageUrl = imageUrl || null;
    
    // 确保用户存在
    const [existingUser] = await pool.execute('SELECT id FROM users WHERE id = ?', [userId]);
    if (!existingUser.length) {
      const defaultUsername = `User_${userId}`;
      await pool.execute('INSERT INTO users (id, username) VALUES (?, ?)', [userId, defaultUsername]);
      console.log(`用户 ${userId} 不存在，已创建，用户名: ${defaultUsername}`);
    }
    
    // 生成记忆ID（如果没有提供）
    const memoryId = id || Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // 将ISO日期格式转换为MySQL兼容的日期时间格式
    let mysqlDate = date;
    if (date && typeof date === 'string') {
      // 处理ISO格式如2025-09-22T15:13:21.000Z
      if (date.includes('T') && date.includes('Z')) {
        const dateObj = new Date(date);
        mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      } else if (date.includes('/')) {
        // 处理本地日期格式如"2023/9/22 15:13:21"
        const dateObj = new Date(date.replace(/\//g, '-'));
        mysqlDate = dateObj.toISOString().slice(0, 19).replace('T', ' ');
      }
    }
    
    // 检查记忆是否已存在
    const [existingMemory] = await pool.execute('SELECT id FROM memories WHERE id = ?', [memoryId]);
    
    if (existingMemory.length) {
      // 更新现有记忆
      await pool.execute(
        'UPDATE memories SET title = ?, content = ?, date = ?, imageUrl = ? WHERE id = ?',
        [title, safeContent, mysqlDate, safeImageUrl, memoryId]
      );
    } else {
      // 插入新记忆
      await pool.execute(
        'INSERT INTO memories (id, userId, title, content, date, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
        [memoryId, userId, title, safeContent, mysqlDate, safeImageUrl]
      );
    }
    
    res.json({
      success: true,
      message: '回忆保存成功',
      data: { id: memoryId }
    });
  } catch (error) {
    console.error('保存回忆时出错:', error);
    res.status(500).json({
      success: false,
      message: '保存回忆失败',
      error: error.message
    });
  }
});

// 服务器启动
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`服务器正在运行在端口 ${PORT}`);
  try {
    // 初始化数据库连接
    await initializePool();
    console.log('数据库初始化完成');
  } catch (error) {
    console.error('数据库初始化失败，服务器仍在运行，但无法处理数据库请求:', error);
  }
});