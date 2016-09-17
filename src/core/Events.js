// pax.events
(function(){

    var events = {
        on: function (obj, scope) {
            for (var i in obj)
                this.addEventListener(i, obj[i], scope);
            return this;
        },

        un: function (obj) {
            for (var i in obj)
                this.removeEventListener(i, obj[i]);
            return this;
        },

        addEventListener: function (type, handler, scope) {
            this.listeners = this.listeners || {};
            var listeners = this.listeners[type];
            if (!listeners) {
                listeners = [];
                this.listeners[type] = listeners;
            }
            var listener = {instance: this, type: type, handler: handler, scope: scope || this};
            listeners.push(listener);
            return this;
        },
        removeEventListener: function (type, handler) {
            var listeners = this.listeners[type];
            if (listeners != null) {
                for (var i = 0, l = listeners.length; i < l; i++) {
                    if (listeners[i].handler == handler) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
            return this;
        },
        clearEventListeners: function (type) {
            var listeners = this.listeners[type];
            if (listeners != null) {
                for (var i = 0, len = listeners.length; i < len; i++) {

                    this.removeEventListener(type, listeners[i].handler)

                }
                this.listeners[type] = [];
            }

            return this;
        },
        trigger: function (type, evt) {
            this.listeners = this.listeners || {};
            var listeners = this.listeners[type] ;
            // fast path
            if (!listeners || listeners.length == 0) return this;

            evt = evt || {};
            if (!evt.target) evt.target = this;
            if (!evt.type)  evt.type = type;

            for (var i = 0, len = listeners.length; i < len; i++) {
                var callback = listeners[i];
                callback.handler.call(callback.scope, evt);
            }
            return this;
        }
    };
    P.events = events;
}());