import { useNavigate } from 'react-router-dom'

function Tree({ treeStatus }) {
  const navigate = useNavigate()
  
  // 阶段对应的中文名称
  const stageNames = {
    'seed': '种子',
    'sprout': '发芽',
    'leaf': '长叶',
    'flower': '开花',
    'fruit': '结果'
  }
  
  // 阶段对应的描述
  const stageDescriptions = {
    'seed': '爱情的种子已经种下，需要你们共同呵护它成长。',
    'sprout': '爱情开始发芽了，继续用爱和关怀浇灌它吧！',
    'leaf': '小树长出了嫩绿的叶子，你们的感情正在茁壮成长。',
    'flower': '小树开花了，你们的爱情正处于最美好的阶段。',
    'fruit': '小树结果了，你们的爱情结出了甜美的果实。'
  }
  
  // 下一阶段需要的浇水次数
  const getNextStageInfo = () => {
    if (treeStatus.water_count >= 50) {
      return '爱情之树已经成熟，每浇水50次就会结出果实！';
    } else if (treeStatus.water_count >= 30) {
      return `还需要 ${50 - treeStatus.water_count} 次浇水就能结果了！`;
    } else if (treeStatus.water_count >= 15) {
      return `还需要 ${30 - treeStatus.water_count} 次浇水就能开花了！`;
    } else if (treeStatus.water_count >= 5) {
      return `还需要 ${15 - treeStatus.water_count} 次浇水就能长叶了！`;
    } else {
      return `还需要 ${5 - treeStatus.water_count} 次浇水就能发芽了！`;
    }
  }
  
  // 上次浇水时间
  const getLastWaterDate = () => {
    if (!treeStatus.last_water_date) {
      return '还没有浇过水哦';
    }
    return treeStatus.last_water_date;
  }
  
  return (
    <div className="tree-page">
      {/* 顶部导航 */}
      <nav className="navbar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className="logo">情感树</h1>
        <div style={{ width: '1.5rem' }}></div> {/* 占位，保持标题居中 */}
      </nav>

      {/* 主内容区域 */}
      <main className="main-content">
        <section className="tree-section">
          <div className="tree-container">
            <h2>我们的恋爱小树</h2>
            <div className="tree-image">
              <img 
                src={`/images/tree_${treeStatus.stage}.svg`} 
                alt={stageNames[treeStatus.stage]} 
                style={{ maxHeight: '250px' }} 
                onError={(e) => {
                  // 降级处理：如果找不到svg，使用简单的图标代替
                  e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='%234CAF50' d='M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z'/%3E%3C/svg%3E`;
                }}
              />
            </div>
            <div className="tree-info">
              <p>当前状态：{stageNames[treeStatus.stage]} - {stageDescriptions[treeStatus.stage]}</p>
              <p>浇水次数：{treeStatus.water_count}</p>
              <p>上次浇水：{getLastWaterDate()}</p>
              <p style={{ marginTop: '1rem', fontWeight: 'bold', color: '#ff6b6b' }}>
                {getNextStageInfo()}
              </p>
            </div>
          </div>
        </section>
        
        <section className="daily-reminder">
          <div className="reminder-content">
            <h3>💡 成长小贴士</h3>
            <p className="tip-text">
              每天记录一次你们的爱情点滴，用爱和关怀浇灌这棵小树，让它和你们的爱情一起茁壮成长吧！
              点击下方按钮去记录今天的付出吧！
            </p>
            <button 
              style={{ marginTop: '1rem', width: '100%', padding: '0.8rem' }} 
              onClick={() => navigate('/record')}
            >
              <i className="fas fa-pen-fancy"></i> 去记录付出
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Tree