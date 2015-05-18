Phisical={//Физика
    stop:false,//Это вакуум
    gravity:0,//
    uround:true,//Замыкание вселенной
    vyaz:0.2,//Вязкость воздуха
    Ctime:500,//Коэффицент перевода милисекунд в физическое время мира
    collect:new Array(),//Здесь лежат все физические объекты
    recalculate:function(dt){//Пересчет всех характеристик
        controller.move();//Пора и о юзере вспомнить. Что он там поделывает?
        for(var i=0;i<this.collect.length;i++){
            if(this.collect[i].dyn){
                var target=this.collect[i];
                if(this.gravity){
                    target.ay=this.gravity;//(target.ay<this.gravity)?target.ay+(this.gravity/2):target.ay;
                }
                if(this.stop){
                    target.vx=Math.ceil(target.vx + (target.vx*this.vyaz - target.ax)*dt/this.Ctime);
                    target.vy=Math.ceil(target.vy + (target.ay)*dt/this.Ctime);
                }else{
                    target.vx=target.vx+target.ax*(dt/this.Ctime);
                    target.vy=target.vy+target.ay*(dt/this.Ctime);
                }

                //Ограничитель скорости
                if(Math.abs(target.vx)>target.max_v){
                    target.vx=(target.vx>0)?(target.max_v):(-target.max_v);
                }
                if(Math.abs(target.vy)>target.max_v){
                    target.vy=(target.vy>0)?(target.max_v):(-target.max_v);
                }

                //Перерасчет координат..
                var next={
                    ox:target.x,
                    oy:target.y,
                    x:Math.round(target.x+target.vx*(dt/this.Ctime)),
                    y:Math.round(target.y+target.vy*(dt/this.Ctime)),
                    w:target.w,
                    h:target.h
                }

                //Вылет за край карты..
                if(Phisical.uround){
                    if(next.y>Graphic.canvas.height){next.y-=Graphic.canvas.height;next.oy=0;}
                    if(next.x>Graphic.canvas.width){next.x-=Graphic.canvas.width;next.ox=0;}
                    if(next.y<0){next.y=Graphic.canvas.height-next.y;next.oy=Graphic.canvas.height;}
                    if(next.x<0){next.x=Graphic.canvas.width-next.x;next.ox=Graphic.canvas.width;}
                }else{
                    if((next.y>Graphic.canvas.height || next.x>Graphic.canvas.width || next.y<0 || next.x<0) && target.name!='hero' && !target.mind){
                        Phisical.destroy(target.name);//Нах он нужен,коли улетел..
                    }

                }

                //Столкновения?
                next=this.findCollision(next,i);
                target.x=next.x;
                target.y=next.y;
                //Перерасчет в случае столкновения
                if(next.collision.x || next.collision.y){
                    Phisical.do_collision(next.collision,target);
                }
            }
        }
        Interface.look();
    },
    sync:function(target,dt){
        if(this.gravity){
            target.ay=this.gravity;//(target.ay<this.gravity)?target.ay+(this.gravity/2):target.ay;
        }
        if(this.stop){
            target.vx=Math.ceil(target.vx + (target.vx*this.vyaz - target.ax)*dt/this.Ctime);
            target.vy=Math.ceil(target.vy + (target.ay)*dt/this.Ctime);
        }else{
            target.vx=target.vx+target.ax*(dt/this.Ctime);
            target.vy=target.vy+target.ay*(dt/this.Ctime);
        }
        //Ограничитель скорости
        if(Math.abs(target.vx)>target.max_v){
            target.vx=(target.vx>0)?(target.max_v):(-target.max_v);
        }
        if(Math.abs(target.vy)>target.max_v){
            target.vy=(target.vy>0)?(target.max_v):(-target.max_v);
        }
        //Перерасчет координат..
        var next={
            ox:target.x,
            oy:target.y,
            x:Math.round(target.x+target.vx*(dt/this.Ctime)),
            y:Math.round(target.y+target.vy*(dt/this.Ctime)),
            w:target.w,
            h:target.h
        }

        //Вылет за край карты..
        if(Phisical.uround){
            if(next.y>Graphic.canvas.height){next.y-=Graphic.canvas.height;next.oy=0;}
            if(next.x>Graphic.canvas.width){next.x-=Graphic.canvas.width;next.ox=0;}
            if(next.y<0){next.y=Graphic.canvas.height-next.y;next.oy=Graphic.canvas.height;}
            if(next.x<0){next.x=Graphic.canvas.width-next.x;next.ox=Graphic.canvas.width;}
        }else{
            if((next.y>Graphic.canvas.height || next.x>Graphic.canvas.width || next.y<0 || next.x<0) && target.name!='hero' && !target.mind){
                Phisical.destroy(target.name);//Нах он нужен,коли улетел..
            }

        }

        //Столкновения?
        next=this.findCollision(next,Phisical.collect.length-1);
        target.x=next.x;
        target.y=next.y;
        //Перерасчет в случае столкновения
        if(next.collision.x || next.collision.y){
            Phisical.do_collision(next.collision,target);
        }
        console.log(target);

    },
    is_empty_place:function(x,y,w,h){
    //Пусто ли свято место?

//			Animations.pp.clearRect(x,y,w,h);
        Animations.pp.fillStyle='rgba(0,0,0,0.1)';
        Animations.pp.fillRect(x,y,w,h);
        w=Math.abs(w)||0;
        h=Math.abs(h)||0;
        for(var key in this.collect){
            var el=this.collect[key];
            if(Math.abs(el.x-x)<(el.w+w)/2 && Math.abs(el.y-y)<(el.h+h)/2){
                return el;
            }
        }
        return false;
    },
    findCollision:function(ball,target){//Проверка столкновения
        var x=ball.x;
        var y=ball.y;
        var collision={};
        for(var i=0;i<this.collect.length;i++){
            if(i!=target){//then try to find collisions...
                var goal=this.collect[i];
                collision.goal=goal;
                //Определение направления движения
                if(ball.oy>ball.y){
                    var Cy=-1;
                }else{
                    var Cy=1;
                }
                if(ball.ox>ball.x){
                    var Cx=-1;
                }else{
                    var Cx=1;
                }
                // если он стал за обьектом                                 и   не был за объектом до этого
                if( Cx*( goal.x - Cx*goal.w/2  )  <  Cx*( ball.x + Cx* ball.w/2) && Cx*(goal.x-Cx*goal.w/2) > Cx*(ball.ox-Cx*ball.w/2)){
                    //Место возможного столкновения
                    var col_x=goal.x - Cx*(goal.w/2 + ball.w/2);
                    var col_y=ball.oy + (ball.y-ball.oy)*(ball.ox-ball.x)/(col_x-ball.x);
                    //Проверка места столкновения по второй оси
                    if((col_y+ball.h/2)>(goal.y-goal.h/2) && (col_y-ball.h/2)<(goal.y+goal.h/2)){
                        collision.x=true;
                        return {x:col_x,y:col_y,collision:collision};
                    }
                }
                // если он стал за обьектом                                 и   не был за объектом до этого
                if( Cy*( goal.y - Cy*goal.h/2  )  <  Cy*( ball.y + Cy* ball.h/2) && Cy*goal.y > Cy*ball.oy ){
                    //Место возможного столкновения
                    var col_y = goal.y - Cy *(goal.h/2 + ball.h/2);
                    var col_x=(ball.x-ball.ox)*(ball.oy-ball.y)/(col_y-ball.y)+ball.ox;
                    //Проверка места столкновения по второй оси
                    if((col_x+ball.w/2)>(goal.x-goal.w/2) && (col_x-ball.w/2)<(goal.x+goal.w/2)){
                        collision.y=true;
                        return {x:col_x,y:col_y,collision:collision};
                    }
                }

            }
        }
        return {x:x,y:y,collision:false};
    },
    do_collision:function(collision,ball){//Если предыдущий метод нашел столкновение
        console.log('Collision!'+ball.name+' -> '+collision.goal.name);
        //ball.oncollision();
        //collision.goal.oncollision();
        if(ball.destroyable && collision.goal.destroyer){
            if(collision.goal.destroyable && ball.destroyer){
                Phisical.destroy(collision.goal.name);
                console.log('doublekill!');
            }
            Animations.create({
                image:'img/explosions.png',
                frames_x:16,
                frames_y:8,
                loop:false,
                active:true,
                x:ball.x,
                y:ball.y,
                last_x_frame:16,
                last_y_frame:0,
                spf:2
            });
            Phisical.destroy(ball.name);
            if(collision.goal.name==hero.phis.name || collision.goal.bulletof==hero.phis.name){
                hero.frag++;
                document.getElementById('frag').innerHTML=hero.frag;
                AI.delta=(AI.delta>150)?AI.delta-100:150;
            }

            console.log(collision.goal.name+' destroy '+ball.name+' frag '+hero.frag+' delta '+AI.delta);

        }else if(collision.goal.destroyable && ball.destroyer){
            Animations.create({
                image:'img/explosions.png',
                frames_x:16,
                frames_y:8,
                loop:false,
                active:true,
                x:collision.goal.x,
                y:collision.goal.y,
                last_x_frame:16,
                last_y_frame:0,
                spf:2
            });
            Phisical.destroy(collision.goal.name);
            if(ball.name==hero.phis.name || collision.goal.bulletof==hero.phis.name){
                hero.frag++;
                document.getElementById('frag').innerHTML=hero.frag;
                AI.delta=(AI.delta>150)?AI.delta-100:150;
            }
            console.log(ball.name+' destroy '+collision.goal.name+' frag '+hero.frag+' delta '+AI.delta);

            if(ball.destroyable && collision.goal.destroyer){
                Phisical.destroy(ball.name);
                console.log('doublekill!');
            }
        }else{//No any destroy..
            if(collision.x){
                if(ball.jumpy){
                    if(collision.goal.jumpy){//Упругий удар
                        var gw=collision.goal.w*collision.goal.h;
                        var bw=ball.w*ball.h;
                        var v=ball.vx-collision.goal.vx;

                        collision.goal.vx=(2*bw)/(bw+gw)*v;
                        ball.vx=(bw-gw)/(bw+gw)*v;
                    }else{
                        ball.vx=-ball.vx;
                        ball.ax=-ball.ax;
                    }
                }else{
                    if(collision.goal.jumpy){
                        collision.goal.vx=ball.vx;
                        ball.vx=0;
                    }else{//Не упругий удар
                        collision.goal.vx=ball.vx;
                        ball.vx=0;
                    }
                }
            }
            if(collision.y){
                if(ball.jumpy){
                    if(collision.goal.jumpy){
                        var gw=collision.goal.w*collision.goal.h;
                        var bw=ball.w*ball.h;
                        var v=ball.vy-collision.goal.vy;

                        collision.goal.vy=(2*bw)/(bw+gw)*v;
                        ball.vy=(bw-gw)/(bw+gw)*v;
                    }else{
                        ball.vy=-ball.vy;
                        ball.ay=-ball.ay;
                    }
                }else{
                    ball.vy=0;
                }
            }
        }
        if(!ball.dyn){
            Graphic.paused=true;
            Graphic.pp.font='50px bold';
            Graphic.pp.fillText('Static ball!!',100,100);
            console.log(ball);
        }
        if(!collision.goal.dyn){
            collision.goal.vx=0;
            collision.goal.vy=0;
        }
    },
    create_preset:function(type){//это не работает
        switch(type){
            case "bullet":

                break;
            case "w_wall":
                var n={
                    w:200,
                    h:2
                }
            case "h_wall":
                if(!n)var n={w:2,h:200};
                n.jumpy=true;
                Phisical.create(n);
                break;
            default:
        }
    },
    create:function(data,timestamp){//создать физический объект
        var name=data.name;
        //Short war with doubles
        while(get(name)){
            name=name+Math.ceil(Math.random()*10);
        }

        var new_o={
            dyn:data.dyn||false,
            w:data.w||1,
            h:data.h||1,
            x:data.x||Math.floor(Math.random()*Graphic.canvas.width),
            y:data.y||Math.floor(Math.random()*Graphic.canvas.height),
            ax:data.ax||0,
            ay:data.ay||0,
            max_v:data.max||data.max_v||0,
            vx:data.vx||0,
            vy:data.vy||0,
            name:name,
            jumpy:data.jumpy||false,
            destroyable:data.destroyable||false,
            destroyer:data.destroyer||false,
            mind:data.mind||false,
            bulletof:data.bulletof||false
        }
        if(data.image){
            var img=new Image();
            img.src=data.image;
            img.onload=function(){
                new_o.image=this;
                new_o.w=this.width;
                new_o.h=this.height;
            }
        }else{
            new_o.color=data.color||false;
        }
        //new_o.oncollision=data.oncollision||function(){return false;};
        if(timestamp){
            var dt=Graphic.shots_time[Graphic.shots_time.length-1]-timestamp;
            console.log('Sync dt',dt,Date.now()-timestamp);

//            Phisical.sync(new_o,timestamp);
        }
        this.collect.push(new_o);
        return new_o;
    },
    destroy:function(name){//уничтожить физический объект
        for(var key in Phisical.collect){
            if(Phisical.collect[key].name==name){
                Phisical.collect.splice(key,1);
                return true;
            }
        }
        return false;
    }
}
