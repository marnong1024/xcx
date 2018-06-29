<template>
  <div class="model_body">
     <div v-if="!pageData" class="none">
          <span class="icon icon-dd"></span>
          <p class="f_30 clor_y">你还没有拼团，赶紧去拼团吧~</p>
        </div>
    <div class="model_item" @click="goDdxq(list)" v-for="list in pageData" :key="list">
        <p class="f_34">{{list.title}}</p>
        <p>￥{{list.amountStr}}</p>
        <p class="f_24 clor_z">购买时间{{list.createTimeStr}}</p> 
        <p class="model_state f_30 clor_z">
        <span v-if="list.state==0">支付待确认</span>
        <span v-if="list.state==1">待支付</span>
        <span v-if="list.state==2">已支付</span>
        <span v-if="list.state==3">已完成</span>
        <span v-if="list.state==4">已过期</span>
        <span v-if="list.state==5">已取消</span>
        <span v-if="list.state==6">退款中</span>
        <span v-if="list.state==7">已退款</span>
        </p> 
    </div>
  </div>
</template>

<script>
import wx from '../../utils/wx'
export default {
 data(){
   return{
     pageData:null
   }
 },
 methods:{
   goDdxq(e){
     console.log(e)
     var str = "../ddxq/main?groupBuyApplyId="
     if(e.state==1){
       
      str = "../ddxq/main?state=true&orderId="+e.id+"&groupBuyApplyId="
     }
     console.log(str)
    wx.hrefTo(str+e.groupBuyApplyId)
   }
 },
 onShow(){
var Object = {
        url:wx.link.orderList,
        method:"POST",
        data:{userToken:this.$store.state.userToken,pageSize:20}
        };
      this.$http(Object).then(item=>{
        var item = item.data;
        console.log(item)
        if(item.code==0&&item.pageData.length>0){
        this.pageData = item.pageData;
        }
      })

  
 }
};
</script>

<style scoped>
.model_item{
  display: block;
  position: relative;
  padding: 12px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #cccccc;
}
.clor_y{
  text-align: center
}
.model_state{
  position: absolute;
  right: 20px;
  bottom: 12px;
}
</style>
