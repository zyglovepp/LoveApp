import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Record({ onSubmitRecord }) {
  const [recordType, setRecordType] = useState('quick') // 'quick' 或 'deep'
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('happy')
  const [image, setImage] = useState(null)
  const [voice, setVoice] = useState(null)
  const [moodDescription, setMoodDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = onSubmitRecord(content, mood, image, recordType, voice, moodDescription)
      setMessage(result.message)
      setMessageType('success')
      
      // 重置表单
      setContent('')
      setMood('happy')
      setImage(null)
      setVoice(null)
      setMoodDescription('')
      
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

  const handleVoiceChange = (e) => {
    // 简化的音频处理，实际项目可能需要更复杂的录音功能
    setVoice(e.target.files[0])
  }

  return (
    <div className="record-page">
      <div className="module-container">
        <section className="form-section">
          <h2>记录今天的付出</h2>
          
          {/* 记录模式选择 */}
          <div className="record-type-selector">
            <label>
              <input
                type="radio"
                value="quick"
                checked={recordType === 'quick'}
                onChange={() => setRecordType('quick')}
              />
              <span>快速记录（≤10秒）</span>
            </label>
            <label>
              <input
                type="radio"
                value="deep"
                checked={recordType === 'deep'}
                onChange={() => setRecordType('deep')}
              />
              <span>深度记录（文字+照片/语音）</span>
            </label>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="content">记录内容 *</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={recordType === 'quick' 
                  ? "简单描述你为对方做的事情（如：给TA泡了蜂蜜水）"
                  : "详细描述你为对方做的事情和感受..."
                }
                required
                minLength={5}
                maxLength={recordType === 'quick' ? 100 : 500}
              ></textarea>
              <div className="char-count">
                {content.length}/{recordType === 'quick' ? 100 : 500}
              </div>
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
            
            {/* 深度记录特有字段 */}
            {recordType === 'deep' && (
              <>
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
                
                <div className="form-group">
                  <label htmlFor="voice">上传语音（可选）</label>
                  <input
                    id="voice"
                    type="file"
                    accept="audio/*"
                    onChange={handleVoiceChange}
                  />
                  {voice && <p className="voice-name">已选择: {voice.name}</p>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="moodDescription">心情描述（可选）</label>
                  <textarea
                    id="moodDescription"
                    value={moodDescription}
                    onChange={(e) => setMoodDescription(e.target.value)}
                    placeholder="分享你当时的心情和感受（如：希望TA看到能开心）"
                    rows="3"
                    maxLength={200}
                  ></textarea>
                  <div className="char-count">
                    {moodDescription.length}/200
                  </div>
                </div>
              </>
            )}
            
            <div className="form-actions">
              <button type="submit" disabled={loading} className="primary">
                {loading ? '提交中...' : '记录付出'}
              </button>
            </div>
          </form>
        </section>
      </div>

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