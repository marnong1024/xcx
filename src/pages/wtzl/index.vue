<template>
  <div class="wtzl">
    <div class="wt_header">
      <p class="f_38">用成长金币为TA助力</p>
      <p class="f_30">最多{{cont.maxHelpNum}}金币</p>
    </div>
    <div class="wt_info">
      <div class="wt_pic">
        <img mode="widthFix" :src="cont.commodityPic" alt="">
      </div>
      <div class="wt_item">
        <p class="f_32">助力进度</p>
        <p class="f_28">{{cont.helpNumCount}}/{{cont.carCurrency}}金币</p>
      </div>
      <div class="wt_tool">
        <div>
          <span @click="minusNun" class="icon icon-minus"></span>
        </div>
        <div class="wt_num f_28">{{subNum}}</div>
        <div>
          <span @click="addNum" class="icon icon-plus"></span>
        </div>
      </div>
    </div>
    <div class="model_sub">
      <div class="model_cont">
        <div class="model_check">
          <checkbox-group @change="checkboxChange">
            <label class="checkbox">
              <checkbox :checked="checked" :disabled="cont.haveHelpNum==0" />
            </label>
          </checkbox-group>
        </div>
        <div class="model_info">
          <p class="f_30">使用我的金币抵扣</p>
          <p class="f_28 clor_f">我的库存:{{cont.userCarCurrency}}金币</p>
        </div>
        <span v-if="payment>0" class="model_tips f_30 clor_r">另需支付{{payment}}元购买{{Paygold}}金币</span>
      </div>
    </div>
    <div class="bot_bar">
        <div class="xcx_bar clor_r">
         <p class="f_38" v-if="payment>0">￥{{payment}}</p>
         <p class="f_38" v-if="payment==0">{{subNum}}金币</p>
         <button @click="submit" class="xcx_bar_btn xcx_btn">确认赠送</button>
        </div>
    </div>
  </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
    data() {
        return {
            cont:null,
            subNum:null,
            checked:false,
            payment:null
        };
    },
    computed:{
       memberWishDetail(){
         return this.$store.state.memberWishDetail
       },
       Paygold(){
         return this.payment/this.cont.conversionRules
       },
       userToken(){
         return this.$store.state.userToken
       }
    },

    methods: {
      submit(){
         var data = {
        url:wx.link.wishHelp, 
        data: {
          userToken: this.userToken,
          memberWishCommodityId: this.cont.id,
          carCurrency:this.subNum,
          isUseSelfHelpNum:this.checked,
          description:""//目前没有留言功能
        },
        method: "POST"
      } 
      wx.request(data).then(res=>{
        res = res.data;
        if(res.code==0){
          var data = {
             timeStamp:res.data.timeStamp,
             nonceStr:res.data.nonceStr,
             package:res.data.package,
             signType:res.data.signType,
             paySign:res.data.paySign,
        }
        var CallObj =  {
          url:"",
          data:{
            userToken: this.userToken,
            id:res.data.wishHelpId
          },
          method: "POST"
        }
         if(res.data.isPay){
        wx.requestPayment(data).then(res=>{
            wx.Toast("支付成功")
            CallObj.url = wx.link.confirmPay;
            wx.request(CallObj).then(CallRes=>{
            })
            wx.navigateBack(1)
        }).catch(err=>{
            wx.Toast("取消支付")
            CallObj.url = wx.link.cancelPay;
            wx.request(CallObj).then(CallRes=>{})
           })
           }else{
             wx.Toast("支付成功")
             setTimeout(()=>{
             wx.navigateBack(1)
             },1500)
           }
        }else{
          wx.Toast(res.desc)
        }
        
        console.log(res.data)
      })
      },
      addNum(){
        var maxHelpNum = this.cont.maxHelpNum,
            subNum = this.subNum;//需支付的金币
        if(subNum<maxHelpNum){
          this.subNum += 100;
          this.PayChange();
        }
      },
      PayChange(){
        var subNum = this.subNum,
        userC = this.cont.userCarCurrency,
        Rules = this.cont.conversionRules;//兑换率
        if(this.checked){
        if(userC>subNum){
          this.payment = 0 
        }else{
          this.payment = (subNum - userC)*Rules;
        }
        }else{
          this.payment = subNum*Rules
        }
      },
      minusNun(){
        var startHelpNum = this.cont.startHelpNum,
            subNum = this.subNum;
         if(subNum>startHelpNum){
           this.subNum -= 100;
           this.PayChange();
         }
      },
      checkboxChange(e){
        this.checked =this.checked?false:true;
          this.PayChange()
      }
    },
    onShow() {
      this.cont = this.$store.state.memberWishDetail;
      this.subNum = this.cont.startHelpNum;
      this.payment = this.subNum*this.cont.conversionRules;
      this.Paygold = this.subNum;
      //需求金币值减去以获取
      var maxHelpNum = this.cont.carCurrency - this.cont.helpNumCount;
      if(maxHelpNum<this.cont.maxHelpNum){
       this.cont.maxHelpNum = maxHelpNum;
      }
    }
};
</script>

<style scoped>
.wt_header {
    padding: 30px 20px 0;
    letter-spacing: 2px;
}
.wt_header p {
    margin: 5px 0;
}
.wt_info {
    display: flex;
    margin: 25px 13px 0;
    box-sizing: border-box;
    padding: 20px 15px;
    box-shadow: 0 0 10px #bed3e7;
}
.wt_item {
    flex: 29;
    padding-left: 10px;
    padding-top: 10px;
}
.wt_pic {
    flex: 13;
}
.wt_pic ._img {
    display: block;
    width: 100%;
}
.wt_tool {
    flex: 21;
    padding-top: 15px;
}
.wt_tool ._div {
    display: inline-block;
    width: 33.3%;
    text-align: center;
}
.icon-minus,
.icon-plus {
    font-size: 28px;
    color: #f5a100;
}
.wt_num {
    vertical-align: top;
    margin-top: 5px;
}
.model_sub {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}
.model_cont {
    width: 100%;
    height: 137px;
    position: relative;
    box-sizing: border-box;
    padding: 20px 62px;
    background-color: #fcfcfc;
    -webkit-box-shadow: 0 0 4rpx #ccc;
    -moz-box-shadow: 0 0 4rpx #ccc;
    box-shadow: 0 0 4rpx #ccc;
}
.model_info ._p{
  margin-bottom:5px 
}
.model_check{
  position: absolute;
   top: 19px;
  left: 28px;
}
.model_tips{
  position: absolute;
  bottom: 22.5px
}
</style>
