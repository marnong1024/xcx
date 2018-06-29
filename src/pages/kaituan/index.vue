<template>
  <div class="commodity" v-if="content">
    <div class="commodity_list">
      <div class="commodity_pic">
        <img class="commodity_img" :src="content.pic" mode="widthFix" alt="">
      </div>
      <div class="commodity_info">
        <div class="commodity_title">
          <div class="f_w">
            <p class="cell">{{content.title}}</p>
            <p v-if="content.type==1" class="clor_r f_24">【老带新团】老用户可开团，新用户可参团/开团</p>
          </div>
        </div>
        <div class="commodity_desc">
          <p>{{content.info}}</p>
          <p class="commodity_num f_w">
            <span class="clor_r f_42">￥{{content.currPriceStr}}</span>
            <span class="clor_r f_20">拼团价</span>
            <span class="clor_c f_28">￥{{content.origPriceStr}}</span>
          </p>
        </div>
      </div>
      <div class="act_desc">
        <p class="f_30 f_w">拼团玩法</p>
        <div class="act_list">
          <div class="act_item_1">
            <span class="b_num">1</span>
            <span>选择商品，开团或拼团</span>
          </div>
          <div class="act_item">
            <span class="b_num">2</span>
            <span>付款后邀请好友参团</span>
          </div>
          <div class="act_item_1">
            <span class="b_num">3</span>
            <span>达到拼团人数，顺利开团</span>
          </div>
          <div class="act_item">
            <span class="b_num">4</span>
            <span>若{{content.deadline}}小时内拼团不成功，全额退款</span>
          </div>
        </div>
      </div>
      <div class="wrap">
       <div>
        <div class="act_recom" v-if="act_recom">
          <div class="recom_list f_30 f_w" >有人正在拼团，可直接参与</div>
          <div class="more f_28" @click="onMore" >查看更多<span class="icon icon-right f_12"></span></div>
        </div>
        <div class="act_user"  v-for="(list,index) in content.applies" :key="index" v-if="index<5">
          <div class="user_pic"><img :src="list.avatar" alt=""></div>
          <div class="user_list">
            <p class="user_name f_28">{{list.memberName}}</p>
            <p class="user_item f_24">还差
              <span class="clor_r">{{list.spellNum}}人</span>参团
              <span class="act_time" v-if="times[index]">{{times[index]}}</span>
            </p>
          </div>
          <div class="xcx_btn" @click="pt_fun(list)">{{content.currPriceStr}}元拼团</div>
        </div>
        </div>   
        <div class="img_box">
          <img class="img_item" mode="widthFix" v-for="list in content.pics" :key="list" :src="list" alt="">
        </div>
      </div>
    </div>
    <!--弹出层 -->
    <div class="mod_dialog" v-if="more_show">
      <div class="cont_dialog">
      <div class="fixed_box">
        <div class="dialog_head">
          <span @click="onMore" class="icon icon-close f_42 f_w clor_z"></span>
          <div class="dialog_search">
            <span class="serrch_box"><input placeholder-class = "placeholder-class"
             @input='bindKeyInput' class="serrch_inp" placeholder="输入团长或团员电话号码" type="text"></span>
            <span class="serrch_sub f_24" @click="groupBuySearch">搜索</span>
          </div>
        </div>
        <div class="dialog_tab">
          <div class="dialog_tab_list" @click="dialogTabFun(1)" :class="{active:dialog_tab==1}">
          <div class="dialog_tab_item">
           <p class="list_title f_28 f_w">正在拼团</p>
           <p class="list_num">（{{processNum}}）</p>
           </div>
          </div>
          <div class="dialog_tab_list" @click="dialogTabFun(2)" :class="{active:dialog_tab==2}">
            <div class="dialog_tab_item">
           <p class="list_title f_28 f_w">拼团成功</p>
           <p class="list_num">（{{successNum}}）</p>
            </div>
          </div>
          <div class="dialog_tab_list" @click="dialogTabFun(3)" :class="{active:dialog_tab==3}">
            <div class="dialog_tab_item">
           <p class="list_title f_28 f_w">拼团失败</p>
           <p class="list_num">（{{faildNum}}）</p>
            </div>
          </div>
        </div>
         <div class="dialog_box">
           <div class="dialog_item" v-for="(list,index) in tablist" :key="index">
             <div class="user_pic"><img :src="list.avatar" alt=""></div>
          <div class="user_list">
            <p class="user_name f_28">{{list.memberName}}</p>
            <p class="user_item f_24"  v-if="dialog_tab!==2" ><span>还差</span><span class="clor_r">{{list.spellNum}}人</span><span>参团</span>
              <span v-if="dialog_tab==1" class="act_time f_24">{{times[index]}}</span>
            </p>
          </div>
          <div class="xcx_btn" @click="pt_fun(list)">{{content.currPriceStr}}元拼团</div>
           </div>
         </div>
       </div>
      </div>

    </div>

    <div class="xcx_fixed">
      <span class="clor_r f_36">￥{{content.currPriceStr}}</span>
      <button @click="go_btn" class="xcx_btn" >发起拼团</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      content: null,
      tablist: null,
      applies: null,
      processNum:null,
      successNum:null,
      faildNum:null,
      appliesSuccess: null,
      appliesFailds: null,
      more_show: false,
      act_recom: true,
      Countdown: [],
      times: [],
      mobile: null,
      intervals: {},
      dialog_tab: 1
    };
  },
  methods: {
    onMore() {
      this.more_show = this.more_show ? false : true;
    },
    bindKeyInput(e) {
      this.mobile = e.target.value;
    },
    dialogTabFun(num) {
      this.dialog_tab = num;
      if (num == 1) {
        this.tablist = this.applies;
      } else if (num == 2) {
        this.tablist = this.appliesSuccess;
      } else {
        this.tablist = this.appliesFailds;
      }
    },
    groupBuySearch() {
      if(this.mobile){
       var Object = {
        url: this.$links.groupBuySearch,
        method:"POST",
        data: {
          id: this.$root.$mp.query.id,
          mobile: this.mobile
        }
      };
      this.$http(Object)
        .then(res => {
          res = res.data;
          if(res.code==0){
            res = res.data;
      this.tablist = this.applies = res.applies;
      this.appliesSuccess = res.appliesSuccess;
      this.appliesFailds = res.appliesFailds;
      this.processNum = res.processNum;
      this.successNum = res.successNum;
      this.faildNum = res.faildNum;
          console.log(res);
          }
        })
        .catch(err => {})
      }
    },
    go_btn() {
      //活动ID
      var id = this.$root.$mp.query.id;
      var cont = this.content;
      this.$store.state.order = {
        id: cont.id,
        title: cont.title,
        peopleNum: cont.peopleNum,
        currPriceStr: cont.currPriceStr,
        origPriceStr: cont.origPriceStr,
        info: cont.info,
        pic: cont.repPic
      };
      //活动id，支付
      wx.navigateTo({
        url: "../details/main?id=" + id
      });
    },
    pt_fun(e) {
      //报名id，请求详情
      wx.navigateTo({
        url: "../ddxq/main?groupBuyApplyId=" + e.id
      });
    },
    formatDuring(mss, index) {
      if (mss == 0) {
        clearInterval(this.intervals[index]);
        return "已结束";
      } else {
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((mss % (1000 * 60)) / 1000);
        return hours + "时" + minutes + "分" + seconds + "秒";
      }
    }
  },
  onUnload() {
    //清除倒计时
    this.more_show = false;
    this.dialog_tab = 1;
    if (this.act_recom) {
      for (let i in this.intervals) {
        clearInterval(this.intervals[i]);
      }
    }
  },
  onLoad() {
    //活动ID，请求活动详情
    var id = this.$root.$mp.query.id;
    var Object = {
      url: this.$links.groupDetail,
      data: { id: id }
    };
    this.$http(Object).then(res => {
      res = res.data.data;
      this.content = res;
      this.tablist = this.applies = res.applies;
      this.appliesSuccess = res.appliesSuccess;
      this.appliesFailds = res.appliesFailds;
      this.processNum = res.processNum;
      this.successNum = res.successNum;
      this.faildNum = res.faildNum;
      var self = this;
      if (!res.applies.length == 0) {
        this.act_recom = true;
        var applies = res.applies;
        for (let i = 0; i < applies.length; i++) {
          self.Countdown[i] = applies[i].surplusTimeMillis;
          self.times[i] = null;
          self.intervals[i] = setInterval(() => {
            self.$set(self.times, i, self.formatDuring(self.Countdown[i], i));
            self.Countdown[i] = self.Countdown[i] - 1000;
            if (self.Countdown[i] == 0) {
              clearInterval(slef.intervals[i]);
            }
          }, 1000);
        }
      } else {
        this.act_recom = false;
      }
    });
  }
};
</script>

