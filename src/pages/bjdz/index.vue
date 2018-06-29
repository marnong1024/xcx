<template>
  <div class="bjdz">
  <div class="bj_box">
    <div class="bj_list">
   <p>姓名</p>
   <div class="bj_inp">
     <input placeholder="收货人姓名" :value="name" class="inp_ f_34" @input="bindKeyName"  type="text"/>
    </div>
  </div>
  <div class="bj_list">
   <p>手机号码</p>
    <div class="bj_inp">
     <input placeholder="快递员将以此联系您" :value="mobile" class="inp_ f_34" @input="bindKeyMobile"  type="number"/>
    </div>
  </div>
  <div class="bj_list">
   <p>地址</p>
   <div class="bj_inp">
       <picker @change="bindPickerChange"  mode = multiSelector
      :range="multiArray"
      :value = "multiIndex"
      :range-key ="'name'"
      @columnchange = "bindMultiPickerColumnChange"
       class="c_citys f_30">
          <span class="f_34 inp_" v-if="!addlist">选择地址</span>{{addlist}}</picker>
    </div>
  </div>
  <div class="bj_list">
   <p>详细地址</p>
    <div class="bj_inp">
     <input  placeholder="例如：xx街道，18号楼，1818室" :value="detail" class="inp_ f_34" @input="bindKeyDetail"  type="text"/>
    </div>
  </div>
  <div class="bj_list">
   <p>标签</p>
    <div class="bj_inp">
     <input class="inp_ f_34" placeholder="不超过两个字，例如：公司，家" :value="flag"  @input="bindKeyFlag"  type="text"/>
    </div>
  </div>
  </div>
   <div class="xcx_fixed">
     <button size="default" :disabled="disab" @click="submit" type="warn">保存
      </button>
  </div>
  </div>
</template>
<script>
import wx from '../../utils/wx';
import citys from '../../../static/citys/city.json'
export default {
  name: "HelloWorld",
  data() {
    return {
      name: null,
      multiIndex:[0,0],
      mobile:null,
      addlist:"",
      cityobj:null,
      detail:null,
      flag:null,
      addr:null,
      flag:null,
      disab:false,
      addr:null,
      multiArray: [
        [{id:"110000000000",name:"北京"}],
        [{id:"110000000000",name:"北京"}],
        [{id:"110000000000",name:"北京"}]
        ],
    };
  },
  computed: {
    address() {
      return {
      consignee: this.name,
      mobile:this.mobile,
      detail:this.detail,
      flag:this.flag,
      isDefault:true
      }
    }
  },
  methods:{
    bindKeyName(e){
      this.name = e.target.value;
    },
    bindKeyMobile(e){
      this.mobile = e.target.value;
    },
    bindKeyDetail(e){
      this.detail = e.target.value;
    },
    bindKeyFlag(e){
      this.flag = e.target.value;
    },
    ChoiceDz(){
     //wx.hrefTo("../ssdz/main")
    },
    bindPickerChange(e){
     var val = e.target.value;
     var county = citys.county[val[0]];
     var provinceId = county.id;
     var cityId = county.childs[val[1]].id;
     var sf = county.name;
     var cs = county.childs[val[1]].name;
     var jd = county.childs[val[1]].childs[val[2]].name;
     var countyId = county.childs[val[1]].childs[val[2]].id;
     this.addlist = sf+"-"+cs+"-"+jd;
     this.cityobj ={
       provinceId:provinceId,
       countyId:countyId,
       cityId:cityId
     }
    },
     bindMultiPickerColumnChange(e){
      var val = e.target.value;
      var col = e.target.column;
      var index1 = this.multiIndex[0]
      if(col==0){
      var data = citys.county[val].childs;
      var county = citys.county[val].childs[0].childs;
       this.multiIndex = [val,0,0]
        this.$set(this.multiArray,1,data)
      }else if(col==1){
        var county  = citys.county[index1].childs[val].childs;
        this.multiIndex = [index1,val,0];
      }if(col==2){
        this.multiIndex[2] = val
       return
      }
      this.$set(this.multiArray,2,county)
      
    },
    submit(){
      var citys = this.cityobj;
      var address = this.address;
      var data ={
        ...address,
        ...citys
      }
      data.userToken = this.$store.state.userToken;
          var Object = {
        url:wx.link.addrAdd,
        method:"POST",
        data:data
        }
      this.$http(Object).then(item=>{
        var item = item.data;
        if(item.code==0){
          wx.Toast("已保存")
          wx.navigateBack()
        }else{
          wx.Toast(item.desc)
        }
      })
    }
  },
  onUnload(){
    var data={ 
      name: null,
      mobile:null,
      detail:null,
      flag:null,
      addr:null
      };
      this.addlist = "";
      for(let i in data){
        this[i] = data[i]
      }
  },
  mounted(){
    var self = this;
    var id = this.$root.$mp.query.id;
      var arr = [];
    for(let i=0;i<citys.provs.length;i++){
      arr.push(citys.provs[i])
    }
     this.$set(this.multiArray,0,arr)
    if(id){
       this.disab = false;
      var data = {
        url: wx.link.addrGet,
        method: "POST",
        data: {
          userToken: this.$store.state.userToken,
          id:id
        }
      };
      this.$http(data)
        .then(res => {
          res = res.data.data;
          console.log(res)
          this.addrDetails =  res;
          this.addlist = res.provinceName+"-"+res.cityIdName+"-"+res.countyName;
          this.cityobj ={
            cityId:res.cityId,
            countyId:res.countyId,
            provinceId:res.provinceId
          }
          this.name =res.consignee;
          this.mobile =res.mobile;
          this.flag =res.flag;
          this.addr = res.addr;
          this.detail = res.detail;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style>
page{
  height: 100%;
}
.bjdz{
  position: relative;
  height: 100%;
  width: 100%;
}
.bj_box{
  padding: 10px 20px;
}
.bj_list{
  margin-bottom: 20px;
  border-bottom: 1px solid #c7c7c7;
}
.bj_inp{
  margin: 5px 0;
}
.bj_inp .inp_{
  color:#5a5a5a;
}
.bj_list p{
  height: 40px;
  line-height: 40px;
  font-size: 18px;
}
.xcx_fixed{
  position: absolute;
}
.xcx_fixed ._button {
  width:100%;
}
.c_citys{
  color: #5a5a5a;
}
</style>
