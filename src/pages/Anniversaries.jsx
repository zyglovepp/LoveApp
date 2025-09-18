import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Anniversaries({ anniversaries, onAddAnniversary }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [name, setName] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [nextAnniversary, setNextAnniversary] = useState(null)
  const navigate = useNavigate()

  // 计算距离下一个纪念日的天数
  useEffect(() => {
    if (anniversaries.length === 0) return

    const today = new Date()
    const todayYear = today.getFullYear()
    const todayMonth = today.getMonth()
    const todayDay = today.getDate()

    // 计算每个纪念日距离今天的天数
    const nextAnni = anniversaries.reduce((closest, anniv) => {
      const annivDate = new Date(anniv.date)
      let futureDate = new Date(todayYear, annivDate.getMonth(), annivDate.getDate())
      
      // 如果今年的纪念日已经过了，计算明年的
      if (
        futureDate.getMonth() < todayMonth || 
        (futureDate.getMonth() === todayMonth && futureDate.getDate() < todayDay)
      ) {
        futureDate = new Date(todayYear + 1, annivDate.getMonth(), annivDate.getDate())
      }
      
      // 计算天数差
      const daysDiff = Math.ceil((futureDate - today) / (1000 * 60 * 60 * 24))
      
      if (!closest || daysDiff < closest.daysDiff) {
        return { ...anniv, daysDiff, nextDate: futureDate }
      }
      return closest
    }, null)

    setNextAnniversary(nextAnni)
  }, [anniversaries])

  const handleAddAnniversary = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = onAddAnniversary(name, date)
      setMessage(result.message)
      setMessageType('success')
      
      // 重置表单并关闭
      setName('')
      setDate('')
      setShowAddForm(false)
    } catch (error) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  // 按照距离今天的天数排序纪念日
  const sortedAnniversaries = [...anniversaries].sort((a, b) => {
    const aDate = new Date(a.date)
    const bDate = new Date(b.date)
    const today = new Date()
    
    let aFuture = new Date(today.getFullYear(), aDate.getMonth(), aDate.getDate())
    let bFuture = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())
    
    if (aFuture < today) aFuture = new Date(today.getFullYear() + 1, aDate.getMonth(), aDate.getDate())
    if (bFuture < today) bFuture = new Date(today.getFullYear() + 1, bDate.getMonth(), bDate.getDate())
    
    return aFuture - bFuture
  })

  return (
    <div className="anniversaries-page">
      {/* 顶部导航 */}
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="logo">纪念日</h1>
        <button 
          className="add-btn" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="fas fa-plus"></i>
        </button>
      </nav>

      {/* 添加纪念日表单 */}
      {showAddForm && (
        <div className="form-section">
          <button 
            className="close-btn" 
            onClick={() => setShowAddForm(false)}
          >
            <i className="fas fa-times"></i>
          </button>
          <h2>添加纪念日</h2>
          <form onSubmit={handleAddAnniversary}>
            <div className="form-group">
              <label htmlFor="name">纪念日名称 *</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：相识纪念日、第一次约会"
                required
                minLength={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="date">日期 *</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? '添加中...' : '保存纪念日'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 主内容区域 */}
      <main className="main-content">
        {/* 下一个纪念日提醒 */}
        {nextAnniversary && (
          <section className="daily-reminder">
            <div className="reminder-content">
              <h3>💖 下一个纪念日</h3>
              <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#ff6b6b',
                marginTop: '0.5rem'
              }}>
                {nextAnniversary.name}
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {nextAnniversary.daysDiff} 天
              </div>
              <p style={{ 
                fontSize: '0.9rem', 
                color: '#666',
                marginTop: '0.5rem'
              }}>
                {nextAnniversary.nextDate.toLocaleDateString('zh-CN')}
              </p>
            </div>
          </section>
        )}

        {/* 纪念日列表 */}
        {sortedAnniversaries.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#666' 
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              <i className="far fa-calendar-alt" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
              还没有设置纪念日哦
            </p>
            <p style={{ marginBottom: '2rem' }}>
              点击右上角的加号，添加你们的第一个重要纪念日吧！
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <i className="fas fa-plus"></i> 添加纪念日
            </button>
          </div>
        ) : (
          <section className="list-section">
            <h2>重要日子</h2>
            {sortedAnniversaries.map(anniversary => {
              // 计算距离
              const annivDate = new Date(anniversary.date)
              const today = new Date()
              let futureDate = new Date(today.getFullYear(), annivDate.getMonth(), annivDate.getDate())
              
              if (futureDate < today) {
                futureDate = new Date(today.getFullYear() + 1, annivDate.getMonth(), annivDate.getDate())
              }
              
              const daysDiff = Math.ceil((futureDate - today) / (1000 * 60 * 60 * 24))
              
              return (
                <div key={anniversary.id} className="list-item">
                  <div className="list-item-header">
                    <span className="list-item-title">{anniversary.name}</span>
                    <span className="list-item-date">{anniversary.date}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    fontSize: '0.9rem'
                  }}>
                    <span style={{ color: daysDiff <= 7 ? '#ff6b6b' : '#555' }}>
                      还有 {daysDiff} 天
                    </span>
                    <span>{daysDiff <= 7 ? '💝' : '📅'}</span>
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </main>

      {/* 提示消息 */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Anniversaries