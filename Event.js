const { ASSET_EVENT_TEMPLATE } = require('./conf.js');
var Util = require('./util.js');

class Event {
    constructor(id, type, weight, repeatable_time, optional, description_func, result_func, condition_func, act_func) {
        this.id = "" + id; // id需要在初始化进list时递增
        this.type = type;
        this.weight = weight;   // 事件的权重，范围[0,100]
        this.repeatable_time = repeatable_time; // 事件在整个游戏过程中允许触发的次数
        this.repeated_time = 0; // 事件在整个游戏过程中已触发的次数
        this.getDescription = description_func; // 事件产生时下显示给玩家的描述
        this.getResult = result_func;   // 事件造成的结果描述，用于events_history
        this.judgeCondition = condition_func; // 事件允许被触发的逻辑
        this.act = act_func;    // 事件起效的具体逻辑
        this.trigger_time = 0;  // 触发的时间点，用于历史回顾
        this.optional = optional;   // 是否由玩家选择触发
    }
}

class EventFactory {
    constructor(conf) {
        this.passive_events_list = {
            asset_events : {
                type : "asset",
                max_num : 5,
                index : 0,
                list : []
            },
            social_events : {
                type : "social",
                max_num : 1,
                index : 0,
                list : []
            }
            // type : "buy"、"sell" 只用于产出可购买/出售的资产,  只在历史数据中有用，不在这里列出
        };
        this.events_history = [];
        this.event_per_round = 2; // 每个回合返回最多2个事件

        // 初始化
        for (let asset_id in conf.all_assets) {
            this.addEvent(ASSET_EVENT_TEMPLATE(conf.all_assets[asset_id]))
        }
        let id = 1;
        for (let ev of conf.SPECIAL_EVENTS_LIST) {
            this.addEvent(new Event(id, ev.type, ev.weight, ev.repeatable_time, ev.optional, 
                            ev.getDescription, ev.getResult, ev.judgeCondition, ev.act))
            id++;
        }
    }


    // 打乱list中的事件顺序，并对部分事件的属性进行随机调整
    eventListResort() {
        for (let one_events in this.passive_events_list) {
            let events = this.passive_events_list[one_events];
            Util.shuffle(events.list);
        }
    }

    addEvent(event) {
        for (let one_events in this.passive_events_list) {
            let events = this.passive_events_list[one_events];
            if (events.type == event.type) {
                for (let _ev of events.list) {
                    if (event.id == _ev.id) {
                        return ; // 事件已经在列表中了，避免反复添加
                    }
                }
                events.list.push(event);
            }
        }
    }

    removeEvent(event) {
        for (let one_events in this.passive_events_list) {
            let events = this.passive_events_list[one_events];
            if (events.type == event.type) {
                for (let i in events.list) {
                    if (events.list[i].id == event.id) {
                        events.list.splice(i, 1);
                    }
                }
            }
        }
    }

    _getEvents(player, events) {
        if (events.list.length <= 0) {
            return [];
        }
        if (events.index >= events.list.length) {
            events.index = 0;
        }
        let max_num = Math.min(events.max_num, events.list.length);
        let result = [];
        let i = 0, num = 0;
        for (i = events.index, num = 0; 
            num < max_num; 
            i = (i+1) % events.list.length, num++) {
            let e = events.list[i];
            if (e.repeated_time < e.repeatable_time &&
                e.judgeCondition(player)) {
                result.push(e);
            }
        }
        events.index = i;
        return result;
    }

    getEvents(player) {
        this.eventListResort(); // 每次获取到事件前，先打乱事件
        let res = [];
        for (let one_events in this.passive_events_list) {
            let events = this.passive_events_list[one_events];
            res = res.concat(this._getEvents(player, events));
        }

        res = Util.weightedRandomSelectMultiple(res, this.event_per_round);
        return res;
    }

    findEvents(event) {
        for (let one_events in this.passive_events_list) {
            let events = this.passive_events_list[one_events];
            if (events.type == event.type) {
                for (let i in events.list) {
                    if (events.list[i].id == event.id) {
                        return events.list[i];
                    }
                }
            }
        }
        return null;
    }

    actEvent(info, event, into_hist) {
        event.act(info);
        event.repeated_time++;
        event.trigger_time = info.player.time;
        let ev = {
            id : event.id,
            type : event.type,
            trigger_time : event.trigger_time,
            description : event.getDescription(info),
            result : event.getResult(info),
            fortune: info.player.getFortune()
        };
        if (into_hist) {
            this.events_history.push(ev);
        }
        return ev;
    }

    actBuyEvent(player, buy_asset) {
        let buy_ev = {
            type: 'buy',
            result : "买入" + buy_asset.getDescription(),
            trigger_time : player.time,
            fortune: player.getFortune()
        };
        this.events_history.push(buy_ev);
        return buy_ev;
    }

    actSellEvent(player, sell_asset) {
        let sell_ev = {
            type: 'sell',
            result : "卖出" + sell_asset.getDescription(),
            trigger_time : player.time,
            fortune: player.getFortune()
        };
        this.events_history.push(sell_ev);
        return sell_ev;
    }
} 

module.exports = {Event, EventFactory};