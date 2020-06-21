//index.js
//获取应用实例
const app = getApp()
import formatTime from '../../utils/util.js'
let timeObj={
  seconds: "00",
  minutes: "00",
  hours: "00"
}
let timerr, localObj;

Page({
  data: {
    motto: 'Hello666  World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array : [1, 2, 3],
    index:0,
    curTime:'',
    timerStatus:'开始',
    hasBegin:false,
    begin:"",
    end:"",
    date:"",
    arry:[
    ],
    hisShow:false,
    allLength:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // wx.setStorageSync("kuangkuang_timerobj", null)
    if (wx.getStorageSync("kuangkuang_timerobj")){
      localObj = JSON.parse(wx.getStorageSync("kuangkuang_timerobj"));
    }else{
      localObj = []
    }
    this.setData({
      arry: localObj
    })

    console.log("motto=" + this.data.motto)
    console.log(formatTime.formatTime(new Date))

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      curTime: timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds
    })

    console.log("---" + formatTime.formatTime(new Date).split(" ")[1].substring(0,5))
    console.log("===" + formatTime.formatTime(new Date).split(" ")[0].substring(5))
    // window.document.addEventListener("click", function(){
    //   console.log("click!!!")
    // })
    console.log(this.checkAllLength())
    // document.getElementById("target").onclick()
    
  },
  checkAllLength:function(){
    let arr = this.data.arry, len=0, hours=0, minutes=0, seconds=0;
    console.log(arr)
    for(var i=0;i<arr.length;i++){
      let timeSource = arr[i].length;
      let timeArr = timeSource.split(":");
      console.log(timeArr)
      //时钟、分钟、秒钟分别相加
      len += parseInt(timeArr[0]*60*60 + timeArr[1]*60 + timeArr[2]);
    }
    console.log("合计秒："+len);
    //hours/minutes/seconds合计时间
    len = this.formatSeconds(len)
    console.log("合计时间：" + len);
    this.setData({
      allLength: len
    })
    return len;
  },
  formatSeconds : function(value) {
    var theTime = parseInt(value);// 秒 
    var theTime1 = 0;// 分 
    var theTime2 = 0;// 小时 
    // alert(theTime); 
    if(theTime > 60) {
      theTime1 = parseInt(theTime / 60);
      theTime = parseInt(theTime % 60);
      // alert(theTime1+"-"+theTime); 
      if (theTime1 > 60) {
        theTime2 = parseInt(theTime1 / 60);
        theTime1 = parseInt(theTime1 % 60);
      }
    }
    var result = "" + parseInt(theTime) + "秒";
    if (theTime1 > 0) {
      result = "" + parseInt(theTime1) + "分" + result;
    }
    if (theTime2 > 0) {
      result = "" + parseInt(theTime2) + "小时:" + result;
    }
    return result; 
  },
  outbtn:function(e){
    console.log(e);
    if(e.target.offsetTop<300){
      this.setData({
        hisShow: false
      })
    }
  },
  inbtn: function () {
    console.log("in btn")
  },
  startStopTimer(){
    let targetStatus;
    if(!this.data.hasBegin){
      this.setData({
        hasBegin: true,
        begin: formatTime.formatTime(new Date).split(" ")[1].substring(0, 5)
      })
    }
    if (this.data.timerStatus=="开始" || this.data.timerStatus=="继续"){
      timerr = setInterval(this.timer, 1000)
      targetStatus = "暂停";
    }else{
      clearInterval(timerr);
      targetStatus = this.data.hasBegin ? "继续" : "开始";
    }
    console.log(this.data.timerStatus);
    this.setData({
      timerStatus: targetStatus,
    })
  },
  overTimer() {
    //localStorage储存开始时间、结束时间、持续时间
    let obj = {
      begin:this.data.begin,
      end: formatTime.formatTime(new Date).split(" ")[1].substring(0, 5),
      length: this.data.curTime,
      date: formatTime.formatTime(new Date).split(" ")[0].substring(5)
    }
    localObj.push(obj);

    wx.setStorageSync('kuangkuang_timerobj', JSON.stringify(localObj))
    timeObj = {
      seconds: "00",
      minutes: "00",
      hours: "00"
    }
    clearInterval(timerr);
    this.setData({
      timerStatus:"开始",
      hasBegin:false,
      curTime: timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds,
      end: obj.end,
      arry: localObj
    })
    this.checkAllLength()
  },
  timer:function(e){
    timeObj.seconds++;
    if (timeObj.seconds>60){
      timeObj.minutes++;
      timeObj.seconds = 1;
    }
    if (timeObj.minutes > 60) {
      timeObj.hours ++;
      timeObj.minutes = 1;
    }
    timeObj.hours = this.checkFomter(timeObj.hours);
    timeObj.minutes = this.checkFomter(timeObj.minutes);
    timeObj.seconds = this.checkFomter(timeObj.seconds);
    this.setData({
      curTime : timeObj.hours + ":" + timeObj.minutes + ":" + timeObj.seconds
    })
    
  },
  checkFomter(num, type){
    num = num+"";
    // console.log(num.length)
    if(type=="toString" || true){
      return num < 10 && num.length < 2 ? "0" + num : num;
    }
      
    if(type=="toNum"){
      return num < 10 ? "0" + num : num;
    }
  },
  showHis:function(){
    this.setData({
      hisShow:true
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
