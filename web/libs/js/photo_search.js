/**
 * @author Huleryo
 * @date 2017/7/21
 */
var dropBox;    // 拖拽框div对象
var photoUrl;   // 上传的图片
var _data;   // 后台得到的数据
var jsonObj;    // _data对应的json对象


function ignoreDrag(e) {
    //因为我们在处理拖放，所以应该确保没有其他元素会取得这个事件
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    //取消事件传播及默认行为
    e.stopPropagation();
    e.preventDefault();

    //取得拖进来的文件
    var data = e.dataTransfer;
    var files = data.files;
    //将其传给真正的处理文件的函数
    processFiles(files);
}

/**
 * 文件处理
 * */
function processFiles(files) {
    var file = files[0];
    if (!isPicture(file.name)) {
        window.alert("请上传正确的图片格式，支持.jpg/.png/.bmp!");
        return;
    }
    //创建FileReader
    var reader = new FileReader();
    //告诉它在准备好数据之后做什么
    reader.onload = function (e) {
        //使用图像URL来绘制dropBox的背景
        photoUrl = "url('" + e.target.result + "')";
        dropBox.style.display = "none";
        document.getElementById("progress_box").style.display = "block";
        document.getElementById("progress_photo").style.backgroundImage = "url('" + e.target.result + "')";
        //document.getElementById("dropBox_fail").style.display = "block";
        //dropBox.style.backgroundImage = "url('" + e.target.result + "')";
    };
    //读取图片
    reader.readAsDataURL(file);

    var formData = new FormData();
    formData.append(file.name, file);
    uploadToServer(formData);
}

/**
 * 上传文件
 * */
function uploadToServer(formData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="图像格式错误！"||data=="未检测到人脸！"||data=="检测到多个人脸！"
                ||data=="网络请求错误！") {
                document.getElementById("progress_box").style.display = "none";
                document.getElementById("dropBox_fail").style.display = "block";
                document.getElementById("fail_photo").style.backgroundImage = photoUrl;
                document.getElementById("failMessage").innerHTML = data;
            } else {
                document.getElementById("progress_box").style.display = "none";
                document.getElementById("success_photo").style.backgroundImage = photoUrl;
                document.getElementById("dropBox_success").style.display = "block";
                _data = data;
                console.log(data);
                showPhotoList(data);
            }
        }
    };
    xhr.open("POST", "FaceSearchController", true);
    xhr.send(formData);
}

/**
 * 简单判断文件后缀是否为图片后缀
 * */
function isPicture(fileName) {
    var postfix = fileName.substr(fileName.lastIndexOf("."),
        fileName.length-fileName.lastIndexOf("."));
    if (postfix==".jpg"||postfix==".png"||postfix==".bmp") {
        return true;
    } else {
        return false;
    }
}

/**
 * 显示拖拽框
 * */
function showDropBox() {
    if (document.getElementById("dropBox").style.display=="none" ||
        document.getElementById("dropBox").style.display=="") {
        document.getElementById("dropBox_fail").style.display = "none";
        document.getElementById("dropBox").style.display = "block";
    } else {
        document.getElementById("dropBox").style.display = "none";
    }
}

/**
 * 将照片展示HTML写入照片展示框
 * */
function showPhotoList(data) {
    jsonObj = JSON.parse(data);
    var totalHtml = "";
    for (var i=0;i<4;i++) {
        totalHtml = totalHtml+getPhotoHtml(jsonObj.missingPeopleList[i].missingID,jsonObj.missingPeopleList[i].confidence,jsonObj.missingPeopleList[i].confidence);
    }
    document.getElementById("photo_list").innerHTML = totalHtml;
}

