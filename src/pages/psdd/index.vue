<template>
  <div class="psdd">
    <div class="psdd_box">
      <div class="psdd_cell" @click="goStste(list)" v-for="list in pageData" :key="list">
      <div class="psdd_title"><span class="psdd_name f_34">{{list.commodityName}}{{list.num}}份</span>
          <div class="psdd_right f_34">
            <span v-if="list.state==1">待配送</span>
            <span v-if="list.state==2">配送中</span>
            <span v-if="list.state==3">待签收</span>
            <span v-if="list.state==4">已签收</span>
            <span v-if="list.state==5">已确认收货</span>
            <span v-if="list.state==6">已兑换</span>
            </div>
      </div>
      </div>
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
   goStste(e){
     if(e.state!==6){
     var url ="../ddzt/main?id="+ e.id+"&activityType="+e.activityType; 
     wx.hrefTo(url)
     }
     
   }
   
 },
 mounted(){
var Object = {
        url:wx.link.distributionList,
        method:"POST",
        data:{userToken:this.$store.state.userToken,
        pageSize:20}
        };
      this.$http(Object).then(item=>{
        var item = item.data;
        if(item.code==0){
          console.log(item)
        this.pageData = item.pageData;
        }
      })
 }
};
</script>

<style>
page{
  width: 100%;
  height: 100%;
  background-color: #f8f8f8
}
.psdd_cell{
  display: block;
  position: relative;
  padding: 12px 20px;
  box-sizing: border-box;
  background-color: #fff;
  border-bottom: 1px solid #cccccc;
}
.psdd_title{
  position: relative;
}
.psdd_name{
  display: block;
  width: 250px
}
.psdd_right{
  position: absolute;
  right: 0;
  top: 0;
  color: #999999;
}

</style>
