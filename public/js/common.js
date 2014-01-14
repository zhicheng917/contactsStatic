/**
 * Created with JetBrains WebStorm.
 * User: 乔祝垒
 * Date: 13-12-20
 * Time: 下午2:50
 * To change this template use File | Settings | File Templates.
 */
function fitImg(I, fw, fh) {//按比例缩放图片(对象，宽，高)

    var h=$(document).height;
    if(fh<h){fh=h};
    var i = new Image();
    i.src = I.src;
    if (i.width > 0 && i.height > 0) {
        I.style.width=fw+"px";
        I.style.height = ((i.height * fw) / i.width)+"px";
        if(parseInt(I.style.height)<fh){
            I.style.width=((i.width*fh)/ i.height)+"px";
            I.style.height = fh+"px";
        }
        if(parseInt(I.style.height)>fh){
            I.style.marginTop=(fh-parseInt(I.style.height))/2+"px";
        }
        if(parseInt(I.style.width)> fw){
            I.style.marginLeft=-(parseInt(I.style.width)- i.width)/2+"px";
        }
    }
}

/*** demo **/
function charMap() {
    var _self=this;
    
}