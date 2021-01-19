function createWebSocketServer(io, game) { // WebSocketの待ち受けを開始する関数
  const rootIo = io.of('/');
  rootIo.on('connection', (socket) => {
    const displayName = socket.handshake.query.displayName;
    const thumbUrl = socket.handshake.query.thumbUrl;

    const startObj = game.newConnection(socket.id, displayName, thumbUrl); // プレイヤーが新たにゲームに参加した時に実行する関数
    socket.emit('start data', startObj);

    socket.on('change direction', (direction) => {
      game.updatePlayerDirection(socket.id, direction);
    });

    socket.on('missile emit', (direction) => {
      game.missileEmit(socket.id, direction);
    });

    socket.on('disconnect', () => {
      game.disconnect(socket.id); //プレイヤーが接続を切った時に実行する関数
    });
  });

  const socketTicker = setInterval(() => {
    rootIo.volatile.emit('map data', game.getMapData()); // 全員に送信
  }, 66);
}

module.exports = {
  createWebSocketServer
};