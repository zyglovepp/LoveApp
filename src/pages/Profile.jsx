import { useState } from 'react'
import { Link } from 'react-router-dom'

function Profile({ data, setBackground, onTriggerMigration }) {
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
        {/* 功能列表 - 仅保留设置图标 */}
        <section className="profile-functions">
          <h3>功能导航</h3>
          <div className="function-list">
            <Link to="/settings" className="function-item">
              <i className="fas fa-cog"></i>
              <span>设置</span>
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