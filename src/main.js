import Vue from 'vue'
import App from './App'
import Store from './store'
import { request,login,link } from './utils/wx'
Vue.prototype.$store = Store
Vue.prototype.$http = request
Vue.prototype.$links = link
Vue.prototype.$login  = function(init){
  login().then(res=>{
      var obj = {
        url:link.login,
        method:"POST",
        data:{thirdCode:res.code}
        };
        request(obj).then(tok=>{ 
        var data = tok.data;
        if(data.code==0){
             tok = data.data.userToken;
             Store.state.SyncType = data.data.syncType;
             Store.state.userToken = tok;
             if(init){
              init()
             }      
        } 
      })
    }).catch(res=>{
      console.log(res)
    })
  }
  App.mpType = 'app'
  const app = new Vue(App)
  app.$mount()
export default {
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
    'pages/order/main',
    'pages/counter/main',
    '^pages/index/main',
    'pages/kaituan/main',
    'pages/details/main',
    'pages/xzdz/main',
    'pages/kafeiku/main',
    'pages/bjdz/main',
    'pages/psdd/main',
    'pages/ddxq/main',
    'pages/xylist/main',
    'pages/ddzt/main',
    'pages/xyjl/main',
    'pages/tiqu/main',
    'pages/zfcg/main',
    'pages/qrcode/main',
    'pages/zyjl/main',
    'pages/wtzl/main',
    'pages/tqlp/main',
    'pages/explain/main'
  ],
    tabBar: {  
      color: "#a9b7b7",  
      selectedColor: "#6fb8fe",
      borderStyle:"#c2c2c2",  
      list: [
        {  
        selectedIconPath: "static/img/qiche.png",  
        iconPath: "static/img/qiche_a.png",  
        pagePath: "pages/index/main",
        text: "心愿汽车"  
      },
       {  
        selectedIconPath: "static/img/tuan.png",  
        iconPath: "static/img/tuan_a.png",  
        pagePath: "pages/counter/main",  
        text: "拼团"  
      }, {  
        selectedIconPath: "static/img/lihe.png",  
        iconPath: "static/img/lihe_a.png",  
        pagePath: "pages/kafeiku/main",  
        text: "车库"  
      }, {  
        selectedIconPath: "static/img/dingdan.png",  
        iconPath: "static/img/dingdan_a.png",  
        pagePath: "pages/order/main",  
        text: "订单"  
      }]  
    }
  }
}
