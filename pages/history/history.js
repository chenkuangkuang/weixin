//获取应用实例
const app = getApp()
var wxCharts = require('../../utils/wxcharts.js')
let timeObj={
  seconds: "00",
  minutes: "00",
  hours: "00"
}
let timerr, localObj;

Page({
  data: {
    motto: 'Hello  World',
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
    allLength:'',
    allLengthShow:true
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
    console.log("localObj", localObj);
    let dateArr = [], chartData=[], tableData=[];
    localObj.map(i=>{
      let dateIndex = dateArr.indexOf(i.date);
      let curLen = this.time2len(i.length);
      let tableItem = {...i};
      if(dateIndex==-1){
        dateArr.push(i.date);
        chartData.push(curLen);
      }else{
        chartData[dateIndex] += curLen;
        tableItem['date'] = '';
      }
      tableData.push(tableItem)
    })
    console.log("dateArr", dateArr, chartData);
    this.setData({
      arry: tableData
    })
    this.checkAllLength();

    let windowWidth = wx.getSystemInfoSync().windowWidth
    console.log(windowWidth)
    new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      animation: true,
      categories: dateArr,
      background: '#f5f5f5',
      series: [{
        name: '打卡时长',
        data: chartData,
        format: function (val, name) {
          return val.toFixed(2) + 'min';
        }
      }],
      xAxis: {
        disableGrid: true
      },
      yAxis: {
        title: '单日打卡时长 (秒)',
        format: function (val) {
          return val.toFixed(0);
        },
        min: 0
      },
      width: windowWidth,
      height: 200,
      dataLabel: false,
      dataPointShape: true,
      extra: {
        lineStyle: 'curve'
      }
    });

  },
  toggleAllLength:function(){
    this.setData({
      allLengthShow: !this.data.allLengthShow
    })
  },
  backHome:function(){
    wx.navigateTo({ 
      url: '../index/index'
    })
  },
  // 将时间格式00:00:05 转换为秒数
  time2len:function(timeStr){
    let timeArr = timeStr.split(":");
    let len = parseInt(timeArr[0]*60*60 + timeArr[1]*60 + timeArr[2]);
    return len;
  },
  checkAllLength:function(){
    let arr = this.data.arry, len=0, hours=0, minutes=0, seconds=0;
    console.log(arr)
    for(var i=0;i<arr.length;i++){
      //时钟、分钟、秒钟分别相加
      let curLen = this.time2len(arr[i].length);
      len += curLen;
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
})
