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
var GameController = require('./GameController.js');

// 定义一个玩家类，用来存储玩家的信息和状态
class Player {
    constructor(socket) {
        this.socket = socket; // 玩家对应的socket对象
    }

    initGameController(info) {
        // TODO check info validation
        this.game_controller = new GameController.GameController(info);
        return true;
    }

    setGameController(gc) {
        this.game_controller = gc;
    }
}

// 用来管理游戏逻辑和状态 
class GameManager {
    constructor() {
        this.players = new Map(); // 游戏中的玩家列表 (使用map加速查询)
    }

    // 添加一个玩家到游戏中 
    addPlayer(socket) {
        let player = new Player(socket);
        this.players.set(socket.id, player);
    }

    // 移除一个玩家从游戏中 
    removePlayer(socket) {
        this.players.delete(socket.id);
    }

    // 根据socket对象找到对应的玩家对象 
    findPlayer(socket) {
        return this.players.get(socket.id);
    }

    // 前后端数据交互接口
    /* 1 - 首页，表单提交玩家信息：姓名、性别、年龄、职业（含月收入）*/
    handleGameInfo(socket, data) {
        let ret = {
            request_result : 'failed'
        };
        let player = this.findPlayer(socket);
        if (player) {
            ret.game_info = GameController.GameInfo();
            ret.request_result = 'ok';
        }
        socket.emit("gameInfoResp", ret);
    }
    /* 后端为该玩家新生成Player对象，随机产出一些起始属性（如现金），游戏控制器开始工作 */
    handlePlayerInfo(socket, data) {
        let ret = {
            request_result : 'failed'
        };
        let player = this.findPlayer(socket);
        if (player) {
            if (!player.hasOwnProperty('game_controller')) { // 避免控制器重复初始化
                if (player.initGameController(data)) {
                    ret.request_result = 'ok';
                }
            }
        }
        socket.emit("playerInfoResp", ret);
    }

    /* 2 - 游戏中页面：是一个loop直到游戏结束，每次发送玩家请求，控制器返回请求，前端显示返回结果 
           游戏结束时，显示结果页面：显示玩家当前资产状态，可以选择查看历史回顾*/
    handlePlayerOption(socket, data) {
        let ret = {
            request_result : 'failed'
        };
        let player = this.findPlayer(socket);
        if (player && player.game_controller) {
            ret = player.game_controller.processPlayerOder(data);
        }
        socket.emit("playerOptionResp", ret);
    }

    handlePlayerNextRound(socket, data) {
        let ret = {
            request_result : 'failed'
        };
        let player = this.findPlayer(socket);
        if (player && player.game_controller) {
            if (player.game_controller.mode === 'manual') { // 手动模式
                ret = player.game_controller.nextRound();
            } else {    // 自动模式
                ret = player.game_controller.nextRoundAuto();
            }
        }
        socket.emit("playerNextRoundResp", ret);
    }

    /* 3 - 可分享结果页面，设想是生成图片或一个元素比较丰富的页面，*/

    /* 4 - 用户提交评论，需要数据库支持 */
}

// 创建一个游戏实例
var game = new GameManager();
setInterval(function() {
    console.log("player online: " + game.players.size);
}, 10000);
// 监听socket连接事件 
io.on('connection', socket => {
    game.addPlayer(socket); //添加玩家到游戏中 
    socket.on('disconnect', () => {
        game.removePlayer(socket); // 移除玩家 
    });

    socket.on('gameInfo', data => {
        game.handleGameInfo(socket, data);
    });

    socket.on('playerInfo', data => {
        game.handlePlayerInfo(socket, data);
    });

    socket.on('playerOption', data => {
        game.handlePlayerOption(socket, data);
    });

    socket.on('playerNextRound', data => {
        game.handlePlayerNextRound(socket, data);
    });

    socket.on('playerShareResult', data => {
        // TODO
    });

    socket.on('playerCommit', data => {
        // TODO
    });
});
