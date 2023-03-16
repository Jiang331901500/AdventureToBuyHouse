// server.js
// 创建一个express应用
const express = require('express');
const app = express();

// 设置静态文件目录
app.use(express.static(__dirname + '/public'));

// 监听3000端口
const server = app.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// 创建一个socket.io实例
const io = require('socket.io')(server);

// 定义一些游戏变量和常量
const CITY_LIST = ['北京', '上海', '广州', '深圳']; // 城市列表
// ['程序员', '老师', '医生', '律师']; // 职业列表
const JOB_LIST = [{
        name: "程序员",
        income: "20000"
    },
    {
        name: "老师",
        income: "15000"
    },
    {
        name: "医生",
        income: "25000"
    },
    {
        name: "律师",
        income: "18000"
    }
];
const HOUSE_LIST = { // 楼盘列表，每个城市有四个楼盘，每个楼盘有两种户型，每种户型有不同的价格和面积
    北京: [{
            name: '朝阳区某小区',
            types: [{
                    type: '一室一厅',
                    price: 100000,
                    area: 50
                },
                {
                    type: '两室一厅',
                    price: 150000,
                    area: 70
                }
            ]
        },
        {
            name: '海淀区某小区',
            types: [{
                    type: '一室一厅',
                    price: 80000,
                    area: 40
                },
                {
                    type: '两室一厅',
                    price: 120000,
                    area: 60
                }
            ]
        },
        {
            name: '昌平区某小区',
            types: [{
                    type: '一室一卫',
                    price: 50000,
                    area: 30
                },
                {
                    type: '一室一厅',
                    price: 70000,
                    area: 50
                }
            ]
        },
        {
            name: '大兴区某小区',
            types: [{
                    type: '一居室',
                    price: 40000,
                    area: 20
                },
                {
                    type: '一室一厅',
                    price: 60000,
                    area: 40
                }
            ]
        }
    ],
    上海: [{
            name: '浦东新区某小区',
            types: [{
                    type: '一室一厅',
                    price: 300000,
                    area: 50
                },
                {
                    type: '两室一厅',
                    price: 450000,
                    area: 70
                }
            ]
        },
        {
            name: '徐汇区某小区',
            types: [{
                    type: '一室一厅',
                    price: 250000,
                    area: 40
                },
                {
                    type: '两室一厅',
                    price: 400000,
                    area: 60
                }
            ]
        },
        {
            name: '松江区某小区',
            types: [{
                    type: '一室一卫',
                    price: 150000,
                    area: 30
                },
                {
                    type: '一室一厅',
                    price: 200000,
                    area: 50
                }
            ]
        },
        {
            name: '青浦区某小区',
            types: [{
                    type: '一居室',
                    price: 100000,
                    area: 20
                },
                {
                    type: '一室一厅',
                    price: 150000,
                    area: 40
                }
            ]
        }
    ],
    广州: [{
            name: "天河区某小区",
            types: [{
                    type: "一室一厅",
                    price: 3500000,
                    area: 50
                },
                {
                    type: "两室一厅",
                    price: 5000000,
                    area: 70
                },
            ],
        },
        {
            name: "越秀区某小区",
            types: [{
                    type: "一室一厅",
                    price: 3000000,
                    area: 40

                },
                {
                    type: '两室一厅',
                    price: 4500000,
                    area: 60
                }
            ]
        },
        {
            name: '番禺区某小区',
            types: [{

                    type: '一室一卫',
                    price: 2000000,
                    area: 30
                },
                {
                    type: "一室一厅",
                    price: 3000000,
                    area: 50,
                },
            ],
        },
        {
            name: "增城区某小区",
            types: [{
                    type: "一居室",
                    price: 1000000,
                    area: 20,
                },
                {
                    type: "一室一厅",
                    price: 1500000,
                    area: 40,
                },
            ]
        },
    ],
    深圳: [{
            name: "南山区某小区",
            types: [{
                    type: "一室一厅",
                    price: 6000000,
                    area: 50
                },
                {
                    type: "两室一厅",
                    price: 9000000,
                    area: 70
                }
            ]
        },
        {
            name: '福田区某小区',
            types: [{
                    type: '一室一厅',
                    price: 5000000,
                    area: 40
                },
                {
                    type: "两室一厅",
                    price: 8000000,
                    area: 60,
                },
            ],
        },
        {
            name: "罗湖区某小区",
            types: [{
                    type: "一室一卫",
                    price: 4000000,
                    area: 30,
                },
                {
                    type: "一室一厅",
                    price: 6000000,
                    area: 50,
                },
            ],
        },
        {
            name: "龙岗区某小区",
            types: [{
                    type: '一居室',
                    price: 3000000,
                    area: 20
                },
                {
                    type: "一室一厅",
                    price: 4000000,
                    area: 40
                },
            ],
        },
    ],
};
// ['全款', '按揭']; // 支付方式列表
const PAYMENT_LIST = {
    北京: [{
            name: '全款',
            rate: 0
        },
        {
            name: '按揭',
            rate: 6.2
        }
    ],
    上海: [{
            name: '全款',
            rate: 0
        },
        {
            name: '按揭',
            rate: 5.2
        }
    ],
    广州: [{
            name: '全款',
            rate: 0
        },
        {
            name: '按揭',
            rate: 5.3
        }
    ],
    深圳: [{
            name: '全款',
            rate: 0
        },
        {
            name: '按揭',
            rate: 5.2
        }
    ]
};
// 定义一个玩家类，用来存储玩家的信息和状态
class Player {
    constructor(socket) {
        this.socket = socket; // 玩家对应的socket对象
        this.name = ''; // 玩家姓名
        this.gender = ''; // 玩家性别
        this.city = ''; // 玩家选择的城市
        this.job = ''; // 玩家选择的职业 
        this.house = null; // 玩家选择的房子对象，包含楼盘名、户型、价格、面积等属性 
        this.payment = ''; // 玩家选择的支付方式 
        this.score = 0; // 玩家最终得分 
    }
}

