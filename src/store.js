import Vue from 'vue'
import Vuex from 'vuex'
import { request,getUserInfo } from './utils/wx'
Vue.use(Vuex)
export default new Vuex.Store({
  /**
     * @param  {} {commit}
     * 选择的订单
     */
    state:{
      order:null,
      SyncType:null,
      userToken:null,
      loginState:true,
      userInfo:{
              nickName:'',
              avatar:'',
              gender:'',
      },
      windowWidth:null,
      locations:null,
      userFirst:false,
      cityName:null,
      miniPic:null,
      description:"用压箱底照片换一张购车劵大佬们赏个脸呗(⌒▽⌒)",
      cityobj:null,
      receAddr:null,
      addlist:null,
      pois:null,
      commodityName:null,
      memberWishDetail:null
    },
    actions:{
     /**
     * @param  {} {commit}
     * 获取用户公开信息
     */
    async getUserInfo ({ commit }) {
        const { userInfo } = await getUserInfo({
          withCredenitals: false
        })
        userInfo.avatar = userInfo.avatarUrl
        userInfo.name = userInfo.nickName
        return userInfo
      }
    },
    mutations:{
      setUserInfo(state,e){
        state.userInfo =  e;
        state.userFirst = true;
      }
    }
})