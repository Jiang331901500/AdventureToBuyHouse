
var ASSET_LIST = {
    house : {
        北京市 : {
            海淀区 : [
                {
                    community : '中华小区',
                    house_type : '商品房',
                    layout : '两室一厅',
                    area : 60,
                    price : 50000
                },
                {
                    community : '农夫山庄',
                    house_type : '别墅',
                    layout : '五室两厅',
                    area : 140,
                    price : 100000
                },
            ],
            朝阳区 : [
                {
                    community : '无名小区',
                    house_type : '商品房',
                    layout : '两室一厅',
                    area : 70,
                    price : 60000
                },
                {
                    community : '未名天禧',
                    house_type : '别墅',
                    layout : '三室两厅',
                    area : 100,
                    price : 120000
                },
            ],
        },
        上海市 : {
            浦东新区 : [
                {
                    community : '东方明珠小区',
                    house_type : '商品房',
                    layout : '两室一厅',
                    area : 80,
                    price : 80000
                },
            ],
            闵行区 : [
                {
                    community : '电机小区',
                    house_type : '商品房',
                    layout : '一室一厅',
                    area : 60,
                    price : 50000
                },
            ],
        },
        广州市 : {
            白云区 : [
                {
                    community : '白云小区',
                    house_type : '商品房',
                    layout : '三室一厅',
                    area : 110,
                    price : 50000
                },
            ],
        }
    },

    // --------------------------------------------
    stock : [
        {
            company : '北京720°有限公司',
            price : 10,
            share : 5000
        },
        {
            company : '上海只因你太美有限公司',
            price : 50,
            share : 5000
        },
        {
            company : '广州有没有搞错有限公司',
            price : 20,
            share : 4000
        },
    ]
};

var SPECIAL_EVENTS_LIST = [
    {
        type : 'social',
        weight : 50,
        repeatable_time : 1,
        optional : false,
        getDescription : function (info) {
            return "投资东南亚赌博网站，乙方圈钱跑路，损失￥" + info.loss_money;
        },
        getResult : function (info) {
            return this.getDescription(info);
        },
        judgeCondition : function (player) {
            return player.money > 500000; // 现金大于50W才会触发
        },
        act : function (info) { // 一个事件的各个方法之间传递参数请使用info
            let loss = Math.min(info.player.money, 100000);
            info['loss_money'] = loss;
            info.player.money -= loss;
        }
    },
    {
        type : 'social',
        weight : 100,
        repeatable_time : 1,
        optional : true,
        getDescription : function (info) {
            return "最近九转大肠的热度空前，是否投资？";
        },
        getResult : function (info) {
            return info.earn_money > 0 ? 
                    "运气不错，投资九转大肠赚了￥" + info.earn_money :
                    "运气不好，投资九转大肠亏了￥" + info.earn_money;
        },
        judgeCondition : function (player) {
            return player.money > 500000; // 现金大于50W才会触发
        },
        act : function (info) {
            let rate = Math.random();
            if (rate <= 0.6) {
                // 挣钱
                info['earn_money'] = Math.floor(500000 * rate);
            } else {
                // 亏钱
                let loss = Math.floor(500000 * (1.0 - rate));
                info['earn_money'] = -Math.min(info.player.money, loss);
            }
            info.player.money += info.earn_money;
        }
    },
];

function ASSET_EVENT_TEMPLATE(asset) {
    return {
        id : "ae_" + asset.id,
        asset_id : asset.id,
        type : 'asset',
        weight : 5,
        repeatable_time : 50, 
        repeated_time : 0,
        trigger_time : 0,
        optional : false,
        getDescription : function(info) {
            let desc = '';
            if (info.asset.id in info.player.assets) {
                if (info.change_ratio < 0) {
                    desc += '坏消息：';
                } else if (info.change_ratio > 0) {
                    desc += '好消息：';
                }
            }
            if (info.change_ratio < 0) {
                return desc + info.asset.getSimpleName() + 
                    '价格下跌' + info.change_ratio + "%";
            } else if (info.change_ratio > 0) {
                return desc + info.asset.getSimpleName() + 
                    '价格上涨' + info.change_ratio + "%";
            }
            return info.asset.getSimpleName() + "的价格目前非常稳定";
        },
        getResult : function(info) {
            return this.getDescription(info);
        },
        judgeCondition : function(player) {
            return true;
        },
        act : function(info) {
            let change_ration = Math.floor(Math.random() * 160) - 80;
            info.asset.price *= (1.0 + change_ration / 100.0);
            info['change_ratio'] = change_ration;
        }
    }
}

module.exports = {ASSET_LIST, ASSET_EVENT_TEMPLATE, SPECIAL_EVENTS_LIST};