<template>
 <div class="xyjl">
   <div class="tab_list f_30">
    <span :class="{c_blue:active==index}" v-for="(list,index) in tab" :key="index" @click="tab_f(index)">{{list.name}}
      <em class="tab_solid"></em>
    </span>
   </div>
   <div class="tab_box">
    <div class="tab_item" v-if="active==0">
      <div class="tab_cont f_30" @click="WishListFun(item.id)" v-for="(item,index) in myWishList" :key="index">
        <p><span class="tab_info f_w">{{item.commodityName}}</span><span class="tab_state c_blue">
          <em v-if="item.state==1">进行中</em>
           <em v-if="item.state==2">已完成</em>
            <em v-if="item.state==3">已过期</em>
          </span></p>
        <p><span class="clor_f">{{item.createTimeStr}}</span></p>
        <p class="avatar"><span v-if="item.avatar" class="item_avatar"><img :src="item.avatar" alt=""></span><span class="sub_num clor_f">{{item.carCurrency}}/{{item.totalHelpNum}}</span></p>
      </div>
    </div>
    <div class="tab_item" v-if="active==1">
        <div class="tab_cont f_30" @click="WishHelpListFun(item.id)" v-for="(item,index) in myWishHelpList" :key="index">
          <div class="tab_cont_flex">
                <div class="tab_cont_pic">
                  <span class="item_avatar"><img :src="item.avatar" alt=""></span>
                </div>
                <div class="tab_cont_info">
                  <p class=""><span class="tab_info f_w">{{item.memberName}}</span></p>
                  <p><span class="clor_f">{{item.createTimeStr}}</span></p>
                </div>
                <span class="tab_cont_num f_34">{{item.carCurrency}}金币</span>
          </div>
        </div>
    </div>
   </div>
 </div>
</template>

<script>
import wx from "../../utils/wx";
export default {
  data() {
    return {
    tab:[{name:"心愿记录"},{name:"赠与记录"}],
    active:0,
    myWishHelpList:null,
    myWishList:null
    };
  },
  computed:{
    userToken(){
      return this.$store.state.userToken
    }
  },
  methods:{
     tab_f(index){
     this.active = index;
     if(!this.myWishHelpList&&this.active==1){
       this.getData(wx.link.myWishHelpList)
     }
     },
     WishListFun(a){
      wx.hrefTo("../xyjl/main?id="+a)
     },
     WishHelpListFun(a){
      wx.hrefTo("../zyjl/main?id="+a)
     },
     getData(url){
       var data = {
        url:url, 
        data: {
          userToken: this.userToken,
          pageNo:1,
          pageSize:30
        },
        method: "POST"
      };
        wx.request(data).then(res=>{
        res = res.data;
        if(res.code==0){
          if(this.active==0){
            this.myWishList = res.pageData;
            }else{
             this.myWishHelpList = res.pageData
            }
        }
      });
     }
  },
  onShow(){
      var index = this.active;
      var url = index==0?wx.link.myWishList:wx.link.myWishHelpList;
      this.getData(url)
  }
};
</script>

<style>
page{
  height: 100%;
}
.xyjl{
  position: relative;
  height: 100%;
}
.tab_list{
  position: absolute;
  display: flex;
  width: 100%;
  height: 50px;
  line-height: 50px;
}
.c_blue{
  color: #549af9;
}
.tab_solid{
  position: absolute;
  left: 80px;
  width: 25px;
  height: 3px;
  bottom: 1px;
  box-sizing: border-box;
  display: none;
  border-bottom: 2px solid #549af9;
} 
.c_blue .tab_solid{
  display: block;
  }
.tab_list span{
  flex: 1;
  text-align: center;
  position: relative;
}
.tab_box{
  display: block;
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  top: 50px;
   overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  bottom: 0
}
.tab_item{
  margin:  12px 8px 0 
}
.tab_cont {
    margin-top: 10px;
    padding: 14px 15px;
    box-shadow: 0px -5px 6px -4px rgba(0, 0, 0, 0.16),0px 5px 9px -4px rgba(0, 0, 0, 0.16);
    border-radius:10px;
}
.item_avatar{
  display: block;
  box-sizing:border-box;
  width:36px;
  height:36px;
  border:1px solid #cccccc;
  overflow: hidden;
  border-radius:50%;
}
.avatar{
  height: 36px;
  position: relative;
}
.item_avatar img{
  display: block;
  width: 100%;
  height: 100%;
}
.tab_cont p{
  display: flex;
  line-height: 25px;
}
.tab_info{
  flex: 27
}
.sub_num{
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%)
}
.tab_state{
  flex: 6
}
.tab_cont_flex{
  display: flex;
  position: relative;
}
.tab_cont_num{
  position: absolute;
  top: 50%;
  color: #969696; 
  right: 0;
  transform: translateY(-50%)
}
.tab_cont_pic{
  flex: 1;
  padding-top: 5px;
}
.tab_cont_info{
  flex: 6
}
.tab_info{
  width: 100%;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap
}
</style>

