;(function(){

    var BLEND = P.BLEND = {
        "no"    : "NOBLEND",
        "cross" : "BLEND(1.0, easeInCubic)",
        "zoom"  : "ZOOMBLEND(1, 1.6, easeInOutSine)",
        "black_out" : "COLORBLEND(2.0, 0x000000, easeOutSine)",
        "white_flash"   : "LIGHTBLEND(1.0, 0xFFFFFF, 2.0, linear)",
        "right_to_left" : "SLIDEBLEND(1.0, 0.0, 0.2, linear)",
        "top_to_bottom" : "SLIDEBLEND(1.0, 90.0, 0.01, linear)",
        "diagonal"  : "SLIDEBLEND(1.0, 135.0, 0.4, linear)",
        "circle"    : "OPENBLEND(1.0, 0.0, 0.2, 0.0, linear)",
        "vertical"  : "OPENBLEND(0.7, 1.0, 0.1, 0.0, linear)",
        "horizontal"    : "OPENBLEND(1.0, -1.0, 0.3, 0.0, linear)",
        "elliptic-zoom" : "OPENBLEND(1.0, -0.5, 0.3, 0.8, linear)"
    };

    var Pano = P.module({

        mixin : P.events,

        statics:{
          controls:[] , initHooks:[]
        },

        options : {
            pov:{"heading":0 , "pitch":0} ,
            fov:150,zoom:1,
            provider: null,
            disableDefaultUI:false,
            addressControl:true ,
            hashControl:true,
            albumControl:true,
            poiControl:true,
            debug:false
        },

        ctor : function(node , options){

            options = P.setOptions(this, options);

            if(!options.provider) options.provider = P.provider.HQT;

            this._overlays = {};

            this._initContainer(node);

            this._initInstance();

            this._initControl();

        },

        getPov:function(){
            return {
                x:this.krpano.get("view.hlookat") || this.options.pov.heading,
                y:this.krpano.get("view.vlookat") || this.options.pov.pitch
            }
        },

        //设置偏航
        setPov : function(obj){
            this.krpano.call("moveto("+obj.heading+","+obj.pitch+")");
            return this;
        },
        //获取视场
        getFov : function(){
            return this.krpano.get("view.fov") || 0;
        },
        //设置视场
        setFov : function(fov){
            this.krpano.call("zoomto("+fov+")");
            return this;
        },

        getZoom : function(){
            return this.options.zoom;
        },

        setVisible : function(visible){
            this._container.style.display = visible ? "block" : "none";
        },

        //设置全景
        setPano : function(panoid){
            if(!panoid || this.panoid == panoid)
                return;
            this.panoid = panoid;
            var local = this;
            if(this.options.provider){
                this.options.provider.getPanoById(panoid , function(resp){
                    local.panoData = resp;
                    var blend = 'ZOOMBLEND(1,1.6,easeInOutSine';
                    var pov = local.getPov();
                    var sug_pov_x = resp._raw.head === null ? pov.x : resp._raw.head;
                    var sug_pov_y = resp._raw.pitch === null ? pov.y : resp._raw.pitch;
                    var config = local.panoData.tiles.getConfig({
                        "id":panoid , "blend":blend ,
                        "x":sug_pov_x , "y":sug_pov_y
                    });
                    local.krpano.call(config);
                });
            }
            return this;
        },

        //设置拖拽方式
        setDragmode : function(v){
            this.krpano.set("control.mousetype",v);return this;
        },

        getMousePosition:function(conv){
            var ix = this.krpano.get("mouse.x"),
                iy = this.krpano.get("mouse.y"),
                po = {x:ix,y:iy};
            if(conv){
                po = this.krpano.screentosphere(ix,iy);
            }

            return po;//{x:ix,y:iy};
        },

        //投影 球面到屏幕
        project:function(h,v){
            return this.krpano.spheretoscreen(h,v);
        },

        //屏幕 到 球面
        unproject:function(x,y){
            return this.krpano.screentosphere(x,y);
        },

        whenReady: function (callback, context) {
            if (this.__ready__) {
                callback.call(context || this);
            } else {
                this.addEventListener('ready',callback,context);
            }
            return this;
        },

        //初始化容器
        _initContainer : function (id) {
            var container = document.getElementById(id);

            if (!container) {
                throw new Error('Pano container not found.');
            } else if (container._pano) {
                throw new Error('Pano container is already initialized.');
            }else{
                this._container = P.dom.create("div","wrap_"+new Date().getTime(),null,'position: absolute; left: 0px; top: 0px; overflow: hidden; width: 100%; height: 100%;',container);
            }
            //this._container = container;
            this._container._pano = true;

            var position = P.dom.getStyle(container, 'position');

            if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
                container.style.position = 'relative';
            }

        },

        // 初始化 krpano 实例
        _initInstance:function(){
            var local = this, options = this.options;

            if(options.krpano){
                local._initEvents(opts.krpano);

            }else{
                embedpano({swf:P.base_lib+'krpano.swf',xml:"", target:this._container.id, html5:"prefer", passQueryParameters:false , basepath:P.base_lib,onready:function(krpano){
                    local._initEvents(krpano);
                },onerror:function(a){
                    alert('error');
                }});
            }
        },

        // 初始化事件
        _initEvents : function(krpano){
            //console.log(krpano)
            //alert(krpano.get("Math.PI"))
            this.krpano = krpano ;
            this.flash = true;//krpano.get("device.flash");
            var local = this;
            id = krpano.id;

            //全局注入 和 反向绑定
            window["__P_hook_"+id] = this;
            krpano.set("control.mousetype","drag2d");
            krpano.set("events.onclick",this.opa('click'));
            krpano.set("events.onmousedown",this.opa('mousedown'));
            krpano.set("events.onmouseup",this.opa('mouseup'));
            krpano.set("events.onnewpano",this.opa('pano_changed'));
            krpano.set("events.onviewchanged",this.opa('pov_changed'));
            krpano.set("events.onxmlcomplete",this.opa('ready'));
            //注入 actions
            //krpano.set("krpano.action[spriteframes]","if(loaded,inc(frame,1,get(frames),0);mul(ypos,frame,frameheight);txtadd(crop,'0|',get(ypos),'|',get(framewidth),'|',get(frameheight));delayedcall(0.02, spriteframes()););");

            //krpano没有 mousemove 事件，从 dom 绑定
            if(krpano.addEventListener){
                krpano.addEventListener("mousemove" , function(e){
                    local._exec(e.type);
                });
            }else{
                krpano.attachEvent('onmousemove' , function(e){
                    local._exec(e.type);
                });
            }

            if(this.options.pano)
                this.setPano(this.options.pano);
        },

        // 初始化控件
        _initControl:function(){
            var options = this.options;
            // 控件元素
            this._container_ctrl = P.dom.create('div','pax-ctrl',null,'',this._container);
            if(Pano.initHooks.length){
                for(var i in Pano.initHooks){
                    Pano.initHooks[i].call( this );
                }
            }
            var defaultUI = !options.disableDefaultUI;
            if(defaultUI){
                if(options.albumControl)
                    this._addControl( P.control.album(this).el );

                if(options.addressControl)
                    this._addControl( P.control.address(this).el );

                if(options.hashControl)
                    this._addControl( P.control.hashControl(this).el );
                if(options.poiControl)
                    this._addControl( P.control.poiControl(this).el );
                if(options.infoControl)
                    this._addControl( P.control.infoControl(this).el );
            }

            if(Pano.controls.length){
                for(var i in Pano.controls){
                    this._addControl( new (Pano.controls[i])(this).el );
                }
            }

            /*document.onselectstart =
            document.oncontextmenu =
            this.krpano.oncontextmenu =
            this.krpano.childNodes[0].oncontextmenu = function(e){
                e.preventDefault()
                e.stopPropagation();
                return false;
            }*/
/*            console.log( this.krpano )
            this.krpano.childNodes[0].addEventListener("click",function(e){
                console.log(e.button)
            });
            console.log("==>",this.krpano.hasEventListener('contextmenu'))
            this.krpano.childNodes[0].addEventListener('contextmenu', function (e){
                console.log(e)
            })*/
            if(this._container.addEventListener){
                this._container.addEventListener('contextmenu', function (e){
                    this.trigger('contextmenu');
                    e.stopPropagation();
                    e.preventDefault();
                },true);
            }else{
                if(this.flash){
                    document.onmousedown = function(e) {
                        if (e.button == 2) {
                            return false;
                        }
                    }
                }
            }


        },

        _addControl : function(el){
            if(el) this._container_ctrl.appendChild(el);
        },

        log : function(str){
          if(this.krpano)
            this.krpano.call("trace('"+str+"')");
        },

        _overlay_hook:function(name){
            var local = this,
                expr = "js(window.__P_hook_"+this.krpano.id+"._exec",

                getValue = function(key){ return local.krpano.get("hotspot['"+name+"']."+key);},

                setValue = function(key , value){
                    local.krpano.set("hotspot['"+name+"']."+key,value);
                }

            //替换表达式
            var parse = function(str , evt){
                if(str == "null" || !str)
                    return local.opa("overlay_"+evt,name);
                else{
                    //匹配出函数名 和 变量
                    str = str.replace(/([\w]+)\(([\w\W]*?)\)(;|$)/g,function(a , b , c ,d){
                        //console.log(b,c);
                        if(b == "setpano" || b == "lookto"){
                            return expr+"("+b+","+c+"))"+d;
                        }else{
                            return a;
                        }
                    })
                }
                return str+";"+local.opa("overlay_"+evt,name);
            }

            setValue("onclick",parse(getValue("onclick"),"click"));
            setValue("ondown",parse(getValue("ondown"),"mousedown"));
            setValue("onup",parse(getValue("onup"),"mouseup"));


            if(!this.flash){
                //overlay.sprite.className = overlay.class;
            }
        },

        //从xml反向收集 overlay,注入 events
        _rebind : function(){
            var krpano = this.krpano, local = this;
            var overlays = this._overlays;
            if(this.flash) {
                var xml = this.krpano.get("xml.content");
                xml.replace(/hotspot.*?name\s*=\s*"(.*?)"/g,function(a,name){
                    overlays[name] = P.hotspot({name:name});
                    overlays[name].pano = local;
                    local._overlay_hook(name);
                });

            }else{
                var items = krpano.get("hotspot").getArray();
                for(var i in items){
                    var name = items[i].name;
                    overlays[name] = P.hotspot({id:name});
                    overlays[name].pano = local;
                    local._overlay_hook(name);
                }
            }
        },

        //脚本转换
        opa : function(evt , data){
            return "js(window.__P_hook_"+this.krpano.id+"._exec('"+evt+"','"+data+"'))";
        },

        _updateFov:function(){
            var krpano = this.krpano;
            if(this._defaultFov === undefined){
                this._defaultFov = krpano.get("view.fov")
            }

            var defaultFov = this._defaultFov;

            if( defaultFov && krpano){
                var zoom = Math.floor( defaultFov / krpano.get("view.fov")  );
                if( zoom == 0) zoom = 1;
                if( this.options.zoom != zoom){
                    this.options.zoom = zoom;
                    this.trigger('zoom_changed');
                }
            }
            //console.log(zoom)
        },

        _exec : function(evt , data){
            var krpano = this.krpano, local = this;

            var ix = krpano.get("mouse.x"),
                iy = krpano.get("mouse.y"),
                po = krpano.screentosphere(ix,iy);

            if(evt == "setpano"){
                this.setPano(data);
            }

            else if(evt == "lookto"){
                this.lookToHotspot(data);
            }

            else if(evt == "pano_changed"){
                //TODO krpano 的加载顺序
                //this._rebind();
                local.trigger(evt , {
                    target:local
                });
            }

            else if(evt == 'pov_changed'){
                local.trigger(evt , {
                    target:local
                });
                // TODO 检测 pov 的变化
                local._updateFov();
            }
            else if(evt == "click" || evt == "mousedown" || evt == "mouseup" || evt =="mousemove"){
                local.trigger(evt , {
                    mouseX:ix , mouseY:iy,
                    position:{y:po.y , x:po.x , z:po.z}
                });
            }

            else if(evt == "overlay_click" || evt == "overlay_mouseup" || evt == "overlay_mousedown"){
                if(local._overlays[data]){

                    local.trigger(evt , {
                        target:local._overlays[data]
                    });
                    local._overlays[data].trigger(evt.replace("overlay_","") , {
                        target:local._overlays[data]
                    });
                }
            } else if(evt == "ready"){
                if(!local.__ready__)
                {
                    //console.log('ready',local.__ready__)
                    //console.log(local.krpano.get("view.fov"))
                    //local._defaultFov = local.krpano.get("view.fov");
                    local.__ready__ = true;
                    local.trigger(evt , {
                        target:local
                    });
                    //console.log('=======>')
                    //local._defaultFov = local.krpano.get("view.fov");
                    //console.log(local._defaultFov)
                }
            } else{
                local.trigger(evt , {
                    target:local
                });
            }
        },

        lookToHotspot:function(v){
            this.krpano.call("looktohotspot("+v+")");
            return this;
        },


        //添加 krpanoxml
        setPano2 : function(str , isxml){
            if(isxml === 0){
                this.krpano.call("loadxml('"+str + "', null, MERGE, BLEND(0.5));");
            }else if(isxml===1){
                this.krpano.call("loadpano(" + str + ", null, MERGE, ZOOMBLEND(1,1.6,easeInOutSine));");
            }
        }
    });

    Pano.include = function(props){
        P.extend(Pano.prototype, props);
    }

    P.Pano = Pano;

    P.pano = function(node , opts){
        return new Pano(node , opts);
    }
}());