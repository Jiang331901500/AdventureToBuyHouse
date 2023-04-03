
class Player {
    constructor(name, age, gender, career) {
        let game_info = require("./conf.js").GAME_INFO;
        this.name = (typeof name === 'string') ? name.substring(0, 64) : "unknown";
        this.age = (typeof age === 'number' && age % 1 === 0) ? Math.min(Math.max(age, 20), 30) : 20;
        this.gender = game_info.gener_options.includes(gender) ? gender : "男";
        this.career = game_info.career_options.some(item => JSON.stringify(item) === JSON.stringify(career)) ? 
                        career : game_info.career_options[0];
        this.money = 1000000;
        this.assets = {};
        this.time = 0; // 游戏开始经过的月份数
    }

    buy(asset) {
        if (this.money >= asset.getValue()) {
            this.money -= asset.getValue();
            asset.start_time = this.time;
            this.assets[asset.id] = asset;
            return true;
        }
        return false;
    }

    sell(id) {
        if (id in this.assets) {
            let asset = this.assets[id];
            this.money += asset.getValue();
            delete this.assets[id];
            return asset;
        }
        return null;
    }

    work(month) {
        this.time += month;
        this.money += this.career.salary * month;
    }

    // fortune包含money和所有资产的value
    getFortune() {
        let value = 0;
        for (let assid in this.assets) {
            value += this.assets[assid].getValue();
        }
        return this.money + value;
    }

    getAgeNow() {
        return this.age + Math.floor(this.time / 12);
    }

    getPlayerInfo() {
        return {
            name : this.name,
            age : this.getAgeNow(),
            gender : this.gender,
            career : this.career,
            money : this.money,
            assets : Object.values(this.assets),
            time : this.time,
            fortune : this.getFortune()
        };
    }
}

module.exports = {Player};