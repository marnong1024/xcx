<template>
  <div class="dizhi" v-if="cont">
    <div class="" @click="tolink">
      <div class="dz_item" v-if="receAddr">
        <div class="dz_left" >
          <div class="dz_delete"><span class="icon icon-dizhi f_42"></span></div>
          <div class="dz_cont">
          <p class="f_34"><span class="pb_score" v-if="receAddr.flag">{{receAddr.flag}}</span>{{receAddr.addr}}</p>
          <p class="f_30 clor_z">{{receAddr.consignee}}{{receAddr.mobile}}</p>
          </div>
        </div>
        <div class="dz_right"><span class="icon icon-right f_30"></span></div>
      </div>
        <div v-if="!receAddr">
          <p class="add_dz f_30 clor_z"><span class="icon icon-add f_30"></span>添加收货地址</p>
        </div>  
    </div>
    <p class="border_solid"></p>
     <div class="article">
          <div class="dd_list" v-if="cont">
            <div class="dd_item">
                <div class="dd_cont f_30">
                <p class="dd_detail dd_cell">{{cont.commodityName}}<span class="dd_num">x{{num}}</span>
                    <span class="item_price">￥0</span>
                </p>
                </div>
            </div>
            <div class="dd_item">
                <div class="dd_cont f_30">
                <p class="dd_detail">服务费<span class="dd_num">（以免服务费）</span>
                    <span class="item_price">￥0</span>
                </p>
                </div>
            </div>
            <div class="dd_item">
                <div class="dd_cont f_30">
                <p class="dd_detail"><span class="dd_num">总计￥0</span>
                    <span class="item_price">还需支付￥0</span>
                </p>
                </div>
            </div>
          </div>
      </div>
      <div class="dd_item">
                <div class="dd_cont f_30">
                <div class="remark p_12">
                   <span class="remark_title">备注</span>
                </div>
                </div>
      </div>          
                 <div class="tex_box">
                   <textarea  @input="remarkFun" cursor-spacing=“5px” placeholder="对快递员哥哥说的话" maxlength="50" class="texta f_30"></textarea>
                   </div>
    <div class="xcx_fixed">
      <button @click="go_btn" class="xcx_ps" >点击配送</button>
    </div>
  </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
      cont: null,
      num: null,
      receAddr: null,
      remark:"",
      acType:null,
      activityId:null,
      receAddrId:null
    };
  },
  computed:{
    Fdata(){
      return {
        userToken:this.userToken,
        activityId:this.activityId,
        receAddrId:this.receAddrId,
        num:this.num,
        type:this.acType,
        remark:this.remark
      }
    },
    userToken(){
      return this.$store.state.userToken
    }
  },
  methods: {
    tolink() {
      var url = "../xzdz/main";
      wx.hrefTo(url);
    },
    remarkFun(e) {
      this.remark = e.target.value;
    },
    go_btn(){
     var data  = {
       url:wx.link.submitDistribution,
       method: "POST",
       data:this.Fdata
     }
     this.$http(data).then(res=>{
        res = res.data;
        if(res.code==0){
          wx.Toast("提交成功")
          setTimeout(()=>{
           wx.switchTab("../kafeiku/main")
          },2000)
        }else{
          wx.Toast(res.desc)
        }
     }).catch(err=>{
       console.log(err)
     })
    }
  },
  onShow() {
    this.activityId = this.$root.$mp.query.activityId;
     this.num = this.$root.$mp.query.num;
     this.acType = this.$root.$mp.query.type;
        var data = {
          url: wx.link.reposDetail,
          method: "POST",
          data: {
            userToken: this.userToken,
            activityId: this.activityId,
            num: this.num,
            type:this.acType
          }
        };
        this.$http(data)
          .then(res => {
            res = res.data;
            if (res.code == 0) {
              var receAddr = this.$store.state.receAddr;
              this.cont = res.data;
              //this.num = res.data.num;
              this.activityId = res.data.activityId;
              if (res.data.receAddr) {
                this.receAddr = receAddr ? receAddr : res.data.receAddr;
                this.receAddrId = this.receAddr.id;
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
  }
};
</script>

<style scoped>
.dz_left {
  flex: 30;
  overflow: hidden;
}
.dz_right {
  flex: 3;
  text-align: center;
  position: relative;
}
.dz_item {
  display: flex;
  padding-left: 20px;
  padding-bottom: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #d5d5d5;
}
.dz_cont {
  width: 90%;
  margin: 0 auto;
  line-height: 25px;
  color: #333333;
}
.dz_cont p {
  width: 100%;
  height: 25px;
  overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
}
.dz_right {
  line-height: 50px;
  vertical-align: top;
  padding-right: 20px;
  text-align: right;
}
.dz_delete,
.dz_cont {
  display: inline-block;
  height: 50px;
}
.icon-dizhi {
  line-height: 50px;
}
.pb_score {
  padding: 0 4px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  font-size: 12px;
  border-radius: 4px;
  color: #fff;
  background: #549af9;
}
.dz_delete {
  width:8%;
  position: relative;
  vertical-align: top;
}
.img_del,
.img_left {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.img_left {
  right: 20px;
}
.article {
  padding: 12px;
  background-color: #f5f5f5;
}
.dd_list {
  background-color: #fff;
  border-radius: 5px;
}
.dd_item {
  padding: 15px 10px;
  border-bottom: 1px solid #f3f3f3;
}
.dd_detail {
  position: relative;
}
.dd_cell {
  margin-bottom: 10px;
}
.icon-add {
  margin-right: 3px;
}
.dd_num {
  color: #878787;
}
.item_price {
  position: absolute;
  right: 0;
}
.p_12 {
  padding: 0 12px;
}
.add_dz {
  height: 50px;
  line-height: 50px;
  text-align: center;
  margin-top: 5px;
}
.add_dz .icon {
  color: #549af9;
}
.border_solid {
  background: url("../../../static/img/border_solid.png");
  background-size: 14px 2px;
  height: 2px;
}
.xcx_ps {
  width: 100%;
  background:#549af9;
  color: #fff;
}
.remark {
  display: block;
}
.tex_box {
  padding: 20px;
  box-sizing: border-box;
}
.texta {
  width: 100%;
}
</style>
