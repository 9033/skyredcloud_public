function randomt(){
    var t=(Math.floor(Math.random() * (0xf/2)+(0xf/2)))*0x10;
    if(t<=0xf)return "0"+t.toString(16);
    return t.toString(16);
}

function randomcolorstr(){
    var r="#";
    r+=randomt();
    r+=randomt();
    r+=randomt();
    return r;
}
var busplate = {}
function buscolorbyplate(plateNo){
    if( busplate.hasOwnProperty(plateNo) ==false ){
        busplate[plateNo]=randomcolorstr();
    }
    return busplate[plateNo];
}

var plates=document.getElementsByClassName('plateNo');
[...plates].forEach(plate=>{
    plate.style.color=buscolorbyplate(plate.innerText);
});
