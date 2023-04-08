
class GameController {
    constructor(info) {
        let conf = require('./conf.js');
        let ASSET = require('./Asset.js');
        let EVENT = require('./Event.js');
        let PL = require('./Player.js');

        this.mode = info.mode ? info.mode : 'auto';
        this.player = new PL.Player(info.name, info.age, info.gender, info.career);
        this.asset_factory = new ASSET.AssetFactory(conf);
        conf['all_assets'] = this.asset_factory.public_asset;
        this.event_factory = new EVENT.EventFactory(conf);
        this.game_status = 'start'; // start/running/over
    }

    timeFly() {
        let month_pass = Math.floor(Math.random() * 5 + 1);
        this.player.work(month_pass);
        return month_pass;
    }

    // 执行玩家的指令（买入/卖出）
    processPlayerOder(data) {
        switch (data.type) {
            case 'buy':
                if (!data.asset || !data.asset.id) {
                    break;
                }
                if (data.asset.id in this.asset_factory.public_asset) {
                    let asset = this.asset_factory.public_asset[data.asset.id];
                    if (this.player.buy(asset)) {
                        this.asset_factory.removeAsset(data.asset.id);
                        data['ev_result'] = this.event_factory.actBuyEvent(this.player, asset);
                        data.player = this.player.getPlayerInfo();
                        data['request_result'] = 'ok';
                        return data;
                    }
                }
                break;

            case 'sell':
                if (!data.asset || !data.asset.id) {
                    break;
                }
                let asset = this.player.sell(data.asset.id);
                if (asset) {
                    this.asset_factory.addAsset(asset);
                    data['ev_result'] = this.event_factory.actSellEvent(this.player, asset);
                    data.player = this.player.getPlayerInfo();
                    data['request_result'] = 'ok';
                    return data;
                }
                break;

            case 'choose':
                if (data.option === true) {
                    data.player = this.player;
                    let ev = this.event_factory.findEvents(data.event);
                    if (ev) {
                        data['ev_result'] = this.event_factory.actEvent(data, ev, true);
                        data.player = this.player.getPlayerInfo();
                        data['request_result'] = 'ok';
                        return data;
                    }
                } else {
                    data.player = this.player;
                    data['request_result'] = 'ok';
                }
                break;
            default:
                break;
        }

        // 失败 - 一般是触发了非法的命令
        data['request_result'] = 'failed';
        return data;
    }

    // 产出下一个回合数据
    nextRound() {
        let info = {
            events: [],
            assets: [],
            player: {}
        };

        // 进度控制
        if (this.gameTimeControl(info)) {
            info.player = this.player;
            return info;
        }

        // event
        let events = this.event_factory.getEvents(this.player);
        for (let event of events) {
            let data = {
                player : this.player
            };

            if (event.type === 'asset') {
                if (event.asset_id in this.player.assets) {
                    data['asset'] = this.player.assets[event.asset_id];
                } else if (event.asset_id in this.asset_factory.public_asset) {
                    data['asset'] = this.asset_factory.public_asset[event.asset_id];
                } else {
                    continue;
                }
            }
            if (event.optional === false) {
                let ev = this.event_factory.actEvent(data, event, true);
                info.events.push(ev);
            } else {
                info.events.push({
                    id : event.id,
                    type : event.type,
                    description : event.getDescription(data),
                    optional : event.optional,
                    trigger_time : this.player.time,
                });
            }
        }
        // asset
        let assets = this.asset_factory.getAsset(this.player);
        for (let asset of assets) {
            info.assets.push({
                id : asset.id,
                type : asset.type,
                description : asset.getDescription(),
            });
        }
        // player
        info.player = this.player.getPlayerInfo();
        return info;
    }

    nextRoundAuto() {
        let info = this.nextRound();
        // 随机选择事件
        for (let idx in info.events) {
            let ev = info.events[idx];
            if (ev.optional === true) {
                let choose = Math.random() > 0.5 ? true : false;
                if (choose) {
                    let data = {
                        type : 'choose',
                        option : choose,
                        event : {
                            id : ev.id,
                            type : ev.type
                        }
                    };
                    let ret = this.processPlayerOder(data);
                    if (ret.request_result === 'ok') {
                        info.events[idx] = ret.ev_result;
                    } else {
                        info.events.splice(idx, 1);
                    }
                } else {
                    info.events.splice(idx, 1);
                }
            }
        }
        // 随机买入资产
        let has_buy = false;
        for (let idx in info.assets) {
            let ass = info.assets[idx];
            let buy = Math.random() > 0.8 ? true : false;
            if (buy === true) {
                let data = {
                    type : 'buy',
                    asset : {
                        id : ass.id
                    }
                };
                let ret = this.processPlayerOder(data);
                if (ret.request_result === 'ok') {
                    info.events.push(ret.ev_result);
                    has_buy = true;
                    break; // 一回合暂时只随机最多买一个资产
                }
            }
        }
        // 随机卖出资产，买入资产的情况下该回合就不卖出资产了
        if (has_buy === false) {
            for (let id in this.player.assets) {
                let ass = this.player.assets[id];
                let sell = Math.random() > 0.8 ? true : false;
                if (sell === true) {
                    let data = {
                        type : 'sell',
                        asset : {
                            id : ass.id
                        }
                    };
                    let ret = this.processPlayerOder(data);
                    if (ret.request_result === 'ok') {
                        info.events.push(ret.ev_result);
                        break; // 一回合暂时只随机最多卖一个资产
                    }
                }
            }
        }

        info.player = this.player.getPlayerInfo();
        info.assets = [];
        return info;
    }

    gameTimeControl(info) {
        // 游戏刚开始第一回合
        if (this.game_status === 'start') {
            this.game_status = 'running';
        } else {
            info.month_pass = this.timeFly();
        }

        // 通知前端游戏结束，返回Player状态和历史事件列表
        if (this.player.getAgeNow() >= 90) {
            this.game_status = 'over';
            info['history'] = this.event_factory.events_history;
            return true;
        }
        info.game_status = this.game_status;
        return false;
    }
}

function GameInfo() {
    let conf = require('./conf.js');
    return conf.GAME_INFO;
}

module.exports = {GameController, GameInfo};