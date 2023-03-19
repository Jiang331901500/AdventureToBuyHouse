var PL = require('./Player.js');
var ASSET = require('./Asset.js');
var EVENT = require('./Event.js');

class GameController {
    constructor(info, conf) {
        this.mode = info.mode;
        this.player = new PL.Player(info.name, info.age, info.gender, info.career, conf);
        this.asset_factory = new ASSET.AssetFactory(conf);
        conf['all_assets'] = this.asset_factory.public_asset;
        this.event_factory = new EVENT.EventFactory(conf);
    }

    timeFly() {
        let month_pass = Math.floor(Math.random() * 5 + 1);
        this.player.time += month_pass;
        this.player.work(month_pass);
    }

    // 执行玩家的指令（买入/卖出）
    processPlayerOder(data) {
        switch (data.type) {
            case 'buy':
                if (data.asset.id in this.asset_factory.public_asset) {
                    let asset = this.asset_factory.public_asset[data.asset.id];
                    if (this.player.buy(asset)) {
                        this.asset_factory.removeAsset(data.asset.id);
                        return this.event_factory.actBuyEvent(this.player, asset);
                    }
                }
                break;

            case 'sell':
                let asset = this.player.sell(data.asset.id);
                if (asset) {
                    this.asset_factory.addAsset(asset);
                    return this.event_factory.actSellEvent(this.player, asset);
                }
                break;

            case 'choose':
                if (data.option == true) {
                    data.player = this.player;
                    let ev = this.event_factory.findEvents(data.event);
                    if (ev) {
                        return this.event_factory.actEvent(data, ev, true);
                    }
                }
                break;
            default:
                break;
        }

        // 失败
        if (data.hasOwnProperty('event')) {
            data.event['status'] = 'failed';
        } else {
            data['event'] = {status : 'failed'};
        }
        return data.event;
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

            if (event.type == 'asset') {
                if (event.asset_id in this.player.assets) {
                    data['asset'] = this.player.assets[event.asset_id];
                } else if (event.asset_id in this.asset_factory.public_asset) {
                    data['asset'] = this.asset_factory.public_asset[event.asset_id];
                } else {
                    continue;
                }
            }
            if (event.optional == false) {
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
        return info;
    }
}

module.exports = {GameController};