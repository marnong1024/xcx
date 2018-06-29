<template>
  <div class="detail_model" v-if="details">
    <div class="head_bc">
      <div class="banner_tips f_34">{{details.peopleNum}}人团</div>
      <div class="detail_box">       
        <div class="detail_pic">
          <image class="_pic" :src="details.repPic"></image> 
        </div>
        <div class="detail_info">
          <p class="detail_title f_34">{{details.title}}</p>
          <div class="commodity_desc">
            <p class="p_cell">{{details.info}}</p>
            <p class="commodity_num f_w">
              <span class="clor_r f_42">￥{{details.currPriceStr}}</span>
              <span class="clor_r f_20">拼团价</span>
              <span class="clor_c f_28">￥{{details.origPriceStr}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="details wrap">
      <div class="pt_list">
        <div class="list_title f_40 f_w">
          <p><span class="c_yl m_r_20" >{{stateInfo.info}}</span><span>{{stateInfo.info2}}</span></p>
          </div>
        <div class="pt_list">
          <p  v-if="spellState!==-5&&surplus!==0" class="c_text f_30">还差<span class="clor_r">{{surplus}}
            </span>人参团<span v-if="surplusTimeMillis" class="clor_r f_24">{{surplusTimeMillis}}</span></p>
        </div>
        <div class="pt_arr">
          <div class="pt_arr_list" v-for="list in pt_arr" :key="list">
            <div class="pt_arr_item">
            <image v-if="list.pic" class="pt_list_pic" :src="list.pic"></image>
            </div>
            <p class="pt_list_name f_20">{{list.name}}</p>
          </div>
          <span class="pt_arr_abs f_20">团长</span>
        </div>
        <div class="tips">
          <span class="pt_title f_30 f_w">拼团流程</span>
          <div class="tip_list">
            <p class="tip_cell f_28" :class="{state_index:spellState==0}" ><span class="pt_num">1</span ><span class="tops">发起拼团或者参加好友的拼团。</span></p>
            <p  :class="{state_index:spellState==2}" class="tip_cell f_28"><span class="pt_num">2</span>
            <span class="tops">在活动时间内邀请好友一起拼团。</span></p>
            <p :class="{state_index:spellState==3}" class="tip_cell f_28"><span class="pt_num">3</span>
            <span class="tops">若拼团成功，参团商品将存入团长的商品库中，可在任意时间下单配送。</span>
             </p>
            <p :class="{state_index:spellState==4}" class="tip_cell f_28"><span class="pt_num">4</span><span class="tops">若活动结束，拼团未成功时，预付款将原路返回。</span></p>
          </div>
        </div>
        <div class="pic_box">
          <image class="pic_item" mode="widthFix" v-for="list in details.pics" :key="list" :src="list"></image>
        </div>
      </div>
    </div>
    <div class="xcx_fixed" v-if="spellState==1||spellState==-4">
      <div class="user_state" >
        <div class="user_close">
          <button @click="onCancel">取消支付</button>
        </div>
        <div class="user_qr">
          <button @click="onPayment">去支付</button>
        </div>
      </div>
    </div>
     <div class="xcx_fixed" v-if="spellState==0">
      <button size="default" @getuserinfo="onGotUserInfo" open-type="getUserInfo" @click="onPayment(1)" type="primary">
        <span>参与拼团</span>
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
      surplus: null,
      details: null,
      orderId: null,
      groupBuyApplyId:null,
      pt_arr: null,
      spellState: null,
      stateInfo: {
        info: "",
        info2: ""
      },
      spellId:null,
      id: null,
      userState: null,
      surplusTimeMillis: null,
      timer: {}
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    userToken() {
      return this.$store.state.userToken;
    }
  },
  methods: {
  init(){
    //待支付订单
    this.userState = this.$root.$mp.query.state || null;
    this.orderId = this.$root.$mp.query.orderId || null;
    //订单详情
    this.groupBuyApplyId = this.$root.$mp.query.groupBuyApplyId||null
        var data = {
          url: wx.link.spellDetail,
          method: "POST",
          data: {
            id: this.groupBuyApplyId,
            userToken: this.userToken
          }
        };
        this.$http(data)
          .then(res => {
            res = res.data;
            if (res.code == 0) {
              var details = res.data;
              var self = this;
              var pt_arr = [];
              this.spellId = details.spellId;
              for (let i = 0; i < details.peopleNum; i++) {
                if (details.applyMemberList[i]) {
                  pt_arr.push({ pic: details.applyMemberList[i].avatar,name: details.applyMemberList[i].name});
                } else {
                  pt_arr.push({ pic: null });
                }
              }
              var millis = details.surplusTimeMillis;
              this.timer = setInterval(() => {
                self.surplusTimeMillis = self.formatDuring(millis);
                millis = millis - 1000;
              }, 1000);
              this.spellState = details.spellState;
              this.stateInfo = this.stateFun(details.spellState) 
              this.details = details;
              this.pt_arr = pt_arr;
              this.surplus = details.peopleNum - details.applyMemberList.length;
            }
          })
          .catch(err => {
            wx.Toast("数据请求失败");
          });
      
  },
  stateFun(i) {
    // -1:已退款
    //  -2:退款中
    //   -3:团购活动结束并完成,且当前登录用户成功参与其中
    //    0:活动进行中但是该登录用户还未参加该活动
    //     1:未开始(团长支付未成功或后台等待支付通知)
    //      2:进行中(该登录用户已参加)
    //       3:结束并完成
    //        4:结束未完成
    var stateInfo =  {
        info: "",
        info2: ""
      };
    switch (i) {
      case -1:
      stateInfo.info = "已退款";
      stateInfo.info2 = "拼团失败"
        break;
      case -2:
      stateInfo.info = "退款中";
      stateInfo.info2 = "拼团失败"
        break;
        case -3:
      stateInfo.info = "拼团成功";
      stateInfo.info2 = "分享给更多好友组团"
        break;
        case -5:
      stateInfo.info = "未开始";
      stateInfo.info2 = "已取消支付"
        break;
        case 0:
      stateInfo.info = "拼团中";
        break;
        case 1:
      stateInfo.info = "未开始";
      stateInfo.info2 = "待支付";
        break;
         case 2:
      stateInfo.info = "已参团";
      stateInfo.info2 = "分享给更多好友组团"
        break;
        case 3:
      stateInfo.info = "已结束";
      stateInfo.info2 = "拼团成功"
        break;
        case 4:
      stateInfo.info = "已结束";
      stateInfo.info2 = "拼团失败"
        break;
    }
    return stateInfo
  },
    onCancel() {
      var self = this;
      wx.alert({
        title: "提示",
        content: "确定取消订单吗",
        success: function(res) {
          if (res.confirm) {
            var data = {
              userToken: self.userToken,
              id: self.orderId
            };
            var obj = {
              url: wx.link.oCancel,
              method: "POST",
              data: data
            };
            self.$http(obj).then(res => {
              wx.Toast("订单已取消");
              setTimeout(() => {
                wx.navigateBack();
              }, 1500);
            });
          }
        }
      });
    },
    formatDuring(mss) {
      if (mss == 0) {
        clearInterval(this.timer);
        return "已结束";
      } else {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((mss % (1000 * 60)) / 1000);
        return hours + "时" + minutes + "分" + seconds + "秒";
      }
    },
    onPayment(e) {
      var details = this.details;
      var data = {
        currPriceStr: null,
        origPriceStr: null,
        info: null,
        title: null,
        peopleNum: null
      };
      for (let i in data) {
        data[i] = details[i]
      };
      data.id = this.orderId;
      data.pic = details.repPic;
      var url;
      if(e==1){
      url = "../details/main?spellId="+this.spellId;
      }else{
      url = "../details/main?state=1"
      }
      this.$store.state.order = data;
      wx.redirectTo(url);
    }
  },
  onUnload() {
    this.surplusTimeMillis = null;
    clearInterval(this.timer);
  },
  onShareAppMessage() {
    var a = getCurrentPages()
    var shareLink=  '/pages/ddxq/main?groupBuyApplyId='+this.groupBuyApplyId;
    var shareTitle = this.details.title+"来参团吧"
    return {
      title: shareTitle,
      path: shareLink,
    }
  },
  async onLoad() {
    if(this.userToken){
      this.init()
    }else{
      //登录回调
      this.$store.state.loginState = false; 
     this.$login(this.init)
    }
  },
};
</script>
<style scoped>
@import "../../../static/css/dd_detail.css";
</style>
