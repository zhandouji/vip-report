/**
 * 通用消息处理
 * Created by zhangyabing on 2018/5/28.
 */
// 全局参数
var GLOBAL = {
  // stomp的websocket连接是否已经ok
  stompConnected: false,
  // PubSub组件中订阅的列表
  subscribeListForPubSub: {},
  // mq中订阅的列表
  subscribeListForMq: {}
}

// 取消所有订阅
PubSub.clearAllSubscriptions();

// stomp连接后执行动作
skynetSocket.afterConnect = function (frame) {
  GLOBAL.stompConnected = true;
  GLOBAL.subscribePersonMessage();
  // 发布stomp连接事件
  PubSub.publish(EVENT.STOMP_CONNCETED, frame);
}

// stomp断连后执行动作
skynetSocket.afterDisConnect = function (frame) {
  GLOBAL.stompConnected = false;
}

/**
 * 订阅个人消息
 */
GLOBAL.subscribePersonMessage = function () {
    var headers = {
      'activemq.retroactive': 'true'
    };
    var destination = "/queue/PERSON";
    skynetSocket.subscribe(destination, function (m) {
      console.log("订阅个人消息<<<<<<<：%o", m);
      var body;
      try {
        body = JSON.parse(m.body);
      } catch (e) {
        console.error("解析个人消息异常：%s", m.body);
        return;
      }
      if (!body) {
        return;
      }
      // 发布消息事件
      PubSub.publish(body.event, body);
    }, headers);
}

/**
 * 对PubSub中订阅方法的封装
 * @param eventName
 * @param funName
 */
GLOBAL.subscribeToPubSub = function (eventName, funName) {
  // 如果有订阅，则不再重复订阅
  if (GLOBAL.subscribeListForPubSub[eventName]) {
    return;
  }
  // 订阅
  var subscribeId = PubSub.subscribe(eventName, funName);
  // 存储订阅事件和订阅标识
  GLOBAL.subscribeListForPubSub[eventName] = subscribeId;
}

/**
 * 对PubSub中取消订阅方法的封装
 * @param eventName
 */
GLOBAL.unSubscribeFromPubSub = function (eventName) {
  // 如果有订阅，则不再重复订阅
  if (!GLOBAL.subscribeListForPubSub[eventName]) {
    return;
  }
  // 订阅标识
  var subscribeId = GLOBAL.subscribeListForPubSub[eventName];
  delete GLOBAL.subscribeListForPubSub[eventName];
  PubSub.unsubscribe(subscribeId);
}

/**
 * 对PubSub中所有订阅方法的封装
 */
GLOBAL.unSubscribeAllFromPubSub = function () {
  GLOBAL.subscribeListForPubSub = {};
  // 取消所有订阅
  PubSub.clearAllSubscriptions();
}

/**
 * 对mq中的订阅方法的封装
 * @param eventName
 * @param funName
 */
GLOBAL.subscribeToMq = function (eventName, funName) {
  // 如果有订阅，则不再重复订阅
  if (GLOBAL.subscribeListForMq[eventName]) {
    return;
  }
  var headers = {
    'activemq.retroactive': 'true'
  };
  // 订阅
  var subscribeId = skynetSocket.subscribe(eventName, funName, headers);
  // 存储订阅事件和订阅标识
  GLOBAL.subscribeListForMq[eventName] = subscribeId;
}

/**
 * 对Mq中取消订阅方法的封装
 * @param eventName
 */
GLOBAL.unSubscribeFromMq = function (eventName) {
  // 如果有订阅，则不再重复订阅
  if (!GLOBAL.subscribeListForMq[eventName]) {
    return;
  }
  // 订阅标识
  var subscribeId = GLOBAL.subscribeListForMq[eventName];
  delete GLOBAL.subscribeListForMq[eventName];
  // 取消订阅
  if (subscribeId) {
    subscribeId.unsubscribe();
  }
}

/**
 * 对Mq中所有订阅方法的封装
 */
GLOBAL.unSubscribeAllFromMq = function () {
  var subscribeList = GLOBAL.subscribeListForMq;
  for (name in subscribeList) {
    if (subscribeList.hasOwnProperty(name)) {
      try {
        subscribeList[name].unsubscribe();
      } catch (e) {
        console.error(e);
      }
    }
  }
  GLOBAL.subscribeListForMq = {};
}

/**
 * 取消所有订阅
 */
GLOBAL.unSubscribeAll = function () {
  GLOBAL.unSubscribeAllFromPubSub();
  GLOBAL.unSubscribeAllFromMq();
}