<template>
  <div class="user-menu">
    <div class="xcx_head" v-show = "false">
      <p class="f_30">解锁咖啡库更多玩法，快来关注快起步微信公众号吧</p>
      <div class="rigth">
        <span class="icon icon-right clor_y"></span>
      </div>
    </div>
    <div class="user-pic" v-if="userInfo.nickName">
      <div class="pic-list" >
        <image class="xcx_pic" :src="userInfo.avatarUrl">
        </image>
      </div>
      <p class="user-name f_34">{{userInfo.nickName}}</p>
    </div>
    <div class="login_model" v-if="!userInfo.nickName">
      <button class="go_btn xcx_btn" @getuserinfo="onGotUserInfo"
       open-type="getUserInfo">点击授权登录</button>
    </div>
    <div class="xcx_menu">
      <div class="menu_list" @click="menuTo('xylist')">
         <p class="menu_cell">心愿记录</p>
         <div class="menu_right"><span class="icon icon-right clor_y"></span></div>
      </div>
      <div class="menu_list" @click="menuTo('purchase')">
         <p class="menu_cell">拼团订单</p>
         <div class="menu_right"><span class="icon icon-right clor_y"></span></div>
      </div>
      <div class="menu_list" @click="menuTo('psdd')">
         <p class="menu_cell">配送订单</p>
         <div class="menu_right"><span class="icon icon-right clor_y"></span></div>
      </div>
    </div>
    <div class="xcx_menu">
      <div class="menu_list"  @click="setting">
         <p class="menu_cell">系统设置</p>
         <div class="menu_right"><span class="icon icon-right clor_y"></span></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{}
  },
   computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods:{
    menuTo(a){
      wx.navigateTo({
                url:"../"+a+"/main"
            });
    },
    setting(){
      wx.openSetting()
    },
    onGotUserInfo(e) {
      this.$store.commit("setUserInfo", e.target.userInfo);
    }
  },
  mounted(){
      wx.getUserInfo({
     success: (res) => {
       console.log(res)
             this.$store.state.userInfo =  res.userInfo
            }
   })
  }
};
</script>

<style scoped>
body{
  height: 100%;
}
.user-menu{
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
}
.login_model,.user-pic {
    width: 100%;
    height: 158px;
    padding-top: 17px;
    background-color: #fff;
}
.pic-list,.go_btn {
    width: 92px;
    height: 92px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
}
.login_model, .go_btn{
   padding-top: 17px;
   line-height: 25px; 
}
.xcx_pic {
    width: 100%;
    height: 100%;
}
.user-name{
  text-align: center;
  margin-top: 15px;
  color: #000;
}

</style>
