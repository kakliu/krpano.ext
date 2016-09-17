(function(){
    if(!window.console){
        window.console = {log:function(){}};
    }
    var ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var escapeMap = {
        '&': '&amp;', '<': '&lt;',  '>': '&gt;',
        '"': '&quot;', "'": '&#x27;', '`': '&#x60;'
    };

    function extend(dest) {
        var sources = arguments  , src, i, j, l;
        dest = dest || {};
        for (i = 1 , l = sources.length; i < l; i++) {
            src = sources[i] || {};
            if (typeof src == 'object') {
                for (j in src) {
                    dest[j] = src[j];
                }
            }
        }
        return dest;
    }

    function parse(str , data){
        return str.replace(/\{ *([\w_]+) *\}/g, function (str, key) {
            var value = data[key];
            if (value === undefined) {
                console.log('No value provided for variable ' + str);
                value = "{" + key + "}";
            } else if (typeof value === 'function') {
                value = value(data);
            }
            return value;
        })
    }

    function has (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key);
    }

    function key (obj){
        var k = [];
        for(var i in obj){
            if(has(obj , i)) k.push(i);
        }
        return k;
    }

    function replace(str,obj){
        //console.log(match)
        return str.replace(RegExp('(?:' + key(obj).join('|') + ')','g') , function(match){
            return obj[match];
        });
    }

    function unescape(str){
        return replace(str , escapeMap);
    }

    function module2()
    {
        var len = arguments.length;
        var C = arguments[0];
        var props = arguments[len - 1];
        var NewClass = typeof props.ctor == "function" ?
            props.ctor :
            function () {
                C.prototype.ctor && C.prototype.ctor.apply(this, arguments);
            };

        var inherit = Object.create || (function () {
                function F() {}
                return function (proto) {
                    F.prototype = proto;
                    return new F;
                };
            })();

        if(arguments.length == 1){
            props = C;
        }else if(C.prototype || C.ctor){
            var proto = inherit(C.prototype || C.ctor);
            proto.constructor = NewClass;
            NewClass.prototype = proto;
        }

        if (props.statics) {
            P.extend(NewClass, props.statics);
            delete props.statics;
        }

        if (props.mixin) {
            P.extend.apply(null, [NewClass.prototype].concat(props.mixin));
            delete props.mixin;
        }

        P.extend(NewClass.prototype, props);

        return NewClass;
    }

    function module(C,props)
    {
        var NewClass = function () {
            if (this.ctor) {
                this.ctor.apply(this, arguments);
            }
        };

        var inherit = Object.create || (function () {
            function F() {}
            return function (proto) {
                F.prototype = proto;
                return new F;
            };
        })();

        if(arguments.length == 1){
            props = C;
        }else if(C.prototype || C.ctor){
            var proto = inherit(C.prototype || C.ctor);
            proto.constructor = NewClass;
            NewClass.prototype = proto;
        }

        if (props.statics) {
            P.extend(NewClass, props.statics);
            delete props.statics;
        }

        if (props.mixin) {
            P.extend.apply(null, [NewClass.prototype].concat(props.mixin));
            delete props.mixin;
        }

       /* if (NewClass.prototype.options) {
            props.options = P.extend(inherit(NewClass.prototype.options), props.options);
        }*/

        if (NewClass.prototype.options) {
            props.options = P.extend(NewClass.prototype.options,props.options);
        }
        P.extend(NewClass.prototype, props);

        return NewClass;
    }


    function path(v){
        // see https://github.com/seajs/seajs/blob/master/src/util-path.js
        var DOUBLE_DOT_RE = /\/[^/]+\/\.\.\//,
            basepath = P.base_lib || (location.href.match(/[^?#]*\//) || [''])[0],
            //basepath = (location.href.match(/[^?#]*\//) || [''])[0],
            first = v.charCodeAt(0);

        if (v.indexOf("//") === 0) {
            v = location.protocol + v;
        }else if(/^\/\/.|:\//.test(v)){

        }else if(first === 47 /* '/' */){
            v = location.protocol +"//" +location.host + v;
        }else{
            v = basepath + v;
        }

        v = v
            .replace(/\/\.\//g, "/") // /./ => /
            .replace(/([^:/])\/+\//g,"$1/"); //  a//b/c ==> a/b/c
        // a/b/c/../../d  ==>  a/b/../d  ==>  a/d
        while (v.match(DOUBLE_DOT_RE)) {
            v = v.replace(DOUBLE_DOT_RE, "/");
        }
        return v;
    }

    var hash = (function(){
        var url = location.hash,
            reg = /(?:#|&)([^=]+)=([^&]*)/ig,
            obj = {},
            m;// = url.match(reg);

        while(m = reg.exec(url)) obj[m[1]] = m[2];

        function _set(o){
            for(var i in o)obj[i] = o[i];
            update();
        }

        function update(){
            var u = [];
            for(var i in obj)
                u.push(i+"="+obj[i]);
            url = u.join('&');
            location.hash = url;
        }

        return {
            get:function(v){ return obj[v]; },
            set:_set,
            data:obj,
            url:url
        };
    })();

    function setOptions(obj, options) {
        //options 生成在 实例上
        if (!obj.hasOwnProperty('options')) {
            obj.options = obj.options ? P.extend({},obj.options) : {};
        }
        for (var i in options) {
            obj.options[i] = options[i];
        }
        return obj.options;
    }

    //节流 两次fn间隔time后执行
    function throttle(fn, time, context) {
        var lock, args, wrapperFn, later;

        later = function () {
            lock = false;
            if (args) {
                wrapperFn.apply(context, args);
                args = false;
            }
        };

        wrapperFn = function () {
            if (lock) {
                // 推后执行
                args = arguments;
            } else {
                fn.apply(context, arguments);
                setTimeout(later, time);
                lock = true;
            }
        };
        return wrapperFn;
    }

    window.requestAnimationFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 15);
        };

    P.emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

    P.now =  function(){ return Date.now() || new Date().getTime();};

    var isTouch = 'ontouchstart' in document.documentElement;

    var evt = {
        'down': isTouch ? 'touchstart' : 'mousedown',
        'move': isTouch ? 'touchmove' : 'mousemove',
        'end' : isTouch ? 'touchend' : 'mouseup'
    };

    var lastId = 0;
    P.stamp = function(obj){
        obj._p_id = obj._p_id || ("p_" + ++lastId);
        return obj._p_id;
    }
    P.extend = extend;
    P.replace = replace;
    P.unescape = unescape;
    P.unescape = unescape;
    P.module = module;
    P.path = path;
    P.parse = parse;
    P.hash = hash;
    P.setOptions = setOptions;
    P.throttle = throttle;
    P.evt = evt;
    P.feature = {
        isTouch : isTouch
    }

    P.date =  function(a,expr){
        expr = expr || 'yyyy-MM-dd';
        if(typeof(a) != 'object'){
            a = new Date(a);
        }
        var y = a.getFullYear(),
            M = a.getMonth()+1,
            d = a.getDate(),
            D = a.getDay(),
            h = a.getHours(),
            m = a.getMinutes(),
            s = a.getSeconds();

        function zeroize(v){
            v = parseInt(v);
            return v<10 ? "0"+v : v;
        }
        return expr.replace(/(?:s{1,2}|m{1,2}|h{1,2}|d{1,2}|M{1,4}|y{1,4})/g, function(str) {

            switch(str) {
                case 's' : return s;
                case 'ss': return zeroize(s);
                case 'm' : return m;
                case 'mm': return zeroize(m);
                case 'h' : return h;
                case 'hh': return zeroize(h);
                case 'd':	return d;
                case 'dd':	return zeroize(d);
                case 'M':	return M;
                case 'MM':	return zeroize(M);
                case 'MMMM':return ['十二','一','二','三','四','五','六','七','八','九','十','十一'][m] + '月';
                case 'yy':	return String(y).substr(2);
                case 'yyyy':return y;
                default:	return str.substr(1, str.length - 2);
            }
        });
    }
}());