function getPhotoHtml(imgSrc,str,confidence) {
    if (confidence>=80) {
        return '<li><a style="cursor: pointer"><img id="'+ imgSrc + '" class="faceSearchPhoto" src="../libs/image/missing_people_photo/'+imgSrc+'.jpg" style="border: solid 2px red"/><span>相似度：'+str+'</span></a></li>';
    }
    return '<li><a style="cursor: pointer"><img id="'+ imgSrc + '" class="faceSearchPhoto" src="../libs/image/missing_people_photo/'+imgSrc+'.jpg" /><span>相似度：'+str+'</span></a></li>';
}
$(document).ready(function () {
    /*添加关注事件*/
    $("#photo_list").delegate('.faceSearchPhoto','click',function () {
        console.log(this);
        console.log(typeof (this));
        for(var i =0;i<4;i++){
            var missingID = jsonObj.missingPeopleList[i].missingID;
            if (missingID == parseInt(this.id)){
                var json = parsePopupJson(jsonObj.missingPeopleList[i]);
                //addVectorLabel([json.lng, json.lat], json);
                //清空popup的内容容器
                content.innerHTML = '';
                //在popup中加载当前要素的具体信息
                addFeatrueInfo(json);
                container.style.display = "block";
                popup.setPosition([jsonObj.missingPeopleList[i].lng,jsonObj.missingPeopleList[i].lat]);

            }
        }
    })
});

/**
 * 显示照片展示框
 * */
function showPhotoBox() {
    setResult();
    if (document.getElementById("photo_box").style.display=="none"||
        document.getElementById("photo_box").style.display=="") {
        document.getElementById("photo_box").style.display = "block";
    } else {
        document.getElementById("photo_box").style.display = "none";
    }
    showPopup(_data);
    //矢量标注图层
    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
    /**
     * 在地图容器中创建一个Overlay
     */
    popup = createPopupLayer();
    map.addOverlay(popup);
}

/**
 * 设置展示结果文字及按钮
 * */
function setResult() {
    var num = 0;
    var obj = JSON.parse(_data);
    console.log(obj);
    for (var i=0;i<obj.missingPeopleList.length;i++) {
        if (obj.missingPeopleList[i].confidence>=80) {
            num +=1;
        }
    }
    if (num==0) {
        ID("addClueBtn").style.display = "none";
        ID("search-description").innerHTML = "未找到相似失踪人员！"
    }
    if (num>0) {
        ID("addClueBtn").style.display = "block";
        ID("search-description").innerHTML = "上传照片与"+num.toString()+"人相似度超过80%,极可能为同一人。"
    }
}

function clearDropBox() {
    if (document.getElementById("dropBox_success").style.display=="none"||
        document.getElementById("dropBox_success").style.display=="") {
        document.getElementById("dropBox").style.display="none";
        document.getElementById("dropBox_fail").style.display="none";
        document.getElementById("dropBox_fail").style.display="none";
        document.getElementById("photo_box").style.display="none";
    }
}


/**
 * 地图加载相关全局变量
 * */
var map;
var zoom = 4.5;
var center = [110.40623,32.529037];
var view = new ol.View({
    //地图初始中心点
    center: center,
    //地图初始显示级别
    zoom: zoom,
    minZoom: zoom,
    projection: new ol.proj.get('EPSG:4326')
});
/**
 * popup相关全局变量
 * */
var container;
var content;
var closer;
var vectorLayer;
//矢量标注的数据源
var vectorSource = new ol.source.Vector();
var popup;
/*------------------------------------------------定位地图------------------------------------------------------*/
var locationMap;

/**
 * html加载函数
 * */
window.onload = function () {
    // 拖拽框初始化
    dropBox = document.getElementById("dropBox");
    dropBox.ondragenter = ignoreDrag;
    dropBox.ondragover = ignoreDrag;
    dropBox.ondrop = drop;

    container = document.getElementById('popup');
    content = document.getElementById('popup-content');
    closer = document.getElementById('popup-closer');

    map = createMap("mapCon", view);




    /**
     * 添加关闭按钮的单击事件（隐藏popup）
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        //未定义popup位置
        popup.setPosition(undefined);
        //失去焦点
        closer.blur();
        return false;
    };
    /**
     * 为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
     */
    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });
    /**
     * 为map添加点击事件监听，渲染弹出popup
     */
    map.on('click', function (evt) {
        //判断当前单击处是否有要素，捕获到要素时弹出popup
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) { return feature; });
        if (feature) {
            //清空popup的内容容器
            content.innerHTML = '';
            //在popup中加载当前要素的具体信息
            addFeatrueInfo(feature.values_.jason);
            container.style.display = "block";
            popup.setPosition(feature.values_.geometry.flatCoordinates);

        }
    });


};

/**
 * 创建标注样式函数,设置image为图标ol.style.Icon
 * @param {ol.Feature} feature 要素
 */
