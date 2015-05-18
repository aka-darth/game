Multiplayer={
    socket:false,
    init:function(){
        var socket = new WebSocket('ws://192.168.1.26');
        socket.heros=[];
        socket.onopen = function () {
            socket.send('{"hero":'+JSON.stringify(hero)+'}');
        };
        socket.sendkey=function(key){
            socket.send('{"id":"'+socket.myid+'","key":"'+key+'"}');
        };
        socket.onmessage = function (message) {
            var data = JSON.parse(message.data);
            console.log('Socket:',data);
            if(data.status){
                socket.myid=data.id;
            }
            if(data.hero){
                socket.heros[data.id]=data.hero;
                socket.heros[data.id].name='hero '+data.id;
                socket.heros[data.id].phis.name='hero'+data.id;
                socket.heros[data.id].phis=Phisical.create(socket.heros[data.id].phis);
                console.log('New hero!',data.id,socket.heros[data.id]);
            }
            if(data.hero_request){
                socket.send('{"hero_reply":'+JSON.stringify(hero)+',"id":"'+socket.myid+'","to":"'+data.to+'"}');
            }
            if(data.key){
                var r_hero=socket.heros[data.id];
                console.log(hero);
                switch(parseInt(data.key)){
                    case 87:case 38://W
                    r_hero.phis.vy-=hero.a;
                    break;
                    case 68:case 39://D
                    r_hero.phis.vx+=hero.a;
                    break;
                    case 65:case 37://A
                    r_hero.phis.vx=hero.phis.vx-hero.a;
                    break;
                    case 83:case 40://S
                    r_hero.phis.vy+=hero.a;
                    break;
                    case 32:
                        r_hero.phis.ax=0;
                        r_hero.phis.ay=0;
                        r_hero.phis.vx=Math.round(hero.phis.vx/2);
                        r_hero.phis.vy=Math.round(hero.phis.vy/2);
                        break;
                    default:
                        console.log('Recieved unknown key ',key);
                }
            }
        };
        socket.onerror = function (error) {
            console.log('WebSocket error: ' + error);
        };
        socket.chat=function(data){
            socket.send('{"chat":"'+data+'"}');
            return true;
        };
        this.socket=socket;
    }
}
