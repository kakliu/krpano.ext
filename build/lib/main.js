var UglifyJS = require('uglify-js'),
    fs = require('fs'),
    path = require('path'),
    iconv = require('iconv-lite');



module.exports = {
    config : function(config){
        new Compiler(config);
    }
}

function Compiler(a){
    console.log('P.js build tool ');
    this.deps = a.deps;
    this.config = a;
	this.build();
}

Compiler.prototype = {
    config: {},

    build: function () {
        var inputFilePath = this.config.src,
            dist = this.config.dist,
            output = this.config.output,
            combineFile = dist + "/" +(output || 'main');
        this.link(this.scan(this.deps), inputFilePath,combineFile);
    },

    scan : function(deps){
        var exist = {}, list = [], exist_mod = {};

        var process = function(mod){
            if(!exist_mod[mod] && deps[mod]){
                if(deps[mod].deps){
                    var ds = deps[mod].deps;
                    for(var m in ds){
                        process(ds[m]);
                    }
                }

                for(var j in deps[mod].src){
                    list.push(deps[mod].src[j]);
                    exist[deps[mod].src[j]] = true;
                }
                exist_mod[mod] = true;
            }
        }

        for(var i in deps)
            process(i);
        return list;
    },

    link : function(list , inputFilePath,combineFile){
        var outputCharset = "utf8";

        var fd = fs.openSync(combineFile+".js", 'w');
        var combinedComment = "/*PMC*/\r\n";
        var combinedCommentBuffer = iconv.encode(combinedComment, outputCharset);
        fs.writeSync(fd, combinedCommentBuffer, 0, combinedCommentBuffer.length);
        fs.closeSync(fd);


        fd = fs.openSync(combineFile+".js", 'a');

        console.log("total:"+list.length+",target:"+combineFile);
        for (var i = 0; i < list.length; i++) {
            console.log(list[i]);
            var modContent = this.content(list[i]) + "\r\n";
            var buffer = iconv.encode(modContent, outputCharset);
            fs.writeSync(fd, buffer, 0, buffer.length);
        }
        fs.closeSync(fd);

        console.info('[ok]' + ' %s ===> %s', inputFilePath, combineFile+".js");

        var modContent = fs.readFileSync(combineFile+".js",'utf8');

        var result = UglifyJS.minify(modContent, {fromString: true});

        fs.writeFileSync(combineFile+"_min.js", result.code, 'utf8');

        //fs.writeFileSync("../../../xh/Public/lib/P_min.js", result.code, 'utf8');

        fs.writeFileSync("../../../pano_core/Public/lib/P_min.js", result.code, 'utf8');

        console.info('[ok]' + ' minify ===> %s', combineFile+"_min.js");
    },

    path: function (mod) {
        return this.config.src + '/' + mod.replace(/\./g,"/") + '.js';
        //return this.config.path + "/" + mod + ".js";
    },

    //读取内容
	content:function(mod){
        //console.log(typeof(mod))
		var file = typeof(mod) == "string" ? this.path(mod) : mod.path;
        //console.log("read : " + file);
		var fileContent = fs.readFileSync(file);
        var modContent = iconv.decode(fileContent, "utf8");
		//remove file BOM
		if(/^\uFEFF/.test(modContent)){
			modContent = modContent.toString().replace(/^\uFEFF/, '');
		}
		return modContent;
	}
}