<style scoped>
.commodity_pic,
.commodity_img {
  width: 100%;
  height: 195px;
  overflow: hidden;
}
.commodity_info {
  width: 100%;
  box-sizing: border-box;
  height: auto;
  padding: 10px 20px 20px;
}
.act_desc {
  background-color: #f4f8fa;
  color: #34537c;
  padding: 15px 20px;
}
.act_list {
  box-sizing: border-box;
  width: 100%;
  color: #547480;
  margin: 2px 0;
}
.act_item,
.act_item_1 {
  display: inline-block;
  box-sizing: border-box;
  height: 25px;
  line-height: 25px;
  font-size: 10px;
}
.act_item_1 {
  width: 40%;
}
.act_item {
  width: 60%;
  padding-left: 2px;
}
.act_item span,
.act_item_1 span {
  display: inline-block;
  vertical-align: middle;
}
.b_num {
  width: 14px;
  height: 14px;
  text-align: center;
  line-height: 14px;
  margin-right: 2px;
  border-radius: 50%;
  background-color: #4f6481;
  color: #ffffff;
}
.act_recom,
.act_user,
.dialog_item {
  display: flex;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}
.act_user,
.dialog_item {
  position: relative;
}
.act_user .xcx_btn,
.dialog_box .xcx_btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 80px;
  font-size: 12px;
}
.dialog_box .xcx_btn {
  right: 12px;
}
.dialog_tab {
  display: flex;
  height: 44px;
  border-bottom: 1px solid #f0f0f0;
}
.dialog_tab_list {
  flex: 1;
  text-align: center;
  padding-top: 6px;
}
.active .dialog_tab_item {
  color: #549af9;
}
.dialog_tab_list .list_num {
  font-size: 10px;
}
.act_user .xcx_btn {
  right: 0;
}
.recom_list {
  flex: 5;
  color: #525252;
}
.more {
  flex: 2;
  color: #595959;
  text-align: right;
}
.user_pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.user_pic > img {
  width: 100%;
  height: 100%;
}

