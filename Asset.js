var Util = require('./util.js');

class House {
    constructor(city, district, community, house_type, layout, area, price, id) {
        this.type = 'house';
        this.city = city;
        this.district = district;
        this.community = community;
        this.house_type = house_type;
        this.layout = layout;
        this.area = area;
        this.price = price;
        this.buyin_price = price;
        this.start_time = 0;
        this.id = "1000" + id; // 不同的资产id前缀不同，传入的id实际上是初始化时这个asset在list中的索引
    }

    getDescription() {
        return this.city + this.district + this.community + this.house_type + '，' + 
        this.layout + '，面积' + this.area + '平米，价值￥' + this.getValue();
    }

    getSimpleName() {
        return this.city + this.district + this.community + this.house_type;
    }

    getValue() {
        return this.area * this.price;
    }
}


class Stock {
    constructor(company, share, price, id) {
        this.type = 'stock';
        this.company = company;
        this.share = share;
        this.price = price;
        this.buyin_price = price;
        this.start_time = 0;
        this.id = "2000" + id;
    }

    getDescription() {
        return  this.company + '股票' + this.share + '股，价值￥' + this.getValue();
    }

    getValue() {
        return this.share * this.price;
    }

    getSimpleName() {
        return this.company + '股票';
    }
}

class AssetFactory {
    constructor(conf) {
        this.public_asset = {}; // 初始化后就是所有未被玩家构架的asset，被购买的asset会从中移除，玩家重新卖出后再加入list

        // 初始化
        this.max_num_per_round = 4;

        let id = 0;
        let house_asset = conf.ASSET_LIST.house;
        let cities = Object.keys(house_asset);
        for (let city of cities) {
            let districts = Object.keys(house_asset[city]);
            for (let district of districts) {
                let house_list = house_asset[city][district];
                for (let house of house_list) {
                    let asset = new House(city, district, house.community, house.house_type,
                        house.layout, house.area, house.price, id);
                    this.public_asset[asset.id] = asset;
                    id++;
                }
            }
        }
        id = 0;
        let stock_asset = conf.ASSET_LIST.stock;
        for (let stock of stock_asset) {
            let asset = new Stock(stock.company, stock.share, stock.price, id);
            this.public_asset[asset.id] = asset;
            id++;
        }
    }

    addAsset(asset) {
        asset.buyin_price = asset.price;
        this.public_asset[asset.id] = asset;
    }

    removeAsset(id) {
        let asset = this.public_asset[id];
        asset.buyin_price = asset.price;
        delete this.public_asset[id];
        return asset;
    }

    getAsset(player) {
        let result = [];
        let assets_id_list = Object.keys(this.public_asset);
        let chosen = Util.randomChoiceMultiple(assets_id_list, this.max_num_per_round);
        for (let id of chosen) {
            result.push(this.public_asset[id]);
        }
        return result;
    }   
}

module.exports = {House, Stock, AssetFactory}