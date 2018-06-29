import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    // 拼团这个字段走 app.json
    config: {
        navigationBarTitleText: '心愿汽车',
        navigationBarBackgroundColor: '#6fb8fe',
    }
  }