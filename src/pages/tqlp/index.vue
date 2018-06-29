<template>
 <div class="tqlp">
   <div class="header">
   </div>
   <div class="tq-box">
     <swiper 
     :indicator-dots="true" 
     :duration="700">
  <div class="tq-cont" v-for="list in cont" :key="list">
    <swiper-item>
     <div class="swiper-item-cont">
       <div class="tq-list" v-for="item in list" :key="item">
         <div class="tq-item">
           <div class="tq-item-pic">
            <img :src="item.pic" alt="">
           </div>
         </div>
       </div>
     </div>
    </swiper-item>
  </div>
</swiper>
     <!-- <div class="tq-cont">
       <div class="tq-list" v-for="list in cont" :key="list">
         <div class="tq-item"></div>
       </div>
     </div> -->
   </div>
 </div>
</template>
<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      cont:null,
      bg:"https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_qiche_bg.jpg"
    }
  },
  methods:{
    tqFum(l){
       var data = {
        url: wx.link.extract,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
          id:l.id
        }
      };
    }
  },
  onShow(){
      var data = {
        url: wx.link.canExtractList,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
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
.tqlp .header{
  display: block;
  height: 150px;
  background-image: url("https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_qiche_bg.jpg");
  background-size: 100%;
}
.tq-box{
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
}
.tq-cont{
  display: block;
}
.tq-cont .tq-list{
  display: inline-block;
  width: 33.33%;
}
.tq-cont .tq-list .tq-item{
  display: block;
  width: 80%;
  margin: 0 auto;
}
</style>
