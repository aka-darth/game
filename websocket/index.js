var socket_server = require('websocket').server;
var inc=0;
var frame={w:800,h:400}
var client=function(connection){
  var _this=this;
  this.id=inc++;
  this.connection=connection;
  this.send=function(data){
    this.connection.sendUTF(data);
  };
  this.connection.on('message', function(message) {
    try{
      var data=JSON.parse(message.utf8Data);
    }catch(e){
      console.log('Check yor JSON',message.utf8Data);
      return;
    }
    switch(data.event){
      case "chat":
      case "key":
            console.log(data);
      case "sync":
//          console.log('Broadcast',data.event);
         socket.broadcast(message.utf8Data,_this.id);
        break;
      case "noob":
        data.id=_this.id;
        socket.broadcast(JSON.stringify(data),_this.id);
        _this.send('{"event":"init","id":"'+_this.id+'","frame":'+JSON.stringify(frame)+'}');
        break;
      case "sync_resp":
        var resp={
          event:"noob",
          hero:data.hero,
          id:data.id
        }
        socket.get(data.to).send(JSON.stringify(resp));
        break;
      default:
         console.log("Socket unknown request",data);
    }

  });
  //TODO: Срочно дописать эту функцию. Отключение клиента это важно
  this.connection.on('close', function(connection){
    console.log('connection closed',_this.id);
    socket.connections.splice(_this.id,1);
  });
  return this;
}
var socket={
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
    socket.broadcast('{"event":"sync_req","to":"'+ t.id+'"}', t.id)
  },
  broadcast:function(data,sender){
    this.connections.forEach(function(client){
      if(client.id!=sender)client.send(data);
    });
  }
}
3

module.exports=socket;