// 定义一个游戏类，用来管理游戏逻辑和状态 
class Game {
    constructor() {
        this.players = []; // 游戏中的玩家列表 
    }

    // 添加一个玩家到游戏中 
    addPlayer(socket) {
        let player = new Player(socket);
        this.players.push(player);
    }

    // 移除一个玩家从游戏中 
    removePlayer(socket) {
        let index = this.players.findIndex(p => p.socket.id === socket.id);
        if (index !== -1) {
            this.players.splice(index, 1);
        }
    }

    // 根据socket对象找到对应的玩家对象 
    findPlayer(socket) {
        return this.players.find(p => p.socket.id === socket.id);
    }

    // 处理玩家输入姓名和性别的事件 
    handleNameAndGender(socket, data) {
        let player = this.findPlayer(socket);
        if (player) {
            player.name = data.name;
            player.gender = data.gender;
            console.log(`Player ${player.name} (${player.gender}) joined the game`);
            socket.emit('cityList', CITY_LIST); // 向该玩家发送城市列表让其选择城市 
        }
    }

    // 处理玩家选择城市的事件 
    handleCity(socket, data) {
        let player = this.findPlayer(socket);
        if (player) {
            player.city = data.city;
            console.log(`Player ${player.name} chose ${player.city}`);
            socket.emit('jobList', JOB_LIST); // 向该玩家发送职业列表让其选择职业 
        }
    }

    // 处理玩家选择职业的事件 
    handleJob(socket, data) {
        let player = this.findPlayer(socket);
        if (player) {
            player.job = data.job;
            console.log(`Player ${player.name} chose ${player.job}`);
            socket.emit('houseList', HOUSE_LIST[player.city]); // 向该玩家发送楼盘列表让其选择房子 
        }
    }

    // 处理玩家选择房子的事件 
    handleHouse(socket, data) {
        let player = this.findPlayer(socket);
        if (player) {
            player.house = data.house;
            console.log(`Player ${player.name} chose ${player.house.name} (${player.house.type})`);
            socket.emit('paymentList', PAYMENT_LIST[player.city]); // 向该玩家发送支付方式列表让其选择支付方式 
        }
    }

    // 处理玩家选择支付方式的事件 
    handlePayment(socket, data) {
        let player = this.findPlayer(socket);
        if (player) {
            player.payment = data.payment;
            console.log(`Player ${player.name} chose ${player.payment}`);
            socket.emit('result', this.calculateResult(player)); // 向该玩家发送游戏结果和评分
        }
    }

    // 计算游戏结果和评分的方法
    calculateResult(player) {
        let result = {}; // 结果对象，包含是否成功买到房子、评分和评语等属性
        result.success = true; // 默认为成功买到房子
        result.score = 100; // 默认满分
        result.comment = player.name + '老铁，'; // 评语开头加称谓

        // 根据不同的随机事件和玩家选择，修改结果对象的属性
        let event = Math.random(); // 随机数，用来模拟随机事件发生的概率

        if (event < 0.2) { // 20% 的概率发生开发商违约
            result.success = false;
            result.score -= 50;
            result.comment += '很不幸，你选中的楼盘出现了开发商违约的情况，你无法拿到房产证。\n';
        } else if (event < 0.5 && player.payment === '按揭') { //30 % 的概率发生贷款利率上涨，如果玩家选择了按揭付款
            result.score -= 20; //扣分20 分
            result.comment += '很遗憾，你申请贷款时遇到了利率上涨的情况，你需要多还一些利息。\n';
        } else if (event < 0.95) { //45% 的概率发生装修质量差
            result.score -= 10; //扣分10 分
            result.comment += '有点可惜，你入住后发现装修质量不太好，有些地方需要重新修缮。\n';
        } else { //5% 的概率没有任何随机事件发生
            result.comment += '恭喜你，一切顺利，你成功买到并入住了心仪的房子。\n';
        }

        return result;
    }
}
// 监听socket连接事件 
io.on('connection', socket => {
    console.log('A user connected');
    // 创建一个游戏实例
    let game = new Game();
    game.addPlayer(socket); //
    // 添加玩家到游戏中 
    socket.on('disconnect', () => {
        console.log('A user disconnected');
        game.removePlayer(socket); // 移除玩家从游戏中 
    });

    // 监听玩家输入姓名和性别的事件 
    socket.on('nameAndGender', data => {
        game.handleNameAndGender(socket, data);
    });

    // 监听玩家选择城市的事件 
    socket.on('city', data => {
        game.handleCity(socket, data);
    });

    // 监听玩家选择职业的事件 
    socket.on('job', data => {
        game.handleJob(socket, data);
    });

    // 监听玩家选择房子的事件 
    socket.on('house', data => {
        game.handleHouse(socket, data);
    });

    // 监听玩家选择支付方式的事件 
    socket.on('payment', data => {
        game.handlePayment(socket, data);
    });
});