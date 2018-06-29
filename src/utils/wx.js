
/**
     *
     * 微信API配置
     */
//wx请求
//Promise为专门的异步方法,参数resolve为异步接收方法，只有在res获取成功以后resolve才会执行
var linkstar = "https://www.e-carhome.com/car-wxa/";
export const request = obj => new Promise((resolve, reject) => {
  wx.request({
    url: obj.url,
    data: obj.data,
    header: { 'content-type': 'application/x-www-form-urlencoded', ...obj.header },
    method: obj.method,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})
export const getSetting = (theKey, theValue) => new Promise((resolve, reject) => {
  wx.getSetting({
    key: theKey,
    data: theValue,
    success() {
      resolve()
    },
    fail(e) {
      reject(e)
    }
  })
})
//wx用户信息
export const getUserInfo = (obj) => new Promise((resolve, reject) => {
  wx.getUserInfo({
    ...obj,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})
//支付
export const requestPayment = (obj) => new Promise((resolve, reject) => {
  wx.requestPayment({
    ...obj,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})

export const uploadFile = (obj) => new Promise((resolve, reject) => {
  wx.uploadFile({
    url: obj.url, //仅为示例，非真实的接口地址
    filePath: obj.filePath,
    name: 'picFile',
    formData:obj.formData,
    success: function(res){
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})
export const login = () => new Promise((resolve, reject) => {
  wx.login({
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})

export const setStorage = (theKey, theValue) => new Promise((resolve, reject) => {
  wx.setStorage({
    key: theKey,
    data: theValue,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})

export const getLocation = theKey => new Promise((resolve, reject) => {
  wx.getLocation({
    key: theKey,
    type: 'gcj02',
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  })
})
export const getStorage = theKey => new Promise((resolve, reject) => {
  wx.getStorage({
    key: theKey,
    success(res) {
      resolve(res.data)
    },
    fail(e) {
      reject(e)
    }
  })
})
export const chooseImage = () => new Promise((resolve, reject) => {
  wx.chooseImage({  
    count:1,
    sizeType:"compressed",
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  });
})

export const previewImage = (str) => new Promise((resolve, reject) => {
  wx.previewImage({  
    urls:[str],
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  });
})
export const saveImageToPhotosAlbum = (str) => new Promise((resolve, reject) => {
  wx.saveImageToPhotosAlbum({
    filePath:str,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  });
})
export const canvasToTempFilePath = (obj) => new Promise((resolve, reject) => {
  wx.canvasToTempFilePath({  
    ...obj,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  });
})
export const getImageInfo =  (str) => new Promise((resolve, reject) => {
  wx.getImageInfo({  
    src: str,
    success(res) {
      resolve(res)
    },
    fail(e) {
      reject(e)
    }
  });
})
export const switchTab = (str) => {
  wx.switchTab({  
    url: str  
  });
}  
export const redirectTo = (str) => {
  wx.redirectTo({  
    url: str  
  });
}
export const createCanvasContext = (a) => {
  return wx.createCanvasContext(a);
}
export const alert = (obj) => {
  wx.showModal({
    ...obj,
    showCancel: true
  })
}
export const getSystemInfoSync = () => {
  return wx.getSystemInfoSync()
}
export const showLoading = (obj)=>{
  wx.showLoading({
    ...obj,
    showCancel: true
  })
}
export const hideLoading = ()=>{
  wx.hideLoading()
}
export const hrefTo = (str) => {
  wx.navigateTo({
    url: str
  })
}
export const navigateBack = (num) => {
  wx.navigateBack({
    Number:num
  })
}
export const openSetting = (obj) => {
  wx.openSetting({})
}

export const reLaunch = (str) => {
  wx.reLaunch({
    url: str,
    success: (res) => {
      console.log(res)
    },fail: (err) => {
      console.log(err)
    }
  })
}
export const Toast = (content) => {
  wx.showToast({
    title: content,
    icon: "none",
    duration: 1500
  })
}
export const link = {
  login: linkstar + "member/third/login.do",
  orderSubm: linkstar + "order/submit.do",
  orderList: linkstar + "order/list.do",
  verifyCode:linkstar+"verifyCode/sms.do",
  repository:linkstar+"repository/list.do",
  reposDetail:linkstar+"repository/detail.do",
  addrList:linkstar+"member/addr/list.do",
  addrDel:linkstar+"member/addr/del.do",
  addrAdd:linkstar+"member/addr/add.do",
  groupBuy:linkstar+"groupBuy/data.do",
  groupDetail:linkstar+"groupBuy/detail.do",
  distributionList:linkstar+"repository/distributionList.do",
  addrGet:linkstar+"member/addr/get.do",
  spellDetail:linkstar+"groupBuy/spellDetailByApplyId.do",
  submitDistribution:linkstar+"repository/submitDistribution.do",
  oCancel:linkstar+"order/cancel.do",
  payByWait:linkstar+"order/payByWait.do",
  confirmPay:linkstar+"order/confirmPay.do",
  distributionTraces:linkstar+"repository/distributionTraces.do",
  wishList:linkstar+"wish/list.do",
  wishSubmit:linkstar+"wish/submit.do",
  memberWishDetail:linkstar+"wish/memberWishDetail.do",
  wishHelp:linkstar+"wish/help.do",
  groupBuySearch:linkstar+"groupBuy/search.do",
  receive:linkstar+"repository/receive.do",
  myWishList:linkstar+"wish/myWishList.do",
  myWishHelpList:linkstar+"wish/myWishHelpList.do",
  qrCode:linkstar+"wish/qrCode.do",
  wishHelpDetail:linkstar+"wish/wishHelpDetail.do",
  submitHelpDesc:linkstar+"wish/submitHelpDesc.do",
  wishHelp:linkstar+"wish/help.do",
  rule:linkstar+"wish/rule.do",
  cancelPay:linkstar+"wish/cancelPay.do",
  extract:linkstar+"wish/extract.do",
  canExtractList:linkstar+"/wish/canExtractList.do"

}
export default {
  request,
  getSetting,
  getSystemInfoSync,
  alert,
  showLoading,
  hideLoading,
  requestPayment,
  Toast,
  canvasToTempFilePath,
  chooseImage,
  getImageInfo,
  previewImage,
  createCanvasContext,
  saveImageToPhotosAlbum,
  uploadFile,
  switchTab,
  hrefTo,
  redirectTo,
  getLocation,
  getUserInfo,
  openSetting,
  setStorage,
  getStorage,
  reLaunch,
  navigateBack,
  login,
  link
}
