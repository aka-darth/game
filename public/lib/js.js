nextshot=0;
/* TODO:
 Fix:
 rounding! Only x&y must be rounded.
 atmosphere...fuck.

 ? create presets (objects,animations)

 saves:
 fix img saves (need another separator)
 save uni settings
 dont save default values



 metric system,convert to pixels

 +Static layer ->
 +Animations (loop/one time) ->
 spf нахуй
 clone image fix


 Phisical lookaround method
 AI lookaround method

 multiobjects

 Destroyers:
 +self-destroyable
 radius destroy
 master of bullets

 map listing for uround uni

 Server-side ->
 Multiply saves,download&upload saves
 multiplayer (if its real)
 Screenshot?
 custom elements: imageData convert to png
 rotate!!
 */
function after_load(){
    //Interface.look_at(get('Gen1'))    ;
//	Phisical.collect=[];
    //get('Stat jumpy5').clever=true;
    if(Graphic.paused)Graphic.anyway=true;//Один кадр то отрисовать надо
}
function save(flag){//Это надо запихнуть в один из объектов
    if(flag=='t'){
        localStorage.save=document.getElementById('save_editor').value;
        return true;
    }
    var data='';
    for(var key in Phisical){
        switch(key){
            case "Ctime":case "vyaz":case "stop":case "gravity":case "uround":
            data+=key+Interface.save_separators[2]+Phisical[key]+Interface.save_separators[1];
            break;
            default:
        }
    }
    data+=Interface.save_separators[0];
    for(var i in Phisical.collect){
        if(Phisical.collect[i].name!='hero'){
            for(var j in Phisical.collect[i]){
                //Defaults
                switch(j){
                    case "dyn":if(Phisical.collect[i][j]==false)continue;break;
                    case "w":if(Phisical.collect[i][j]==1)continue;break;
                    case "h":if(Phisical.collect[i][j]==1)continue;break;
                    case "ax":if(Phisical.collect[i][j]==0)continue;break;
                    case "ay":if(Phisical.collect[i][j]==0)continue;break;
                    case "max_v":if(Phisical.collect[i][j]==0)continue;break;
                    case "vx":if(Phisical.collect[i][j]==0)continue;break;
                    case "vy":if(Phisical.collect[i][j]==0)continue;break;
                    case "jumpy":if(Phisical.collect[i][j]==false)continue;break;
                    case "destroyable":if(Phisical.collect[i][j]==false)continue;break;
                    case "destroyer":if(Phisical.collect[i][j]==false)continue;break;
                    case "mind":if(Phisical.collect[i][j]==false)continue;break;
                    case "bulletof":if(Phisical.collect[i][j]==false)continue;break;
                }
                if(j=="image"){
                    data+=j+Interface.save_separators[2]+Phisical.collect[i][j].src+Interface.save_separators[1];
                }else{
                    data+=j+Interface.save_separators[2]+Phisical.collect[i][j]+Interface.save_separators[1];
                }
            }
            data+=Interface.save_separators[0];
        }
    }
    if(flag=='g'){
        document.getElementById('save_editor').value=data;
        return true;
    }else{
        localStorage.save=data;
        return true;
    }
}
function get(name){//Совершенно необходимая команда в консоли. Она может поймать даже пулю!
    for(var key in Phisical.collect){
        if(Phisical.collect[key].name==name){
            Interface.look_at(Phisical.collect[key]);
            return Phisical.collect[key];
        }
    }
    return false;
}
function ship_attack(){
    if(AI.ship_attack){
        AI.ship_attack=false;
    }else{
        hero.frag=0;
        AI.delta=4000;
        document.getElementById('frag').style.display='block';
        AI.ship_attack=true;
    }
}
function need_repair(){
    for(var i in Phisical.collect){
        var el=Phisical.collect[i];
        if(isNaN(el.x)){
            console.log(el.name+' need repair');
        }
        if(isNaN(el.y)){
            console.log(el.name+' need repair');
        }
        if(isNaN(el.vx)){
            console.log(el.name+' need repair');
        }
        if(isNaN(el.vy)){
            console.log(el.name+' need repair');
        }
    }
}

