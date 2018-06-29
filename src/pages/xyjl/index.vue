<template>
<div class="xyjl">
  <div class="container" v-if="dataList">
    <div class="head">
      <div class="head-t">
        <image class="head-logo" :src="dataList.avatar" mode="aspectFill"></image>
        <div class="div-p">
          <p>用成长金币帮我实现心愿~</p>
          <p>集满1.5可实现TA的心愿</p>
        </div>
      </div>
      <div class="wishText">
        <p>{{dataList.description}}</p>
        <text class="iconfont icon-sanjiao2"></text>
        <div class="wishImg" @click="previewImage">
          <image :src="dataList.pic" mode="aspectFill"></image>
          <span>好友助力后可见</span>
        </div>
      </div>
      <div class="rule-link" @click="toRule">活动规则</div>
    </div>
    <div class="process">
      <div class="process-t">
        <div class="good">
          <image :src="dataList.commodityPic" mode="widthFix"></image>
          <p>{{dataList.commodityName}}</p>
        </div>
        <div class="time-cess">
          <p class="time-s">剩余时间 {{surplusTimeMillis}}</p>
           <p class="tips-s">
             <span v-if="state==4">金币已返还至好友账户</span>
             <span v-if="state==3">正在返还好友金币中</span>
           </p>
          <div class="processDiv">
            <p class="processBar"><span :style="{width:dataList.offset*100 +'%'}"></span></p>
            <span class="processNum">{{dataList.helpNumCount}}/{{dataList.carCurrency}}金币</span>
          </div>
        </div>
      </div>
      <div class="share">
        <!-- 1:进行中 2:已完成 3:退款中 4:已退款 5:已过期 -->
        <button type="default" v-if="isSelf&&state==1"  @click="share" size="default">继续分享</button>
        <button type="default" v-if="!isSelf&&state==1" @click="Helpfun" size="default">为TA助力</button>
        <button type="default" v-if="isSelf&&state==5" @click="Helpfun" size="default">重新发起</button>
        <p class="tolink f_30" v-if="!isSelf" @click="tolink">我也要免费拿</p>
      </div>
    </div>
    <div class="share-cont">
      <p class="share-none" v-if="!helps">暂无助力{{state}}</p>
      <div class="helps" v-if="helps">
      <div class="share-top">
        <span class="sw-title">助力小天使</span>
        <!-- <span v-if="" class="sw-btn">公开好友信息<switch type="switch" color="#6fb8fe" checked="true"/></span> -->
      </div>
      <div class="share-list">
        <div class="share-li" v-for="(list,index) in helps" :key="index">
          <image :src="list.avatar" mode="widthFix"></image>
          <div>
            <p class="p1">{{list.memberName}}</p>
            <p class="p2">{{list.createTimeStr}}</p>
          </div>
          <span class="shareB">{{list.carCurrency}}金币</span>
          <div class="comment-send">
             <textarea v-if="!list.description&&list.isSelf" @confirm="com_confirm"  @focus="com_focus(list,index)" class="com_textarea"  maxlength='39'></textarea>
            <span class="comment-tip f_28" v-if="!t_show&&!list.description&&list.isSelf">留言</span>
            <span class="comment-cont" v-if="list.description">{{list.description}}</span>
            </div>
        </div>
      </div>
      </div>
    </div>
  </div>
  <card :share_show="share_show" @share_pyq="share_pyq" @share="dialog_show"></card>
 </div> 
</template>

