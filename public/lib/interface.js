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
