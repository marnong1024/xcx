import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    config: {
      navigationBarTitleText: '生成图片',
      navigationBarBackgroundColor:'#549af9',
      navigationBarTextStyle:'black'
    }
  }