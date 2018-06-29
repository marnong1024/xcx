<template>
  <div class="explain" v-if="rule" >
   <h1 class="f_42 f_w">{{rule.title}}</h1>
   <div class="rules">
      <p class="f_w" v-for="(list,index) in rule.rules" :key="index">{{index+1}}、{{list}}</p>
   </div>
  
  </div>
</template>

<script>
export default {
  data() {
    return {
     rule:null
    }
  },
  onLoad() {
    console.log(111)
        var obj = {
          url:this.$links.rule,
          method:"POST",
        }
       this.$http(obj).then(res => {
            res = res.data;
          if(res.code==0){
            this.rule = res.data
          }else{
          }
        }).catch(err => {
          console.log(err);
        });
  }
};
</script>

<style>
.explain{
  padding: 30px 20px 0
}
.explain h1{
  line-height: 21px;
}
.explain .rules{
  margin-top: 12px;
  overflow: hidden;
}
.explain .rules p{
    font-size: 16px;
    line-height: 24px;
    color: #333;
    text-align: justify;
    margin-top: 12px;
}

</style>
