(function(){

    var numbits = 6 * 5;
    var digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8',
        '9', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];
    var digits_map = {};

    function str_pad(str,l,pad){
        if(isNaN(l)) l = 5;
        pad = pad || " ";
        l = Math.max(0,(l - str.length));
        for(i=0;i<l;i++){
            str = pad + str;
        }
        return str;
    }

    (function(){
        for(var j=0;j<digits.length;j++){
            digits_map[digits[j]] = str_pad(j.toString(2),5,"0");
        }
    }());



    function getBits(v, floor, ceiling)
    {
        var buffer = [], i, mid;
        for (i = 0; i < numbits; i++) {
            mid = (floor + ceiling) / 2;
            if (v >= mid) {
                buffer[i] = 1;
                floor = mid;
            } else {
                buffer[i] = 0;
                ceiling = mid;
            }
        }
        return buffer;
    }

    function setBits(v, floor, ceiling)
    {
        var mid = (floor + ceiling)/2;
        for (var i=0; i<v.length; i++) {
            mid = (floor + ceiling) / 2;
            if (v[i]=="1")
                floor = mid;
            else
                ceiling = mid;
        }
        return mid;
    }

    function base32_encode(v)
    {
        var hash = "";
        for (var i=0; i<v.length; i+=5)
        {
            var str = v.substr(i,5);
            var index = parseInt(str,2);

            hash += digits[index];
        }
        return hash;
    }

    function base32_decode(v){console.log(v)
        var str = "";
        for(var i = 0; i< v.length ;i++){
            str += digits_map[v.charAt(i)];
        }
        return str;
    }

    function encode(lat, lon)
    {
        var latbits = getBits(lat, -90, 90);
        var lonbits = getBits(lon, -180, 180);
        var buffer = [];
        for (var i = 0 ; i < numbits; i++) {
            buffer.push(latbits[i]);
            buffer.push(lonbits[i]);
        }
        console.log(buffer.join(""));
        //console.log(lonbits.join(""));
        return base32_encode(buffer.join(""));
    }

    function decode(v){
        //even bits
        var buffer = base32_decode(v);

        var lat = [], lon = [], i, j;
        for (i = 0, j = 0; i < numbits*2; i+=2) {
            if ( i < buffer.length )
                lat[j++] = buffer.charAt(i);
        }

        //odd bits
        for (i=1,j=0; i< numbits*2;i+=2) {
            if ( i < buffer.length )
                lon[j++] = buffer.charAt(i);
        }

        lon = setBits(lon, -180, 180);
        lat = setBits(lat, -90, 90);

        return {lat:lat , lon:lon};
    }

    P.geohash = {
        "encode":encode,
        "decode":decode
    };
}());