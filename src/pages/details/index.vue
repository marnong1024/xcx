<template>
  <div class="detail_model" v-if="order">
    <div class="head_bc">
      <div class="banner_tips f_34">{{order.peopleNum}}人团</div>
      <div class="detail_box">
        <div class="detail_pic">
          <image class="_pic" :src="order.pic"></image>
        </div>
        <div class="detail_info">
          <div class="commodity_title">
            <div>
              <p class="cell f_w">{{order.title}}</p>
            </div>
          </div>
          <div class="commodity_desc">
            <p class="p_cell">{{order.info}}</p>
            <p class="commodity_num f_w">
              <span class="clor_r f_42">￥{{order.currPriceStr}}</span>
              <span class="clor_r f_20">拼团价</span>
              <span class="clor_c f_28">￥{{order.origPriceStr}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="details wrap">
      <div class="list">
        <div class="list_title f_34 f_w">订单详情{{SyncType}}</div>
        <div class="commodity_desc">
          <p class="c_text">{{order.title}}</p>
          <span class="numb">￥{{order.currPriceStr}}</span>
        </div>
      </div>
      <div class="bingMobile" v-if="SyncType==1">
        <span class="clor_r f_24">*首次团购需要输入您的联系方式</span>
          <div class="xcx_from">
          <div class="xcx_from_cell">
              <div class="inp_box">
                  <input class="inp_ f_28" @input="bindKeyInput"  type="number" placeholder="请输入手机号码" />
              </div>
              <div class="xcx_btn_box">
                  <button class="xcx_btn f_28" size="default" :disabled="disab" @click="getSms" type="primary">{{smsTime}}</button>
              </div>
          </div>
          <div class="xcx_from_cell">
              <div class="inp_box">
              <input class="inp_ f_28" @input="bindKeySms"  type="number" placeholder="请输入验证码" />
              </div>
              <div class="xcx_btn_box">
              </div>
              </div>
          </div>
      </div>
    </div>
    <div class="back" @click="back">
      <image src="https://www.e-carhome.com/qiche/car_h5/xcx/img/back_pic.png"></image>
      <p class="f_24 f_w">返回</p>
      </div>
    <div class="xcx_fixed">
      <button size="default" @click="payment" type="primary">微信支付
        <span>￥{{order.currPriceStr}}</span>
      </button>
    </div>
  </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      phone: null,
      sms:null,
      applyId:null,
      smsTime:"获取短信",
      disab:false,
      state:false,//待支付状态
      spellId:null,
      id:null
    };
  },
  computed: {
    userToken(){
      return this.$store.state.userToken
    },
    order() {
      return this.$store.state.order;
    },
    SyncType(){
      return this.$store.state.SyncType
    },
    orderObj(){
      return {
              userToken: this.userToken,
              mobile: this.phone,
              smsCode:this.sms,
              name:this.userInfo.nickName,
              avatar:this.userInfo.avatarUrl,
              sex:this.userInfo.gender,
      } 
    },
    userInfo(){
        return this.$store.state.userInfo
      }
  },
  methods: {
    back(){
      wx.switchTab("../counter/main")
    },
    bindKeyInput(e) {
      this.phone = e.target.value;
    },
    Countdown() {
            var self = this;
            let interval = setInterval(function() {
                if (self.smsTime-- == 0) {
                    self.smsTime = "重新获取验证码";
                    self.disab = false;
                    clearInterval(interval);
                }
            }, 1000);
        },
    bindKeySms(e){
      this.sms = e.target.value;
    },
    payment(){
      var payobj = {
          userToken:this.userToken
        };
       var obj = {
       url:wx.link.orderSubm,
        method:"POST",
        data:{}
        };
      if(this.state){
        //支付待支付订单
        payobj.id = this.order.id;
           var data  ={
             url:wx.link.payByWait,
             method:"POST",
             data:payobj
           }
           this.request(data)
      }else{
        var spellId = this.spellId;
        var groupBuyActivityId = this.id;
        if(spellId){
         //拼团id
         console.log("拼团")
         payobj.spellId = spellId;
        }else if(this.SyncType==1&&!this.sms){
         wx.Toast("请输入验证码");
         return
       }else if(groupBuyActivityId){
          //开团id
          console.log("开团")
         payobj.groupBuyActivityId = groupBuyActivityId;
        }
        if(this.SyncType==3){
        obj.data = payobj;
        this.request(obj)
      }else{
          payobj.mobile =  this.phone;
          payobj.smsCode = this.sms;
        if(this.SyncType==1){
          payobj.name = this.userInfo.nickName;
          payobj.avatar = this.userInfo.avatarUrl;
          payobj.sex = this.userInfo.gender;
        };
        obj.data = payobj;
        this.request(obj)
      }
      }
     
    },
    rPayment(data){
         wx.requestPayment(data).then(res=>{
           wx.Toast("支付成功");
           this.$store.state.SyncType = 3;
             var data = {
             url:wx.link.confirmPay,
             method:"POST",
             data:{
               userToken:this.userToken,
               id:this.orderId
             }
           };
           wx.request(data).then(res=>{
             var url = "../zfcg/main?applyId="+this.applyId;
             this.$store.state.commodityName = res.data.data;
              wx.redirectTo(url)
           })
           }).catch(err=>{
            wx.Toast("取消支付")
           })
    },
    request(obj){
       this.$http(obj).then(res => {
            res = res.data;
          if(res.code==0){
            var data = {
             timeStamp:res.data.timeStamp,
             nonceStr:res.data.nonceStr,
             package:res.data.package,
             signType:res.data.signType,
             paySign:res.data.paySign,
            };
             this.applyId = res.data.applyId;
             this.orderId = res.data.orderId;
            this.rPayment(data);
          }else{
          wx.Toast(res.desc);
          }
        }).catch(err => {
          console.log(err);
        });
    },
    getToken() {
      //获取token
      if(!this.userInfo&&this.SyncType!==3){
       wx.getUserInfo().then(info=>{
            this.$store.state.userInfo = info;
           }).catch(err=>{
            wx.alert({
              title: '用户未授权',
              content: '如需正常使用，请前往授权',
              confirmText:'去授权',
              success: function(res) {
                 wx.openSetting()
              }
            })
           })
      }
    },
    getSms() {
      var phone = this.phone;
      var numb = /^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/;
      if (!phone) {
        wx.Toast("请输入手机号码");
      } else if (!numb.test(phone)){
        wx.Toast("手机号码不正确");
      } else {
        this.disab = true;
        var Object = {
          url :wx.link.verifyCode,
          method:"POST",
          data:{ 
            type:100005,
            mobile:phone
          }
        }
      this.$http(Object).then(res=>{ 
        var res = res.data;
        if(res.code==0){
        this.smsTime = res.data;
        this.Countdown();
        wx.Toast("短信发送成功");
        }
      }).catch(err=>{
        wx.Toast(err);
        this.disab = false;
      })
      }
    }
  },
  async onLoad() {
    this.state =  this.$root.$mp.query.state;
    this.spellId =this.$root.$mp.query.spellId;
    //活动id支付，开团。
    this.id = this.$root.$mp.query.id
    this.getToken()
  }
};
</script>

<style scoped>
@import '../../../static/css/dd_detail.css';
</style>
