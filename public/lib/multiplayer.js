Multiplayer={
    socket:false,
    id:false,
    heros:[],
    init:function(){
        //Return
        Graphic.paused=false;
        if(this.socket)return;
        var socket = new WebSocket('ws://192.168.1.26');
        socket.onopen = function(){
            socket.send('{"event":"noob","hero":'+JSON.stringify(hero)+',"stamp":"'+Date.now()+'"}');
            console.log('{"event":"noob","hero":'+JSON.stringify(hero)+',"stamp":"'+Date.now()+'"}');
        };
        socket.onmessage = function (message) {
            try{
                var data = JSON.parse(message.data);
//                console.log('Server say:',data);
            }catch(e){
                console.log('Check your JSON:\n==================\n',message,'\n=================\n');
            }
            Multiplayer.router(data);
        };
        socket.onerror = function (error) {
            console.log('WebSocket error: ' + error);
        };
        this.socket=socket;
        st:setInterval(function(){Multiplayer.socket.send('{"event":"sync","hero":'+JSON.stringify(hero)+',"id":"'+Multiplayer.id+'"}');},config.syncinterval||1000)
    },
    sendkey:function(key){
        this.socket.send('{"event":"key","id":"'+Multiplayer.id+'","key":"'+key+'"}');
    },
    chat:function(data){
        this.socket.send('{"chat":"' + data + '","id":"'+Multiplayer.id+'"}');
    },
    start:function(data){
        Multiplayer.id=data.id;
        Graphic.canvas.width=data.frame.w;
        Graphic.canvas.height=data.frame.h;
        Animations.canvas.width=data.frame.w;
        Animations.canvas.height=data.frame.h;
    },
    router:function(data){
        switch(data.event){
            case "init":
                this.start(data);
                break;
            case "key":
                var r_hero = Multiplayer.heros[data.id];
                switch (parseInt(data.key)) {
                    case 87:
                    case 38://W
                        r_hero.phis.vy -= r_hero.a;
                        break;
                    case 68:
                    case 39://D
                        r_hero.phis.vx += r_hero.a;
                        break;
                    case 65:
                    case 37://A
                        r_hero.phis.vx = r_hero.phis.vx - r_hero.a;
                        break;
                    case 83:
                    case 40://S
                        r_hero.phis.vy += r_hero.a;
                        break;
                    case 32:
                        r_hero.phis.ax = 0;
                        r_hero.phis.ay = 0;
                        r_hero.phis.vx = Math.round(r_hero.phis.vx / 2);
                        r_hero.phis.vy = Math.round(r_hero.phis.vy / 2);
                        break;
                }
                break;
            case "noob":
                console.log(data);
                Multiplayer.heros[data.id]=data.hero;
                Multiplayer.heros[data.id].name='hero '+data.id;
                Multiplayer.heros[data.id].phis.name='hero'+data.id;
                Multiplayer.heros[data.id].phis=Phisical.create(Multiplayer.heros[data.id].phis,data.stamp);
                console.log('New hero!',data.id,Multiplayer.heros[data.id]);
                break;
            case "sync_req":
                Multiplayer.socket.send('{"event":"sync_resp","hero":'+JSON.stringify(hero)+',"id":"'+Multiplayer.id+'","to":"'+data.to+'"}');
                break;
            case "sync":
                console.log(data.hero.phis);
                var model=Phisical.get('hero'+data.id);
                for(var key in model){
                    if(key!="name")model[key]=(typeof data.hero.phis[key]=="undefined")?data.hero.phis[key]:model[key];
                }
                break;
            default:
                console.log("Socket unknown request",data);
        }
    }
};

