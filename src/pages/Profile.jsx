import { useState } from 'react'
import { Link } from 'react-router-dom'

function Profile({ data, setBackground }) {
  const [showSettings, setShowSettings] = useState(false)
  const [userInfo] = useState({
    name: '恋爱中的你',
    partnerName: '你的伴侣',
    togetherDays: 128,
    starCount: 45,
    morningStarCount: 9,
    totalRecords: 45
  })

  return (
    <div className="profile-page">
      <div className="module-container">
        {/* 用户信息卡片 */}
        <section className="profile-info">
          <div className="profile-header">
            <div className="avatar">
              <i className="fas fa-heart" style={{ fontSize: '2rem', color: '#ff6b6b' }}></i>
            </div>
            <div className="user-details">
              <h2>{userInfo.name}</h2>
              <p>与 {userInfo.partnerName} 相恋 {userInfo.togetherDays} 天</p>
            </div>
            <button 
              className="settings-btn" 
              onClick={() => setShowSettings(!showSettings)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-gear" style={{ fontSize: '1.2rem', color: '#666' }}></i>
            </button>
          </div>
        </section>
      </div>

      <div className="module-container">
        {/* 数据统计卡片 */}
        <section className="stats-section">
          <h3>恋爱数据</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{userInfo.starCount}</div>
              <div className="stat-label">付出星</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userInfo.morningStarCount}</div>
              <div className="stat-label">晨辉星</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userInfo.totalRecords}</div>
              <div className="stat-label">记录次数</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{Math.floor(userInfo.togetherDays / 30)}月{userInfo.togetherDays % 30}天</div>
              <div className="stat-label">恋爱时长</div>
            </div>
          </div>
        </section>
      </div>

      <div className="module-container">
        {/* 功能列表 */}
        <section className="profile-functions">
          <h3>功能导航</h3>
          <div className="function-list">
            <Link to="/" className="function-item">
              <i className="fas fa-home"></i>
              <span>返回主页</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/tree" className="function-item">
              <i className="fas fa-star"></i>
              <span>我的爱情星空</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/rewards" className="function-item">
              <i className="fas fa-gift"></i>
              <span>星愿兑换</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
            <Link to="/memories" className="function-item">
              <i className="fas fa-book"></i>
              <span>共同回忆</span>
              <i className="fas fa-chevron-right"></i>
            </Link>
          </div>
        </section>
      </div>

      <div className="module-container">
        {/* 按钮区域 */}
        <section className="profile-actions">
          <button className="secondary" style={{ marginBottom: '1rem', width: '100%' }}>
            <i className="fas fa-share-alt"></i> 分享我们的故事
          </button>
          <button className="warning" style={{ width: '100%' }}>
            <i className="fas fa-question-circle"></i> 帮助与反馈
          </button>
        </section>
      </div>

      {/* 设置面板（默认隐藏） */}
      {showSettings && (
        <div className="module-container">
          <section className="settings-section">
            <div className="settings-header">
              <h3>设置</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowSettings(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="settings-content">
              <div className="setting-item">
                <span>通知提醒</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <span>主题颜色</span>
                <div className="color-options">
                  <button className="color-btn active" style={{ backgroundColor: '#ff6b6b' }}></button>
                  <button className="color-btn" style={{ backgroundColor: '#4ecdc4' }}></button>
                  <button className="color-btn" style={{ backgroundColor: '#ffe66d' }}></button>
                </div>
              </div>
              
              {/* 背景设置 */}
              <div className="setting-item">
                <span>背景设置</span>
                <div className="background-options">
                  <button 
                    className={`background-btn ${data?.background?.type === 'default' ? 'active' : ''}`} 
                    onClick={() => setBackground('default')}
                  >
                    默认渐变
                  </button>
                  <button 
                    className={`background-btn ${data?.background?.type === 'bg1' ? 'active' : ''}`} 
                    onClick={() => setBackground('bg1')}
                  >
                    背景图1
                  </button>
                  <button 
                    className={`background-btn ${data?.background?.type === 'bg2' ? 'active' : ''}`} 
                    onClick={() => setBackground('bg2')}
                  >
                    背景图2
                  </button>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setBackground('custom', event.target.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    style={{ marginTop: '0.5rem' }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* 页脚版权信息 */}
      <div className="profile-footer">
        <p>Love App © 2023 - 让爱更纯粹</p>
        <p style={{ fontSize: '0.8rem', color: '#999', marginTop: '0.5rem' }}>
          v1.0.0 | 隐私政策 | 用户协议
        </p>
      </div>
    </div>
  )
}

export default Profile