<template>
    <div class="bg_cor" v-if="data">
        <div class="xcx_heads">
            <div class="xcx_pagetitle">
                好友助力，免费拿商品~
            </div>
            <p class="head_info">每位好友可助力100-500金币给你</p>
            <p class="head_info">新用户可免费助力200金币</p>
            <span class="xcx_rule" @click="toRule">活动规则</span>
        </div>
        <image class="index_bg" src="https://www.e-carhome.com/qiche/car_h5/xcx/img/index_bg.jpg"></image>
        <div class="container">
            <div class="xcx_body">
                <div class="xcx_cont" :class="{isShow:drawer}">
                    <div class="xcx_list" @click="category_show">
                        <div class="xcx_list_pic">
                            <img v-if="!pic_item" class="xcx_list_pic_item" src="https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_car.png" alt="">
                            <img v-if="pic_item" class="xcx_list_pic_item" :src="pic_item" alt="">
                        </div>
                        <div class="xcx_list_text" v-if="!wishCommodity">
                          <p>选择您的礼品</p>
                        </div>
                        <div class="xcx_list_text" v-if="wishCommodity">
                          <p><span>{{wishCommodity.commodityName}}</span></p>
                          <p class="category_info_price f_28">需要<span class="clor_">{{wishCommodity.carCurrency}}</span>金币</p>
                        </div>
                        <div class="xcx_img_left"><span class="icon icon-right clor_y"></span></div>
                    </div>
                    <!--商品列表-->
                    <div class="xcx_category">
                       <swiper :indicator-dots="true"
                            :autoplay="false"  
                            :duration="500">
                       <div v-for="(list,index) in data.wishCommoditys" :key="index">
                       <swiper-item>
                           <div class="xcx_category_ul">
                               <div class="xcx_category_li" v-for="(item,val) in list" @click="chooseList(item)" :key="val">
                                 <div class="xcx_category_item">
                                    <img class="xcx_category_pic" mode="widthFix" :src="item.pic">
                                </div>
                                 <div class="xcx_category_info">
                                    <p class="category_info_name">{{item.commodityName}}</p>
                                    <p class="category_info_price">需
                                        <span class="clor_">{{item.carCurrency}}金币</span>
                                    </p>
                                </div>
                               </div>
                           </div>
                       </swiper-item>
                      </div>
                      </swiper>
                    </div>
                </div>
                <div class="xcx_cont" @click="chooseImage">
                    <div class="xcx_up_load" v-if="!picFile">
                        <p>选张照片作为心愿汇报吧^^</p>
                        <p class="f_42 icon icon-jia"></p>
                        <p class="tip_text">好友助力以后可见哦</p>
                    </div>
                    <div class="xcx_pic_list" v-if="picFile">
                        <image class="xcx_pic_item" :src="picFile"></image>
                    </div>
                </div>
                <div class="xcx_cont">
                    <div class="xcx_up_load">
                        <p>为你的心愿拉个票^^</p>
                        <textarea v-if="t_show" class="xcx_textarea" @input="linechange" maxlength='39' placeholder-style="color:#cfcfcf" placeholder='用压箱底照片换一张购车劵大佬们赏个脸呗(⌒▽⌒)'></textarea>
                    </div>
                </div>
                <button class="xcx_btn" @getuserinfo="onGotUserInfo" open-type="getUserInfo" @click="xcx_submit">邀请好友助力</button>
            </div>
        </div>
        <card :share_show="share_show" @share_pyq="share_pyq" @share="dialog_show"></card>
        <canvas class="canvas" canvas-id="shareCanvas" :style="{width:c_width+ 'px',height:c_height+ 'px'}"></canvas>
    </div>