<script>
import wx from "../../utils/wx";
import card from "../../components/card.vue"
export default {
  data() {
    return {
      shareId: null,
      dataList: null,
      share_show:false,
      intervals:null,
      isSelf:null,
      t_show:false,
      helps:null,
      activityId:null,
      state:null,
      active:null,
      description:null,
      surplusTimeMillis:""
    };
  },
  computed:{
    userToken(){
      return this.$store.state.userToken;
    }
  },
  components:{
    card
  },
  methods:{
    toRule(){
      wx.hrefTo("../explain/main")
    },
    init(){
      var data = {
        url:wx.link.memberWishDetail, 
        data: {
          userToken: this.userToken,
          memberWishCommodityId: this.shareId
        },
        method: "POST"
      } 
      wx.request(data).then(res=>{
        res = res.data;
        if(res.code==0){
          var memberWishCommodity = res.data.memberWishCommodity;
          var Millis  = memberWishCommodity.surplusTimeMillis;
          var self = this;
          this.$store.state.miniPic = res.data.pic;
          this.state = memberWishCommodity.state;
          this.intervals = setInterval(()=>{
          self.surplusTimeMillis = self.formatDuring(Millis);
          Millis=Millis-1000;
          },1000)
          this.dataList = memberWishCommodity;
          this.isSelf = memberWishCommodity.isSelf;
          this.isParticipate = memberWishCommodity.isParticipate;
          if(memberWishCommodity.helps.length==0){
            this.helps = null;
          }else{
            this.helps = memberWishCommodity.helps;
          }
        }
      });
    },
    com_focus(l,index){
      console.log(l.id)
      this.activityId = l.id
      this.active = index;
      this.t_show=true
    },
    com_confirm(e){
      var description = e.target.value;
      if(description.length>0){
        var data = {
        url:wx.link.submitHelpDesc,
        method:"POST",
        data:{
        id: this.activityId,
        userToken: this.userToken,
        description: description
        }}
        wx.request(data).then(res=>{
         res =  res.data;
         if(res.code==0){
           this.$set(this.helps[this.active],"description",description)
         }
        })
      }
       

    },
    comment(){
      this.t_show = true
    },
    dialog_show(){
      this.share_show = this.share_show?false:true;
    },
     share(){
       this.share_show = true;
     },
      share_pyq(){
      this.dialog_show();
      wx.hrefTo('../qrcode/main?id='+this.share_id)
    },
     formatDuring(mss) {
      if(mss==0){
        clearInterval(this.intervals)
        return "已结束"
      }else{
      var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((mss % (1000 * 60)) / 1000);
      return  hours + "小时" + minutes + "分" + seconds +"秒"
      } 
    },
    tolink(){
      wx.switchTab("../index/main")
    },
    previewImage(){
      if(this.isSelf||this.isParticipate){
        wx.previewImage(this.dataList.pic)
      }
    },
    Helpfun(){
       this.$store.state.memberWishDetail = {
         id:this.dataList.id,//助力ID
         maxHelpNum:this.dataList.maxHelpNum,//助力最大值
         commodityName:this.dataList.commodityName,//商品名
         carCurrency:this.dataList.carCurrency,//商品总金币
         commodityPic:this.dataList.commodityPic,
         startHelpNum:this.dataList.startHelpNum,//最少助力金币
         userCarCurrency:this.dataList.userCarCurrency,//用户所拥有金币
         conversionRules:this.dataList.conversionRules,//1点助力值等于多少元钱(单位:元)
         helpNumCount:this.dataList.helpNumCount//当前获得助力值
       }
      wx.hrefTo("../wtzl/main")
 }
  },
  onShareAppMessage: function (res) {
    var shareLink=  '/pages/xyjl/main?id='+this.shareId;
    var shareTitle = "想要"+this.dataList.commodityName+",帮帮我呗~"
    return {
      title: shareTitle,
      path: shareLink
    }
  },
  onUnload() {
    //清除倒计时
        clearInterval(this.intervals);
  },
  onShow(){
      this.shareId = this.$root.$mp.query.id;
      if(this.userToken){
        this.init()
      }else{
        this.$store.state.loginState = false; 
        this.$login(this.init)
      }
      
  }
};
</script>

