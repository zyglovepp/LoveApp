import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Record from './pages/Record'
import Tree from './pages/Tree'
import Rewards from './pages/Rewards'
import Memories from './pages/Memories'
import Tips from './pages/Tips'
import Profile from './pages/Profile'
import './App.css'

// 导入数据库服务
import { connectToDB, migrateLocalDataToDB, fetchUserDataFromDB, saveRecordToDB, saveStarrySkyToDB, saveRewardToDB, saveMemoryToDB, saveAnniversaryToDB, getUserId } from './services/dbService'

// 自定义导航栏组件
const TopNavbar = () => {
  const location = useLocation();
  
  return (
    <>
      <nav className="top-navbar">
        <div className="app-title">
          <i className="fas fa-heart"></i>
          <span>恋爱小助手</span>
        </div>
        <div className="nav-actions">
          <Link to="/memories" className={`nav-icon ${location.pathname === '/memories' ? 'active' : ''}`}>
            <i className="fas fa-bookmark"></i>
          </Link>
          <Link to="/tips" className={`nav-icon ${location.pathname === '/tips' ? 'active' : ''}`}>
            <i className="fas fa-lightbulb"></i>
          </Link>
        </div>
      </nav>
      {/* 为固定导航栏添加占位元素，防止内容被遮挡 */}
      <div className="navbar-placeholder"></div>
    </>
  );
};

