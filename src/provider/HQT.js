(function(){
    P.provider = {};
    //全景提供者，返回panoData
    var api = {
        "pano"  : (window.PANO_CFG_PATH || "/Panorama/")  + "{id}.json",
        "thumb" : (window.PANO_IMG_PATH || "/pano/") + "{id}/thumb.jpg",
        "hot"   : (window.PANO_CFG_PATH || "/Panorama/")  + "{id}/hot.json",
        "server": (window.PANO_IMG_PATH || "/pano/")
    }

    var HQTProvider = {
        "getPoiById" : function(id , fn){
            $.getJSON(P.parse(api.hot,{"id":id}) , function(resp){
                fn && fn(resp.data);
            });
        },
        "getPanoById":function(id , fn){
            var time = "20"+id.substring(8,10)+"-"+id.substring(10,12)+"-"+id.substring(12,14);
            var data = {
                "imageDate": time,
                "copyright": "HQT（红权科技）",
                "location":{},
                "group":[],
                "tiles": {
                    "worldSize": null,
                    "tileSize": 512,
                    "centerHeading": 0,
                    "getThumbUrl": function (id) {
                        return P.parse(api.thumb, {"id": id})
                    },
                    //返回krpano配置
                    "getConfig": function (obj) {
                        var opts = P.extend({"base": api.server}, obj);
                        return P.parse("loadxml('<krpano debugmode=\"false\" showerrors=\"false\"><preview url=\"{base}/{id}/cube/preview.jpg\" /><view hlookat=\"{x}\" vlookat=\"{y}\" limitview=\"auto\" fovmin=\"25\" fovmax=\"120\" /><image type=\"CUBE\" multires=\"true\" tilesize=\"512\"><level tiledimagewidth=\"512\" tiledimageheight=\"512\"><cube url=\"{base}/{id}/cube/1/%s_%v_%h.jpg\" /></level><level tiledimagewidth=\"1024\" tiledimageheight=\"1024\"><cube url=\"{base}/{id}/cube/2/%s_%v_%h.jpg\" /></level><level tiledimagewidth=\"2048\" tiledimageheight=\"2048\"><cube url=\"{base}/{id}/cube/3/%s_%v_%h.jpg\" /><mobile><cube url=\"{base}/{id}/cube/2/{s}_1_1.jpg\" /></mobile></level></image><plugin name=\"gyro\" devices=\"html5\" keep=\"true\" url=\"%SWFPATH%/plugins/gyro.js\" enabled=\"false\"  camroll=\"true\" friction=\"0.0\" touch_mode=\"full\" sensor_mode=\"1\" autocalibration=\"true\" /></krpano>',null, MERGE, {blend}));", opts);
                    }
                }
            };
            //alert(P.parse(api.pano , {id:id}))
            /*$.ajax({dataType:"json",url:P.parse(api.pano , {id:id})}).done(function(){
                alert()
            }).fail(function(a,b,c){
                alert(JSON.stringify(a));
                alert(b);
                alert(c);
            });*/

            $.getJSON(P.parse(api.pano , {id:id}) , function(resp){
                data.location = {
                    latLng : {lat:resp.data.lat,lng:resp.data.lng || resp.data.lon},
                    description : "",
                    shortDesc:resp.data.poi_data.name + " " +resp.data.title,
                    pano:id
                };
                data.poi_data = resp.data.poi_data;
                data._raw = resp.data;
                fn && fn(data);
            })

        }
    }
    P.provider.HQT = HQTProvider;
}());