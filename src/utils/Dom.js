(function(){
    P.dom = {
        getStyle: function (el, style) {

            var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

            if ((!value || value === 'auto') && document.defaultView) {
                var css = document.defaultView.getComputedStyle(el, null);
                value = css ? css[style] : null;
            }

            return value === 'auto' ? null : value;
        },

        create:function(tag , id , cls , style , parent , data)
        {
            var el = document.createElement(tag);
            if (id) el.id = id;
            if (cls) el.className = cls;
            if (style) el.setAttribute("style", style);
            if (parent) parent.appendChild(el);
            if(data)
                for(var i in data)
                    el.setAttribute(i, data[i]);
            return el;
        }
    };
}());