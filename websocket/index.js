var socket_server = require('websocket').server;
var inc=0;
var client=function(connection){
  var _this=this;
  this.id=inc++;
  this.connection=connection;
  this.send=function(data){
    this.connection.sendUTF(data);
  };
  this.connection.on('message', function(message) {
    var data=JSON.parse(message.utf8Data);
    console.log('Catch mess from:',_this.id,data);
    if(data.key){
      socket.broadcast(message.utf8Data,_this.id);
    }else if(data.chat){
      socket.broadcast(message.utf8Data,_this.id);
    }else if(data.hero){
      data.id=_this.id;
      socket.broadcast(JSON.stringify(data),_this.id);
      _this.send('{"status":"request_heros","id":"'+_this.id+'"}');
    }else if(data.hero_reply){
      var resp={
        hero:data.hero_reply,
        id:data.id
      }
      console.log();
      socket.get(data.to).send(JSON.stringify(resp));
    }
  });
  this.connection.on('close', function(connection) {
    console.log('connection closed',_this.id);
    socket.connections.splice(_this.id,1);
  });
  return this;
}
socket={
  init:function(server){
    this.connections=[];
    this.get=function(id){
      var target_client=null;
      this.connections.forEach(function(client){
        if(client.id==id)target_client=client;
      });
//      console.log('GBI',target_client);
      return target_client;
    }
    this.socket = new socket_server({httpServer: server});
    this.socket.on('request',this.init_client);
  },
  init_client:function(request){
    //Init new client
    var connection = request.accept(null, request.origin);
    var t=new client(connection);
    socket.connections.push(t);
    socket.broadcast('{"hero_request":"true","to":"'+ t.id+'"}', t.id)
  },
  broadcast:function(data,sender){
    console.log('Try broadcast to',this.connections.length,'from',sender);
    this.connections.forEach(function(client){
      if(client.id!=sender){
        console.log('Sending ',data,'to',client.id);
        client.send(data);
      }else{
        console.log('Client',client.id,'is sender');
      }
    });
  }
}


module.exports=socket;