// 自定义底部标签导航组件
const BottomNav = () => {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-items">
        <Link to="/" className={`bottom-nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <i className="fas fa-home"></i>
          </div>
          <span className="bottom-nav-label">主页</span>
        </Link>
        <Link to="/record" className={`bottom-nav-item ${location.pathname === '/record' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <i className="fas fa-edit"></i>
          </div>
          <span className="bottom-nav-label">记录</span>
        </Link>
        <Link to="/tree" className={`bottom-nav-item ${location.pathname === '/tree' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <i className="fas fa-star"></i>
          </div>
          <span className="bottom-nav-label">星空</span>
        </Link>
        <Link to="/rewards" className={`bottom-nav-item ${location.pathname === '/rewards' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <i className="fas fa-gift"></i>
          </div>
          <span className="bottom-nav-label">奖励</span>
        </Link>
        <Link to="/profile" className={`bottom-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}>
          <div className="bottom-nav-icon">
            <i className="fas fa-user"></i>
          </div>
          <span className="bottom-nav-label">我的</span>
        </Link>
      </div>
    </nav>
  );
};

function App() {
  // 模拟数据存储
  const [data, setData] = useState(() => {
    // 尝试从localStorage加载数据
    const savedData = localStorage.getItem('loveAppData')
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // 迁移旧数据到新的星空系统
      if (parsedData.tree_status) {
        const starsEarned = parsedData.tree_status.water_count || 0;
        return {
          starry_sky: {
            stars: starsEarned,
            morning_stars: Math.floor(starsEarned / 5), // 简单迁移逻辑
            today_records: 0,
            last_record_date: parsedData.tree_status.last_water_date || null,
            achievements: []
          },
          records: parsedData.records || [],
          rewards: parsedData.rewards || [],
          memories: parsedData.memories || [],
          anniversaries: parsedData.anniversaries || [],
          tips: parsedData.tips || [],
          background: {
            type: 'default',
            value: null
          }
        };
      }
      return parsedData;
    }
    
    // 初始数据
    return {
      records: [],
      starry_sky: {
        stars: 0,        // 付出星数量
        morning_stars: 0, // 晨辉星数量
        today_records: 0, // 今日记录数量
        last_record_date: null, // 上次记录日期
        achievements: [] // 成就列表
      },
      rewards: [],
      memories: [],
      anniversaries: [],
      tips: [
        "恋爱中最重要的是真诚和沟通。",
        "学会换位思考，理解对方的感受。",
        "定期表达感谢和爱意，不要把对方的好视为理所当然。",
        "给彼此一些个人空间，保持独立的自我。",
        "共同创造新的回忆，保持关系的新鲜感。"
      ],
      background: {
        type: 'default', // default, bg1, bg2, custom
        value: null
      }
    }
  })

  // 用户ID
  const [userId] = useState(getUserId);

  // 数据库连接和数据同步
  useEffect(() => {
    // 临时：确保数据迁移能够触发
    // 如果localStorage中没有dataSyncedWithDB标志，添加一些示例数据并触发迁移
    const hasSynced = localStorage.getItem('dataSyncedWithDB');
    if (!hasSynced) {
      console.log('临时：未检测到同步标志，确保有测试数据');
      const testData = {
        records: [{ id: '1', content: '测试记录', recordType: 'normal', date: new Date().toISOString() }],
        starry_sky: { stars: 0, morning_stars: 0, today_records: 0, last_record_date: null, achievements: [] },
        rewards: [],
        memories: [],
        anniversaries: []
      };
      localStorage.setItem('loveAppData', JSON.stringify(testData));
    }
    
    const initDatabase = async () => {
      try {
        console.log('初始化数据库连接...');
        // 连接到后端服务
        const connectResult = await connectToDB();
        console.log('连接结果:', connectResult);
        
        // 检查是否需要从本地迁移数据
        const savedData = localStorage.getItem('loveAppData');
        const hasSynced = localStorage.getItem('dataSyncedWithDB');
        console.log('本地数据状态 - 有数据:', !!savedData, '已同步:', !!hasSynced);
        
        if (savedData && !hasSynced) {
          console.log('开始从本地迁移数据到服务器');
          const parsedData = JSON.parse(savedData);
          const migrateResult = await migrateLocalDataToDB(userId, parsedData);
          
          if (migrateResult.success) {
            console.log('数据迁移成功');
            localStorage.setItem('dataSyncedWithDB', 'true');
          } else {
            console.error('数据迁移失败:', migrateResult.message);
          }
        } else {
          // 尝试从数据库加载数据
          console.log('尝试从数据库加载数据');
          const fetchResult = await fetchUserDataFromDB(userId);
          
          if (fetchResult.success && fetchResult.data) {
            const dbData = fetchResult.data;
            // 合并数据库数据和本地数据
            setData(prevData => {
              const mergedData = {
                ...prevData,
                ...dbData,
                // 确保tips和background字段存在
                tips: prevData.tips,
                background: prevData.background
              };
              return mergedData;
            });
          }
        }
      } catch (error) {
        console.error('数据库初始化失败:', error);
        // 数据库连接失败不影响应用功能，继续使用本地存储
      }
    };

    initDatabase();

    // 组件卸载时断开数据库连接
    return () => {
      // 注意：在Web应用中，我们通常不主动断开连接，而是让连接保持活跃
    };
  }, [userId]);

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('loveAppData', JSON.stringify(data))
  }, [data])

  // 设置背景图
  const setBackground = (type, value = null) => {
    setData(prev => ({
      ...prev,
      background: {
        type,
        value
      }
    }))
  }

  // API函数
  const submitRecord = async (content, mood, image = null, recordType = 'quick', voice = null, moodDescription = '') => {
    if (!content || content.trim().length < 5) {
      throw new Error('记录内容不能为空且至少5个字符')
    }

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = today !== data.starry_sky.last_record_date;
    
    // 检查每日记录限制
    if (!isNewDay && data.starry_sky.today_records >= 5) {
      throw new Error('今日记录已达上限（5条），请明天再来记录吧！')
    }

    // 准备记录数据
    const newRecord = {
      id: data.records.length + 1,
      content,
      mood,
      recordType, // quick: 快速记录, deep: 深度记录
      voice: voice ? 'voice recording' : null, // 简化处理，实际项目可能需要更复杂的音频处理
      moodDescription,
      date: new Date().toLocaleString('zh-CN'),
      image: image ? image.name : null,
      starType: isNewDay ? 'morning_star' : 'normal_star' // 首次记录获得晨辉星
    }

    // 更新星空状态
    let updatedStars = data.starry_sky.stars + 1;
    let updatedMorningStars = data.starry_sky.morning_stars;
    let updatedTodayRecords = isNewDay ? 1 : data.starry_sky.today_records + 1;
    
    // 首次记录奖励晨辉星
    if (isNewDay) {
      updatedMorningStars += 1;
    }

    // 检查成就解锁
    const updatedAchievements = [...data.starry_sky.achievements];
    const totalStars = updatedStars + updatedMorningStars;
    
    // 成就逻辑示例
    if (totalStars >= 10 && !updatedAchievements.includes('first_star_light')) {
      updatedAchievements.push('first_star_light');
    }
    if (totalStars >= 50 && !updatedAchievements.includes('star_forest')) {
      updatedAchievements.push('star_forest');
    }
    if (data.records.length + 1 >= 30 && !updatedAchievements.includes('persistent_love')) {
      updatedAchievements.push('persistent_love');
    }

    const updatedStarrySky = {
      stars: updatedStars,
      morning_stars: updatedMorningStars,
      today_records: updatedTodayRecords,
      last_record_date: today,
      achievements: updatedAchievements
    }

    setData(prev => ({
      ...prev,
      records: [...prev.records, newRecord],
      starry_sky: updatedStarrySky
    }))

    // 尝试保存到数据库
    try {
      await saveRecordToDB(userId, newRecord);
      await saveStarrySkyToDB(userId, updatedStarrySky);
      console.log('记录已保存到数据库');
    } catch (error) {
      console.error('保存记录到数据库失败:', error);
      // 数据库保存失败不会影响应用功能，继续使用本地存储
    }

    const message = isNewDay 
      ? '记录成功！获得了1颗晨辉星和1颗付出星～' 
      : '记录成功！获得了1颗付出星～';
    
    return { success: true, message }
  }

  // 检查并应用背景图
  useEffect(() => {
    const body = document.querySelector('body');
    if (!body) return;

    // 清除所有背景相关样式
    body.style.backgroundImage = '';
    body.style.backgroundSize = '';
    body.style.backgroundPosition = '';
    body.style.backgroundRepeat = '';

    // 应用新背景 - 添加空值检查
    if (data.background && data.background.type === 'default') {
      body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)';
    } else if (data.background && data.background.type === 'bg1') {
      body.style.backgroundImage = 'url(/images/bg1.png)';
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
    } else if (data.background && data.background.type === 'bg2') {
      body.style.backgroundImage = 'url(/images/bg2.png)';
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
    } else if (data.background && data.background.type === 'custom' && data.background.value) {
      body.style.backgroundImage = `url(${data.background.value})`;
      body.style.backgroundSize = 'cover';
      body.style.backgroundPosition = 'center';
      body.style.backgroundRepeat = 'no-repeat';
    } else {
      // 默认背景
      body.style.background = 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)';
    }
  }, [data.background])

  const exchangeReward = async (reward_type) => {
    if (data.starry_sky.morning_stars < 1) {
      throw new Error('晨辉星数量不足')
    }

    const reward_names = {
      'make_up': '和好券',
      'wish': '心愿券',
      'ceremony': '专属仪式券'
    }

    const new_reward = {
      id: data.rewards.length + 1,
      type: reward_type,
      name: reward_names[reward_type] || '未知奖励',
      date: new Date().toISOString().split('T')[0],
      used: false
    }

    const updatedStarrySky = {
      ...data.starry_sky,
      morning_stars: data.starry_sky.morning_stars - 1
    }

    setData(prev => ({
      ...prev,
      rewards: [...prev.rewards, new_reward],
      starry_sky: updatedStarrySky
    }))

    // 尝试保存到数据库
    try {
      await saveRewardToDB(userId, new_reward);
      await saveStarrySkyToDB(userId, updatedStarrySky);
      console.log('奖励已保存到数据库');
    } catch (error) {
      console.error('保存奖励到数据库失败:', error);
      // 数据库保存失败不会影响应用功能，继续使用本地存储
    }

    return { success: true, message: '兑换成功！消耗1颗晨辉星，获得了' + new_reward.name }
  }

  const addMemory = async (title, description, tags, image = null) => {
    const newMemory = {
      id: data.memories.length + 1,
      title,
      description,
      tags: tags ? tags.split(',') : [],
      date: new Date().toISOString().split('T')[0],
      image: image ? image.name : null
    }

    setData(prev => ({
      ...prev,
      memories: [...prev.memories, newMemory]
    }))

    // 尝试保存到数据库
    try {
      await saveMemoryToDB(userId, newMemory);
      console.log('回忆已保存到数据库');
    } catch (error) {
      console.error('保存回忆到数据库失败:', error);
      // 数据库保存失败不会影响应用功能，继续使用本地存储
    }

    return { success: true, message: '回忆添加成功！' }
  }

  const addAnniversary = async (name, date) => {
    const newAnniversary = {
      id: data.anniversaries.length + 1,
      name,
      date
    }

    setData(prev => ({
      ...prev,
      anniversaries: [...prev.anniversaries, newAnniversary]
    }))

    // 尝试保存到数据库
    try {
      await saveAnniversaryToDB(userId, newAnniversary);
      console.log('纪念日已保存到数据库');
    } catch (error) {
      console.error('保存纪念日到数据库失败:', error);
      // 数据库保存失败不会影响应用功能，继续使用本地存储
    }

    return { success: true, message: '纪念日添加成功！' }
  }

  // 获取今日小贴士
  const getTodayTip = () => {
    return data.tips[Math.floor(Math.random() * data.tips.length)]
  }

  // 手动触发数据迁移（临时用于调试）
  const manuallyTriggerMigration = async () => {
    console.log('手动触发数据迁移流程');
    const savedData = localStorage.getItem('loveAppData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        console.log('准备迁移的数据:', parsedData);
        const migrateResult = await migrateLocalDataToDB(userId, parsedData);
        if (migrateResult.success) {
          console.log('数据迁移成功');
          localStorage.setItem('dataSyncedWithDB', 'true');
          alert('数据迁移成功！');
        } else {
          console.error('数据迁移失败:', migrateResult.message);
          alert('数据迁移失败: ' + migrateResult.message);
        }
      } catch (error) {
        console.error('数据迁移失败:', error);
        alert('数据迁移失败: ' + error.message);
      }
    }
  }

  return (
    <Router>
      <div className="app-container">
        <div className="main-layout">
          {/* 顶部固定导航栏 */}
          <TopNavbar />
          
          {/* 主内容区域 */}
          <div className="main-content-wrapper">
            {/* 临时：用于调试的数据迁移按钮 */}
            <button 
              onClick={manuallyTriggerMigration} 
              style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 1000,
                padding: '10px 20px',
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              手动触发数据迁移
            </button>
            
            <div className="main-content">
              <Routes>
                <Route path="/" element={<Home starrySky={data.starry_sky} todayTip={getTodayTip()} />} />
                <Route path="/record" element={<Record onSubmitRecord={submitRecord} />} />
                <Route path="/tree" element={<Tree starrySky={data.starry_sky} />} />
                <Route path="/rewards" element={<Rewards starrySky={data.starry_sky} rewards={data.rewards} onExchangeReward={exchangeReward} />} />
                <Route path="/memories" element={<Memories memories={data.memories} anniversaries={data.anniversaries} onAddMemory={addMemory} onAddAnniversary={addAnniversary} />} />
                <Route path="/tips" element={<Tips tips={data.tips} />} />
                <Route path="/profile" element={<Profile data={data} setBackground={setBackground} />} />
              </Routes>
            </div>
          </div>
        </div>
        
        {/* 底部标签式导航栏 */}
        <BottomNav />
      </div>
    </Router>
  )
}

export default App