import { Link } from 'react-router-dom'

function Home({ starrySky, todayTip }) {
  // 生成简单的星空背景（用于首页展示）
  const generateMiniStarrySky = () => {
    const stars = [];
    const totalStars = Math.min(20, starrySky.stars + starrySky.morning_stars);
    
    for (let i = 0; i < totalStars; i++) {
      const left = Math.random() * 90 + 5;
      const top = Math.random() * 90 + 5;
      const size = Math.random() * 4 + 2;
      const isMorningStar = i < Math.min(5, starrySky.morning_stars);
      
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

  const miniStars = generateMiniStarrySky()

  return (
      <div className="home-page">
        {/* 星空展示区域 */}
        <div className="module-container">
          <section className="starry-sky-section">
            <div className="starry-sky-container">
              <h2>我们的爱情星空</h2>
              
              {/* 小型星空背景 */}
              <div className="mini-sky-background">
                {miniStars.map((star) => (
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
              
              {/* 星空信息摘要 */}
              <div className="star-summary">
                <div className="star-counts">
                  <div className="count-item">
                    <span className="count-icon">⭐</span>
                    <span className="count-text">{starrySky.stars} 付出星</span>
                  </div>
                  <div className="count-item">
                    <span className="count-icon">☀️</span>
                    <span className="count-text">{starrySky.morning_stars} 晨辉星</span>
                  </div>
                </div>
                
                <div className="today-status">
                  <p>今日已记录: {starrySky.today_records}/5</p>
                </div>
                
                <Link to="/tree" className="view-detail-link">
                  查看星空详情 →
                </Link>
              </div>
            </div>
          </section>
        </div>

      {/* 功能导航 */}
      <div className="module-container">
        <section className="feature-nav">
          <div className="feature-items">
            <Link to="/record" className="feature-item">
              <div className="feature-icon"><i className="fas fa-pen-fancy"></i></div>
              <div className="feature-name">记录付出</div>
            </Link>
            <Link to="/tree" className="feature-item">
              <div className="feature-icon"><i className="fas fa-star"></i></div>
              <div className="feature-name">爱情星空</div>
            </Link>
            <Link to="/rewards" className="feature-item">
              <div className="feature-icon"><i className="fas fa-gift"></i></div>
              <div className="feature-name">星愿兑换</div>
            </Link>
            <Link to="/memories" className="feature-item">
              <div className="feature-icon"><i className="fas fa-images"></i></div>
              <div className="feature-name">共同回忆</div>
            </Link>
            <Link to="/tips" className="feature-item">
              <div className="feature-icon"><i className="fas fa-lightbulb"></i></div>
              <div className="feature-name">恋爱小贴士</div>
            </Link>
          </div>
        </section>
      </div>

      {/* 今日提醒 */}
      <div className="module-container">
        <section className="daily-reminder">
          <div className="reminder-content">
            <h3>💌 今日小贴士</h3>
            <p className="tip-text">
              {todayTip}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Home