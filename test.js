var GameController = require('./GameController.js');
var CONF = require('./conf.js');
// ---------------------------------test
var info = {
    mode : 'self',
    name : 'JJ',
    age : '22',
    gender : '男',
    career : {
        name : "程序员",
        salary : 20000
    },
};

let controller = new GameController.GameController(info, CONF);
console.log("#1 ---------------");
let buy_info = controller.nextRound();
console.log(buy_info);

let data  ={};
if (buy_info.events[0].optional == true) {
    data = {
        type : 'choose',
        option : true,
        event : {
            id : buy_info.events[0].id,
            type : 'social'
        },
    };
}
console.log("+++++++++++++++++++++++++++++++");
console.log(controller.processPlayerOder(data));

data = {
    type : 'buy',
    asset : {
        id : buy_info.assets[0].id
    },
};
controller.processPlayerOder(data);
console.log(controller.player);
controller.timeFly();

console.log("#2 ---------------");
buy_info = controller.nextRound();
console.log(buy_info);
let keys = Object.keys(controller.player.assets);
data = {
    type : 'sell',
    asset : {
        id : keys[0]
    },
};
controller.processPlayerOder(data);
console.log(controller.player);
console.log(controller.event_factory.events_history);
controller.timeFly();