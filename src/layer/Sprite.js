(function(){

    var Sprite = P.module(P.Overlay,{
        options:{type : "sprite" , currentFrame:0 , frame:30},

        _onAfterAdd : function(){
            var width = this.options.width,
                height= this.options.height;

            var name = P.stamp(this),
                krpano = this.pano.krpano,
                id = "hotspot['"+name+"'].";

            krpano.set(id+"crop","0|"+this.options.currentFrame*height+"|"+width+"|"+height);

            this._anim();
        },

        _anim:function(){
            var local = this;
            var width = this.options.width,
                height= this.options.height,
                durarion= this.options.durarion,
                frame = this.options.frame;
            this.options.currentFrame++;
            if(this.options.currentFrame>=durarion)
                this.options.currentFrame = 0;

            var krpano = this.pano.krpano,
                id = "hotspot['"+P.stamp(this)+"'].";
            krpano.set(id+"crop","0|"+this.options.currentFrame*height+"|"+width+"|"+height);

            setTimeout(function(){
                local._anim();
            },1000/frame);

        }
    });

    P.sprite = function(opts){
        return new Sprite(opts);
    }
}());