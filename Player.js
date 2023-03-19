
class Player {
    constructor(name, age, gender, career, conf) {
        this.name = name ;
        this.age = age;
        this.gender = gender;
        this.career = career;
        this.money = 10000000;
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
}

module.exports = {Player};