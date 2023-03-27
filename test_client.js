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
  setTimeout(function() {
    socket.emit('playerNextRound', {});
  }, 5000);
});

var info = {
  mode : 'auto',
  name : 'JJ',
  age : '22',
  gender : '男',
  career : {
      name : "程序员",
      salary : 20000
  },
};
socket.emit('playerInfo', info);

