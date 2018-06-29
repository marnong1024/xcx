<template>
<div class="dz">
  <div class="dz-box" v-if="pageData">
    <div class="dz_bar">
      <span class="bar_title">我的地址</span><span v-if="pageData" @click="dz_edit" class="bar_state">{{edit_state}}</span>
    </div>
    <div class="dz_list">
      <div class="dz_item" v-for="(list,index) in pageData" :key="index">
        <div class="dz_left" @click="xzdd_fun(list)">
          <div class="dz_delete" @click.stop="dz_delete(list,index)" v-if = "!edit"  >
            <span class=" f_34 icon icon-jinzhi"></span>
          </div>
          <div class="dz_cont">
          <p class="t_f f_30"><span class="pb_score">{{list.flag}}</span>{{list.addr}}</p>
          <p class="f_28 clor_z">{{list.consignee}}{{list.mobile}}</p>
          </div>
        </div>
        <div  v-show = "!edit" class="dz_right"><span @click="addr(list)">更改</span></div>
      </div>
    </div>
  </div>
  <div v-if="!pageData" class="none">
          <span class="icon icon-ditu"></span>
          <span class="none_title f_34">还没有地址噢，去新增一个吧~</span>
        </div>
  <div class="xcx_fixed">
     <button size="default" @click="addr" type="warn">新增收货地址
      </button>
  </div>
  </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
  name: "HelloWorld",
  data() {
    return {
      edit_state: "编辑",
      edit:true,
      pageData: null
    };
  },
  methods:{
    xzdd_fun(e){
        console.log(e)
        this.$store.state.receAddr = e;
        wx.navigateBack()
    },
    dz_edit(){
      var edit = this.edit;
      this.edit = edit?false:true;
      this.edit_state = edit?"完成":"编辑"
    },
    addr(l){
      var url = "../bjdz/main";
     url =  l.id?url+"?id="+l.id:url;
     console.log(url)
      wx.hrefTo(url);
    },
    dz_delete(l,d){
      var data = {
        url: wx.link.addrDel,
        method: "POST",
        data : {
        userToken:this.userToken,
        id:l.id
      }};
      this.$http(data)
        .then(res => {
          res = res.data;
          if(res.code==0){
            console.log(res)
            this.$delete(this.pageData,d)
            wx.Toast("删除成功")
          };
        })
        .catch(err => {
          console.log(err);
        });


    }
  },
  onShow(){
    this.edit = true;
    this.edit_state = "编辑"
    var activityId = this.$root.$mp.query.activityId;
    var num = this.$root.$mp.query.num;
      var data = {
        url: wx.link.addrList,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
          pageNo: 1,
          pageSize:30
        }
      };
      this.$http(data)
        .then(res => {
          res = res.data;
          if(res.code==0){
            if(res.pageData.length>0){
           this.pageData = res.pageData;
            }
            
          };
        })
        .catch(err => {
          console.log(err);
        });
  }
};
</script>
<style scoped>
.dz-box {
  padding-left: 20px;
  box-sizing: border-box;
}
.dz_bar {
  display: flex;
  height: 50px;
  line-height: 50px;
}
.dz_bar .bar_title,
.dz_left {
  flex: 11;
}
.dz_left{
  overflow: hidden;
}
.dz_bar .bar_state,
.dz_right {
  flex: 3;
  text-align: center;
  color: #c22121;
}
.icon-jinzhi{
  color: #c22121
}
.dz_item {
  display: flex;
  padding: 10px 0 15px;
  border-bottom: 1px solid #d5d5d5;
}
.dz_cont {
  width: 90%;
  line-height: 25px;
}
.dz_cont p{
  height: 25px;
}
.dz_cont .t_f{
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.dz_right {
  line-height: 50px;
  vertical-align: top;
}
.dz_delete,
.dz_cont {
  display: inline-block;
  height: 50px;
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
  width: 25px;
  line-height: 50px;
  position: relative;
  vertical-align: top;
}
.xcx_fixed ._button {
  width:100%;
}

</style>
