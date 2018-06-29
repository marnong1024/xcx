<template>
  <div class="container">
    <p class="titles">当前拥有金币</p>
    <p class="num-p"><span>1000</span></p>
    <div class="div-img">
      <image class="logo" src="../../static/img/logo.png" mode="aspectFill"></image>
      <div @click="tqlp">
        <p >提取</p>
        <p>礼品</p>
      </div>
    </div>
    <p class="process">
      <swiper :autoplay="true" :interval="2500" :duration="1000" :circular="true" :vertical="true">
        <div class="commodity" v-for="list in cont" :key="list">
        <swiper-item>
        <p class="commodityName"><span>{{list.createTimeStr}}</span>发起<span>{{list.commodityName}}的心愿</span></p>
        </swiper-item>
        </div>
      </swiper>
      </p>
  </div>
</template>
<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      motto: "Hello World",
      cont: null
    };
  },
  computed:{
    userToken(){
      return this.$store.state.userToken
    }
  },
  methods: {
    tqlp(){
      wx.hrefTo("../tqlp/main")
    }
  },
  onShow(){
     var data = {
        url:wx.link.myWishList, 
        data: {
          userToken: this.userToken,
          pageNo:1,
          pageSize:5
        },
        method: "POST"
      };
      wx.request(data).then(res=>{
        res =res.data;
        if(res.code==0){
          this.cont = res.pageData;
        }
      })

  }
};
</script>

<style scoped>
.container {
  background-color: #72bbff;
  color: #fff;
  text-align: center;
}
.titles {
  font-size: 18px;
  color: #fff;
  padding-top: 54px;
  margin-bottom: 6px;
}
.num-p span {
  font-size: 45px;
}
.div-img {
  position: relative;
  margin: 65px 0;
}
.div-img div {
  position: absolute;
  right: -23px;
  bottom: -46px;
  box-sizing: border-box;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  padding: 15px 0;
  background-color: #f4952e;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 0 10px #999;
}
.div-img .num2 {
  font-size: 23px;
}
.logo {
  width: 215px;
  height: 215px;
}
.process {
  width: 258.5px;
  height: 39px;
  line-height: 39px;
  text-align: center;
  border: solid 2px #c7e4ff;
  color: #fff;
  overflow: hidden;
  border-radius: 5px;
  margin: 0 auto 80px;
}
.commodityName{
  font-size: 13px;
}
</style>