<style scoped>
.xyjl{
  position: relative;
  overflow:hidden;
}
.container {
  background-color: #6fb8fe;
}
.head {
  position: relative;
  width: 100%;
  background-color: #6fb8fe;
  color: #fff;
}
.head-t {
  overflow: hidden;
  padding-top: 32px;
  margin-bottom: 14px;
  font-size: 20px;
}
.head-logo {
  width: 64px;
  height: 64px;
  margin-left: 8px;
  margin-right: 20px;
  border-radius: 50%;
  background-color: black;
  float: left;
}
.div-p p {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.div-p p:first-child {
  font-size: 12.5px;
  margin: 6px 0;
}
.wishText {
  box-sizing: border-box;
  height: 94px;
  position: relative;
  background-color: #fff3dc;
  padding: 25px 12px;
  border-radius: 8px;
  font-size: 15px;
  color: #be800f;
  line-height: 21px;
}
.wishText p {
  width: 200px;
  font-weight: bold;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.wishText .iconfont {
  position: absolute;
  top: -9px;
  left: 26px;
  width: 14px;
  height: 9px;
  line-height: 9px;
  color: #fff3dc;
  font-size: 18px;
}
.wishImg {
  box-sizing: border-box;
  position: absolute;
  right: 0;
  top: -5px;
  background-color: #fff;
  width: 120px;
  height: 92px;
  padding: 4px;
  transform: rotate(-10deg);
}
.wishImg image {
  width: 100%;
  height: 100%;
  filter: blur(15px);
}
.wishImg span {
  width: 100%;
  color: #fff;
  font-size: 14px;
  text-align: center;
  position: absolute;
  bottom: 20px;
  left: 0;
}
.rule-link {
  width: 24px;
  height: 24px;
  padding: 6px;
  line-height: 12px;
  box-shadow: 0 0 10px #999;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  right: 0;
  top: 24px;
  font-size: 10px;
  color: #fff;
}

.process {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 12px 0;
  background-color: #fff9ed;
}
.process-t {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}
.process-t .good image {
  display: block;
  margin: 0 auto 15px;
  width: 65px;
  height: 80px;
  padding-top: 28px;
}
.process-t .good p {
  text-align: center;
  font-size: 15px;
  color: #333334;
  font-weight: bold;
  letter-spacing: 1px;
}
.process-t .time-cess {
  width: 93%;
  margin: 19px auto 0;
}
.process-t .time-cess .time-s {
  font-size: 12.5px;
  color: #faa200;
  text-indent: 4px;
}
.process-t .time-cess .tips-s{
  font-size: 12.5px;
  color: #549af9;
  text-indent: 4px;
}
.processDiv {
  overflow: hidden;
  padding: 16px 0;
  line-height: 30px;
}
.processDiv .processBar {
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 28px;
  border-radius: 25px;
  border: solid 1px #e8e8e8;
  background-color: #f7f7f7;
  float: left;
}
.processDiv .processBar span {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 50%;
  border-radius: 25px;
  background-color: #19d100;
}
.processDiv .processNum {
  font-size: 22.5px;
  font-weight: bold;
  color: #333334;
  float: right;
}
.process .share {
  padding: 20px 0;
}
.process .share button {
  width: 91%;
  height: 46px;
  border-radius: 50px;
  letter-spacing: 1px;
  background-color: #6fb8fe;
  margin: 0 auto;
  color: #fff;
  font-weight: bold;
}

.share-cont {
  box-sizing: border-box;
  width: 100%;
  padding: 21px 15px;
  font-size: 15px;
  color: #969696;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 15px;
}
.share-none {
  text-align: center;
}
.share-top .sw-title {
  font-size: 20px;
  color: #8b8b8b;
}
.share-top .sw-btn {
  float: right;
  font-size: 15px;
  color: #8d8d8d;
}
.share-li {
  width: 100%;
  overflow: hidden;
  margin-top: 14px;
}
.share-li image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 15px;
  float: left;
}
.share-li div {
  float: left;
  width: 165px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.share-li .p1 {
  font-size: 15px;
  color: #303031;
}
.share-li .p2 {
  font-size: 10px;
  color: #8b8b8b;
}
.share-li .shareB {
  float: right;
  font-size: 20px;
  color: #8d8d8d;
}
.share-li .comment-send{
  display: block;
  width: 100%;
  padding-left: 45px;
  margin-top: 5px;
  background-color: #fbfaf8;
  position:relative;
  height: 44px;
}
.comment-send .comment-cont{
  text-align: center
}
.comment-tip{
  position: absolute;
  top: 50%;
  left: 50%;
  color: #6fb8fe;
  transform: translate(-50%,-50%)
}
.tolink{
  margin-top: 15px;
  text-align: center;
  color: #eeaf12;
}
.com_textarea{
  display: block;
  width: 100%;
  height: 100%;
}
</style>