.user_list {
  flex: 1;
  margin-left: 7px;
}
.user_name {
  color: #0b0b0b;
}
.user_item {
  color: #8f8f8f;
  margin-top: 3px;
}
.xcx_fixed .xcx_btn {
  flex: 228px;
  height: 100%;
  line-height: 45px;
}
.xcx_fixed span {
  margin-left: 13px;
  flex: 118px;
  height: 100%;
}
.img_box,
.img_item {
  display: block;
  width: 100%;
  border: none;
}
.mod_dialog {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0px;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.4);
  overflow: hidden;
}
.cont_dialog {
  width: 100%;
  height: 100%;
  position: relative;
}
.fixed_box {
  position: absolute;
  top: 90px;
  right: 33px;
  left: 33px;
  background-color: #fff;
  border-radius: 3px;
  box-sizing: border-box;
}
.sub_tip {
  color: #8f8f8f;
  text-align: center;
  height: 40px;
  line-height: 40px;
}
.dialog_head {
  position: relative;
  padding: 11px 34px;
  border-bottom: 1px solid #f0f0f0;
}
.dialog_head .icon-close {
  position: absolute;
  right: 15px;
  top: 15px;
}
.dialog_search {
  display: flex;
  width: 213.5px;
  height: 30px;
  border: 1rpx solid #549af9;
  box-sizing: border-box;
}
.serrch_box {
  flex: 352;
}
.serrch_sub {
  flex: 75;
  background-color: #549af9;
  text-align: center;
  height: 100%;
  color: #fff;
  line-height: 28px;
}
.serrch_inp {
  display: block;
  height: 28px;
  line-height: 28px;
  font-size: 14px;
  text-align: center;
  color: #000;
  padding:0 5px;
  box-sizing: border-box;
}
.placeholder-class{
  font-size: 12px;
  line-height: 28px;
}
.dialog_tab {
  display: flex;
  width: 100%;
  color: #000;
}
.dialog_box {
  padding-left: 12px;
  height: 350px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
