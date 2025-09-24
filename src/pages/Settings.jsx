import { useState } from 'react'
import { Link } from 'react-router-dom'

function Settings({ data, setBackground, onTriggerMigration }) {
  // 设置面板状态
  const [showNotifications, setShowNotifications] = useState(true)
  const [selectedColor, setSelectedColor] = useState('#ff6b6b')

  return (
    <div className="settings-page">
      {/* 页面标题栏 */}
      <div className="page-header" style={{ position: 'relative', textAlign: 'center', paddingTop: '2rem', marginBottom: '2rem' }}>
        <Link to="/profile" style={{ position: 'absolute', left: '1rem', top: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textDecoration: 'none', color: '#ff6b6b', fontSize: '1.2rem', transition: 'all 0.3s ease' }}>
          <i className="fas fa-arrow-left"></i>
        </Link>
        <h1 style={{ margin: 0, color: '#333', fontSize: '1.8rem' }}>设置</h1>
      </div>

      <div className="module-container">
        {/* 设置内容区域 */}
        <section className="settings-section">
          <div className="settings-content">
            <div className="setting-item">
              <span>通知提醒</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={showNotifications} 
                  onChange={(e) => setShowNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            <div className="setting-item">
              <span>主题颜色</span>
              <div className="color-options">
                <button 
                  className={`color-btn ${selectedColor === '#ff6b6b' ? 'active' : ''}`} 
                  style={{ backgroundColor: '#ff6b6b' }} 
                  onClick={() => setSelectedColor('#ff6b6b')}
                ></button>
                <button 
                  className={`color-btn ${selectedColor === '#4ecdc4' ? 'active' : ''}`} 
                  style={{ backgroundColor: '#4ecdc4' }} 
                  onClick={() => setSelectedColor('#4ecdc4')}
                ></button>
                <button 
                  className={`color-btn ${selectedColor === '#ffe66d' ? 'active' : ''}`} 
                  style={{ backgroundColor: '#ffe66d' }} 
                  onClick={() => setSelectedColor('#ffe66d')}
                ></button>
              </div>
            </div>
            
            {/* 数据迁移按钮 */}
            <div className="setting-item">
              <button className="secondary" style={{ width: '100%' }} onClick={onTriggerMigration}>
                手动触发数据迁移
              </button>
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

export default Settings