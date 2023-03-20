var PL = require('./Player.js');
var ASSET = require('./Asset.js');
var EVENT = require('./Event.js');
var CONF = require('./conf.js');

class GameController {
    constructor(info) {
        let conf = CONF;

        this.mode = info.mode;
        this.player = new PL.Player(info.name, info.age, info.gender, info.career, this);
        this.asset_factory = new ASSET.AssetFactory(conf);
        conf['all_assets'] = this.asset_factory.public_asset;
        this.event_factory = new EVENT.EventFactory(conf);
        this.game_status = 'start'; // start/running/over
    }

    timeFly() {
        let month_pass = Math.floor(Math.random() * 5 + 1);
        this.player.time += month_pass;
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
                        data['request_result'] = 'ok';
                        return data;
                    }
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
                this.event_factory.actEvent(data, event, true);
            }
            info.events.push({
                id : event.id,
                type : event.type,
                description : event.getDescription(data),
                optional : event.optional,
            });
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
        info.player = this.player;

        // 进度控制
        this.gameTimeControl(info);
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
        if (false) {
            this.game_status = 'over';
            info['history'] = this.event_factory.events_history;
            return true;
        }
        info.game_status = this.game_status;
        return false;
    }
}

module.exports = {GameController};