var createLabelStyle = function (feature) {
    return new ol.style.Style({
        image: new ol.style.Icon(
            /** @type {olx.style.IconOptions} */
            ({
                //设置图标点
                anchor: [0.5, 60],
                //图标起点
                anchorOrigin: 'top-right',
                //指定x值为图标点的x值
                anchorXUnits: 'fraction',
                //指定Y值为像素的值
                anchorYUnits: 'pixels',
                //偏移
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale:0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../libs/image/clusters.png'           //标注图标
            })),
        text: new ol.style.Text({
            //位置
            textAlign: 'center',
            //基准线
            textBaseline: 'middle',
            //文字样式
            font: 'normal 14px 微软雅黑',
            //文本内容
            text: feature.get('name'),
            //文本填充样式（即文字颜色）
            fill: new ol.style.Fill({ color: '#aa3300' }),
            stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
        })
    });
};

/**
 *popup图层
 */
function createPopupLayer() {
    return new ol.Overlay(
        /** @type {olx.OverlayOptions} */
        ({
            //要转换成overlay的HTML元素
            element: container,
            //当前窗口可见
            autoPan: true,
            //Popup放置的位置
            positioning: 'bottom-center',
            //是否应该停止事件传播到地图窗口
            stopEvent: false,
            autoPanAnimation: {
                //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度
                duration: 250
            }
        }));

}

/**添加矢量要素*/
function addVectorLabel(coordinate,jason) {
    //新建一个要素 ol.Feature
    var newFeature = new ol.Feature({
        //几何信息
        geometry: new ol.geom.Point(coordinate),
        jason:jason
    });
    //设置要素的样式
    newFeature.setStyle(createLabelStyle(newFeature));
    //将新要素添加到数据源中
    vectorSource.addFeature(newFeature);
}
/*添加popup信息*/
function addFeatrueInfo(info) {
    if (info==undefined)
        return -1;
    content.innerHTML ="";
    var html = "<div id='parentUl' class='pop-upcontainer pop-text'>" +
        "<h3 align='center' style='color: white'>详细信息</h3>"+
        "<table border='1'"+
        "<tr>" +
        "<td width='20%'>寻亲类别：</td> " +
        "<td width='50%'>"+info.type+"</td>" +
        "</tr>"+
        "<tr>" +
        "<td>寻亲编号：</td>" +
        "<td>"+info.id+"</td>" +
        "</tr>"+
        "<tr>" +
        "<td>姓名：</td>" +
        "<td>"+info.name+"</td>" +
        "</tr>"+
        "<tr>" +
        "<td >性别：</td> " +
        "<td>"+info.sex+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >出生日期：</td> " +
        "<td>"+info.birthDate+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >身高：</td> " +
        "<td>"+info.height+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >失踪时间：</td> " +
        "<td>"+info.missingDate+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >失踪地点：</td> " +
        "<td>"+info.missingPlace+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >相关描述：</td> " +
        "<td>"+info.missingDesc+"</td>" +
        "</tr>"+
        "<tr>"+
        "<td >其他资料：</td> " +
        "<td>"+info.missingExtraData+"</td>"+
        "</tr>"+
        "</table>"+
        "<div id='pop-img'><img src='../libs/image/all_missing_people_photo/"+info.id+".jpg'/></div>"+
        "</div>";
    content.innerHTML=html;
}







/**
 * 显示人脸搜索结果相对应的popup
 * */
function showPopup(data) {
    var jsonObj = JSON.parse(data);
    for (var i=0;i<4;i++) {
        var json = parsePopupJson(jsonObj.missingPeopleList[i]);
        addVectorLabel([json.lng, json.lat], json);
    }
}

/**
 * 将后台得到的数据定制成Popup所需要的Json格式
 * */
function parsePopupJson(obj) {
    var json = {
        id: obj.missingID,
        type: obj.type,
        name: obj.missingName,
        sex: obj.sex,
        birthDate: getDateStr(obj.birthDate),
        height: obj.height,
        missingDate: getDateStr(obj.missingDate),
        missingPlace: obj.missingPlace,
        missingDesc: obj.description,
        missingExtraData: obj.extraData,
        lng: obj.lng,
        lat: obj.lat
    };
    return json;
}

/**
 * 将毫秒时间戳转化为--年--月--日字符串
 * */
function getDateStr(mill) {
    var date = new Date(mill);
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 ";
    };
    return date.toLocaleString();
}

