/**
 * Created by jljsj on 14/11/5.
 */
(function (C) {


    var stage, Canvas,imageBit,scale,imgRotation=0;
    var WIDTH=innerWidth*devicePixelRatio,HEIGHT=innerHeight*devicePixelRatio;
    var text;
    //创建图片
    var newImageToStage=function (str){
        imageBit= new C.Bitmap(str);
        //取出图片宽高做比例
        //图片比例需要按devicePixelRatio来算，，如按实列比例，在大屏下会出现糊，精度不够，几乘就用几乘的图
        imageBit.rotation=imgRotation;
        imageBit.regX=str.width/2;
        imageBit.regY=str.height/2;
//        switch (imgRotation){
//            case 0:
//                break;
//            case 90:
//                break;
//            case 180:
//                break;
//            case 270:
//                break
//        }
        if(imgRotation==90||imgRotation==270){
            imageBit.x=imageBit.regY*scale;
            imageBit.y=imageBit.regX*scale;
        }else{
            imageBit.x=imageBit.regX*scale;
            imageBit.y=imageBit.regY*scale;
        }

        imageBit.scaleX=imageBit.scaleY=scale;

        console.log(imageBit.regX,imageBit.regY);
        //imageBit.setTransform(this.width/2*scale,this.height/2*scale,scale,scale,0,0,0,this.width/2,this.height/2);
        stage.addChild(imageBit);
        var a = new C.Shape();
        a.graphics.f("#000").dr(-5, -5, 10 , 10);
        stage.addChild(a);
        a.y=str.width/2*scale;
        a.x=str.height/2*scale;
        //console.log(imageBit.image.width);
//        var t=new C.Text("imageWidth:"+imageBit.image.width, (10*devicePixelRatio) + "px menlo", "#000")
//        stage.addChild(t);
//        t.y=100;
//        text=new C.Text("", (10*devicePixelRatio) + "px menlo", "#000");
//        stage.addChild(text);

        ImageEnabled();


        //多点触控
        stagePicnh()
    };
    function ImageEnabled(){
        imageBit.addEventListener("mousedown",function (e){
            var c= e.target;

            c.offset={x: c.x- stage.mouseX,y: c.y- stage.mouseY}

        });
        imageBit.addEventListener("pressmove",function (e){
            var c= e.target;

            c.x= stage.mouseX+ c.offset.x;
            c.y= stage.mouseY+ c.offset.y;
        });
    }
    function stagePicnh(){
        var picnhStartWidth,picnhEndWidth,ImgScale,imageXY={x:0,y:0},
            rStart={one:{x:0,y:0},tow:{x:0,y:0}},rEnd={one:{x:0,y:0},tow:{x:0,y:0}};


        stage.addEventListener("stagemousedown",function (e){
            var touchList= e.nativeEvent.targetTouches;
            console.log(touchList);
            if(touchList.length==2){
                imageBit.removeAllEventListeners();
                ImgScale=imageBit.scaleX;
                //判断两点的距离
                //console.log(touchList[0].clientX,touchList[1].clientX);

                rStart.one={x:touchList[0].clientX,y:touchList[0].clientY};
                rStart.tow={x:touchList[1].clientX,y:touchList[1].clientY};
                picnhStartWidth=Math.sqrt(Math.pow(rStart.one.x-rStart.tow.x,2)+Math.pow(rStart.one.y-rStart.tow.y,2));
                imageXY.x=imageBit.x;
                imageXY.y=imageBit.y;


            }else{

            }
        });
        stage.addEventListener('stagemousemove', function (e) {
            var touchList= e.nativeEvent.targetTouches;
            if(touchList.length==2){
                //console.log(touchList[0].clientX,touchList[1].clientX);
                rEnd.one={x:touchList[0].clientX,y:touchList[0].clientY};
                rEnd.tow={x:touchList[1].clientX,y:touchList[1].clientY};
                picnhEndWidth=Math.sqrt(Math.pow(rEnd.one.x-rEnd.tow.x,2)+Math.pow(rEnd.one.y-rEnd.tow.y,2));
                //判断Ｘ轴的两点间距离的变化大于10时设为picnh
                if(Math.abs(picnhStartWidth-picnhEndWidth)>10){
                    //计算旋转

                    //获取图片的大小

                    //var tobj={x:imageBit.regX,y:imageBit.regY};
                    //算出两点间的中心点给图片

                    //imageBit.regX= (rEnd.one.y+rEnd.tow.y)/2/imageBit.scaleX*devicePixelRatio;
                    //imageBit.regY= (rEnd.one.x+rEnd.tow.x)/2/imageBit.scaleX*devicePixelRatio;

                    //imageBit.x=imageBit.regY* imageBit.scaleX;
                    //imageBit.y=imageBit.regX* imageBit.scaleX;

                    //text.text=imageBit.y+"\n\n"+tobj.y+":"+imageBit.regX+"\n"+(imageBit.regX-tobj.x)*scale;

                    //计算比例缩放
                    imageBit.scaleX=imageBit.scaleY= ImgScale*(picnhEndWidth/picnhStartWidth);



                    //imageBit.rotation=
                }
                //不做中心点换位。。直接按角度旋转..
                //算了两点与Ｘ的斜角
                var k1=Math.atan2(rStart.tow.y-rStart.one.y,rStart.tow.x-rStart.one.x)*180/Math.PI
                var k2=Math.atan2(rEnd.tow.y-rEnd.one.y,rEnd.tow.x-rEnd.one.x)*180/Math.PI;
                if(k1<0){
                    k1=360+k1
                }
                if(k2<0){
                    k2=360+k2
                }
                imageBit.rotation=k2-k1+imgRotation;
                console.log(k1,k2);
                //console.log(picnhEndX-picnhStartX)
            }else{

            }
        });
        stage.addEventListener('stagemouseup',function (e){
            var touchList= e.nativeEvent.touches;
            console.log(1,imageBit,imageBit._listeners,touchList.length);
            if(!imageBit._listeners&& touchList.length<1){
                ImageEnabled();
                imgRotation=imageBit.rotation
            }

            //console.log(2,imageBit)
        });

    }
    //创建canvas
    function createImg(src){

        var img=new Image();
        img.src=src;
        img.onload=function(){


            EXIF.getData(this,function (){
                //console.log(EXIF.getTag(this, 'Orientation'));
                var o=EXIF.getTag(this, 'Orientation');
                switch (o){
                    case 3:
                        imgRotation = 180;
                        break;
                    case 6:
                        imgRotation = 90;
                        break;
                    case 8:
                        imgRotation = 270;
                        break;
                }
                //创建canvas到dom里

                Canvas = $("<canvas id='myC' style='display:block'></canvas>").appendTo('body');
                Canvas[0].width = WIDTH;
                Canvas[0].height = HEIGHT;
                Canvas.width(window.innerWidth);
                Canvas.height(window.innerHeight);

                stage = new C.Stage('myC');
                //stage.setTransform(0, 0, devicePixelRatio, devicePixelRatio);
                C.Ticker.setFPS(30);
                C.Ticker.useRAF = true;
                C.Ticker.addEventListener("tick", stage);
                C.Touch.enable(stage, false); //多点触摸

                scale=WIDTH/this.height;

                newImageToStage(this)
            });
        }
//            // 转换二进制数据
//            var base64 = result.replace(/^.*?,/,'');
//            var binary = atob(base64);
//            var binaryData = new BinaryFile(binary);




    }

    $(document).ready(function () {
        //取出图片
        $("#cameraInput").on('change',function (){
            var file=this.files[0];
            var URL = URL || webkitURL;
            var blob = URL.createObjectURL(file);
            createImg(blob);
        });
        var k=Math.tan(45)

        console.log(k)
    });

})(createjs = createjs || {});
var createjs;
