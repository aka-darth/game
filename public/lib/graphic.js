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
    //MAIN LOOP
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
