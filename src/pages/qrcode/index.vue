<template>
  <div class="qrcode">
    <canvas canvas-id="sharePic" class="sharePic" :style="{height:page_width*1.3+ 'px'}"></canvas>
    <button class="btn_pic" @click="getPic">保存图片</button>
  </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      qrcode:null
    };
  },
  computed:{
    userToken(){
      return this.$store.state.userToken
    },
    nickName(){
      return this.$store.state.userInfo.nickName
    },
    page_width(){
      return this.$store.state.windowWidth
     },
    miniPic(){
      return this.$store.state.miniPic
     },
    description(){
      return this.$store.state.description
    }
    
  },
  methods: {
    getPic(){
       wx.canvasToTempFilePath({
    canvasId: 'sharePic'
      }).then(res => {
        wx.saveImageToPhotosAlbum(res.tempFilePath).then(suc=>{
          wx.Toast("保存成功，快去朋友圈分享吧~")
        })
        }).catch(err=>{
          console.log(err)
        })
    },
    getQrCode(pic){
         var ctx = wx.createCanvasContext('sharePic');
         var w = this.page_width-12;
         var arr = [];
         var description = this.description;
         arr.push(description.substring(1,22))
         if(description.length>22){
         arr.push(description.substring(22,description.length))
         };
         //背景图
        wx.getImageInfo("https://www.e-carhome.com/qiche/car_h5/xcx/img/sharepic_bg.jpg").then(bg=>{
          console.log(bg.path)
          ctx.drawImage(bg.path, 0, 0, w, 1.38*w);
          wx.getImageInfo(pic).then(res=>{
          ctx.drawImage(res.path, w*.35, .65*w+70, w*.3, w*.3);
          ctx.setTextAlign('center')    // 文字居中
          ctx.textAlign="center"
          ctx.setFillStyle('#000000')  // 文字颜色：黑色
          ctx.setFontSize(20)         // 文字字号：12px
          ctx.fillText(this.nickName, w/2, 48);
          ctx.fillText("正在请求支援!", w/2, 78);
          wx.getImageInfo(this.miniPic).then(res=>{
          ctx.drawImage(res.path, w*.25, 93, w*.5, w*.38);
          ctx.setFontSize(14)
          ctx.setTextAlign('center') 
          ctx.textAlign="center"
          ctx.setFillStyle('#549af9')  
          ctx.fillText(arr[0], w/2, .65*w+35);
          if(description.length>22){
          ctx.fillText(arr[1], w/2, .65*w+55);
          }
          ctx.setFontSize(16)
          ctx.setFillStyle('#000000')
          ctx.fillText("长按扫码，为TA助力成长金币", w/2,w+90);
          ctx.stroke()
          ctx.draw()
          setTimeout(function(){
                  wx.hideLoading()
             },1000)
        })
        })
        })
        
        
    }
  },
  onShow() {
    wx.showLoading({
  title: '生成图片中',
    })
    var id = this.$root.$mp.query.id;
    var data = {
        url:wx.link.qrCode, 
        data: {
          userToken:this.userToken,
          memberWishCommodityId:id
        },
        method: "POST"
      };
    wx.request(data).then(res=>{
      res = res.data
      if(res.code==0){
        this.getQrCode(res.data)
      }else{
        wx.Toast(res.desc)
      }
    })
  }
};
</script>
<style>
page{
  width: 100%;
  height: 100%;
}
.qrcode{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 25px 12px;
  background-color: #549af9
}
.sharePic{
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 10px;
  background-color: #ffffff
}
.btn_pic{
color:#549af9;
width:60%;
border-radius:40rpx;
margin: 15px auto 30px;
}
</style>
