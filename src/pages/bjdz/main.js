import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()
//首页
export default {
    config: {
      navigationBarTitleText: '编辑地址',
      navigationBarBackgroundColor:'#fff',
      navigationBarTextStyle:'black'
    }
  }