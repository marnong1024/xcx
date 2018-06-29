<template>
  <div>
    <div class="xcx_body">
      <div class="xcx_title">
        <p class="f_38 f_w">订单库存</p>
        <p class="f_30">随时下单配送，免服务费</p>
      </div>
      <div class="xcx_cont" >
        <div v-if="no_data" class="none">
          <span class="icon icon-khezi"></span>
          <button @click="tabTo">库里什么都没有,点我去拼团</button>
        </div>
        <div v-if="pageData" class="list" v-for="(list,index) in pageData" :key="index">
          <div class="flipper" v-if="list.qiche">
            <div class="front">
              <div class="kfk_pic" @click="toKfk">
                 <img class="kfk_pic_list" :src="list.qiche" alt="">
                 <p class="f_30 kfk_name">{{list.commodityName}}</p>
                </div>
            </div>
          </div>
          <div class="flipper" v-if="!list.qiche"  :class="{f_active:list.state}">
            <div class="front" @click.stop="choice(index,list)" >
                <div class="kfk_pic">
                 <img class="kfk_pic_list" :src="list.repPic" alt="">
                </div>
            </div>
            <div class="f_42 back">
              <div class="kfk_num">
               <span class="minus icon icon-jian" @click.stop="minus(list)">
               </span><span class="kfk_img">{{kfk_num}}件</span>
               <span class="icon icon-jia" :class="{clor_y:kfk_num==numMax}" @click.stop="add_num(list)"></span>
              </div>
              <div class="kfk_item">
                 <p class="f_30">{{list.commodityName}}</p>
                 <p class="f_30 clor_f">共{{list.num}}件</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bot_bar" v-if="bar_show">
        <div class="xcx_bar clor_r">
         <p class="f_38">￥{{kfk_price}}<span class="xcx_card f_24">{{kfk_num}}件</span></p>
         <p class="f_24 m_t">以免服务费</p>
         <button @click="exchange"  type="warn" class="xcx_bar_btn btn_xc xcx_btn">现场兑换</button>
         <button @click="tolink" class="xcx_bar_btn xcx_btn">配送</button>
        </div>
    </div>
  </div>
</template>
<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      item: false,
      bar_show: false,
      pageData: null,
      no_data:false,
      numMax:null,
      kfk_num:1,
      kfk_price:0,
      acType:null,
      activityId:null
    };
  },
  methods: {
    init(){
    var data = {
        url: wx.link.repository,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
          pageNo: 1,
          pageSIze: 30
        }
      };
      this.$http(data)
        .then(res => {
          res = res.data.data;
          if(res.list.length!== 0){
          for(let i=0;i<res.list.length;i++){
            res.list[i].state = false;
          }
          var arr = res.list
          console.log(res.list)
          var model = {commodityName:"金币兑换",qiche:"https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_qiche.jpg"};
          arr = [model].concat(arr);
          console.log(arr)
          this.pageData = arr;
          //console.log(this.pageData)
          }
          if(res.list.length== 0){
            this.no_data=true;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    exchange(){
      var num = this.kfk_num;
      self = this;
      wx.alert({
  title: '兑换数量'+num,
  content: '兑换的时候请工作人员确认，确认之后将无法再兑换',
  success: function(res) {
    if (res.confirm) {
      var data = {
        url:wx.link.receive,
        method:"POST",
        data:{
        activityId:self.activityId,
        userToken:self.$store.state.userToken,
        type:self.acType,
        num:num
        }
      }
      console.log(data)
      self.$http(data).then(res=>{
        res = res.data;
        if(res.code==0){
          wx.Toast("兑换成功")
          Object.assign(self.$data, self.$options.data())
          self.init();
        }else{
          wx.Toast("兑换失败")
        }
      })
    } else if (res.cancel) {
      console.log('用户点击取消')
    }
  }
});
     
    },
    choice(e,l) {
      for(let i=0;i<this.pageData.length;i++){
        this.pageData[i].state = false;
      }
      this.activityId = l.activityId;
      this.acType = l.type;
      this.kfk_price = l.serviceFeeStr;
      this.kfk_num = 1;
      this.numMax = l.num;
      l.state = true;
      this.bar_show = true;
    },
    toKfk(){
       wx.hrefTo("../tiqu/main")
    },
    tabTo(){
      wx.switchTab("../counter/main")
    },
    tolink(e) {
      if(e==1){
      var url ="../tiqu/main"
      }else{
      var url = "../qrdd/main?activityId="+this.activityId+"&num="+this.kfk_num+"&type="+this.acType;
      }
      wx.hrefTo(url);
    },
    minus(l){
      var num = this.kfk_num;
      if(num == 1){
        l.state =this.bar_show = false;
      }else{
        this.kfk_num-=1;
      }
    
    },
    add_num(l){
      var num = this.kfk_num;
      if(num == this.numMax){
        return
      }else{
        this.kfk_num+=1
      }
    
    }
  },
  async onShow() {
      this.init()
  }
};
</script>

<style>
.xcx_body {
  margin-top: 38px;
}
.xcx_title {
  padding: 0 20px;
}
.xcx_title .f_30 {
  color: #5a5a5a;
}
.xcx_cont {
  display: flex;
  flex-wrap: wrap;
  margin: 15px auto 0;
  width: 344px;
}
.xcx_cont .list {
  margin-top: 15px;
  width: 50%;
  height: 164px;
}
.xcx_cont .list .flipper {
  display: block;
  width: 140px;
  height: 100%;
  margin: 0 auto;
  -webkit-border-radius: 6px;
  border-radius: 6px;
  position: relative;
}
.xcx_cont .list .flipper .front {
  width: 100%;
  height: 100%;
  position: relative;
}
.kfk_pic,
.kfk_pic img {
  position: absolute;
  width: 100%;
  height: 100%;
}
.kfk_item {
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 40px;
  color: #fff; 
  padding:0 5px;
  box-sizing: border-box; 
  text-align: center;
}
.kfk_name{
  position: absolute;
  width: 100%;
  height: 40px;
  bottom: 15px;
  color: #000; 
  padding:0 5px;
  box-sizing: border-box; 
  text-align: center;
}
.front,
.back {
  backface-visibility: hidden;
  color: #000;
  transition: 0.6s ease-out;
  -webkit-box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.16);
  box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.16);
  -webkit-transition: 0.6s ease-out;
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
  position: absolute;
  top: 0;
  left: 0;
}
.front {
  z-index: 2;
  transform: rotateY(0deg);
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
}
.back {
  background-color: #afd9fd;
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 1;
  transform: rotateY(-180deg);
  -webkit-transform: rotateY(-180deg);
}
.icon-jian{
  font-size: 40px
}
.kfk_num{
  display: flex;
}
.kfk_num span{
  flex: 1;
  height: 90px;
  line-height: 90px;
}
.f_active .front {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);
  -ms-transform: rotateY(180deg);
  -o-transform: rotateY(180deg);
  z-index: 1;
}
.f_active .back {
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
  -moz-transform: rotateY(0deg);
  -ms-transform: rotateY(0deg);
  -o-transform: rotateY(0deg);
  z-index: 2;
}
</style>
