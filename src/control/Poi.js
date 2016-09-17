;(function(){
    function poiControl(pano){
        this.pano = pano;
        this.ctor();
        this.overlays = [];
    }

    poiControl.prototype = {
        ctor : function(){
            this.pano.addEventListener("pano_changed" , this.onChanged , this);
            this.pano.addEventListener("overlay_click" , this.onClick , this);
            this.pano.addEventListener("zoom_changed" , this.onZoomChanged , this);
        },

        onZoomChanged:function(){
            console.log(this.pano.getZoom())
            this.update();
        },

        onClick:function(e){
            var data = e.target.options.data, pano = this.pano;
            if(data){
                var type = data.type,
                    value = data.type_value;
                //console.log(pano.showText)
                switch(type)
                {
                    case '3':
                        pano.setPano( value );break;
                    case '4':
                        pano.showText ? pano.showText(value) :  pano.trigger('poi_click_type_4',{value:value});break;
                    case '5':
                        pano.trigger('poi_click_type_5',{value:value});break;
                    default:
                        pano.trigger('poi_click_type_'+type,{value:value});break;
                }

            }
            console.log(data);
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

        update:function(){
            var zoom = this.pano.getZoom();
            for(var i in this.overlays){

                var obj = this.overlays[i],
                    data = obj.options.data,
                    z_index = data.z_index;
                if(z_index){
                    if(z_index.indexOf(zoom) == -1){
                        obj.setVisible(false);
                    }else{
                        obj.setVisible(true);
                    }
                }
            }
        },

        render : function(){
            var data = this.data, pano = this.pano;
            var ratio = window.devicePixelRatio || 1;
            for(var i in data)
            {
                this.overlays.push(
                    P
                        .hotspot({'position':{x:data[i].lon , y:data[i].lat} , 'data':data[i] , 'icon':'icons/hotspot-' + data[i].type + '@'+ratio+'x' +'.png','animation':'bounce'})
                        .setPano(pano)
                );
            }
            this.update();
        }
    }

    P.Control.Poi = poiControl;
    P.control.poiControl = function(opts){
        return new poiControl(opts);
    }

}());