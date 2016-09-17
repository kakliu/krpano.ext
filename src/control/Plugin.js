;(function(){
    P.Pano.include({
        "setGyro":function(v){
            this._gyro = v;
            v = v ? 'true' : 'false';
            var act = 'set(plugin[gyro].enabled,'+v+')';
            if(this.krpano)
                this.krpano.call(act);
        },
        "toggleGyro":function(){
            this.setGyro(!this._gyro)
        }
    });
}());