function closePhotoShow() {
    document.getElementById("dropBox_success").style.display="none";
    document.getElementById("photo_box").style.display="none";
    document.getElementById("offer_clue_form").style.display="none";
    map.removeOverlay(popup);
    popup.setPosition(undefined);
    map.removeLayer(vectorLayer);
}

/*----------------------------------------提供线索表单展示----------------------------------------------------*/
//拖动修改后的坐标
var locationCoordinate = null;
var locationMapState = "none";
/**
 * 通过DOM id获取对象
 * */
function ID(id) {
    return document.getElementById(id);
}
//显示表单
function showOfferClueForm() {
    /*ID("offer_clue_form").style.display = "block";*/
    /*--------------------------------------------定位地图---------------------------------------*/
    if(locationMapState=="none"){
        //交互式拖动监听
        /**
         * Define a namespace for the application.
         */
        var app = {};


        /**
         * @constructor
         * @extends {ol.interaction.Pointer}
         */
        app.Drag = function() {

            ol.interaction.Pointer.call(this, {
                handleDownEvent: app.Drag.prototype.handleDownEvent,
                handleDragEvent: app.Drag.prototype.handleDragEvent,
                handleMoveEvent: app.Drag.prototype.handleMoveEvent,
                handleUpEvent: app.Drag.prototype.handleUpEvent
            });

            /**
             * @type {ol.Pixel}
             * @private
             */
            this.coordinate_ = null;

            /**
             * @type {string|undefined}
             * @private
             */
            this.cursor_ = 'pointer';

            /**
             * @type {ol.Feature}
             * @private
             */
            this.feature_ = null;

            /**
             * @type {string|undefined}
             * @private
             */
            this.previousCursor_ = undefined;

        };
        ol.inherits(app.Drag, ol.interaction.Pointer);


        /**
         * @param {ol.MapBrowserEvent} evt Map browser event.
         * @return {boolean} `true` to start the drag sequence.
         */
        app.Drag.prototype.handleDownEvent = function(evt) {
            var map = evt.map;

            var feature = map.forEachFeatureAtPixel(evt.pixel,
                function(feature) {
                    return feature;
                });

            if (feature) {
                this.coordinate_ = evt.coordinate;
                this.feature_ = feature;
            }
            return !!feature;
        };


        /**
         * @param {ol.MapBrowserEvent} evt Map browser event.
         */
        app.Drag.prototype.handleDragEvent = function(evt) {
            var deltaX = evt.coordinate[0] - this.coordinate_[0];
            var deltaY = evt.coordinate[1] - this.coordinate_[1];

            var geometry = /** @type {ol.geom.SimpleGeometry} */
                (this.feature_.getGeometry());
            geometry.translate(deltaX, deltaY);

            this.coordinate_[0] = evt.coordinate[0];
            this.coordinate_[1] = evt.coordinate[1];
            //不断改变location位置
            locationCoordinate = evt.coordinate;
        };


        /**
         * @param {ol.MapBrowserEvent} evt Event.
         */
        app.Drag.prototype.handleMoveEvent = function(evt) {
            if (this.cursor_) {
                var map = evt.map;
                var feature = map.forEachFeatureAtPixel(evt.pixel,
                    function(feature) {
                        return feature;
                    });
                var element = evt.map.getTargetElement();
                if (feature) {
                    if (element.style.cursor != this.cursor_) {
                        this.previousCursor_ = element.style.cursor;
                        element.style.cursor = this.cursor_;
                    }
                } else if (this.previousCursor_ !== undefined) {
                    element.style.cursor = this.previousCursor_;
                    this.previousCursor_ = undefined;
                }
            }
        };


        /**
         * @return {boolean} `false` to stop the drag sequence.
         */
        app.Drag.prototype.handleUpEvent = function() {
            this.coordinate_ = null;
            this.feature_ = null;
            return false;
        };

        locationMap =new ol.Map({
            interactions: ol.interaction.defaults().extend([new app.Drag()]),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
                    })
                })
            ],
            target: "location_map",
            view: new ol.View({
                //地图初始中心点
                center: [90.40623,35.529037],
                //地图初始显示级别
                zoom: 4,
                projection: new ol.proj.get('EPSG:4326')
            })
        });
        locationMapState = "show";
        return;
    }


}
//提交表单
function submitForm() {
    // 获取相似度超过80%的人数,及misisngIDList
    var num = 0;
    var missingIDList = [];
    var confidenceList = [];
    var obj = JSON.parse(_data);
    for (var i=0;i<obj.missingPeopleList.length;i++) {
        if (obj.missingPeopleList[i].confidence>=80) {
            num++;
            missingIDList.push(obj.missingPeopleList[i].missingID);
            confidenceList.push(obj.missingPeopleList[i].confidence);
        }
    }

    var clue_height = ID("clue_height").value;
    var clue_location = ID("clue_location").value;
    var clue_find_date = ID("clue_find_date").value;
    var clue_description = ID("clue_description").value;
    var clue_sex;
    // 获取性别
    var radio = document.getElementsByName("sex");
    for (var i=0; i<radio.length; i++) {
        if (radio[i].checked) {
            clue_sex = radio[i].value;
        }
    }
    if(clue_description==""||clue_height==""||clue_location==""|| clue_find_date==""){
        alert("请完善表单信息！");
        return;
    }
    ID("longitude").value = locationCoordinate[0];
    ID("latitude").value = locationCoordinate[1];
    //发送表单至Controller
    var message = {
        "num": num,
        "missingIDList": missingIDList,
        "confidenceList": confidenceList,
        "height": clue_height,
        "sex": clue_sex,
        "findPlace": clue_location,
        "findDate": clue_find_date,
        "description": clue_description,
        "lng": locationCoordinate[0],
        "lat": locationCoordinate[1]
    };
    console.log(JSON.stringify(message));
    var formData = new FormData();
    formData.append("message", encodeURI(JSON.stringify(message)));
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            window.alert(data);
        }
    };
    xhr.open("post", "AddClueController", true);
    xhr.send(formData);

}
//定位触发事件
$(document).ready(function () {
    $("#clue_location").blur(function () {
        var address = ID("clue_location").value;
        getLocation(address);
        // 初始化定位坐标
        locationCoordinate =  [ID("longitude").value,ID("latitude").value];
    })
});


