(function(){

    var debug = '<script type="text/javascript">(function(){var exist={},list=[],exist_mod={};var process=function(mod){if(!exist_mod[mod]&&deps[mod]){if(deps[mod].deps){var ds=deps[mod].deps;for(var m in ds){process(ds[m])}}for(var j in deps[mod].src){list.push(deps[mod].src[j]);exist[deps[mod].src[j]]=true}exist_mod[mod]=true}};for(var i in deps)process(i);var mods = list;var tpl="<scr"+"ipt type=\'text/javascript\' src=\'../src/{url}.js?{stamp}\'><\/scr"+"ipt>";for(var i in mods){document.write(tpl.replace("{url}",mods[i].replace(/\\./g,"/")));console.log("load : "+mods[i])}}());</script>';

    document.write("<script src='../src/deps.js'><\/script>");
    document.write(debug);
}())