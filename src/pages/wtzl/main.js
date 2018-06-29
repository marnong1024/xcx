import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()
export default {
    config: {
      navigationBarTitleText: '为TA实现心愿',
      navigationBarBackgroundColor:'#fff',
      navigationBarTextStyle:'black'
    }
  }