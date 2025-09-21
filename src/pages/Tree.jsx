import { useNavigate } from 'react-router-dom'

function Tree({ starrySky }) {
  const navigate = useNavigate()

  // 成就名称与描述
  const achievements = {
    'first_star_light': { name: '第一颗星光', description: '获得了人生中第一颗星星' },
    'star_forest': { name: '星空森林', description: '累计获得50颗星星' },
    'persistent_love': { name: '持续的爱', description: '坚持记录30天的付出' },
    'morning_collector': { name: '晨光收集者', description: '获得10颗晨辉星' },
    'star_master': { name: '星空大师', description: '累计获得100颗星星' }
  }

  // 生成星空展示数据
  const generateStarrySkyDisplay = () => {
    const stars = [];
    const totalStars = starrySky.stars + starrySky.morning_stars;
    
    // 生成星星位置
    for (let i = 0; i < totalStars; i++) {
      const left = Math.random() * 95;
      const top = Math.random() * 95;
      const size = Math.random() * 8 + 2;
      const isMorningStar = i < starrySky.morning_stars;
      
      stars.push({
        id: i,
        left: `${left}%`,
        top: `${top}%`,
        size: `${size}px`,
        type: isMorningStar ? 'morning' : 'normal'
      });
    }
    
    return stars;
  }

  const starDisplay = generateStarrySkyDisplay()
  
  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '暂无记录';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
  }

  // 获取已解锁成就
  const unlockedAchievements = starrySky.achievements.map(id => achievements[id]).filter(Boolean)
  
  return (
      <div className="tree-page">
        {/* 星空展示区域 */}
        <div className="module-container">
          <section className="starry-sky-section">
            <h2>我们的爱情星空</h2>
            <div className="starry-sky-container">
              {/* 星空背景 */}
              <div className="sky-background">
                {/* 随机生成的星星 */}
                {starDisplay.map((star) => (
                  <div
                    key={star.id}
                    className={`star ${star.type}`}
                    style={{
                      left: star.left,
                      top: star.top,
                      width: star.size,
                      height: star.size,
                      animationDelay: `${star.id * 0.1}s`
                    }}
                  />
                ))}
              </div>
              
              {/* 星空信息 */}
              <div className="star-info">
                <div className="star-stats">
                  <div className="stat-item">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-value">{starrySky.stars}</span>
                    <span className="stat-label">付出星</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">☀️</span>
                    <span className="stat-value">{starrySky.morning_stars}</span>
                    <span className="stat-label">晨辉星</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">✨</span>
                    <span className="stat-value">{starrySky.stars + starrySky.morning_stars}</span>
                    <span className="stat-label">总星星</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📅</span>
                    <span className="stat-value">{starrySky.today_records}/5</span>
                    <span className="stat-label">今日记录</span>
                  </div>
                </div>
                
                <div className="last-record-info">
                  <p>上次记录：{formatDate(starrySky.last_record_date)}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 成就展示 */}
        {unlockedAchievements.length > 0 && (
          <div className="module-container">
            <section className="achievements-section">
              <h3>🏆 解锁的成就</h3>
              <div className="achievements-list">
                {unlockedAchievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <div className="achievement-icon">🌟</div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* 记录按钮 */}
        <div className="module-container">
          <section className="action-section">
            <button 
              className="primary"
              onClick={() => navigate('/record')}
            >
              记录今天的付出
            </button>
          </section>
        </div>
      </div>
    )
}

export default Tree