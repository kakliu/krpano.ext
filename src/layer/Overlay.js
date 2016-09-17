(function(){
    var Overlay = P.module({
        mixin : P.events,

        options : {"type":"overlay",'keep':false},

        _position : {x:0 , y:0},

        ctor : function(options)
        {
            options = P.setOptions(this , options);
            this._position = options.position;
        },

        focus : function(){
            /*if(this.pano)
                this.pano.krpano.call("looktohotspot("+this.id+")");*/
        },

        setPano:function(pano){
            if(pano === null){
                if(this.pano){
                    this.pano.removeOverlay(this);
                    this.pano = null;
                }
            }else{
                this.pano = pano;
                this.pano.addOverlay(this);
                this._update();
            }
            return this;
        },


        setIcon : function(url){
            var id = P.stamp(this) ;
            this.pano.krpano.set("hotspot['"+id+"'].url", P.path(url));
        },

        setVisible : function(v){
            if(this.pano)
                this.pano.krpano.set("hotspot['"+P.stamp(this)+"'].visible" , !!v);
        },

        setPosition:function(v){
            this._position = v; this._update();
            return this;
        },

        getPosition : function(){
            var id = P.stamp(this);
            var instance = this.pano.krpano.get("hotspot['"+id+"'].name");
            if(instance){
                this._position.x = this.pano.krpano.get("hotspot['"+id+"'].ath");
                this._position.y = this.pano.krpano.get("hotspot['"+id+"'].atv");
            }

            return this._position;
        },

        _update : function(){
            var id = "hotspot['" + P.stamp(this) + "'].";
            if(this.pano.krpano){
                var instance = this.pano.krpano.get(id + "name");
                if(instance){
                    this.pano.krpano.set(id + "ath",this._position.x);
                    this.pano.krpano.set(id + "atv",this._position.y);
                }
            }
        },

        _onAdd : function(){
            var options = this.options,
                name = P.stamp(this),
                position = this._position || {x:0 , y:0},
                edge = options.edge || "bottom",
                krpano = this.pano.krpano,
                pano = this.pano,
                id = "hotspot['"+name+"'].";
            krpano.call("addhotspot('"+name+"')");
            krpano.set(id+"keep",!!options.keep);
            krpano.set(id+"ath",position.x);
            krpano.set(id+"atv",position.y);
            krpano.set(id+"url",P.path(options.icon  || 'icons/marker.png'));
            krpano.set(id+"edge",edge);
            krpano.set(id+"onclick",pano.opa("overlay_click",name));
            krpano.set(id+"ondown",pano.opa("overlay_mousedown",name));
            krpano.set(id+"onup",pano.opa("overlay_mouseup",name));
            this._onAfterAdd();
        },
        _onAfterAdd : function(){

        }
    });

    P.Overlay = Overlay;

    P.overlay = function(opts){
        return new Overlay(opts);
    };


    P.Pano.include({
        /**
         * 添加热点 热区
         * @param obj
         */
        addOverlay : function(obj){
            var id = P.stamp(obj);
            if(this._overlays[id]) return obj;
            this._overlays[id] = obj;
            this.whenReady( obj._onAdd , obj);
        },

        removeOverlay:function(obj){
            var id = P.stamp(obj);
            this.krpano.call("removehotspot('"+id+"')");
            delete this._overlays[id];
        },

        setOverlayVisible:function(v){
            for(var i in this._overlays){
                this._overlays[i].setVisible(!!v);
            }
        }
    });

    /*P.Pano.initHooks.push(function(){
        this.addEventListener("ready",function(){
            console.log(this._overlays)
            for(var i in this._overlays)
            {
                console.log(this._overlays[i])
                if('__add__' in this._overlays[i]){
                    this._addOverlayReady(this._overlays[i]);
                }
            }
        },this)
    });*/
}());