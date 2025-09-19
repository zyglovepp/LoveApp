import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Tips() {
  const [tipOfTheDay, setTipOfTheDay] = useState(null)
  const [allTips, setAllTips] = useState([])
  const [favorites, setFavorites] = useState([])
  const [showFavorites, setShowFavorites] = useState(false)
  const navigate = useNavigate()

  // 恋爱小贴士数据
  const tipsData = [
    {
      id: 1,
      title: '保持日常的小惊喜',
      content: '不需要昂贵的礼物，一个贴心的便签、一杯温热的咖啡、一句温暖的话，都能让对方感受到你的在乎。',
      category: '日常相处'
    },
    {
      id: 2,
      title: '学会有效的沟通',
      content: '在发生分歧时，记得用"我"开头表达感受，而不是指责对方。例如："我感到有点难过"而不是"你总是让我难过"。',
      category: '沟通技巧'
    },
    {
      id: 3,
      title: '创造共同的仪式感',
      content: '每周一次的约会、固定的早餐时间、睡前的拥抱，这些小事会成为你们独特的情感纽带。',
      category: '仪式感'
    },
    {
      id: 4,
      title: '尊重彼此的空间',
      content: '即使是最亲密的伴侣也需要独处的时间。给对方空间，也是给自己空间成长。',
      category: '个人空间'
    },
    {
      id: 5,
      title: '表达感恩',
      content: '经常对对方说"谢谢"，表达你对他/她所做一切的感激之情。感恩能让关系更加稳固。',
      category: '情感表达'
    },
    {
      id: 6,
      title: '记住重要的日子',
      content: '生日、纪念日、第一次约会的日期...这些重要的日子能让对方感受到你的用心。',
      category: '关系维护'
    },
    {
      id: 7,
      title: '一起尝试新事物',
      content: '共同学习一项新技能、尝试新的餐厅、去新的地方旅行，新鲜的体验能为关系注入活力。',
      category: '共同成长'
    },
    {
      id: 8,
      title: '学会倾听',
      content: '有时候对方需要的不是解决方案，而是一个耐心倾听的人。放下手机，认真听对方说话。',
      category: '沟通技巧'
    },
    {
      id: 9,
      title: '保持幽默感',
      content: '在生活中保持幽默感，一起笑能拉近彼此的距离，也能缓解紧张的气氛。',
      category: '情感表达'
    },
    {
      id: 10,
      title: '支持对方的梦想',
      content: '成为对方最坚实的后盾，支持他/她追求梦想，一起成长为更好的人。',
      category: '共同成长'
    }
  ]

  // 初始化数据
  useEffect(() => {
    // 从localStorage加载收藏的小贴士
    const savedFavorites = localStorage.getItem('loveApp_favoriteTips')
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }

    // 设置所有小贴士
    setAllTips(tipsData)

    // 设置今日小贴士（基于日期的随机选择）
    const today = new Date().toDateString()
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const randomIndex = seed % tipsData.length
    setTipOfTheDay(tipsData[randomIndex])
  }, [])

  // 保存收藏到localStorage
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites)
    localStorage.setItem('loveApp_favoriteTips', JSON.stringify(newFavorites))
  }

  // 切换收藏状态
  const toggleFavorite = (tipId) => {
    if (favorites.includes(tipId)) {
      saveFavorites(favorites.filter(id => id !== tipId))
    } else {
      saveFavorites([...favorites, tipId])
    }
  }

  // 获取收藏的小贴士
  const getFavoriteTips = () => {
    return allTips.filter(tip => favorites.includes(tip.id))
  }

  // 根据分类获取小贴士
  const getTipsByCategory = () => {
    const categories = {}
    allTips.forEach(tip => {
      if (!categories[tip.category]) {
        categories[tip.category] = []
      }
      categories[tip.category].push(tip)
    })
    return categories
  }

  const categorizedTips = getTipsByCategory()

  return (
    <div className="tips-page">
      {showFavorites ? (
        // 收藏的小贴士
        <div className="module-container">
          <section className="tips-section">
            <h2>我的收藏</h2>
            {getFavoriteTips().length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '2rem',
                color: '#666' 
              }}>
                <i className="far fa-heart" style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}></i>
                <p>还没有收藏任何小贴士哦</p>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  浏览小贴士时点击心形图标进行收藏
                </p>
              </div>
            ) : (
              getFavoriteTips().map(tip => (
                <div key={tip.id} className="tip-item">
                  <div className="tip-header">
                    <h3>{tip.title}</h3>
                    <button 
                      className="favorite-btn active"
                      onClick={() => toggleFavorite(tip.id)}
                      aria-label="取消收藏"
                    >
                      <i className="fas fa-heart"></i>
                    </button>
                  </div>
                  <p className="tip-content">{tip.content}</p>
                  <span className="tip-category">{tip.category}</span>
                </div>
              ))
            )}
          </section>
        </div>
      ) : (
        // 所有小贴士
        <>
          {/* 今日小贴士 */}
          {tipOfTheDay && (
            <div className="module-container">
              <section className="daily-reminder">
                <div className="reminder-content">
                  <h3>💡 今日小贴士</h3>
                  <h4>{tipOfTheDay.title}</h4>
                  <p className="tip-text">{tipOfTheDay.content}</p>
                </div>
              </section>
            </div>
          )}
          
          {/* 分类展示所有小贴士 */}
          {Object.keys(categorizedTips).map(category => (
            <div key={category} className="module-container">
              <section className="tips-section">
                <h2>{category}</h2>
                {categorizedTips[category].map(tip => (
                  <div key={tip.id} className="tip-item">
                    <div className="tip-header">
                      <h3>{tip.title}</h3>
                      <button 
                        className={`favorite-btn ${favorites.includes(tip.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(tip.id)}
                        aria-label={favorites.includes(tip.id) ? '取消收藏' : '收藏'}
                      >
                        {favorites.includes(tip.id) ? (
                          <i className="fas fa-heart"></i>
                        ) : (
                          <i className="far fa-heart"></i>
                        )}
                      </button>
                    </div>
                    <p className="tip-content">{tip.content}</p>
                  </div>
                ))}
              </section>
            </div>
          ))}
        </>
      )}
    </div>
  )
}

export default Tips