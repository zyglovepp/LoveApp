from flask import Flask, render_template, request, jsonify, redirect, url_for
import json
import os
from datetime import datetime, timedelta
import random

app = Flask(__name__)

# 配置数据文件路径
DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data')
DB_FILE = os.path.join(DATA_DIR, 'db.json')

# 确保数据目录存在
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# 初始化数据
if not os.path.exists(DB_FILE):
    initial_data = {
        'records': [],
        'tree_status': {
            'stage': 'seed',  # seed, sprout, leaf, flower, fruit
            'water_count': 0,
            'last_water_date': None
        },
        'fruits': 0,
        'rewards': [],
        'memories': [],
        'anniversaries': [],
        'tips': [
            "恋爱中最重要的是真诚和沟通。",
            "学会换位思考，理解对方的感受。",
            "定期表达感谢和爱意，不要把对方的好视为理所当然。",
            "给彼此一些个人空间，保持独立的自我。",
            "共同创造新的回忆，保持关系的新鲜感。"
        ]
    }
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(initial_data, f, ensure_ascii=False, indent=2)

# 读取数据
def read_data():
    with open(DB_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

# 保存数据
def save_data(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 主页
@app.route('/')
def index():
    data = read_data()
    return render_template('index.html', tree_status=data['tree_status'], fruits=data['fruits'])

# 记录付出页面
@app.route('/record')
def record_page():
    return render_template('record.html')

# 提交付出记录
@app.route('/submit_record', methods=['POST'])
def submit_record():
    content = request.form.get('content')
    mood = request.form.get('mood')
    image = request.files.get('image')  # 简化处理，实际项目中需要处理文件上传
    
    if not content or len(content.strip()) < 5:
        return jsonify({'success': False, 'message': '记录内容不能为空且至少5个字符'})
    
    data = read_data()
    
    # 创建新记录
    new_record = {
        'id': len(data['records']) + 1,
        'content': content,
        'mood': mood,
        'date': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'image': image.filename if image else None
    }
    
    data['records'].append(new_record)
    
    # 更新情感树状态
    data['tree_status']['water_count'] += 1
    data['tree_status']['last_water_date'] = datetime.now().strftime('%Y-%m-%d')
    
    # 检查是否升级
    if data['tree_status']['water_count'] >= 50:
        data['tree_status']['stage'] = 'fruit'
        # 每结果一次获得一个果实
        if data['tree_status']['water_count'] % 50 == 0:
            data['fruits'] += 1
    elif data['tree_status']['water_count'] >= 30:
        data['tree_status']['stage'] = 'flower'
    elif data['tree_status']['water_count'] >= 15:
        data['tree_status']['stage'] = 'leaf'
    elif data['tree_status']['water_count'] >= 5:
        data['tree_status']['stage'] = 'sprout'
    
    save_data(data)
    return jsonify({'success': True, 'message': '记录成功！情感树获得了养分～'})

# 情感树页面
@app.route('/tree')
def tree_page():
    data = read_data()
    return render_template('tree.html', tree_status=data['tree_status'])

# 果实兑换页面
@app.route('/rewards')
def rewards_page():
    data = read_data()
    return render_template('rewards.html', fruits=data['fruits'], rewards=data['rewards'])

# 兑换奖励
@app.route('/exchange_reward', methods=['POST'])
def exchange_reward():
    reward_type = request.form.get('reward_type')
    
    data = read_data()
    
    # 检查果实数量是否足够
    if data['fruits'] < 1:
        return jsonify({'success': False, 'message': '果实数量不足'})
    
    # 创建奖励
    reward_names = {
        'make_up': '和好券',
        'wish': '心愿券',
        'ceremony': '专属仪式券'
    }
    
    new_reward = {
        'id': len(data['rewards']) + 1,
        'type': reward_type,
        'name': reward_names.get(reward_type, '未知奖励'),
        'date': datetime.now().strftime('%Y-%m-%d'),
        'used': False
    }
    
    data['rewards'].append(new_reward)
    data['fruits'] -= 1
    
    save_data(data)
    return jsonify({'success': True, 'message': '兑换成功！获得了' + new_reward['name']})

# 共同回忆页面
@app.route('/memories')
def memories_page():
    data = read_data()
    return render_template('memories.html', memories=data['memories'], anniversaries=data['anniversaries'])

# 添加回忆
@app.route('/add_memory', methods=['POST'])
def add_memory():
    title = request.form.get('title')
    description = request.form.get('description')
    tags = request.form.get('tags')
    image = request.files.get('image')  # 简化处理
    
    data = read_data()
    
    new_memory = {
        'id': len(data['memories']) + 1,
        'title': title,
        'description': description,
        'tags': tags.split(',') if tags else [],
        'date': datetime.now().strftime('%Y-%m-%d'),
        'image': image.filename if image else None
    }
    
    data['memories'].append(new_memory)
    save_data(data)
    return jsonify({'success': True, 'message': '回忆添加成功！'})

# 添加纪念日
@app.route('/add_anniversary', methods=['POST'])
def add_anniversary():
    name = request.form.get('name')
    date = request.form.get('date')
    
    data = read_data()
    
    new_anniversary = {
        'id': len(data['anniversaries']) + 1,
        'name': name,
        'date': date
    }
    
    data['anniversaries'].append(new_anniversary)
    save_data(data)
    return jsonify({'success': True, 'message': '纪念日添加成功！'})

# 恋爱小贴士页面
@app.route('/tips')
def tips_page():
    data = read_data()
    today_tip = random.choice(data['tips'])
    return render_template('tips.html', tips=data['tips'], today_tip=today_tip)

# 获取所有记录（用于调试）
@app.route('/api/records')
def get_records():
    data = read_data()
    return jsonify(data['records'])

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)