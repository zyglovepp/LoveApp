import { Link } from 'react-router-dom'

function Home({ treeStatus, fruits, todayTip }) {
  // 阶段对应的中文名称
  const stageNames = {
    'seed': '种子',
    'sprout': '发芽',
    'leaf': '长叶',
    'flower': '开花',
    'fruit': '结果'
  }

  return (
    <div className="home-page">
      {/* 情感树展示区域 */}
      <div className="module-container">
        <section className="tree-section">
          <div className="tree-container">
            <h2>我们的恋爱小树</h2>
            <div className="tree-image">
              <img 
                src={`/images/tree_${treeStatus.stage}.svg`} 
                alt={stageNames[treeStatus.stage]} 
                onError={(e) => {
                  // 降级处理：如果找不到svg，使用简单的图标代替
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%234CAF50' d='M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z'/%3E%3C/svg%3E`;
                }}
              />
            </div>
            <div className="tree-info">
              <p>当前状态：{stageNames[treeStatus.stage] || '种子'}</p>
              <p>浇水次数：{treeStatus.water_count}</p>
              <p>果实数量：{fruits} <i className="fas fa-apple-alt"></i></p>
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
              <div className="feature-icon"><i className="fas fa-tree"></i></div>
              <div className="feature-name">情感树</div>
            </Link>
            <Link to="/rewards" className="feature-item">
              <div className="feature-icon"><i className="fas fa-gift"></i></div>
              <div className="feature-name">果实兑换</div>
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