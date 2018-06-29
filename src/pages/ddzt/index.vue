<template>
<div>
  <div class="detail_model" >
    <p class="f_38 f_w">状态追踪</p>
    <div class="dd_state" v-if="traces">
      <p class="state_list f_28" v-for="(list,index) in traces" :key="index">
        <span class="state_item f_w">{{list.acceptStation}}</span>
        <span class="state_time clor_f">{{list.acceptTimeStr}}</span>
        <span class="state_icon_b" :class="{state_icon:index==lastIndex}"></span>
        <span class="state_solid" v-if="index!==lastIndex"></span>
      </p>
    </div>
    <div v-if="lastIndex<0">
      <p class="state_none clor_f f_30">当前无订单状态~</p>
    </div>
  </div>
  <div class="xcx_fixed">
    <button @click="close" class="close xcx_btn">关闭</button>
  </div>
 </div> 
</template>

<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      traces:null,
      lastIndex:null,
    };
  },
  computed: {
    order() {
      return this.$store.state.order;
    },
    userInfo(){
        return this.$store.state.userInfo
      },
    userToken(){
       return this.$store.state.userToken
     }
  },
  methods: {
   close(){
     wx.navigateBack()
   }
  },
   onShow() {
    var activityId =  this.$root.$mp.query.id;
    //var activityType = this.$root.$mp.query.activityType;
         var data  = {
           url:wx.link.distributionTraces,
           method:"POST",
           data:{
             id: activityId,
             //activityType: activityType,
             userToken:this.userToken
           }
         }
    wx.request(data).then(res=>{
      res = res.data;
      if(res.code==0){
        this.traces = res.data.traces;
        this.lastIndex = this.traces.length-1
      }
    })     
  
  }
};
</script>

<style scoped>
.detail_model{
  padding:20px 10px;
}
.dd_state{
  padding-left: 45px;
}
.state_list{
  display: flex;
  position: relative;
  margin-top: 16px;
  height: 60px;
}
.state_item{
  flex: 18;
  text-align: left;
  padding-right: 10px;

}
.state_time{
  flex: 11;
  text-align: right
}
 .state_icon_b{
  position: absolute;
  left: -35px;
  width: 20px;
  top: 10px;
  height: 20px;
  background-color: #e3e3e3;
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-sizing: border-box
}
.state_list .state_icon{
  border: 4px solid #e4931b;
  background-color: #ffffff
}
.state_solid{
  position: absolute;
  top: 26px;
  left: -26px;
  width: 3px;
  height: 61px;
  background-color: #e3e3e3
}
.xcx_fixed .close{
  width: 100%;
  height: 45px;
  line-height: 45px;
}
.state_none{
  padding-top: 20px;
  text-align: center 
}
</style>
