/**
 * 可拖拽点
 */
;(function(){
    var Marker = P.module(P.Overlay , {
        options : {
            draggable : false,
            type : "marker"
        },
        ctor : function(options){
            options = P.setOptions(this , options);
            this._position = options.position;
            this._bind();
        },

        setDraggable : function(v){
            if(this.options.draggable != v){
                this.options.draggable = v;
            }
        },

        _bind : function(){
            this.addEventListener("mousedown" , this._onMouseDown , this);
        },

        _onMouseDown:function(){
            if(this.options.draggable){
                //热点屏幕位置
                var cur = this.getPosition();
                cur = this.pano.project(cur.x,cur.y);
                var p = this.pano.getMousePosition();
                this.offset = [p.x - cur.x , p.y - cur.y];
                this.pano.addEventListener("mouseup",this._onMouseUp,this);
                this.addEventListener("mouseup",this._onMouseUp,this);
                this.pano.addEventListener("mousemove",this._onMouseMove , this);

            }
        },
        _onMouseUp:function(){
            this.pano.removeEventListener("mouseup",this._onMouseUp);
            this.removeEventListener("mouseup",this._onMouseUp);
            this.pano.removeEventListener("mousemove",this._onMouseMove, this);
        },
        _onMouseMove:function(){

            var p = this.pano.getMousePosition();

            var tx = p.x - this.offset[0],
                ty = p.y - this.offset[1];

            var proj = this.pano.unproject(tx, ty);
            this.setPosition( proj );
            this.trigger("drag",{position:proj});
            this.pano.trigger("overlay_drag",{position:proj});
        }
    });

    P.marker = function(opts){
        return new Marker(opts);
    }
}());