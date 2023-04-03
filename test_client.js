const io = require('socket.io-client');

// 创建socket对象，设置要连接的服务器url
var socket = io('http://127.0.0.1:3000');
// 注册connect事件，监听和服务是否建立了连接
socket.on('connect', function () {
  console.log('客户端和服务建立了连接')
});

socket.on('playerInfoResp', data => {
  console.log('-----------------------------START');
  console.log(data);
  socket.emit('playerNextRound', {});
});

var cnt = 0;
socket.on('playerNextRoundResp', data => {
  console.log('-----------------------------#' + cnt++);
  console.log(data);
  if (data.game_status === "over") {
    console.log('-----------------------------#OVER');
    return ;
  }
  setTimeout(function() {
    socket.emit('playerNextRound', {});
  }, 5000);
});

socket.on('gameInfoResp', data => {
  console.log('-----------------------------GET_OPTIONS');
  console.log(data);
  
  var info = {
    mode : 'auto',
    name : 'JJ',
    age : 32,
    gender : '男',
    career : {
        id: "1",
        name : "程序员",
        salary : 20000
    },
  };
  socket.emit('playerInfo', info);
});
socket.emit('gameInfo', {});

