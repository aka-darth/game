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
                    if(Multiplayer.socket)Multiplayer.sendkey(item);
                    hero.phis.vy-=hero.a;
                break;
                case 68:case 39://D
                    if(Multiplayer.socket)Multiplayer.sendkey(item);
                    hero.phis.vx+=hero.a;
                break;
                case 65:case 37://A
                    if(Multiplayer.socket)Multiplayer.sendkey(item);
                    hero.phis.vx=hero.phis.vx-hero.a;
                break;
                case 83:case 40://S
                    if(Multiplayer.socket)Multiplayer.sendkey(item);
                    hero.phis.vy+=hero.a;
                break;
                case 32:
                    if(Multiplayer.socket)Multiplayer.sendkey(item);
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