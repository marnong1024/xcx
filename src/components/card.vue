<template>
  <div id="share" :class="{share_show:share_show}">
   <div class="share_model" v-if="share_show" @click="$emit('share')"></div>
   <div class="share_list">
     <div class="s_head f_28">
      <div class="share_link">
          <button class="share_icon" open-type="share">
            <image class="share_img" src="https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_wechat.png"></image>
            </button>
        <p>分享给好友</p>
      </div>
      <div class="share_link">
          <button class="share_icon" @click.stop="$emit('share_pyq')">
            <image class="share_img" src="https://www.e-carhome.com/qiche/car_h5/xcx/img/icon_pyq.png"></image>
            </button>
        <p>分享朋友圈</p>
      </div>
      </div>
      <span class="s_sub icon icon-close"  @click="$emit('share')"></span>
   </div>
  </div>
</template>
<script>
export default {
  props: ['share_show']
}
</script>

<style>
#share{
  height: 100%;
  width: 100%;
}
.share_model{
  position: absolute;
     top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
}
.share_list{
  position: absolute;
  width: 100%;
  background-color: #fff;
  z-index: 999999;
  height: 180px;
  bottom: -180px;
  transition: all .2s;
}
.share_show .share_list{
 bottom: 0
}
.share_img{
  width: 100%;
  height: 100%;
}
.s_head{
  display: flex;
  width: 100%;
  height: 90px;
  margin-top: 40px;
  text-align: center;
  color: #000000
}
.share_link{
  flex: 1;
}
.share_icon{
  display: block;
  margin: 0 auto 7.5px;
  padding: 0;
  width: 60px;
  height: 60px;
  box-sizing: border-box;
  background: transparent;
}
.share_icon::after{
border: none;
}
.share_pic{
  flex: 1;
}
.s_sub{
  display: block;
  position: absolute;
  right: 0;
  top: 10px;
  width: 35px;
  height: 35px;
  font-size: 20px;
  color: #ccc;
}
</style>
