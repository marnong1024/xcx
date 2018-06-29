<template>
 <div class="zyjl" v-if="cont">
   <div class="user_info">
     <div class="user_pic">
       <img :src="cont.avatar" alt="">
     </div>
     <div class="user_name f_w">
        <p class="f_34">{{cont.memberName}}</p>
        <p class="f_30 clor_f">已为他助力{{cont.carCurrency}}金币!</p>
     </div>
   </div>
   <div class="cont_details">
        <div class="cont_item"><span>赠送数量</span><span class="num">{{cont.carCurrency}}金币</span></div>
        <div class="cont_item"><span>库存抵扣</span><span class="num">{{cont.userCarCurrency}}金币</span></div>
        <div class="cont_item"><span>支付金额</span><span class="num">{{cont.amountStr}}元</span></div>
        <div class="cont_item"><span>支付时间</span><span class="right">{{cont.createTimeStr}}</span></div>
        <div class="cont_item"><span>状态</span><span class="right">
         <em v-if="cont.state==1">待支付</em>
         <em v-if="cont.state==2">助力成功</em>
         <em v-if="cont.state==3">退款中</em>
         <em v-if="cont.state==4">已退款</em>
         <em v-if="cont.state==5">取消支付</em>
         </span>
          </div>
   </div>
   <div class="cont_bottom">
       <span class="cont_btn f_30" @click="ToLink">查看心愿页面</span>
   </div>
 </div>
</template>
<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      cont:null
    }
  },
  methods:{
    ToLink(){
      wx.hrefTo("../xyjl/main?id="+this.cont.memberWishCommodityId)
    }
  },
  onShow(){
    var id = this.$root.$mp.query.id;
    console.log(id)
      var data = {
        url: wx.link.wishHelpDetail,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
          id:id
        }
      };
      this.$http(data)
        .then(res => {
          res = res.data;
          if(res.code==0){
            this.cont = res.data
          };
        })
        .catch(err => {
          console.log(err);
        });
  }
};
</script>
<style>
page{
  height: 100%;
}
.zyjl{
  position: relative;
  width: 100%;
  height: 100%;
}
.user_info{
  display: block;
  width: 130px;
  margin: 0 auto;
}
.user_pic{
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 18px;
}
.user_pic img{
  display: block;
  width: 100%;
  height: 100%;
}
.user_name{
  text-align: center;
  line-height: 17px;
}
.user_name p{
  margin-top: 10px
}
.cont_item{
  display: flex;
  font-size: 17px;
  height: 37.5px;
  line-height: 18px;
  padding: 8px 20px;
  color: #9a9a9a;
  box-sizing: border-box;
}
.cont_item span{
  flex: 1
}
.cont_item .num{
  color: #000;
}
.cont_item .num,.cont_item .right{
  text-align: right
}
.cont_details{
  position: absolute;
  width: 100%;
  padding: 5px 0;
  top: 156px;
}
.cont_bottom{
  position: absolute;
  background-color: #f5f5f5;
  width: 100%;
  top: 350px;
  bottom: 0; 
}
.cont_btn{
  display: block;
  width: 190px;
  height: 45px;
  line-height: 45px;
  color: #549af9;
  margin: 145px auto 0;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
  border-radius: 22.5px;
  text-align: center
}
</style>
