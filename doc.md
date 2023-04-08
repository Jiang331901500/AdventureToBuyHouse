# Interface
## gameInfo
### request
```javascript
data = {
    // 暂时无需传数据
}
```
### response
返回时的topic为*gameInfoResp*
```javascript
data = {
    request_result : 'ok',
    game_info: {
        mode_options: {
            auto: "我命由我不由天模式", 
            manual: "听天由命躺平模式"
        },
        name_length: [1, 64],
        age_range: [20, 30],
        gener_options: ["男", "女"],
        career_options: [
            {
                id: "1",
                name: "程序员",
                salary: 20000
            },
            {
                id: "2",
                name: "医生",
                salary: 22000
            },
            {
                id: "3",
                name: "教师",
                salary: 15000
            },
            {
                id: "4",
                name: "厨师",
                salary: 10000
            },
        ],
    }
}
```
## playerInfo
### request
```javascript
data = {
    mode : "auto" // auto - 自动模式; Manual - 手动模式
    name : "JJ",
    age : 25,
    gener : "男",
    career : {
        id : "1",
        name : "程序员",
        salary : 20000
    }
};
```
### response
返回时的topic为 *playerInfoResp*
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
返回时的topic为 *playerOptionResp*
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
返回时的topic为 *playerNextRoundResp*
```javascript
data = {
    events: [],
    assets: [],
    player: {},
    game_status: "start", // start/running/over
    month_pass: 3 // 这一轮经过了几个月
};
```
## playerShareResult
待定

## playerCommit
待定