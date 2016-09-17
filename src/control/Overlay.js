/**
 * 覆盖物管理器
 */
;(function(){
    function OverlayControl(pano){
        this.pano = pano;
        this.ctor();
        this.overlays = [];
    }

    OverlayControl.prototype = {
        ctor : function(){
            this.pano.addEventListener("pano_changed" , this.onChanged , this);
            this.pano.addEventListener("overlay_click" , this.onChanged , this);
        },

        onChanged : function(){
            this.clear();
            var provider = this.pano.options.provider;
            if(provider && provider.getPanoById){
                var id = this.pano.panoid,
                    local = this;
                provider.getPoiById(id , function(resp){
                    local.data = resp;
                    local.pano.trigger("poi_ready" , {data:local.data});
                    local.render();
                })
            }
        },
        clear : function(){
            for(var i in this.overlays){
                this.overlays[i].setPano(null)
            }
        },

        render : function(){
            var data = this.data, pano = this.pano;
            for(var i in data)
            {
                this.overlays.push(
                    P.hotspot({'position':{x:data[i].lon , y:data[i].lat}})
                        .setPano(pano)
                );
            }
        }
    }

    P.Control.Overlay = OverlayControl;
    P.control.overlay = function(opts){
        return new OverlayControl(opts);
    }

}());