import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    config: {
      navigationBarTitleText: '赠与记录',
      navigationBarBackgroundColor:'#fff',
      navigationBarTextStyle:'black'
    }
  }