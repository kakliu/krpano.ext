/**
 * Created by Administrator on 2014/11/6.
 */

(function(){

    var dom = {
        on: function (el, type, fn, scope) {
            var id = P.stamp(fn),
                key = '__pano_' + type + id,
                handler;
            handler = function (e) {
                /* ie8 hack */
                if(browser.ielt9) e.target = e.srcElement;
                return fn.call(scope || el, e);
            };

            if (el.addEventListener) {

                if (type === 'mousewheel') {
                    // firfox
                    el.addEventListener('DOMMouseScroll', handler, false);
                    el.addEventListener(type, handler, false);
                } else {
                    el.addEventListener(type, handler, false);
                }

            } else if (el.attachEvent) {
                el.attachEvent('on' + type, handler);
            } else {
                el["on" + type] = handler;
            }

            //保存 handler
            el[key] = handler;

            return this;
        },

        un: function (el, type, fn) {

            var id = P.stamp(fn),
                key = '__pano_' + type + id,
                handler = el[key];

            if (!handler) {
                return this;
            }

            if (el.removeEventListener) {

                if (type === 'mousewheel') {
                    el.removeEventListener('DOMMouseScroll', handler, false);
                    el.removeEventListener(type, handler, false);

                } else {
                    el.removeEventListener(type, handler, false);
                }
            } else if (el.detachEvent) {
                el.detachEvent('on' + type, handler);
            } else {
                delete el["on" + type];
            }

            delete el[key];

            return this;
        },
        trigger: function (el, type, id, e) {
            var key = '__pano_' + type + id,
                handler = el[key];
            if (handler) handler(e);

            return this;
        },
        stopPropagation: function (e) {

            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }

            return this;
        },

        preventDefault: function (e) {

            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
            return this;
        },

        stop: function (e) {
            return event
                .preventDefault(e)
                .stopPropagation(e);
        },
        getWheelDelta: function (e) {

            return  e.wheelDelta ?
                e.wheelDelta / 120 :
                e.detail ?
                    e.detail / -3 :
                    0
        }
    }
    P.dom = dom;
})
