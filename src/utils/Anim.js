(function(){
    P.anim = {};

    var list = [];
    var stamp = 0;

    function add(opts)
    {

        list[++stamp] = {
            value : opts.value || 1000,
            time:opts.time || 1000,//ms
            onUpdate : opts.onUpdate,
            onComplete:opts.onComplete,
            _start : new Date().getTime(),
            id : stamp
        }
        return stamp;
    }

    function remove(id){
        if(list[id])
        {
            list[id] = null ; delete list[id]
        }
    }

    function tick(){
        var n = new Date().getTime();
        for(var i in list){
            var t = n - list[i]._start,
                c = list[i].value,
                d = list[i].time,
                id = list[i].id;

            // t b c d
            var value = easing.decel(t , 0 , c , d);
            if(list[i].onUpdate)
                list[i].onUpdate(value , t);

            if( t >= list[i].time){
                if(list[i].onComplete)
                    list[i].onComplete(id , value);
                remove(id);
            }
        }

        requestAnimationFrame(tick);
    };

    tick();


    P.anim = {
        add : add,
        remove : remove
    }

    var easing = {

        /**
         * @param t: Number - current time. from 0.0
         * @param b: Number - beginning value.
         * @param c: Number - change in value(delta value), calc(endValue - beginningValue)
         * @param d: Number - duration time. (unit: ms)
         * @returns {number}
         */
        decel : function(t, b, c ,d){
            // v = v0 + at0 , v = 0 , t0 = d
            // => v0 = -ad;
            // 0 -> c
            var a  = - c * 2 / (d * d),
                v0 = 0 - a * d;
            return v0 * t + a * t * t /2;

            /*
            //使用另一端计算
             var a = c * 2 / (d * d),
             v = a * (d - t);
             return v * t + a * t * t /2;
            * */
        },
        accel : function(t,b,c,d){
            var a  = - c * 2 / (d * d);
            return a * t * t /2;
        }
    };
}());