/**
 * Love APP 通用脚本文件
 */

// 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    // 为所有按钮添加悬停效果
    const buttons = document.querySelectorAll('button, .btn, a:not(.back-btn)');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // 平滑滚动效果
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // 模拟加载状态
    const loaders = document.querySelectorAll('.loading');
    loaders.forEach(loader => {
        setTimeout(() => {
            loader.style.display = 'none';
        }, 1000);
    });
    
    // 添加一些简单的动画效果
    animateOnScroll();
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        // 可以在这里添加响应式调整逻辑
    });
});

/**
 * 滚动时添加动画效果
 */
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.tree-image, .feature-item, .record-item, .memory-item, .anniversary-item, .tip-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.style.opacity = 0;
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * 显示提示消息
 */
function showMessage(message, type = 'success') {
    // 创建提示元素
    const messageElement = document.createElement('div');
    messageElement.className = 'message ' + type;
    messageElement.textContent = message;
    
    // 添加到页面
    document.body.appendChild(messageElement);
    
    // 设置样式
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.right = '20px';
    messageElement.style.padding = '1rem 1.5rem';
    messageElement.style.borderRadius = '8px';
    messageElement.style.color = 'white';
    messageElement.style.fontWeight = 'bold';
    messageElement.style.zIndex = '3000';
    messageElement.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateX(100%)';
    messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // 设置背景色
    if (type === 'success') {
        messageElement.style.backgroundColor = '#4ecdc4';
    } else if (type === 'error') {
        messageElement.style.backgroundColor = '#ff6b6b';
    } else if (type === 'warning') {
        messageElement.style.backgroundColor = '#ffd93d';
        messageElement.style.color = '#333';
    }
    
    // 显示提示
    setTimeout(() => {
        messageElement.style.opacity = '1';
        messageElement.style.transform = 'translateX(0)';
    }, 100);
    
    // 3秒后隐藏
    setTimeout(() => {
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 300);
    }, 3000);
}

/**
 * 验证表单输入
 */
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff6b6b';
            
            // 3秒后恢复
            setTimeout(() => {
                input.style.borderColor = '';
            }, 3000);
        }
    });
    
    return isValid;
}

/**
 * 格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    if (format === 'YYYY-MM-DD') {
        return `${year}-${month}-${day}`;
    } else if (format === 'YYYY-MM-DD HH:mm') {
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    } else if (format === 'YYYY-MM-DD HH:mm:ss') {
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    } else if (format === 'MM-DD') {
        return `${month}-${day}`;
    }
    
    return date;
}

/**
 * 计算两个日期之间的天数
 */
function daysBetweenDates(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * 生成随机ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 复制文本到剪贴板
 */
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        
        // 避免滚动条出现
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('无法复制文本: ', err);
        }
        
        document.body.removeChild(textArea);
    }
}