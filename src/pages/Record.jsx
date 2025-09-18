import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Record({ onSubmitRecord }) {
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('happy')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = onSubmitRecord(content, mood, image)
      setMessage(result.message)
      setMessageType('success')
      
      // 重置表单
      setContent('')
      setMood('happy')
      setImage(null)
      
      // 3秒后返回首页
      setTimeout(() => {
        navigate('/')
      }, 3000)
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

  return (
    <div className="record-page">
      {/* 顶部导航 */}
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="logo">记录付出</h1>
        <div style={{ width: '1.5rem' }}></div> {/* 占位，保持标题居中 */}
      </nav>

      {/* 主内容区域 */}
      <main className="main-content">
        <section className="form-section">
          <h2>记录今天的付出</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">记录内容 *</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="写下你今天为对方做的事情或感受到的爱意..."
                required
                minLength={5}
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="mood">心情</label>
              <select
                id="mood"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
              >
                <option value="happy">😊 开心</option>
                <option value="excited">😍 兴奋</option>
                <option value="grateful">🙏 感恩</option>
                <option value="calm">😌 平静</option>
                <option value="thoughtful">🤔 深思</option>
              </select>
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
                {loading ? '提交中...' : '记录付出'}
              </button>
            </div>
          </form>
        </section>
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

export default Record