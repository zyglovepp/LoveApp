// 重构后的数据库服务 - 使用后端API而非直接连接MongoDB

// 后端API基础URL - 使用相对路径，由Vite代理处理
const API_BASE_URL = '/api';

// 简单的HTTP请求包装函数
const request = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP错误! 状态码: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    // 在API不可用时，返回失败状态但不抛出异常，确保应用可以继续运行
    return { success: false, message: error.message };
  }
};

// 获取用户ID (保持不变)
export const getUserId = () => {
  let id = localStorage.getItem('userId');
  if (!id) {
    id = 'user_' + Date.now();
    localStorage.setItem('userId', id);
  }
  return id;
};

// 模拟连接状态 - 由于使用API，始终返回true表示可以尝试API请求
export const isConnectedToDB = () => {
  return true;
};

// 模拟连接函数 - 由于使用API，不需要实际连接数据库
export const connectToDB = async () => {
  console.log('使用后端API服务');
  // 验证后端API是否可用
  const result = await request('/ping'); // request函数会自动添加API_BASE_URL前缀
  if (result.success) {
    console.log('后端API连接成功');
  } else {
    console.warn('后端API当前不可用，将使用本地存储');
  }
  return Promise.resolve(true);
};

// 模拟断开连接函数 - 由于使用API，不需要实际断开连接
export const disconnectFromDB = async () => {
  console.log('API连接已关闭');
  return Promise.resolve();
};

// 从本地迁移数据到服务器
export const migrateLocalDataToDB = async (userId, localData) => {
  try {
    console.log('准备发送数据迁移请求，userId:', userId);
    console.log('准备迁移的数据:', localData);
    // 使用现有的保存用户数据端点来实现数据迁移
    const result = await request(`/user/${userId}/save`, {
      method: 'POST',
      body: JSON.stringify(localData)
    });
    console.log('数据迁移请求响应:', result);
    
    if (result.success) {
      console.log('数据迁移成功完成');
    } else {
      console.error('数据迁移失败:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('数据迁移失败:', error);
    return { success: false, message: error.message };
  }
};

// 从服务器获取用户数据
export const fetchUserDataFromDB = async (userId) => {
  try {
    const result = await request(`/user/${userId}`);
    
    if (result.success && result.data) {
      console.log('从服务器获取数据成功');
    } else {
      console.error('从服务器获取数据失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('从服务器获取数据失败:', error);
    return { success: false, message: error.message };
  }
};

// 保存记录到服务器
export const saveRecordToDB = async (userId, record) => {
  try {
    const result = await request('/records', {
      method: 'POST',
      body: JSON.stringify({ userId, ...record })
    });
    
    if (result.success) {
      console.log('记录保存成功');
    } else {
      console.error('记录保存失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('保存记录到服务器失败:', error);
    return { success: false, message: error.message };
  }
};

// 保存星空数据到服务器
export const saveStarrySkyToDB = async (userId, starrySky) => {
  try {
    const result = await request('/starry-sky', {
      method: 'POST',
      body: JSON.stringify({ userId, ...starrySky })
    });
    
    if (result.success) {
      console.log('星空数据保存成功');
    } else {
      console.error('星空数据保存失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('保存星空数据到服务器失败:', error);
    return { success: false, message: error.message };
  }
};

// 保存奖励到服务器
export const saveRewardToDB = async (userId, reward) => {
  try {
    const result = await request('/rewards', {
      method: 'POST',
      body: JSON.stringify({ userId, ...reward })
    });
    
    if (result.success) {
      console.log('奖励保存成功');
    } else {
      console.error('奖励保存失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('保存奖励到服务器失败:', error);
    return { success: false, message: error.message };
  }
};

// 保存回忆到服务器
export const saveMemoryToDB = async (userId, memory) => {
  try {
    const result = await request('/memories', {
      method: 'POST',
      body: JSON.stringify({ userId, ...memory })
    });
    
    if (result.success) {
      console.log('回忆保存成功');
    } else {
      console.error('回忆保存失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('保存回忆到服务器失败:', error);
    return { success: false, message: error.message };
  }
};

// 保存纪念日到服务器
export const saveAnniversaryToDB = async (userId, anniversary) => {
  try {
    const result = await request('/anniversaries', {
      method: 'POST',
      body: JSON.stringify({ userId, ...anniversary })
    });
    
    if (result.success) {
      console.log('纪念日保存成功');
    } else {
      console.error('纪念日保存失败:', result.message || '未知错误');
    }
    
    return result;
  } catch (error) {
    console.error('保存纪念日到服务器失败:', error);
    return { success: false, message: error.message };
  }
};

// 导出默认对象
const dbService = {
  connectToDB,
  disconnectFromDB,
  getUserId,
  migrateLocalDataToDB,
  fetchUserDataFromDB,
  saveRecordToDB,
  saveStarrySkyToDB,
  saveRewardToDB,
  saveMemoryToDB,
  saveAnniversaryToDB,
  isConnectedToDB
};

export default dbService;