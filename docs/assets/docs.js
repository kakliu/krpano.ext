var vm = (function(){
    var store = (function(){
        var stack = {};
        return function(key , val){
            if(val) {
                stack[key] = val;
                return key;
            }
            else return stack[key];
        }
    }());
    var extend = function(dist , src){
        src = src || {};
        for(var i in src){
            dist[i] = src[i];
        }
        return dist;
    };

    var escape = (function(){
        var m = '(?:' +
                ['&','<','>','"',"'",'`'].join('|') +
                ')',
            obj = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#x27;",'`':'&#x60;'};

        return function(str){
            return str.replace(RegExp(m,'g') , function(match){
                return obj[match];
            });
        }
    }());

    var preLoad = function(tpl,fn){
        var res = [], cur=0;
        tpl = tpl.replace(/(<%\s|{{)?([\s\S]*?)(%>|}})/g,function(a){
            return a.replace(/load\(([\w\W]+?)\)/g,function(all,u){
                var url = u.replace(/['"\s\t]/g,"");
                res.push(url);
                return "helper.store("+u+")";
            });
        })
        var process = function(){
            $.ajax({
                url:res[cur],
                success : function(resp){

                    store(res[cur],resp);
                    if(cur++<res.length-1) process();
                    else {
                        fn(tpl)
                    }
                }
            })
        }
        if(res.length) process();
        else{ fn(tpl);}
    }

    function tmpl(str, data , h){
        var helper = {
            "escape" : escape,"store" : store,

            "init":function(d){
                var clss = [];
                for(var i in d){
                    clss[d[i].name] = 1;
                }
                store("clss",clss);
                return "";
            },
            "args":function(d){
                if(!d) return "";
                var paras = [];
                for(var i in d){
                    paras.push(d[i][0]+":"+helper.link(d[i][1]));
                }
                return "("+paras.join(' , ')+")";
            },
            "link":function(str){
                if(!str) return "";
                var clss = store('clss');
                if(clss[str])
                {
                    return '<a href="#'+str+'">'+str+'</a>'
                }else{
                    return str.replace(/<([\s\S]*?)>/g,function(a,match){
                        return clss[match] ? ('<<a href="#'+match+'">'+escape(match)+'</a>>') : a;
                    });
                }
            }
        }
        for(var i in h){
            if(/^@/.test(i)){
                var key = i.replace('@','');
                if(key) store(key , h[i]);
            }else{
                helper[i] = h[i];
            }
        }
        //extend(helper , h);

        var source = str
            .replace(/[\r\n]/g, "")
            .replace(/\{\{([^\}]+?)\}\}/g, "<%=$1%>")
            .replace(/<!\-\-([\s\S]*?)\-\->/g, "<%$1%>")
            .replace(/<%\s?=\s?([\s\S]*?)%>/g,function(a,b){
                //管道风格过滤器
                var filter = b.split('|').reverse();
                return "',"+
                    filter.join("|").replace(/([\w\W]+?)\|/g,'helper.$1(') + Array(filter.length).join(')') +
                    ",'";
            })
            .replace(/<%\s?([\s\S]*?)%>/g,function(a){
                //内置的方法 get store
                return a.replace(/[^a-zA-Z0-9_](get|store)[\s]*\(/g,"helper.$1(");
            })
            .replace(/<%\s?([\s\S]*?)%>/g,"');$1;p.push('");
        source =
            "var p=[],print=function(){p.push.apply(p,arguments);};" +
            "p.push('" + source + "');return p.join('');";
        console.log(source)
        try {
            var fn =  new Function("el",'helper',source);
        } catch (e) {
            e.source = source;
            throw e;
        }
        // 修改this,默认为this = data
        var _tpl = function(data,el,filter) {
            //扩展过滤器
            extend(helper , filter || {});
            return fn.call(data, el , helper);
        };
        _tpl.source = 'function(args){\n' + source + '}';
        return data ? _tpl( data ) : _tpl;
    };

    return function(opts){
        if(typeof(opts) == 'object'){
            preLoad(opts.view , function(tpl){
                opts.success(tmpl(tpl , opts.model))
            });
        }else{
            var args = Array.prototype.slice.call(arguments,0);
            return tmpl.apply(tmpl , args);
        }
    }
}());

//