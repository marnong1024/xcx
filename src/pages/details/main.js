import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    config: {
      navigationBarTitleText: '订单详情',
      navigationBarBackgroundColor:'#fff',
      navigationBarTextStyle:'black'
    }
  }