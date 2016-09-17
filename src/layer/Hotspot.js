(function(){
    var ease = {
        'bounce':function(t , d){
            var dt = t % d;
            dt = Math.sin( Math.PI * dt / d);
            return Math.round( -25 * dt);
        }
    }
    var Hotspot = P.module(P.Overlay,{
        options:{type : "hotspot",animation:'none',frame:30},
        _onAfterAdd : function(){
            if(this.options.animation.toLocaleLowerCase()!= 'none') this.setAnimate();
        },

        _process : function(){

            var local = this,
                frame = this.options.frame,
                type = this.options.animation.toLocaleLowerCase();
            if(this.pano){
                var
                    krpano = this.pano.krpano,
                    id = "hotspot['"+P.stamp(this)+"'].",
                    oy = ease[type](++this.currentFrame, frame);
                krpano.set(id+"oy",oy+'%');
            }

            this.anim_handler = setTimeout(function(){
                local._process();
            },1000/frame);

        },
        setAnimate:function(v){
            if(v === null){
                clearTimeout(this.anim_handler);
            }else{
                this.currentFrame = 0;
                this._process();
            }
        }
    });

    P.hotspot = function(opts){
        return new Hotspot(opts);
    }
}());