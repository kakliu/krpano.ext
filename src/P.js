(function(){
    'use strict';
    var P = {
        version  :"20150914" ,
        base_lib : window.PANO_BASE_LIB || "/lib/",
    };

    function expose() {
        var old = window.P;

        P.noConflict = function () {
            window.P = old;
            return this;
        };

        window.P = P;
    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = P;

    } else if (typeof define === 'function' && define.amd) {
        define(P);
    }

    if (typeof window !== 'undefined') {
        expose();
    }

    var css = document.createElement("link");
    css.href = P.base_lib + "P.css";
    css.setAttribute("type" , "text/css");
    css.setAttribute("rel", "stylesheet");
    document.getElementsByTagName("head")[0].appendChild(css);
}());