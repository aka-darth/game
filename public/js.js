nextshot=0;
/* TODO:
 Физику перенести на свою систему координат, отличную от пикселей, добавить методы перерасчета в пиксели.
 Пролистывание карты для незацикленных вселенных


 Fix:
Физика: округлятся должны только x и y! Избавить скорости и ускорения от всех округлений.
        вязкость воздуха - ужасна.переписать

 ? create presets (objects,animations)
    создать пресеты объектов по типам (стены,пули)

 saves:
 Надо избавиться от сохранения дефолтных настроек чтоб облегчить файл, т.к. они при загрузке по дефолту установятся. И в этом должны помочь пресеты
 fix img saves (need another separator)
 save uni settings

 +Static layer ->
 +Animations (loop/one time) ->
 clone image fix ???


 Phisical lookaround method
 AI lookaround method

 multiobjects

 Destroyers:
 +self-destroyable
 radius destroy
 master of bullets



 Server-side ->
 Multiply saves,download&upload saves
 multiplayer (if its real) //I DO IT!
 Screenshot?
 custom elements: imageData convert to png
 */

//Временные функции. Не использовать их в модулях!
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

//Точка входа
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

    //Мой герой всегда со мной
    hero={
        name:'hero',
        a:2,
        frag:0,
        phis:Phisical.create({
            w:30,h:30,x:450,y:180,max:70,dyn:true,color:'#FF9900',jumpy:true,name:'hero',destroyer:true
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