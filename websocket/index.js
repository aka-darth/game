var socket_server = require('websocket').server;
var client=function(connection){
  var _this=this;
  this.id=socket.connections.length;
  this.connection=connection;
  this.bind=function(){
    this.connection.on('message', function(message) {
      var data=JSON.parse(message.utf8Data);
      console.log('Catch mess:',data);
      if(data.key){
        socket.broadcast(message.utf8Data,_this.id);
      }else if(data.chat){
        socket.broadcast(message.utf8Data,_this.id);
      }
    });
    this.connection.on('close', function(connection) {
      console.log('connection closed',connection);
      socket.connections.splice();
    });
  };
  this.send=function(data){
    this.connection.sendUTF(data);
  };
  this.bind();
  return this;
}
socket={
  init:function(server){
    this.connections=[];
    this.socket = new socket_server({httpServer: server});
    this.socket.on('request',function(request){
      var connection = request.accept(null, request.origin);
      var t=new client(connection);
      socket.connections.push(t);
    });
  },
  broadcast:function(data,sender){
    console.log('Try broadcast to',this.connections.length,'from',sender);
    this.connections.forEach(function(client){
      if(client.id!=sender){
        console.log('Sending ',data,'\nto\n',client.id);
        client.send(data);
      }else{
        console.log('Client',client.id,'is sender');
      }
    });
  }

}


module.exports=socket;