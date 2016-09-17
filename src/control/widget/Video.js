;(function() {
    function VideoControl(pano) {
        this.pano = pano;
        this.dom = {};
        this.ctor();
    }

    VideoControl.prototype = {
        ctor : function(){
            this._initScene();
            this._bind();
        },

        play : function(url){
            this.dom.video.src = url;
        },
        stop : function(){
            this.dom.video.src = "";
        },
        _initScene:function(){
            this.el = P.dom.create("div",null,null);
            this.dom.btn = P.dom.create("div",null,null,"position:absolute;top:5px;right:5px;height:32px;width:32px;background-color:rgba(0,0,0,0.5);",this.el);
            this.dom.wrap = P.dom.create("div",null,null,"display:none;position:absolute;width:100%;height:100%;top:0;left:0;background-color:rgba(0,0,0,.95)",this.el);
            this.dom.menu = P.dom.create("div",null,null,"position:absolute;height:64px;top:0;left:0;",this.dom.wrap);
            this.dom.video = P.dom.create("video",null,null,"width:auto;height:450px;margin:auto;position:absolute;top:0;left:0;right:0;bottom:0;box-shadow:0 0 2px 1px rgba(255,255,255,.2);",this.dom.wrap,{controls:"controls",autoplay:"autoplay"});
            this.dom.ctrl = P.dom.create("div",null,null,'position:absolute;bottom:10%;width:60%;left:20%;',this.dom.wrap);
            this.dom.ctrl_pay = P.dom.create("div",null,null,"width: 32px;height: 32px;background-color: #fff;float:left;",this.dom.ctrl);
            this.dom.ctrl_time = P.dom.create("div",null,null,"height: 32px;line-height: 32px;color: #fff;width: 64px;float:right;text-align:center;",this.dom.ctrl);
            this.dom.ctrl_progress = P.dom.create("div",null,null,"height: 32px;margin:0 64px;position: relative;",this.dom.ctrl);
            this.dom.ctrl_mask = P.dom.create("div",null,null,"border-top: 1px solid #fff;position: absolute;top: 50%;left: 0;width: 100%;",this.dom.ctrl_progress);
            this.dom.ctrl_cur = P.dom.create("div",null,null," width: 2px;height: 32px;background-color: #4bacff;position: absolute;top: 0;left: 50%;",this.dom.ctrl_progress);

            this.dom.back = P.dom.create("div",null,null,";margin:14px;width:32px;height:32px;border:2px solid #fff;border-radius:32px;",this.dom.menu);
        },
        _bind : function(){
            this.pano.addEventListener("pano_changed" , this._onChanged , this);

            var local = this;

            $(this.dom.btn).on("click" , function(){
                $(local.dom.wrap).fadeIn(300);
                local.play("http://asset.logomap.com/hotel/jiaxing/video1.mp4");
                local.pano.setOverlayVisible(false);
            });

            $(this.dom.back).on("click" , function(){
                $(local.dom.wrap).fadeOut(200);
                local.stop();
                local.pano.setOverlayVisible(true);
            });

            $(this.dom.video).on('timeupdate' , function(e){
                local.dom.ctrl_time.innerHTML = P.date( e.timeStamp , "mm:ss")
            })
        },

        _onChanged : function(e){


            var data = this.pano.panoData.poi_data.description;
        }
    }


    P.Control.VideoControl = VideoControl;
    P.control.videoControl = function(opts){
        return new VideoControl(opts);
    }

    //P.Pano.controls.push(VideoControl);
}());