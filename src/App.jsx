import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Record from './pages/Record'
import Tree from './pages/Tree'
import Rewards from './pages/Rewards'
import Memories from './pages/Memories'
import Tips from './pages/Tips'
import './App.css'

function App() {
  // 模拟数据存储
  const [data, setData] = useState(() => {
    // 尝试从localStorage加载数据
    const savedData = localStorage.getItem('loveAppData')
    if (savedData) {
      return JSON.parse(savedData)
    }
    
    // 初始数据
    return {
      records: [],
      tree_status: {
        stage: 'seed',  // seed, sprout, leaf, flower, fruit
        water_count: 0,
        last_water_date: null
      },
      fruits: 0,
      rewards: [],
      memories: [],
      anniversaries: [],
      tips: [
        "恋爱中最重要的是真诚和沟通。",
        "学会换位思考，理解对方的感受。",
        "定期表达感谢和爱意，不要把对方的好视为理所当然。",
        "给彼此一些个人空间，保持独立的自我。",
        "共同创造新的回忆，保持关系的新鲜感。"
      ]
    }
  })

  // 保存数据到localStorage
  useEffect(() => {
    localStorage.setItem('loveAppData', JSON.stringify(data))
  }, [data])

  // API函数
  const submitRecord = (content, mood, image = null) => {
    if (!content || content.trim().length < 5) {
      throw new Error('记录内容不能为空且至少5个字符')
    }

    const newRecord = {
      id: data.records.length + 1,
      content,
      mood,
      date: new Date().toLocaleString('zh-CN'),
      image: image ? image.name : null
    }

    const updatedTreeStatus = {
      ...data.tree_status,
      water_count: data.tree_status.water_count + 1,
      last_water_date: new Date().toISOString().split('T')[0]
    }

    // 检查是否升级
    let updatedStage = updatedTreeStatus.stage
    let updatedFruits = data.fruits
    
    if (updatedTreeStatus.water_count >= 50) {
      updatedStage = 'fruit'
      // 每结果一次获得一个果实
      if (updatedTreeStatus.water_count % 50 === 0) {
        updatedFruits += 1
      }
    } else if (updatedTreeStatus.water_count >= 30) {
      updatedStage = 'flower'
    } else if (updatedTreeStatus.water_count >= 15) {
      updatedStage = 'leaf'
    } else if (updatedTreeStatus.water_count >= 5) {
      updatedStage = 'sprout'
    }

    updatedTreeStatus.stage = updatedStage

    setData(prev => ({
      ...prev,
      records: [...prev.records, newRecord],
      tree_status: updatedTreeStatus,
      fruits: updatedFruits
    }))

    return { success: true, message: '记录成功！情感树获得了养分～' }
  }

  const exchangeReward = (reward_type) => {
    if (data.fruits < 1) {
      throw new Error('果实数量不足')
    }

    const reward_names = {
      'make_up': '和好券',
      'wish': '心愿券',
      'ceremony': '专属仪式券'
    }

    const new_reward = {
      id: data.rewards.length + 1,
      type: reward_type,
      name: reward_names[reward_type] || '未知奖励',
      date: new Date().toISOString().split('T')[0],
      used: false
    }

    setData(prev => ({
      ...prev,
      rewards: [...prev.rewards, new_reward],
      fruits: prev.fruits - 1
    }))

    return { success: true, message: '兑换成功！获得了' + new_reward.name }
  }

  const addMemory = (title, description, tags, image = null) => {
    const newMemory = {
      id: data.memories.length + 1,
      title,
      description,
      tags: tags ? tags.split(',') : [],
      date: new Date().toISOString().split('T')[0],
      image: image ? image.name : null
    }

    setData(prev => ({
      ...prev,
      memories: [...prev.memories, newMemory]
    }))

    return { success: true, message: '回忆添加成功！' }
  }

  const addAnniversary = (name, date) => {
    const newAnniversary = {
      id: data.anniversaries.length + 1,
      name,
      date
    }

    setData(prev => ({
      ...prev,
      anniversaries: [...prev.anniversaries, newAnniversary]
    }))

    return { success: true, message: '纪念日添加成功！' }
  }

  // 获取今日小贴士
  const getTodayTip = () => {
    return data.tips[Math.floor(Math.random() * data.tips.length)]
  }

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route 
            path="/" 
            element={<Home 
              treeStatus={data.tree_status} 
              fruits={data.fruits} 
              todayTip={getTodayTip()} 
            />} 
          />
          <Route 
            path="/record" 
            element={<Record onSubmitRecord={submitRecord} />} 
          />
          <Route 
            path="/tree" 
            element={<Tree treeStatus={data.tree_status} />} 
          />
          <Route 
            path="/rewards" 
            element={<Rewards 
              fruits={data.fruits} 
              rewards={data.rewards} 
              onExchangeReward={exchangeReward} 
            />} 
          />
          <Route 
            path="/memories" 
            element={<Memories 
              memories={data.memories} 
              anniversaries={data.anniversaries} 
              onAddMemory={addMemory} 
              onAddAnniversary={addAnniversary} 
            />} 
          />
          <Route 
            path="/tips" 
            element={<Tips tips={data.tips} />} 
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App