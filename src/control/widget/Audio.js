;(function() {
    function AudioControl(pano) {
        this.pano = pano;
        this.dom = {};
        this.ctor();
    }

    AudioControl.prototype = {
        ctor : function(){
            this._initScene();
            this._bind();
        },
        setPano : function(pano){
            pano._addControl( this.el );
            return this;
        },
        load : function(url){
            if(url) this.dom.audio.src = url;
        },
        play : function(url){
            if(url) this.dom.audio.src = url;
            this.dom.audio.play();
        },
        stop : function(){
            this.dom.audio.pause();
        },
        _initScene:function(){
            this.el = P.dom.create("div",null,null);
            this.dom.btn = P.dom.create("div",null,'icon-sound icon-mute',"position:absolute;top:5px;right:5px;height:32px;width:32px;background-color:rgba(0,0,0,0.5);",this.el);
            this.dom.audio = P.dom.create("audio",null,null,"width:1px;height:1px;right:0;top:0;margin:auto;position:absolute;visibility: hidden;",this.el,{controls:"controls"/*,autoplay:"autoplay"*/});
        },
        _bind : function(){

            var local = this;
            var audio = local.dom.audio;
            $(this.dom.btn).on("click" , function(){
                if(audio.paused){
                    audio.play();
                    $(local.dom.btn).removeClass('icon-mute');
                }else{
                    audio.pause();
                    $(local.dom.btn).addClass('icon-mute');
                }
            });

        }
    }


    P.Control.AudioControl = AudioControl;
    P.control.AudioControl = function(opts){
        return new AudioControl(opts);
    }
    //P.Pano.controls.push(AudioControl);

    //P.Pano.controls.push(VideoControl);
}());