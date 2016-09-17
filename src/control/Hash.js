;(function(){
    var hash = P.hash;
    var hashControl = function(pano , pov){
        pano.addEventListener("pano_changed",function(){
            hash.set({"panoid":pano.panoid})
        });
        if(pov == true){
            var handler = P.throttle(function(){
                var pov = pano.getPov();
                hash.set({"heading":parseInt(pov.x) , "pitch":parseInt(pov.y)});

            },300,this);
            pano.addEventListener("pov_changed",handler);
        }
        /*window.addEventListener('hashchange',function(){
            hash.render()
        })*/
    }

    P.control.hashControl = function(opts){
        return new hashControl(opts);
    }
}());