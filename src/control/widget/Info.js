;(function() {
    function InfoControl(pano) {
        this.pano = pano;
        this.ctor();
        this.data = "";
    }

    InfoControl.prototype = {
        ctor : function(){
            this._initScene();
            this._bind();
        },

        _initScene:function(){

            this.el = P.dom.create("div",null,"p-ctrl-info-btn","position:absolute;top:85px;left:5px;height:42px;width:42px;background-color:rgba(0,0,0,0.5);");
        },

        _bind : function(){
            var local = this;
            this.pano.addEventListener("pano_changed" , this._onChanged , this);
            $(this.el).on('click' , function(){
                local.pano.trigger("show_text",{data:local.data});
            });
        },

        _onChanged : function(e){
            this.data = this.pano.panoData.poi_data.description;
        }
    }


    P.Control.InfoControl = InfoControl;
    P.control.infoControl = function(opts){
        return new InfoControl(opts);
    }

    //P.Pano.controls.push(InfoControl);
}());

(function() {
    function Info(pano) {
        this.pano = pano;
        this.ctor();
    }

    Info.prototype = {
        ctor: function () {
            this._initScene();
            this._initEvents();
            this.pano.showText = function(str){
                this.trigger('show_text',{data:str})
            }
        },
        _initScene: function () {
            this.el = P.dom.create("div", null, 'p-info', "display:none;");
            this.content = P.dom.create("div", null, null, "position:absolute;width:80%;height:60%;top:20%;left:10%;background-color:rgba(0,0,0,.8);color:#fff;line-height:1.9em;padding:32px 15px;box-sizing:border-box;overflow-y: auto;z-index:9999;", this.el);
            this.close = P.dom.create("div", null, 'p-ctrl-info-close', "position:absolute;right:0;width:32px;height:32px;top:20%;background-color:rgba(0,0,0,.8);font-size:16px;text-align:center;", this.content);
            this.close.innerHTML = '×';
        },
        _initEvents: function () {
            var local = this;
            this.pano.addEventListener("show_text", this._onActive, this);
            $(this.close).on("click", function () {
                $(local.el).fadeOut(200);
            })
        },
        _onActive: function (e) {
            this.show(e.data);
        },
        show: function (str) {alert(str)
            this.content.innerHTML = str;

            $(this.el).fadeIn(300);
        }
    }

    P.Pano.controls.push(Info);

}());