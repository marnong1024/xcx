<script>
import wx from './utils/wx'
export default {
  created () {
    this.$store.state.windowWidth = wx.getSystemInfoSync().windowWidth  
    if(this.$store.state.loginState){
      this.$login()
  }
  }
}
</script>
<style>
@import '../static/css/xcx_icon.css';
</style>
