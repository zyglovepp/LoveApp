import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Memories({ memories, onAddMemory }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  // 生成当前日期字符串，用于默认值
  const getCurrentDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleAddMemory = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = onAddMemory(content, date, image)
      setMessage(result.message)
      setMessageType('success')
      
      // 重置表单并关闭
      setContent('')
      setDate(getCurrentDate())
      setImage(null)
      setShowAddForm(false)
    } catch (error) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.files[0])
  }

  // 按照日期倒序排序回忆
  const sortedMemories = [...memories].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  )

  return (
    <div className="memories-page">
      {/* 顶部导航 */}
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="logo">共同回忆</h1>
        <button 
          className="add-btn" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <i className="fas fa-plus"></i>
        </button>
      </nav>

      {/* 添加回忆表单 */}
      {showAddForm && (
        <div className="form-section">
          <button 
            className="close-btn" 
            onClick={() => setShowAddForm(false)}
          >
            <i className="fas fa-times"></i>
          </button>
          <h2>添加美好回忆</h2>
          <form onSubmit={handleAddMemory}>
            <div className="form-group">
              <label htmlFor="content">回忆内容 *</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你们的美好回忆..."
                required
                minLength={5}
              ></textarea>
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
            
            <div className="form-group">
              <label htmlFor="image">上传照片（可选）</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {image && <p className="image-name">已选择: {image.name}</p>}
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading}>
                {loading ? '添加中...' : '保存回忆'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 主内容区域 - 回忆列表 */}
      <main className="main-content">
        {sortedMemories.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '2rem',
            color: '#666' 
          }}>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              <i className="far fa-calendar-check" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
              还没有共同回忆哦
            </p>
            <p style={{ marginBottom: '2rem' }}>
              点击右上角的加号，添加你们的第一个美好回忆吧！
            </p>
            <button 
              onClick={() => setShowAddForm(true)}
              style={{ width: '100%', padding: '0.8rem' }}
            >
              <i className="fas fa-plus"></i> 添加回忆
            </button>
          </div>
        ) : (
          <section className="list-section">
            <h2>美好时光</h2>
            {sortedMemories.map(memory => (
              <div key={memory.id} className="list-item memory-item">
                {memory.image && (
                  <div className="memory-image">
                    <img 
                      src={memory.image}
                      alt="回忆照片"
                      style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </div>
                )}
                <div className="list-item-header">
                  <span className="list-item-title">{memory.content}</span>
                  <span className="list-item-date">{memory.date}</span>
                </div>
              </div>
            ))}
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

export default Memories