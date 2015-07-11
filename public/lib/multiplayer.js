/* Хорошему коду комментарии не нужны */
/*
* TODO: отключение, загрузка карты (а не только ширины и высоты), комнаты у сокетов (на сервере)
*/
Multiplayer={
    socket:false,
    id:false,
    heros:[],
    init:function(){
        Graphic.paused=false;
        if(this.socket)return;
//        var socket = new WebSocket('ws://192.168.1.26');
//        var socket = new WebSocket('ws://127.0.0.1');
        var socket = new WebSocket('ws://10.4.4.34');
        socket.onopen = function(){
            socket.send('{"event":"noob","hero":'+JSON.stringify(hero)+',"stamp":"'+Date.now()+'"}');
            console.log('Multiplayer ready.');
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
            console.error('WebSocket error: ' + error);
        };
        Multiplayer.socket=socket;
        st:setInterval(function(){Multiplayer.socket.send('{"event":"sync","hero":'+JSON.stringify(hero)+',"id":"'+Multiplayer.id+'","time":"'+Date.now()+'"}');},config.syncinterval||1000);
    },
    /*
    * Отсылает код клавиши на сервер
    * @param код клавиши
    */
    sendkey:function(key){
        this.socket.send('{"event":"key","id":"'+Multiplayer.id+'","key":'+key+'}');
    },
    /*
    * Отслыает строку на сервер
    */
    chat:function(data){
        this.socket.send('{"chat":"' + data + '","id":"'+Multiplayer.id+'"}');
    },
    /* Готовит игру к многопользовательскому режиму.
    * @param object настройки,полученные с сервера
    */
    start:function(data){
        Multiplayer.id=data.id;
        Graphic.canvas.width=data.frame.w;
        Graphic.canvas.height=data.frame.h;
        Animations.canvas.width=data.frame.w;
        Animations.canvas.height=data.frame.h;
    },
    /* Разбирает сообщения с сервера
    * @param object сообщение с сервера
    */
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
                    case 69:case "69":
                        var t=Phisical.create({
                            name:'bullet',
                            bulletof:'hero'+data.id,
                            x:Multiplayer.heros[data.id].phis.x+Multiplayer.heros[data.id].phis.w,
                            y:Multiplayer.heros[data.id].phis.y,
                            vx:70,
                            max_v:70,
                            w:2,
                            h:2,
                            destroyable:true,
                            destroyer:true,
                            color:'#ff0000',
                            dyn:true
                        });

                        console.log(t);
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
//                console.log(Date.now(),data.time,Date.now()-data.time);
                var model=Phisical.get('hero'+data.id);
                for(var key in model){
                    if(key!="name")model[key]=(typeof data.hero.phis[key]!="undefined")?data.hero.phis[key]:model[key];
                }
                break;
            default:
                console.log("Socket unknown request",data);
        }
    }
};

