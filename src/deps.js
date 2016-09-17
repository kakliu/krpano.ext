var deps = {
    Krpano : {
        src : ['krpano'],
        desc: 'krpano核心'
    },

    Core : {
        src : [
            "P",
            "core.Base",
            "utils.Anim",
            "utils.Kinetic",
            "utils.Dom",
            "core.Events",
            "core.Pano"
        ]
        ,
        desc : "扩展"
    },

    Provider:{
        src : ['provider.HQT'],
        desc: "全景服务提供者",
        deps: ['Core']
    },

    Control:{
        src : [
            "control.Control",
            "control.Album",
            //"control.Combo",
            //"control.ComboMobile",
            "control.Address",
            "control.Hash",
            "control.Poi",
            //"control.widget.Info",
            "control.widget.Video",
            "control.widget.Audio",
            "control.Plugin"
        ],
        desc:"控制器"
    },

    Layer : {
        src : [
            "layer.Overlay",
            "layer.Hotspot",
            "layer.Marker",
            "layer.Sprite",
            "layer.Text"
        ],
        desc: "覆盖物"
    },

    Editer:{
        src : ['control.Editer'],
        deps: ['Layer'],
        desc: '热点编辑器'
    },

    Effect:{
        src : ['utils.effect.View'],
        deps: ['Core'],
        desc: '动画特效'
    }
};

if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = {deps: deps};
}
