
import mqtt from './../../utils/mqtt.js';

//获取应用实例
const app = getApp();

Page({
  data: {
    client: null,
    topic: {
      CountTopic: '/iot/2187/count'
    },
    value: {
      Humdlogo: './../images/humd.png',
      HumdValue: 0,
      Templogo: './../images/temp.png',
      TempValue: 0,
      CountValue:10,
      WaitingCriteria:20
    },
    ButtonValue: [{
      ButtonName: '现在该去吃饭吗？',
      ButtonState: '不推荐'
    },
    {
      ButtonName: '我要提意见',
    }]
  },

  onLoad: function() {
    var that = this;
    this.data.client = app.globalData.client;

    console.log("on load");

    that.data.client.on('connect', that.ConnectCallback);
    that.data.client.on("message", that.MessageProcess);
    that.data.client.on("error", that.ConnectError);
    that.data.client.on("reconnect", that.ClientReconnect);
    that.data.client.on("offline", that.ClientOffline);
  },

  onShow: function() {
  },

  onHide: function() {
    console.log("on hide");
  },

  onUnload: function() {
    console.log("on unload");
    var that = this;
    that.data.client.end();
  },
  buttonFeedback: function(e) {
    var that = this;
    if(that.data.value.CountValue>10){
      that.setData({
        'ButtonValue[0].ButtonState': '需要',
      })
    }
    else{
      that.setData({
        'ButtonValue[0].ButtonState': '不需要',
      })
    }
  },
  showPopup() {
    var that = this;
    if(that.data.value.CountValue> 20){
      wx.showModal({
        title: '可恶',
        content: '目前在食堂就餐需要排队，推荐错峰用餐',
      });
    }
    else{
      wx.showModal({
        title: '好哎',
        content: '目前在食堂就餐不需要排队，推荐尽快就餐',
      });
    }
  },

  showEmail() {
      wx.showModal({
        title: '请投递至校园邮箱',
        content: 'limuyuan@shphschool.com',
      });
  },

  MessageProcess: function(topic, payload) {
    console.log('on message')
    var that = this;

    var payload_string = payload.toString();
      if (topic == that.data.topic.CountTopic) {
        that.setData({
          'value.CountValue': payload_string
        })
      }
  },

  ConnectCallback: function(connack) {
    var that = this;
    console.log("connect callback ");
    for (var v in that.data.topic) {
      that.data.client.subscribe(that.data.topic[v], {
        qos: 1
      },function(err){
        if(!err){
          console.log(that.data.topic[v])
          console.log('subscribe success')
        }
      }
      );
    }
  },

  ConnectError: function(error) {
    console.log(error)
  },

  ClientReconnect: function() {
    console.log("Client Reconnect")
  },

  ClientOffline: function() {
    console.log("Client Offline")
  }

})