AI={//Искуственные мозги
    collect:[],
    ship_attack:false,
    delta:1100,
    prev:0,
    brside:1,
    brrrr:false,
    think:function(total){//Вообще то по хорошему это step.
        for(var key in Phisical.collect){
            if(Phisical.collect[key].mind){
                var el=Phisical.collect[key];
                if(AI.brrrr){
                    el.ax=(AI.brside*400)/(hero.phis.x-el.x);
                    el.ay=(AI.brside*400)/(hero.phis.y-el.y);
                }else{
                    el.ax+=(1-Math.random()*2);
                    el.ay+=(1-Math.random()*2);
                }

                /*		if(el.clever){
                 var tx=(hero.phis.x-el.x)/Math.abs(hero.phis.x-el.x);
                 var ty=(hero.phis.y-el.y)/Math.abs(hero.phis.y-el.y);

                 var sx=(hero.phis.x+el.x)/2;
                 var sy=(hero.phis.y+el.y)/2;

                 var dx=Math.abs(hero.phis.x-el.x)-(hero.phis.w+el.w)/2-2;
                 var dy=Math.abs(hero.phis.y-el.y)-(hero.phis.h+el.h)/2-2;

                 var who;
                 if(who=Phisical.is_empty_place(sx-dx/2,sy-dy/2,dx,dy)){
                 console.log('Place not empty:'+who.name+' '+sx+','+sy+','+dx+','+dy);
                 }else{
                 console.log('Place empty'+sx+','+sy+','+dx+','+dy);
                 }
                 }
                 */	}
        }
    },
    step:function(total){//А это ship_attack
        AI.think(total);
        if(this.ship_attack && (total-this.prev)>this.delta){
            var t=Math.floor(Math.random()*6)+1;
            Phisical.create({
                x:880,
                y:Math.round(Math.random()*Graphic.canvas.height),
                vx:-((t+4)*hero.phis.max_v/7),
                max:(t+4)*hero.phis.max_v/7,
                image:'img/ship_'+t+'.png',
                dyn:true,
                jumpy:true,
                mind:true,
                destroyable:false,
                name:'Ship'+t+'-'+Phisical.collect.length
            });
            this.prev=total;
        }
    }
}
