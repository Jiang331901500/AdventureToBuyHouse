# Interface
## playerInfo
### request
```javascript
data = {
    mode : "auto" // auto - 自动模式; Manual - 手动模式
    name : "JJ",
    age : 25,
    gener : "male",
    career : {
        name : "程序员",
        salary : 20000
    }
};
```
### response
```javascript
data = {
    request_result : "ok", // failed
    message : "" // 请求失败时返回的提示
};
```

## playerOption
### request
|field|value|optional|description|
|-|-|-|-|
|type|buy / sell / choose|no||
|asset|-|yes|用户点击购买或卖出资产时传回asset|
|option|yes / no|no|部分事件让用户选择是否，同时要回传event|
```javascript
data = {
    type : "buy", 
    asset : {
        id : "111"
    },
    event : {
        id : "111",
        type : "social"
    },
    option : true
};
```
### response
```javascript
data = {
    request_result : "ok",
    ev_result : {
        type : "sell",
        result : "卖出xxx资产",
        trigger_time : 20, // 触发时间点
        fortune : 500000 // 当前总财富值
    },
};
```
## playerNextRound
### request
```javascript
// 暂时不需要数据
data = {

};
```
### response
```javascript
data = {
    events: [],
    assets: [],
    player: {},
    history: [],
    game_status: "start", // start/running/over
    month_pass: 3 // 这一轮经过了几个月
};
```
## playerShareResult
待定

## playerCommit
待定