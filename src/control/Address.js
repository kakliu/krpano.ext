;(function(){
    function Address(pano){
        this.pano = pano;
        this.ctor();
    }

    Address.prototype = {
        ctor : function(){
            this.initScene();
            console.log('init addr' , Date.now())
            this.pano.addEventListener("pano_changed",this.onChanged , this);
        },

        initScene : function(){
            this.el = P.dom.create("div" , null , "pano-control-address", "position: absolute; left:5px;top: 5px;display:block;font-size:12px;text-shadow: rgba(0, 0, 0,0.8) 1px 1px 3px;color:#fff;padding:8px;background-color: rgba(0,0,0,.4);");
            this._address = P.dom.create("div",null,"pano-control-ars","border-bottom:rgba(255,255,255,0.6) solid 1px;padding:5px 0;",this.el);
            this._date = P.dom.create("div",null,"pano-control-imagedate","padding:5px 0;",this.el);
            //this.setDate();
        },

        onChanged : function(){
            console.log("listen onchanged : " , Date.now())
            var panoData = this.pano.panoData;
            var time = panoData.imageDate;
            var copy = panoData.copyright;
            var desc = panoData.location.shortDesc;
            console.log(panoData.location)

            copy = "&copy;</a href='#'>"+ copy + "</a>";
            var self = this;
            this._date.innerHTML = copy + "<span style='float:right;padding-left: 10px;'>拍摄时间:" + time+"</span>";
            this._address.innerHTML = desc;
        }
    }

    P.control.address = function(opts){
        return new Address(opts);
    }

}());