window.onload=function(){
    Uni={
        load:function(data){
            if(data){
                var t=data.split(Interface.save_separators[0]);
                var b=t[0].split(Interface.save_separators[1]);
                for(var j=0;j<b.length-1;j++){
                    var hg=b[j].split(Interface.save_separators[2]);
                    Phisical[hg[0]]=hg[1];
                }
                for(var i=1;i<t.length-1;i++){
                    var b=t[i].split(Interface.save_separators[1]);
                    var n={};
                    var d=false;
                    for(var j=0;j<b.length-1;j++){
                        var hg=b[j].split(Interface.save_separators[2]);
                        switch(hg[0]){
                            case "name":
                                if(get(hg[1])){
                                    d=true;
                                    console.log('Loader:Find double!');
                                }
                            case "image":case "color":
                            n[hg[0]]=hg[1];
                            break;
                            case "jumpy":case "dyn":case "mind":
                            n[hg[0]]=(hg[1]=="true")?true:false;
                            break;
                            default:n[hg[0]]=parseFloat(hg[1]);
                        }
                    }
                    if(d){
                        Phisical.destroy(n.name);
                        //continue;
                    }
                    Phisical.create(n);
                }
                console.log('Map Loaded');
            }
        },
        save:function(flag){
            if(flag=='t'){
                localStorage.save=document.getElementById('save_editor').value;
                return true;
            }
            var data='';
            for(var key in Phisical){
                switch(key){
                    case "Ctime":case "vyaz":case "stop":case "gravity":case "uround":
                    data+=key+Interface.save_separators[2]+Phisical[key]+Interface.save_separators[1];
                    break;
                    default:
                }
            }
            data+=Interface.save_separators[0];
            for(var i in Phisical.collect){
                if(Phisical.collect[i].name!='hero'){
                    for(var j in Phisical.collect[i]){
                        //Defaults
                        switch(j){
                            case "color":if(Phisical.collect[i][j]=="#000000")continue;break;
                            case "dyn":if(Phisical.collect[i][j]==false)continue;break;
                            case "w":if(Phisical.collect[i][j]==1)continue;break;
                            case "h":if(Phisical.collect[i][j]==1)continue;break;
                            case "ax":if(Phisical.collect[i][j]==0)continue;break;
                            case "ay":if(Phisical.collect[i][j]==0)continue;break;
                            case "max_v":if(Phisical.collect[i][j]==0)continue;break;
                            case "vx":if(Phisical.collect[i][j]==0)continue;break;
                            case "vy":if(Phisical.collect[i][j]==0)continue;break;
                            case "jumpy":if(Phisical.collect[i][j]==false)continue;break;
                            case "destroyable":if(Phisical.collect[i][j]==false)continue;break;
                            case "destroyer":if(Phisical.collect[i][j]==false)continue;break;
                            case "mind":if(Phisical.collect[i][j]==false)continue;break;
                            case "bulletof":if(Phisical.collect[i][j]==false)continue;break;
                        }
                        if(j=="image"){
                            data+=j+Interface.save_separators[2]+Phisical.collect[i][j].src+Interface.save_separators[1];
                        }else{
                            data+=j+Interface.save_separators[2]+Phisical.collect[i][j]+Interface.save_separators[1];
                        }
                    }
                    data+=Interface.save_separators[0];
                }
            };
            if(flag=='g'){
                document.getElementById('save_editor').value=data;
                return true;
            }else{
                localStorage.save=data;
                return true;
            }
        }
    }
    Interface={//Обратная связь управления
        history:[],
        mode:'build',
        save_separators:['|~|',',~,',':~:'],
        controls:['dyn','w','h','x','y','ax','ay','max_v','vx','vy','name','jumpy','destroyable','destroyer','mind','image','color'],
        look:function(){//Every shot update
            if(this.looking_el){
                var el=this.looking_el;
                document.getElementById('info').style.display='block';
                for(var i in this.controls){
                    var control=document.getElementById('lookat_'+Interface.controls[i]);
                    if(control.id=="lookat_image")continue;
                    switch(control.type){
                        case "number":
                            control.value=parseFloat(this.looking_el[this.controls[i]]);
                            break;
                        case "checkbox":
                            control.checked=this.looking_el[this.controls[i]];
                            break;
                        case "color":case "text":default:
                        //console.log(control);
                    }
                }
            }
        },
        look_at:function(el){//Start looking,init listeners
            this.looking_el=el;
            for(var i in this.controls){
                var control=document.getElementById('lookat_'+this.controls[i]);
                if(control.id=="lookat_image"){
                    if(el.image){
                        console.log(el.image);
                        Drawer.canvas.width=el.image.width+20;
                        Drawer.canvas.height=el.image.height+20;
                        Drawer.pp.drawImage(el.image,10,10);
                        Drawer.pp.fillText(el.name,10,10);
                    }
                    continue;
                }
                switch(control.type){
                    case "number":case "text":
                    control.value=el[this.controls[i]];
                    break;
                    case "checkbox":
                        control.checked=el[this.controls[i]];
                        break;
                    case "color":
                        if(el.color){
                            control.value=el.color;
                            Drawer.canvas.width=el.w+20;
                            Drawer.canvas.height=el.h+20;
                            Drawer.pp.fillStyle=el.color;
                            Drawer.pp.fillRect(10,10,el.w,el.h);
                            Drawer.pp.fillText(el.name,10,10);
                        }
                        break;
                    default:
                        console.log(control);
                }
                control.onchange=function(){
                    var c=this.id.split('lookat_')[1];
                    if(!Interface.looking_el){
                        return false;
                    }
                    switch(this.type){
                        case "color":
                            Interface.looking_el.color=this.value;
                            Drawer.pp.clearRect(0,0,Drawer.canvas.width,Drawer.canvas.height);
                            Drawer.pp.fillStyle=Interface.looking_el.color;
                            Drawer.pp.fillRect(10,10,Interface.looking_el.w,Interface.looking_el.h);
                            Drawer.pp.fillText(Interface.looking_el.name,10,10);
                            break;
                        case "number":
                            Interface.looking_el[c]=parseFloat(this.value);
                            break;
                        case "text":
                            Interface.looking_el[c]=this.value;
                            break;
                        case "checkbox":
                            Interface.looking_el[c]=this.checked;
                            break;
                            break;
                        case "image":case "text":
                        break;
                        default:
                            console.log('Unknown control!');
                            console.log(control);
                    }
                    Graphic.anyway=true;
                }
            }
            document.getElementById('look_but').onclick=function(){
                Interface.looking_el=false;
                document.getElementById('lookat_destroy').style.display='none';
                this.innerHTML='Generate';
                this.onclick=function(){Interface.create();}
                return false;
            }
            document.getElementById('look_but').innerHTML='Stop looking';
            document.getElementById('lookat_destroy').style.display='block';
            document.getElementById('lookat_destroy').onclick=function(){
                Phisical.destroy(Interface.looking_el.name);
                Interface.looking_el=false;
                this.style.display='none';
            }
            console.log('look at '+el.name);
        },
        create:function(){
            var el={}
            for(var i in this.controls){
                var control=document.getElementById('lookat_'+Interface.controls[i]);
                if(control.id=="lookat_image")continue;
                switch(control.type){
                    case "color":
                    case "text":
                        el[this.controls[i]]=control.value;
                        break;
                    case "number":
                        el[this.controls[i]]=parseFloat(control.value);
                        break;
                    case "checkbox":
                        el[this.controls[i]]=control.checked;
                        break;
                    default:
                        console.log(control);
                }
            }
            var el=Phisical.create(el);
            Graphic.anyway=true;
            Interface.look_at(el);
            if(Interface.mode=='build'){
                hero.phis=el;
            }
        }
    }
    Phisical={//Физика
        stop:false,//Это вакуум
        gravity:0,//
        uround:true,//Замыкание вселенной
        vyaz:0.5,//Вязкость воздуха
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
        is_empty_place:function(x,y,w,h){//Пусто ли свято место?
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
        create:function(data){//создать физический объект
            var name=data.name;
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
    controller={//Управление
        keys:[],
        customhero:function(){//Это должно быть в Interface
            var imageData =document.getElementById('hero').getContext('2d').getImageData(0,0,100,100);
            /*r,g,b,a r,g,b,a ...
             //r,g,b,a r,g,b,a ...
             // ...
             var empty_x=true;
             for(var i=3;i<imageData.width;i+=4){
             var empty_y=true;
             for(var j=3;j<imageData.height;j+=4){
             if(imageData[i*imageData.width+j]!=0){
             empty_y=false;
             empty_x=false;
             break;
             }
             }
             if(empty_y){

             }
             }
             */
            hero.phis.casual=imageData;
            hero.phis.w=imageData.width;
            hero.phis.h=imageData.height;
        },
        init:function(){
            if(localStorage.save){
                Uni.load(localStorage.save);
            }
            Animations.canvas.onmousedown=function(e){
                var el=Phisical.is_empty_place(e.offsetX,e.offsetY);
                if(el){
                    Interface.look_at(el);
                }else{
                    console.log(e.offsetX+','+e.offsetY);
                    if(!Interface.looking_el){
                        document.getElementById('lookat_x').value=e.offsetX;
                        document.getElementById('lookat_y').value=e.offsetY;

                        /*						Phisical.create({
                         name:'bullet',
                         bulletof:'hero',
                         x:hero.phis.x+hero.phis.w*Math.abs(e.offsetX-hero.phis.x)/(e.offsetX-hero.phis.x),
                         y:hero.phis.y+hero.phis.h*Math.abs(e.offsetY-hero.phis.y)/(e.offsetX-hero.phis.y),
                         vx:e.offsetX-hero.phis.x,
                         vy:e.offsetY-hero.phis.y,
                         max_v:70,
                         w:2,
                         h:2,
                         destroyable:true,
                         destroyer:true,
                         color:'#ff0000',
                         dyn:true
                         });
                         */					}else{
                        Interface.history.push({name:Interface.looking_el.name,x:Interface.looking_el.x,y:Interface.looking_el.y});
                        Interface.looking_el.x=e.offsetX;
                        Interface.looking_el.y=e.offsetY;
                        Graphic.anyway=true;
                    }
                }
            }
            document.onkeydown=function(e){
                var code = e.which;
                switch(e.which){
                    case 80://P
                        Graphic.paused=true;
                        Graphic.pp.font='30px bold Arial';
                        Graphic.pp.fillText('Пауза',Graphic.canvas.width/2-50,Graphic.canvas.height/2-15);
                        Graphic.pp.font='10px sans-serif';
                        break;
                    case 71://G
                        Graphic.paused=false;
                        break;
                    case 70://F
                        if(Graphic.paused)Graphic.anyway=true;
                        break;
                    default:
                        if(controller.keys.indexOf(code)<0){
                            controller.keys.push(code);
                        }
                }
            }
            document.onkeyup=(function(e){
                switch(e.which){
                    case 80://P
                        Graphic.paused=true;
                        Graphic.pp.font='30px bold Arial';
                        Graphic.pp.fillText('Пауза',Graphic.canvas.width/2-50,Graphic.canvas.height/2-15);
                        Graphic.pp.font='10px sans-serif';
                        break;
                    case 71://G
                        Graphic.paused=false;
                        break;
                    case 90://Z
                        if(e.ctrlKey && Interface.history.length>0){
                            var t=Interface.history[Interface.history.length-1];
                            get(t.name).x=t.x;
                            get(t.name).y=t.y;
                            Graphic.anyway=true;
                        }
                        break;
                    case 70://F
                        if(Graphic.paused)Graphic.anyway=true;
                        break;
                    case 69://E Выстрел
                        Phisical.create({
                            name:'bullet',
                            bulletof:'hero',
                            x:hero.phis.x+hero.phis.w,
                            y:hero.phis.y,
                            vx:70,
                            max_v:70,
                            w:2,
                            h:2,
                            destroyable:true,
                            destroyer:true,
                            color:'#ff0000',
                            dyn:true
                        });
                    case 81://Q
                        break;
                    case 107://+
                        if(Interface.looking_el){
                            if(e.altKey){
                                Interface.looking_el.h+=10;
                            }else{
                                Interface.looking_el.w+=10;
                            }
                        }
                        break;
                    case 109://-
                        if(Interface.looking_el){
                            if(e.altKey){
                                Interface.looking_el.h-=10;
                            }else{
                                Interface.looking_el.w-=10;
                            }
                        }
                        break;
                    default:
                    //console.log(e.which);
                }
                controller.keys.splice(controller.keys.indexOf(e.which),1);
            });
        },
        move:function(){//Обработка нажатых клавиш (еще есть в init)
            this.keys.forEach(function(item){
                switch(item){
                    case 87:case 38://W
                        socket.sendkey(item);
                        hero.phis.vy-=hero.a;
                    break;
                    case 68:case 39://D
                        socket.sendkey(item);
                        hero.phis.vx+=hero.a;
                    break;
                    case 65:case 37://A
                        socket.sendkey(item);
                        hero.phis.vx=hero.phis.vx-hero.a;
                    break;
                    case 83:case 40://S
                        socket.sendkey(item);
                        hero.phis.vy+=hero.a;
                    break;
                    case 32:
                        socket.sendkey(item);
                        hero.phis.ax=0;
                        hero.phis.ay=0;
                        hero.phis.vx=Math.round(hero.phis.vx/2);
                        hero.phis.vy=Math.round(hero.phis.vy/2);
                        break;
                    default:
                    //console.log(item);
                }
            });
        }
    }
    Animations={//Анимации
        collect:[],//bool loop,int frames_x,int frames_y,img,bool active,int frame_per_shot,  int x,int y   int spf
        presets:{
            init:function(){
                this.explosion=Animations.create({
                    image:'img/explosions.png',
                    frames_x:16,
                    frames_y:8,
                    loop:false,
                    last_x_frame:16,
                    last_y_frame:0
                });
            }
        },
        create:function(data){
            //if img already loaded, use it
            var img=new Image();
            var n={
                loop:data.loop||false,
                frame_x:data.frame_x||0,
                frame_y:data.frame_y||0,
                frames_x:data.frames_x||0,
                frames_y:data.frames_y||0,
                img:img,
                active:false,
                spf:data.spf||1,
                x:data.x||Math.ceil(Math.random()*this.canvas.width),
                y:data.y||Math.ceil(Math.random()*this.canvas.height),
                delay:0
                //private
            }
            n.last_x_frame=(data.last_x_frame>n.frames_x)?n.frames_x-1:data.last_x_frame-1;
            n.last_y_frame=(data.last_y_frame>n.frames_y)?n.frames_y-1:data.last_y_frame-1;
            img.src=data.image;
            img.onload=function(){
                n.frame_width=n.img.width/n.frames_x;
                n.frame_height=n.img.height/n.frames_y;
                n.x=n.x-n.frame_width/2;
                n.y=n.y-n.frame_height/2;
                n.prev={x:n.x,y:n.y};
                n.active=data.active||false;
            }
            this.collect.push(n);
        },
        init:function(){
            this.canvas=document.getElementById("animations");
            this.canvas.height=window.innerHeight-20;
            this.canvas.width=document.body.clientWidth-350;
            this.pp=this.canvas.getContext('2d');
            this.presets.init();
        },
        shot:function(time){
            for(var i in Animations.collect){
                if(Animations.collect[i].active){
                    var a=Animations.collect[i];

                    if(a.spf>a.delay){
                        a.delay++;
                        continue;
                    }
                    a.delay=0;

                    Animations.pp.clearRect(a.prev.x,a.prev.y,a.frame_width,a.frame_height);
                    a.prev={x:a.x,y:a.y};
                    Animations.pp.drawImage(a.img,a.frame_x*a.frame_width,a.frame_y*a.frame_height,a.frame_width,a.frame_height,a.x,a.y,a.frame_width,a.frame_height);
                    if(a.frame_x>a.last_x_frame){
                        a.frame_x=0;
                        if(a.frame_y>a.last_y_frame){
                            if(a.loop){
                                a.frame_y=0;
                            }else{
                                a.active=false;
                            }
                        }else{
                            a.frame_y++;
                        }
                    }else{
                        a.frame_x++;
                    }
                }
            }
        }
    },
    Graphic={//Это почти бог.
            def_color:'black',
            paused:true,
            shownames:true,
            init:function(){
                this.canvas=document.getElementById("canvas");
                this.canvas.height=window.innerHeight-20;
                this.canvas.width=document.body.clientWidth-350;
                this.pp=this.canvas.getContext('2d');
                Animations.init();
                controller.init();
                Drawer.init();

                //Поехали!!
                this.shots_time=new Array();
                this.prevtime=0;
                controller.AFr=window.requestAnimationFrame(this.shot,this.canvas);
                console.log('Engine loaded');
                after_load();
            },
            shot:function(time){//Отрисовка кадра. Выполнения этой функции - это удары сердца игры.
                Graphic.shots_time.push( 1000/(time-Graphic.prevtime) );
                if(Graphic.shots_time.length>24){
                    Graphic.shots_time.splice(0,1);
                }
                if(!Graphic.paused || Graphic.anyway){
                    Graphic.anyway=false;
                    AI.step(time);
                    Phisical.recalculate(time-Graphic.prevtime);

                    Animations.shot(time);

                    var Spf=Graphic.shots_time.reduce(function(prev, curr){
                        return prev+curr;
                    });

                    Graphic.pp.clearRect(0,0,Graphic.canvas.width,Graphic.canvas.height);

                    var E=0;
                    Phisical.collect.forEach(function(item,key,array){

                        if(item.casual){
                            Graphic.pp.putImageData(item.casual,item.x-item.w/2,item.y-item.h/2);
                        }else if(item.image){
                            Graphic.pp.drawImage(item.image,item.x-item.w/2,item.y-item.h/2);
                            if(Graphic.shownames)Graphic.pp.fillText(item.name,item.x-item.w/2,item.y-item.h/2);
                        }else{
                            if(item.color)Graphic.pp.fillStyle=item.color;
                            Graphic.pp.fillRect(item.x-item.w/2,item.y-item.h/2,item.w,item.h);
                            if(Graphic.shownames)Graphic.pp.fillText(item.name,item.x-item.w/2,item.y-item.h/2);

                            //				Animations.pp.fillRect(item.x-item.w/2,item.y-item.h/2,item.w,item.h);
                            //				if(Graphic.shownames)Animations.pp.fillText(item.name,item.x-item.w/2,item.y-item.h/2);

                            if(item.color)Graphic.pp.fillStyle=Graphic.def_color;
                        }

                        var g=(item.w*item.h)*(item.vx*item.vx+item.vy*item.vy)/2;
                        E=isNaN(g)?E:(E+g);

                    });


                    //Отрисовка
                    Graphic.pp.fillText('FPS:'+Math.round(Spf/Graphic.shots_time.length),10,11);
                    Graphic.pp.fillText('Objects:'+Phisical.collect.length,10,22);
                    Graphic.pp.fillText('Uni total Energy:'+Math.round(E),10,33);
                    if(Graphic.paused){
                        Graphic.pp.font='30px bold Arial';
                        Graphic.pp.fillText('Пауза',Graphic.canvas.width/2-50,Graphic.canvas.height/2-15);
                        Graphic.pp.font='10px sans-serif';
                    }
                }
                Graphic.prevtime=time;
                window.requestAnimationFrame(Graphic.shot,Graphic.canvas);
            }
        }
    hero={//Мой герой всегда со мной
        name:'hero',
        a:7,
        frag:0,
        phis:Phisical.create({
            w:30,h:30,x:450,y:180,max:30,dyn:true,color:'#FF9900',jumpy:true,name:'hero',destroyer:true
        }),
        reset:function(){//Ну почти всегда.. иногда надо его вернуть
            if(get(this.phis.name)){
                this.phis.vx=0;
                this.phis.vy=0;

                //Тут надо что то вроде while  !phis .is_empty_place x=rand y=rand
                this.phis.x=Graphic.canvas.width/2;
                this.phis.y=Graphic.canvas.height/2;
            }else{
                Graphic.paused=true;
                Graphic.pp.fillText('Герой мёртв!',200,200);
            }
        }
    }
    Brushadow2={//Кисточка для рисования
        name:'Brushadow2',
        size:3,
        pre:{x:false,y:false},
        color:document.getElementById('Brushadow2_color').value,
        pre:{x:false,y:false},
        draw:function draw(e){
            if(Brushadow2.pre.x!==false){
                Drawer.pp.beginPath();
                Drawer.pp.moveTo(Brushadow2.pre.x,Brushadow2.pre.y);
                Drawer.pp.lineTo(e.offsetX,e.offsetY);
                Drawer.pp.fill();
                Drawer.pp.stroke();
            }
            Brushadow2.pre.x=e.offsetX;
            Brushadow2.pre.y=e.offsetY;
        },
        draw_start:function(e){
            Drawer.pp.beginPath();
            Brushadow2.pre.x=e.offsetX;
            Brushadow2.pre.y=e.offsetY;
            Drawer.pp.lineWidth=this.size;
            Drawer.pp.fillStyle='transparent';
            Drawer.pp.shadowBlur=this.size/10;
            Drawer.pp.lineCap='round';
            Drawer.pp.shadowColor=this.color;
        }
    }
    Drawer={//Эта штука рисует в canvas в панели объекта.
        alpha:0.1,
        init:function(){
            this.canvas=document.getElementById("lookat_image");
            this.canvas.height=50;
            this.canvas.width=50;
            this.pp=this.canvas.getContext('2d');
            this.shtuka=Brushadow2;
            this.canvas.onmousedown=this.draw_start;
        },
        history:{
            states:new Array(),
            currentstate:0,
            forward:function(){
                if(this.currentstate<this.states.length){
                    console.log(this.currentstate);
                    this.currentstate++;
                    this.restore();
                    console.log(this.currentstate);
                }else if(this.currentstate==this.states.length){
                    this.restore();
                }
                console.log(this.currentstate+" "+this.states.length);
            },
            back:function(){
                console.log();
                if(this.currentstate>0){
                    this.currentstate--;
                    this.restore();
                }
            },
            add:function(){
                this.states[this.currentstate]=Drawer.pp.getImageData(0,0,Drawer.canvas.width,Drawer.canvas.height);
                this.currentstate++;
            },
            restore:function(){
                Drawer.pp.putImageData(this.states[this.currentstate],0,0,0,0,Drawer.canvas.width,Drawer.canvas.height);
            }
        },
        draw_start:function(e){
            Drawer.history.add();
            Drawer.pp.fillStyle=Drawer.hexToRgbA(Drawer.shtuka.color,Drawer.alpha);
            Drawer.pp.strokeStyle=Drawer.hexToRgbA(Drawer.shtuka.color,Drawer.alpha);
            Drawer.pp.shadowColor=Drawer.shtuka.color;
            document.onmouseup=function(){
                console.log('Draw end:'+Drawer.shtuka.name);
                Drawer.shtuka.pre={x:false,y:false};
                document.onmousemove=null;
            }
            Drawer.shtuka.draw_start(e);
            console.log('Draw start:'+Drawer.shtuka.name+','+Drawer.shtuka.color);
            document.onmousemove=Drawer.shtuka.draw;
        },
        hexToRgbA:function(hex,alpha){
            var c;
            if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
                c= hex.substring(1).split('');
                if(c.length== 3){
                    c= [c[0], c[0], c[1], c[1], c[2], c[2]];
                }
                c= '0x'+c.join('');
                return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+alpha+')';
            }
            throw new Error('Bad Hex');
        },
        try_restore:function(side){
            switch(side){
                case "f":
                    Drawer.history.forward();
                    break;
                case "b":
                    Drawer.history.back();
                    break;
            }
        },
        go_select:function(){

        },
        selection:{
            show:function(){

            }
        }
    }
    //Ready Go
    Graphic.init();
}