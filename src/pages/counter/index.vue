<template>
  <div class="counter-warp">
    <swiper class='banner'
    :style="{height:imgheights}"
    :indicator-dots="true" :autoplay="autoplay" 
    :interval="interval" 
    :circular="true" indicator-active-color="#fdf9ff" 
    :duration="duration"
    >
      <div v-for="(list,index) in poster" :key="index">
        <swiper-item>
          <img :src="list.imgPath" mode="aspectFit" @load='imageLoad' :style="{width:'100%',height:imgheights}" />
        </swiper-item>
      </div>
    </swiper>
    <div class="xcx_tab_box">
      <div class="xcx_tab_list">
        <div class="xcx_tab_before" :style="{left:isLeft}"></div>
        <div class="xcx_tab_item" @click="xcx_tab(0)" :class="{activeTab:isActive==0 }">
          <p class="tab_title">老带新团</p>
          <p class="tab_tip">仅新用户可参团</p>
        </div>
        <div class="xcx_tab_item" @click="xcx_tab(1)" :class="{activeTab:isActive==1 }">
          <p class="tab_title">全民参与</p>
          <p class="tab_tip">新老用户均可参团</p>
        </div>
         <div class="xcx_tab_item" @click="xcx_tab(2)" :class="{activeTab:isActive==2 }">
          <p class="tab_title">新车订购</p>
          <p class="tab_tip">新老用户均可订购</p>
        </div>
      </div>
      <div class="xcx_tab_cont">
        <div class="tab_cont_list" v-for="list in tabcont" :key="list" @click="go_detail(list)">
          <div class="cont_pic_box">
            <img class="cont_pic" mode="widthFix" :src="list.pic" alt="">
          </div>
          <div class="cont_info">
            <p class="info_name">{{list.title}}</p>
            <p class="info_num"><span 
            class="clor_r">￥{{list.currPriceStr}}</span><span 
            class="clor_c f_20">￥{{list.origPriceStr}}</span><span 
            class="list_type">{{list.peopleNum}}人团</span>
            </p>
            <button class="go_btn xcx_btn" @getuserinfo="onGotUserInfo" open-type="getUserInfo">去开团</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tabcont: null,
      oldBeltNew: null,
      poster: null,
      publicParticipation: null,
      isActive: 1,
      indicatorDots: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
      //所有图片的高度
      imgheights: null,
      isLeft: ""
    };
  },
  computed: {
    count() {
      return "你好";
    }
  },
  methods: {
    login(){
      var data = {
      url: this.$links.groupBuy,
      data: {}
    };
    this.$http(data)
      .then(res => {
        res = res.data.data;
        this.poster = res.poster;
        this.oldBeltNew = res.oldBeltNew;
        this.tabcont = res.publicParticipation;
        this.placeAnOrder = res.placeAnOrder;
        console.log(res.placeAnOrder)
        this.publicParticipation = res.publicParticipation;
      })
      .catch(err => {
        console.log(err);
      });
    },
    imageLoad(e) {
      var res = wx.getSystemInfoSync();
      var imgwidth = e.target.width,
        imgheight = e.target.height,
        ratio = imgwidth / imgheight;
      this.imgheights = res.windowWidth / ratio * 2 + "rpx";
    },
    onGotUserInfo(e) {
      this.$store.commit("setUserInfo", e.target.userInfo);
    },
    xcx_tab(e) {
      this.isLeft = this.left_num*e+"px";
      this.isActive = e;
      if(e==0){
       this.tabcont = this.oldBeltNew;
      }else if(e==1){
       this.tabcont = this.publicParticipation;
      }else{
        this.tabcont = this.placeAnOrder
      }
    },
    go_detail(a) {
      //活动ID
      var url = "../kaituan/main?id=" + a.id;
      wx.navigateTo({
        url: url
      });
    }
  },
  onShow(){
    var w = (wx.getSystemInfoSync().windowWidth-26)/3;
    this.isLeft = w+"px";
    this.left_num = w;
    this.isActive = 1;
    this.login()
  },
  onShareAppMessage: function(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "拼团"
    };
  }
};
</script>
<style>
.counter-warp {
  margin-top: 0;
  background-color: #f4f4f4;
  overflow: hidden;
}
.counter-warp .swiper {
  width: 100%;
}
.banner {
  width: 100%;
  height: 120px;
  display: block;
}
.slide-image {
  width: 100%;
  display: block;
}
.xcx_tab_box {
  margin-top: 10px;
}
.xcx_tab_list {
  display: flex;
  height: 55px;
  margin:0 13px;
  position: relative;

  box-sizing: border-box;
}
.xcx_tab_item {
  flex: 1;
  text-align: center;
  color: #2c2c2c;
  padding: 5px;
  position: relative;
}
.xcx_tab_before {
  position: absolute;
  height: 0;
  width: 33.3%;
  border-bottom: 55px solid #fff;
  border-right: 11px solid transparent;
  border-left: 11px solid transparent;
  box-sizing: border-box;
  transition: all 0.2s;
}
.tab_title {
  font-size: 18px;
  line-height: 30px;
}
.tab_tip {
  font-size: 10px;
}
.activeTab {
  color: #549af9;
}
.xcx_tab_cont {
  width: 100%;
  padding: 15px 22px;
  background-color: #ffffff;
  box-sizing: border-box;
}
.tab_cont_list {
  display: block;
  width: 100%;
  margin-bottom: 15px;
  -webkit-box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.16);
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.16);
  -webkit-border-radius: 6px;
  border-radius: 6px;
  overflow: hidden;
}
.cont_pic_box {
  width: 100%;
  height: 172px;
  overflow: hidden;
  margin: 0;
}
.cont_pic {
  width: 100%;
}
.cont_info {
  position: relative;
  padding: 23px 17px 19px;
  font-size: 17px;
  color: #000000;
}

.list_type {
  background-color: #cc4444;
  line-height: 15px;
  color: #f4f4f4;
  font-size: 12px;
  padding: 0 4px;
}
.info_name {
  line-height: 17px;
  margin-bottom: 19px;
}
.info_num span {
  display: inline-block;
}
.info_num {
  height: 17px;
  line-height: 17px;
}
.go_btn {
  position: absolute;
  right: 12px;
  bottom: 10px;
}
</style>
