<template>
<div class="zfcg">
   <div class="share_btn">
    <button class="share" @click="share_show=true">邀请好友</button>
    <button class="ptxq" @click="goDetail">拼团详情</button>
   </div>
   <card :share_show="share_show" @share="share"></card>
</div>
</template>
<script>
import wx from "../../utils/wx";
import card from "../../components/card.vue";
export default {
  data() {
    return {
      share_show:false,
      share_link:null,
    };
  },
  methods:{
   goDetail(){
     wx.hrefTo(this.share_link)
   },
   share(){
     this.share_show = this.share_show?false:true;
   }
  },
   components:{
    card
  },
  async onLoad() {
   var str = this.$root.$mp.query.applyId;
   this.share_link  =  '/pages/ddxq/main?groupBuyApplyId='+str;
  },
  onShareAppMessage(){
    var commodityName = this.$store.state.commodityName
    return {
      title: commodityName+' 一起拼团吧~',
      path: this.share_link
    }
  }
};
</script>
<style>
.zfcg {
  width: 100%;
  height: 100%;
  background-image: url("https://www.e-carhome.com/qiche/car_h5/xcx/img/bg_zfcg.jpg");
  background-size: 100%;
  position: relative;
  overflow: hidden;
}
page {
  height: 100%;
}
.share_model{
  position: absolute;
   top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
}
.share_btn{
  width: 265px;
  margin: 359px auto 0;

}
.share_btn button{
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  box-sizing: border-box;
}
.share{
  background-color: #549af9;
  color: #fff;
}
.ptxq{
  background-color: #fff;
  margin-top: 20px;
}

</style>