</template>
<script>
import wx from "../../utils/wx";
import card from "../../components/card.vue"
export default {
  data() {
    return {
      chooseImageState:false,
      drawer: false,
      picFile:null,
      filePath:null,
      pic_item:null,
      share_pic:"https://www.e-carhome.com/qiche/car_h5/xcx/img/share_pic_1.jpg",
      wishCommodityId:null,
      wishCommodity:null,
      data: null,
      t_show:true,
      description:null,
      share_show:false,
      c_stop:true,
      share_id:"3c8e2f6f85c045f496c3db9d73b01c19"
    };
  },
  computed:{
     updata(){
       return{
         userToken:this.userToken,
         description:this.description||"用压箱底照片换一张购车劵大佬们赏个脸呗(⌒▽⌒)",
         wishCommodityId:this.wishCommodityId
       }
     },
     c_width(){
       return this.$store.state.windowWidth
     },
     c_height(){
       return this.$store.state.windowWidth*4/5 
     },
     userToken(){
       return this.$store.state.userToken
     }
  },
  methods: {
    toRule(){
      wx.hrefTo("../explain/main")
    },
    getImageInfo(str){
      var wishCommodity = this.wishCommodity,
          share_pic = this.share_pic,
          c_width = this.c_width,
         c_height = this.c_height,
         arr = [],
         description = this.description||"用压箱底照片换一张购车劵大佬们赏个脸呗(⌒▽⌒)";
           arr.push(description.substring(1,12))
         if(description.length>12){
         arr.push(description.substring(12,description.length))
         };
      wx.getImageInfo(share_pic.bigPic).then(res=>{
     var ctx = wx.createCanvasContext('shareCanvas')
    // 分享底图5:4自适应
    ctx.drawImage(res.path, 0, 0, c_width, c_height)
    // 作者名称
    ctx.setTextAlign('center')    // 文字居中
    ctx.textAlign="center"
    ctx.setFillStyle('#ffffff')  // 文字颜色：黑色
    ctx.setFontSize(22)         // 文字字号：12px
    ctx.fillText(arr[0], c_width/2, c_height*.72);
    if(description.length>12){
    ctx.fillText(arr[1], c_width/2, c_height*.82);
    }
    ctx.stroke()
    ctx.draw()
      })
    },
    share_pyq(){
      this.dialog_show();
      this.chooseImageState = true;
      wx.hrefTo('../qrcode/main?id='+this.share_id)
    },
    category_show() {
      if(this.$store.state.SyncType==3){
        this.drawer = this.drawer ? false : true;
    }else{
      wx.alert({
              title: '您尚未绑定信息',
              content: '如需正常使用，请前往绑定您的信息',
              confirmText:'去绑定',
              success: function(res) {
                 
              }
            })
    }
    },
    linechange(e){
      this.description = e.target.value
    },
    getData(){
      var data = {
      url: wx.link.wishList,
      data: {}
    };
    wx.request(data).then(res => {
      res = res.data;
      if (res.code == 0) {
        this.data = res.data;
        this.share_pic = res.data.pic;
        this.$store.state.miniPic = res.data.pic.miniPic
      }
    });
    },
    chooseList(l){
       this.pic_item = l.pic;
       this.wishCommodity = l;
       this.wishCommodityId = l.id;
       this.drawer = false;
       this.getImageInfo()
    },
    xcx_submit(){
      //wx.hrefTo("../xyjl/main?id=0712773168ea4e0a908cbfb23a3dfdf5")
      if(!this.c_stop){
        return
      }
      var updata = this.updata;
      if(!updata.wishCommodityId){
        wx.Toast("请选择心愿物品")
      }else if(!this.picFile){
        wx.Toast("请上传一张照片~")
      }else{
        this.c_stop = false;
         var data = {
        url:wx.link.wishSubmit,
        data:this.updata,
        filePath: this.picFile,
        formData:updata,
      };
      wx.uploadFile(data).then(res=>{
        res = JSON.parse(res.data);
         this.c_stop = true;
        if(res.code==0){
          this.share_id = res.data;
          this.$store.state.description = this.updata.description;
        wx.canvasToTempFilePath({
    canvasId: 'shareCanvas'
      }).then(res => {
        this.filePath = res.tempFilePath;
        this.dialog_show()
        })
        }else {
          wx.Toast(res.desc)
        }
      })
      }
    },
    dialog_show(){
      this.share_show = this.share_show?false:true;
      this.t_show = this.t_show?false:true;
    },
    onGotUserInfo(e) {
      this.$store.commit("setUserInfo", e.target.userInfo);
    },
    chooseImage(){
      this.chooseImageState = false;
        wx.chooseImage().then(res=>{
            this.picFile = res.tempFilePaths[0];
            this.chooseImageState = true;
        })
    }
  },
  onShow(){
    //选择图片会触发onShow
    if(this.chooseImageState){
    Object.assign(this.$data, this.$options.data())
    this.getData();
    }
  },
  components:{
    card
  },
  onShareAppMessage(){
    var url ="/pages/xyjl/main?id=1b8a1f5b83af456c8cebcc3d22fdccfd"
    return {
      title: '想要'+this.wishCommodity.commodityName+"帮帮我呗~",
      path: url,
      imageUrl:this.filePath
    }
  },
  created() {
      this.getData();
  }
};
</script>

