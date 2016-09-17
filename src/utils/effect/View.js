;(function(){
    var ACT = {
        "planet":'tween(view.architectural, 0.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion,1.0, distance(1.0,0.8));tween(view.fov,150, distance(150,0.8));tween(view.vlookat,90, distance(100,0.8));add(new_hlookat, view.hlookat, 123.0);tween(view.hlookat, get(new_hlookat), distance(100,0.8));',
        "architectural":'if(view.vlookat LT -80 OR view.vlookat GT +80,tween(view.vlookat, 0.0, 1.0, easeInOutSine);tween(view.fov,100, distance(150,0.8)););tween(view.architectural, 1.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion,0.0, distance(1.0,0.5));',
        "normal":'if(view.vlookat LT -80 OR view.vlookat GT +80,tween(view.vlookat, 0.0, 1.0, easeInOutSine);tween(view.fov,100, distance(150,0.8)););tween(view.architectural, 0.0, distance(1.0,0.5));tween(view.pannini,0.0, distance(1.0,0.5));tween(view.distortion, 0.0, distance(1.0,0.5));'
    }

    P.Pano.include({
        "setView":function(type){
            if(this.krpano && ACT[type])
                this.krpano.call(ACT[type]);
        }
    });
}());