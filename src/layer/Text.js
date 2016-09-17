/**
 * 文字覆盖物类
 */
(function(){
    var Text = P.module({

        mixin : P.events,

        options : {"type":"text",'keep':false},

        _position : {x:0 , y:0},

        _el : null,

        ctor : function(options)
        {
            options = P.setOptions(this , options);
            this._position = options.position;
            this._el = P.dom.create("div",null,"pano-overlay-custom", "position: absolute; left:0;top: 0;");
            if(options.html){
                this._el.innerHTML = options.html;
            }
        },

        focus : function(){

        },

        setPano:function(pano){
            if(pano === null){
                if(this.pano){
                    this.pano.removeText(this);
                    this.pano = null;
                }
            }else{
                this.pano = pano;
                this.pano.addText(this);
                this._update();
            }
            return this;
        },

        setContent : function(html){

        },


        setPosition:function(v){
            this._position = v; this._update();
            return this;
        },

        getPosition : function(){
/*            var id = P.stamp(this);
            var instance = this.pano.krpano.get("hotspot['"+id+"'].name");
            if(instance){
                this._position.x = this.pano.krpano.get("hotspot['"+id+"'].ath");
                this._position.y = this.pano.krpano.get("hotspot['"+id+"'].atv");
            }

            return this._position;*/
        },

        _update : function(){
            var s_p = this.pano.project(this._position.x,this._position.y);
            this._el.style['left'] = s_p.x + 'px';
            this._el.style['top']  = s_p.y + 'px';
        },

        _onAdd : function(){
            this.pano.addEventListener("pov_changed" , this._update , this);
            this._update();
        },

        _onRemove : function(){
            this.pano.removeEventListener("pov_changed" , this._update);
        }
    });

    P.Text = Text;

    P.text = function(opts){
        return new Text(opts);
    };


    P.Pano.include({
        /**
         * 添加文字 热区
         * @param obj
         */
        /*addText : function(obj){
            if(this._overlays_text) this._overlays_text = {};
            var id = P.stamp(obj);
            if(this._overlays_text[id]) return obj;
            this._overlays_text[id] = obj;
            this.whenReady( obj._onAdd , obj);
        },

        removeText:function(obj){
            if(this._overlays_text) this._overlays_text = {};
            var id = P.stamp(obj);
            if(this._overlays_text[id]){
                delete this._overlays_text[id];
            }

        }*/
    });

    P.Pano.initHooks.push(function () {
        var el = P.dom.create("div", null, "pano-layer-custom", "position: absolute; left:0;top: 0;");

        this._overlays_text = {};

        this._addControl(el);

        this.addText = function(obj){

            var id = P.stamp(obj);
            el.appendChild(obj._el);
            this._overlays_text[id] = obj;
            this.whenReady( obj._onAdd , obj);
        }
    });
}());