<style>
page{
  width: 100%;
  height: 100%;
}
.xcx_heads {
  width: 100%;
  position: relative;
  background-color: transparent;
  padding: 0 13px 10px;
  padding-top: 35px;
  margin-bottom: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  box-sizing: border-box;
}
.container,.xcx_heads,.xcx_body{
  z-index: 999;
}
.pagetitle {
  font-size: 23px;
  line-height: 23px;
  margin-bottom: 10px;
}
.head_info {
  margin-top: 6px;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 1.5px;
}
.bg_cor {
  background-color: #f0f0f0;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.xcx_body {
  width: 100%;
}
.xcx_cont {
  width: 100%;
  border: 0.5px solid fff;
  border-radius: 10px;
  padding: 9px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 12px;
  box-sizing: border-box;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  -webkit-box-shadow: 0 0 2px #ccc;
  -moz-box-shadow: 0 0 2px #ccc;
  box-shadow: 0 0 2px #ccc;
  z-index: 999;
}
.isShow .xcx_category {
  height: 280px;
}
.xcx_category {
  display: block;
  margin-top: 5px;
  width: 100%;
  height: 0;
  overflow: hidden;
  transition: height 0.4s;
  -moz-transition: height 0.4s;
  -webkit-transition: height 0.4s;
  -o-transition: height 0.4s;
}
.xcx_category_ul {
  width: 100%;
  padding: 6px;
  display: flex;
  flex-flow: wrap;
  box-sizing: border-box;
}
.xcx_category_li {
  display: inline-block;
  width: 33.3%;
  box-sizing: border-box;
  margin-top: 10px;
}
.xcx_category_item {
  width: 80%;
  margin: 0 auto;
}
.xcx_category_pic {
  width: 100%;
}
.xcx_list {
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.xcx_list_pic {
  flex: 14;
  height: 100%;
}
.xcx_list_pic_item {
  display: block;
  width: 80%;
  height: 100%;
  margin:0 auto 
}
.xcx_list_text {
  flex: 55;
}
.xcx_img_left {
  width: 17px;
  height: 17px;
  float: right;
  transform: rotate(0);
}
.isShow .xcx_img_left {
  transform: rotate(90deg);
  transition: all 0.4s;
  -moz-transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
}
.icon-jia {
  width: 24px;
  height: 24px;
  display: block;
  color: #82b7ff;
  text-align: center;
  margin: 20px auto 0;
}
.tip_text {
  font-size: 14px;
  text-align: center;
  color: #cfcfcf;
  margin-top: 10px;
}
.xcx_textarea {
  height: 45px;
  font-size: 14px;
  margin: 20px auto 0;
  width: 100%;
  letter-spacing: 2px;
}
.xcx_category_info {
  text-align: center;
  font-size: 12px;
}
.category_info_name {
  color: #333333;
}
.category_info_price {
  color: #a4a4a4;
  font-weight: normal;
}
.clor_ {
  color: #f5a000;
}
.xcx_btn {
  background-color: #549af9;
  color: #fff;
  width: 60%;
  height: 44px;
  line-height: 44px;
  border-radius: 20px;
  margin: 15px auto 30px;
}
.xcx_rule {
  width: 24px;
  height: 24px;
  padding: 6px;
  line-height: 12px;
  box-shadow: 0 0 10px #999;
  border: #549af9 solid 1px;
  border-radius: 50%;
  text-align: center;
  position: absolute;
  font-size: 10px;
  color: #fff;
  right: 13px;
  top: 10px;
}
._swiper{
    width: 100%;
    height: 100%;
}
.xcx_pic_list,.xcx_pic_item{
    height: 96px;
    filter: blur(15px);
    width: 100%;
    overflow: hidden;
}
.index_bg{
  position: fixed;
  width: 100%;
  height: 176px;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
}
.canvas{
  position: absolute;
  top: 700px;
}
</style>