//进行定位
var vectorLayer = null;
function getLocation(address) {
    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
        });
        //TODO: 使用geocoder 对象完成相关功能
        geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                //TODO:获得了有效经纬度，可以做一些展示工作
                //比如在获得的经纬度上打上一个Marker

                var lat = parseFloat(result.geocodes[0].location.lat);
                var lng = parseFloat(result.geocodes[0].location.lng);
                ID("longitude").value = lng;
                ID("latitude").value = lat;
                locationCoordinate = [lng, lat];
                //地图视图的初始参数
                var view = locationMap.getView();
                view.setCenter([lng,lat]);
                view.setZoom(14);
                //清空之前矢量图层
                locationMap.removeLayer(vectorLayer);
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point([lng,lat]),
                    name: address
                });
                iconFeature.setStyle(createLocationStyle(iconFeature));
                //矢量标注数据源
                var vectorSource = new ol.source.Vector({
                    features: [iconFeature]
                });
                //矢量标注图层
                vectorLayer = new ol.layer.Vector({
                    source: vectorSource
                });
                locationMap.addLayer(vectorLayer);

            }else{
                window.alert("定位失败！");
            }
        });
    })
}

/**
 * 创建矢量标注样式函数,设置image为图标ol.style.Icon
 * @param {ol.Feature} feature 要素
 */
var createLocationStyle = function (feature) {
    return new ol.style.Style({
        image: new ol.style.Icon(
            /** @type {olx.style.IconOptions} */
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                // scale:0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../libs/image/location.png'
            })),
        text: new ol.style.Text({
            //位置
            textAlign: 'center',
            //基准线
            textBaseline: 'middle',
            //文字样式
            font: 'normal 14px 微软雅黑',
            //文本内容
            text: feature.get('name'),
            //文本填充样式（即文字颜色）
            fill: new ol.style.Fill({ color: '#1728aa' }),
            stroke: new ol.style.Stroke({ color: '#39ffee', width: 2 })
        })
    });
};

$(document).ready(function () {
    $("#slidUp-clue-box").click(function () {
        $("#offer_clue_form").slideUp(200);
    })

    $("#addClueBtn").click(function () {
        $("#offer_clue_form").slideDown(200);
    })
});