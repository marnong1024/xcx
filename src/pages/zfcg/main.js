import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    config: {
      navigationBarTitleText: '支付成功',
      navigationBarBackgroundColor:'#fff',
      navigationBarTextStyle:'black'
    }
  }