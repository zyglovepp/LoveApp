import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Rewards({ fruits, rewards, onExchangeReward }) {
  const [selectedReward, setSelectedReward] = useState('make_up')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const navigate = useNavigate()

  const rewardTypes = [
    { value: 'make_up', name: '和好券', description: '当你们发生小争执时，可以使用此券要求对方和好' },
    { value: 'wish', name: '心愿券', description: '可以向对方提出一个合理的心愿，对方要尽力满足' },
    { value: 'ceremony', name: '专属仪式券', description: '可以要求对方为你策划一场专属的浪漫仪式' }
  ]

  const handleExchange = async () => {
    setLoading(true)
    
    try {
      const result = onExchangeReward(selectedReward)
      setMessage(result.message)
      setMessageType('success')
      
      // 3秒后清空消息
      setTimeout(() => {
        setMessage('')
      }, 3000)
    } catch (error) {
      setMessage(error.message)
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rewards-page">
      <div className="module-container">
        {/* 果实数量显示 */}
        <section className="tree-section">
          <div className="tree-container">
            <h2>你的果实</h2>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ff6b6b' }}>
              {fruits} <i className="fas fa-apple-alt"></i>
            </div>
            <p style={{ marginTop: '1rem', color: '#555' }}>
              每记录50次付出，情感树就会结出一个果实
            </p>
          </div>
        </section>
      </div>

      <div className="module-container">
        {/* 兑换奖励 */}
        <section className="form-section">
          <h2>兑换奖励</h2>
          <div className="form-group">
            <label htmlFor="reward_type">选择奖励类型</label>
            <select
              id="reward_type"
              value={selectedReward}
              onChange={(e) => setSelectedReward(e.target.value)}
            >
              {rewardTypes.map(reward => (
                <option key={reward.value} value={reward.value}>
                  {reward.name}
                </option>
              ))}
            </select>
            <p style={{ marginTop: '0.5rem', color: '#555', fontSize: '0.9rem' }}>
              {rewardTypes.find(r => r.value === selectedReward)?.description}
            </p>
          </div>
          
          <div className="form-actions">
            <button 
                type="button" 
                className="primary"
                onClick={handleExchange} 
                disabled={loading || fruits < 1}
              >
                {loading ? '兑换中...' : `兑换奖励 (消耗1个果实)`}
              </button>
            {fruits < 1 && (
              <p style={{ marginTop: '0.5rem', color: '#ff6b6b', fontSize: '0.9rem' }}>
                果实数量不足，需要先记录更多的付出哦！
              </p>
            )}
          </div>
          </section>
        </div>

        {rewards.length > 0 && (
          <div className="module-container">
            {/* 我的奖励列表 */}
          <section className="list-section">
            <h2>我的奖励</h2>
            {rewards.map(reward => (
              <div key={reward.id} className="list-item">
                <div className="list-item-header">
                  <span className="list-item-title">{reward.name}</span>
                  <span className="list-item-date">{reward.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{reward.used ? '已使用' : '未使用'}</span>
                  <span style={{ 
                    color: reward.used ? '#999' : '#4ecdc4',
                    fontWeight: 'bold' 
                  }}>
                    {reward.used ? '🎫' : '✨'}
                  </span>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}

      {/* 提示消息 */}
      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}
    </div>
  )
}

export default Rewards