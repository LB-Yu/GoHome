/**
 * @author Huleryo
 * @date 2017/7/12
 */

/**
 * 地图显示相关全局变量
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
})
/**
 * 用于记录当前显示状态
 * */
var currentState;

/**
 * 图片标注相关
 * */
// 矢量标注的数据源
var vectorSource;
// 矢量标注图层
var vectorLayer;

/**
 * 交互式查询
 * */
/*多边形查询*/
// 绘制对象
var draw;
// 绘制状态,初始为关闭
var drawState;
// 绘制图层
var drawVector;
/*点查询*/
var pointDraw;
var pointDrawState;
var pointDrawVector;
/*圆查询*/
var circleDraw;
var circleDrawState;
var circleDrawVextor;
/*拉框查询*/
var squareDraw;
var squareDrawState;
var squareDrawVector;
/*线查询*/
var lineDraw;
var lineDrawState;
var lineDrawVector;

window.onload = function () {
    // 当前显示状态
    currentState = "photo";
    // 交互式查询状态
    drawState = "off";
    pointDrawState = "off";
    lineDrawState = "off";
    circleDrawState = "off";
    squareDrawState = "off";
    map = createMap("mapCon", view);

    queryIDLatlng();

    vectorSource = new ol.source.Vector({
        features: []
    });
    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);
    query(gdb,num,querySuccess,queryError);
    addclusterPopup();
};

/**
 * 创建矢量标注样式函数,设置image为图标ol.style.Icon,即图片显示样式
 * @param {ol.Feature} feature 要素
 */
var createLabelStyle = function (feature, imgSrc) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon(
            ({
                anchor: [0.5, 60],
                anchorOrigin: 'top-right',
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale:0.05,
                //透明度
                opacity: 0.75,
                //图标的url
                src: imgSrc
            })
        )
    });
};

/**
 * 添加一个新的标注（矢量要素）
 * @param {ol.Coordinate} coordinate 坐标点
 */
function addVectorLabel(coordinate, imgSrc) {
    //新建一个要素 ol.Feature
    var newFeature = new ol.Feature({
        //几何信息
        geometry: new ol.geom.Point(coordinate)
    });
    //设置要素的样式
    newFeature.setStyle(createLabelStyle(newFeature, imgSrc));
    //将新要素添加到数据源中
    vectorSource.addFeature(newFeature);
}

/**
 * 数据库查询请求
 * */
function queryIDLatlng() {
    var formData = new FormData();
    formData.append("gap", 30);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="间隔参数错误！") {
                window.alert("照片数据获取失败！")
            } else {
                showPhotoMaker(data);
            }
        }
    };
    xhr.open("post", "PhotoMarkerController", true);
    xhr.send(formData);
}

/**
 * 显示照片标注
 * */
function showPhotoMaker(data) {
    var obj = JSON.parse(data);
    for (var i=0;i<obj.missingPeopleList.length;i++) {
        coordinate = [obj.missingPeopleList[i].lng, obj.missingPeopleList[i].lat];
        imgSrc = "../libs/image/all_missing_people_photo/"+obj.missingPeopleList[i].missingID+".jpg";
        addVectorLabel(coordinate, imgSrc);
    }
}

/**
 * 去除照片标注
 * */
function removePhotoMaker() {
    map.removeLayer(vectorLayer);
}
/**
 * 点击切换底图
 */
function change() {
    if (currentState=="photo") {
        clusters.setVisible(true);
        removePhotoMaker();
        currentState = "popup";
        document.getElementById("unfoldBtn").style.display = "block";
    } else {
        clusters.setVisible(false);
        if (filterclusters!=null) {
            filterclusters.setVisible(false);
        }
        map.removeLayer(filterclusters);
        map.addLayer(vectorLayer);
        currentState = "photo";
        document.getElementById("unfoldBtn").style.display = "none";
    }
}











/*------------------------------clusterPopup-----------------------------------------------*/




var gdb= "gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt";
                                        //底图
var num = 10000;                       //显示与查询数目
var container;
var content;
var closer;
var cluster_popup;
var len = 0;                           //一个聚合簇中个数
var filterclusters;                    //条件查询clusters层
var description = new Array();         //一个聚合簇中所有信息
var currentPage =1;                       //一个聚合簇信息当前页面
var totalPage =1;                         //总页面数
var clusters;                          //聚合簇
var total_text = new Array();          //记录总查询数据

function addclusterPopup() {
    container = document.getElementById("popup");
    content = document.getElementById("popup-content");
    closer = document.getElementById("popup-closer");

    //创建popUp 的OverLayer
    cluster_popup = createPopupLayer();
    //添加popUp 至底图
    map.addOverlay(cluster_popup);

    /**
     * 添加关闭按钮的单击事件（隐藏popup）
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function () {
        //未定义popup位置
        cluster_popup.setPosition(undefined);
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
     * 为map添加点击事件监听，捕获信息
     */
    map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
        if (feature) {
            if (drawState=="off"&&pointDrawState=="off"&&circleDrawState=="off"&&lineDrawState=="off"&&
                squareDrawState=="off") {
                container.style.display = "block";
                clusterPopup(feature);
            }
        }
    });
    //进行查询以及聚合簇
    addClusterTips();
};
/**
 * 附加
 * 根据feature构造cluster层
 * @param features
 * return clusters
 */
function createClusters(features,distance,imgUrl,scale,textColor) {
    //矢量要素数据源
    var source = new ol.source.Vector({
        features: features
    });
    //聚合标注数据源
    var clusterSource = new ol.source.Cluster({
        distance: distance,
        source: source
    });
    //加载聚合标注的矢量图层
    var styleCache = {};
    var newCluster = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
                style = [
                    new ol.style.Style({
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
                                scale:scale,
                                //透明度
                                opacity: 0.75,
                                //图标的url
                                src: imgUrl
                            })),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: textColor
                            })
                        })
                    })
                ];
                styleCache[size] = style;
            }
            return style;
        }
    });
    return newCluster;
}

/**
 * 查询成功解析json进行聚合标注
 * @param result
 */
function querySuccess(result) {
    var features = new Array();
    for(var i=0;i<num;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        //遍历信息进行存储
        total_text[i] = text;
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    clusters = createClusters(features,50,"../libs/image/clusters.png",0.5,'#fff');
    clusters.setVisible(false);
    map.addLayer(clusters);
}

/**
 * 解析Json
 * @param result
 * @param number
 * @param column
 * @returns {*}
 */
function getValue(result,number,column) {
    return result.SFEleArray[number].AttValue[column];
}
/**
 * 查询失败显示失败信息
 * @param e
 */
function queryError(e) {
    window.alert(e);
}
/**
 * 触发popup事件
 * @param feature
 */
function clusterPopup(feature) {
    //初始化cluster_popup参数
    len = getFeatureLen(feature);
    //刷新信息总页数
    totalPage = len;
    //刷新起始页
    currentPage = 1;
    //刷新位置
    var position = getFeatureCoordinates(feature);
    //刷新内容
    for (var i=0;i<len;i++){
        description[i] = getFeatureDesc(feature,i);
    }
    //初始化首页popup框中信息
    var i = addFeatrueInfo(description[currentPage-1]);
    if (i==-1)
        return;
    //进行定位
    cluster_popup.setPosition(position);
}
/**
 * 触发向前翻页事件
 */
function pageTurnBackFun() {
    if (currentPage > 1){
        currentPage = currentPage - 1;
        addFeatrueInfo(description[currentPage-1])
    }
}
/**
 * 触发向后翻页事件
 */
function pageTurnOverFun() {
    if (currentPage <len){
        currentPage = currentPage + 1;
        addFeatrueInfo(description[currentPage-1])
    }
}
/**
 * 获得feature的坐标
 * @param feature 聚合簇
 */
function getFeatureCoordinates(feature) {
    return feature.values_.geometry.flatCoordinates;
}
/**
 * 获得feature信息
 * @param feature 聚合簇
 * @param i
 */
function getFeatureDesc(feature,i) {
    return feature.values_.features[i].values_.text;
}
/**
 * 获得feature 数目
 * @param feature 聚合簇
 * return 返回数目
 */
function getFeatureLen(feature) {
    if (feature.values_.features==undefined)
        return;
    return feature.values_.features.length;
}
/**
 * 触发查询事件以及聚合标注事件
 */
function addClusterTips() {
    query(gdb,num,querySuccess,queryError);
    //矢量要素数据源
}
/**
 * 构造popLayer
 * @returns {ol.Overlay}
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
/**
 * 为popUp动态添加内容
 * */
function addFeatrueInfo(info) {
    if (info==undefined)
        return -1;
    content.innerHTML ="";
    var html = "<div id='parentUl' class='pop-upcontainer pop-text'>" +
        "<div id='pageTuringImg'><img id='pageTurnBack' onclick='pageTurnBackFun()' src='../libs/image/pageBack.png'/>"+
        "<img id='pageTurnOver' onclick='pageTurnOverFun()' src='../libs/image/pageForward.png'/>"+
        "<p id='pageIndex' style='color: white'>"+currentPage+"/"+totalPage+"</p></div>"+
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


/*----------------------------------------筛选功能------------------------------------------------------------*/
var tableTotalRecords;
var tableTotalPages;
var tableCurrentPage;
var tableStage;
var tableFilter_text;

/**
 * 获得一级索引和二级索引值，启动筛选
 */
function getFirstAndSecondValue() {
    var firstClass = document.getElementById("firstValueClass").selectedIndex;
    var firstValue = document.getElementById("firstValueInput").value;
    var secondClass = document.getElementById("secondValueClass").selectedIndex;
    var secondValue = document.getElementById("secondValueInput").value;
    startFilter(firstClass,firstValue,secondClass,secondValue);
}
/**
 * 开始筛选,筛选完毕调用cluster
 * @param firstClass
 * @param firstValue
 * @param secondClass
 * @param secondValue
 */
function startFilter(firstClass,firstValue,secondClass,secondValue) {
    //清除残余filterclusters层与底图
    //map.removeLayer(clusters);
    clusters.setVisible(false);
    map.removeLayer(filterclusters);
    //进行第一次筛选
    var firstFiltered_text = filterClusters(firstClass,firstValue,total_text);
    //进行第二次筛选
    var secondFiltered_text = filterClusters(secondClass,secondValue,firstFiltered_text);
    //筛选完毕，构造并添加filterClusters
    createFilterClusters(secondFiltered_text);
    tableFilter_text = secondFiltered_text;
    fillTable();
}

/**
 * 通过filterQuery筛选missingPeople,返回筛选后的text
 * @param filterQuery
 * @returns {Array}
 */
function filterClusters(filterClass,filterValue,raster_text) {
    //创建筛选数组tableFilter_text
    var tableFilter_text = new Array();
    var regex = new RegExp(filterValue);
    switch (filterClass){
        case 0:
            for (var i=0;i<raster_text.length;i++){
                var str = raster_text[i].missingDate;
                if(regex.test(str)){
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
        case 1:
            for (var i = 0; i < raster_text.length; i++) {
                var str = raster_text[i].id;
                if (filterValue == str) {
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
        case 2:
            for (var i=0;i<raster_text.length;i++){
                var str = raster_text[i].name;
                if(regex.test(str)){
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
        case 3:
            for (var i=0;i<raster_text.length;i++){
                var str = raster_text[i].sex;
                if(regex.test(str)){
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
        case 4:
            for (var i=0;i<raster_text.length;i++){
                var str = raster_text[i].missingPlace;
                if(regex.test(str)){
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
        case 5:
            for (var i=0;i<raster_text.length;i++){
                var str = raster_text[i].birthDate;
                if(regex.test(str)){
                    tableFilter_text.push(raster_text[i]);
                }
            }
            break;
    }
    return tableFilter_text;
}
/**
 * 通过tableFilter_text构建features
 * @param tableFilter_text
 */
function createFilterClusters(tableFilter_text) {
    var features = new Array();
    for(var i = 0;i<tableFilter_text.length;i++){
        var coordinates = [tableFilter_text[i].lng,tableFilter_text[i].lat];
        //构造点要素
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text:tableFilter_text[i]
            }
        );
    }
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,'#fff');
    map.addLayer(filterclusters);
}
/**
 * 添加拖动事件
 */
var showTable = "none";                                            //实现关心窗口和高级搜索切换
$(document).ready(function () {
    $("#seniorSearch").click(function () {
        if(showTable =="attentionTable"){
            $("#attentionPanel").slideUp(500);
        }
        //显示高级搜索table
        $("#filterPanel").slideDown(2000);
        showTable = "filterTable";
    })
    $("#tableClose").click(function () {
        //关闭高级搜索table
        $("#filterPanel").slideUp(2000);
        showTable = "none";
    })
    $("#showAttention").click(function () {
        if(showTable =="filterTable"){
            $("#filterPanel").slideUp(500);
        }
        initAttentionIndexes();

    })
    $("#attentionClose").click(function () {
        //关闭关心人员窗口
        $("#attentionPanel").slideUp(2000);
        showTable = "none";
    })

})
/**
 * 实现table填充
 * @param tableFilter_text
 */

function fillTable() {
    tableTotalRecords = tableFilter_text.length
    var pageIndex = tableTotalRecords/20;                              //一页显示20条记录
    tableTotalPages = 0;
    tableCurrentPage = 0;
    tableStage = true;                                            //看是否能整除
    if(Number.isInteger(pageIndex)){
        tableTotalPages = parseInt(pageIndex);
        tableStage = true;
    }
    else {
        tableTotalPages = parseInt(pageIndex)+1;
        tableStage = false;
    }
    tableTurnForward();
}
/**
 * 向后翻页
 */
function tableTurnForward() {
    var table = document.getElementById("descTable");
    var indexTip = document.getElementById("tablePageIndex");
    if (tableCurrentPage==tableTotalPages){
        if(tableTotalPages==0){
            table.innerHTML="<div style='text-align: center;'>未找到任何记录!</div>"
            indexTip.innerHTML="0/0";
        }
        return;
    }
    if (tableStage == false) {
        table.innerHTML = "";
        if (tableCurrentPage < tableTotalPages - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+
                "</tr>";
            for (var i = 0; i < 20; i++) {
                //清空原有数据
                var index = tableCurrentPage * 20 + i;
                var textHtml = "<tr>" +
                    "<td>" + tableFilter_text[index].type + "</td>" +
                    "<td>" + tableFilter_text[index].id + "</td>" +
                    "<td>" + tableFilter_text[index].name + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[index].lng + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[index].lat + "</td>" +
                    "<td class='addAttention'>关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        if (tableCurrentPage == tableTotalPages - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+
                "</tr>";
            for (var i = tableCurrentPage * 20; i < tableTotalRecords; i++) {
                //清空原有数据
                var textHtml = "<tr>" +
                    "<td>" + tableFilter_text[i].type + "</td>" +
                    "<td>" + tableFilter_text[i].id + "</td>" +
                    "<td>" + tableFilter_text[i].name + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[i].lng + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[i].lat + "</td>" +
                    "<td class='addAttention'>关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        else {
            table.innerHTML = "";
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+
                "</tr>";
            for (var i = 0; i < 20; i++) {
                //清空原有数据
                var index = tableCurrentPage * 20 + i;
                var textHtml = "<tr>" +
                    "<td>" + tableFilter_text[index].type + "</td>" +
                    "<td>" + tableFilter_text[index].id + "</td>" +
                    "<td>" + tableFilter_text[index].name + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[index].lng + "</td>" +
                    "<td style='display: none'>" + tableFilter_text[index].lat + "</td>" +
                    "<td class='addAttention'>关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        table.innerHTML = insertHtml;
        tableCurrentPage = tableCurrentPage + 1;
        indexTip.innerHTML = tableCurrentPage + "/" + tableTotalPages + "总记录数" + tableTotalRecords;
    }

}

/**
 * 向前翻页
 */
function tableTurnBack() {
    var table = document.getElementById("descTable");
    var indexTip = document.getElementById("tablePageIndex");
    if (tableCurrentPage==1)
        return;
    else {
        tableCurrentPage = tableCurrentPage-1;
        table.innerHTML = "";
        var insertHtml = "<tr>" +
            "<td style='width: 100px'>寻亲类别</td>" +
            "<td style='width: 100px'>寻亲编号</td>" +
            "<td style='width: 150px'>姓名</td>" +
            "<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+
            "</tr>";
        for (var i = 0; i < 20; i++) {
            var index = (tableCurrentPage-1) * 20 + i;
            var textHtml = "<tr id='"+index.toString()+ "'>" +
                "<td>" + tableFilter_text[index].type + "</td>" +
                "<td>" + tableFilter_text[index].id + "</td>" +
                "<td>" + tableFilter_text[index].name + "</td>" +
                "<td style='display: none'>" +tableFilter_text[index].lng + "</td>" +
                "<td style='display: none'>" +tableFilter_text[index].lat + "</td>" +
                "<td class='addAttention'>关注</td>" +
                "</tr>";
            insertHtml += textHtml;
        }
        table.innerHTML=insertHtml;
        indexTip.innerHTML=tableCurrentPage+"/"+tableTotalPages+"总记录数"+tableTotalRecords;
    }
}


/*绑定定位事件、添加关注、取消关注*/
$(document).ready(function () {
    /*添加定位绑定事件*/
    $("table").delegate('tr','click',function () {
        var text=$(this).context.innerHTML;
        var lng = parseFloat($(text)[3].innerHTML);
        var lat = parseFloat($(text)[4].innerHTML);
        var id = parseInt($(text)[1].innerHTML);
        /*通过id查询详细信息*/
        var result = filterClusters(1,id,total_text);
        /*若交互式查询关闭则允许弹出popup*/
        if (drawState=="off") {
            container.style.display = "block";
        }
        /*弹出popup并进行定位*/
        addFeatrueInfo(result[0]);
        cluster_popup.setPosition([lng,lat]);
        var view = map.getView();
        view.setCenter([lng,lat]);
    })
    /*添加关注事件*/
    $("table").delegate('.addAttention','click',function () {
        var test = $(this).parent()["0"].innerHTML;
        var id = $(test)[1].innerHTML;
        /*向后台发请求，添加关注*/
        addAttention(id);
    })
    /*取消关注事件*/
    $("table").delegate('.cancelAttention','click',function () {
        var test = $(this).parent()["0"].innerHTML;
        var id = $(test)[1].innerHTML;
        /*向后台发请求，添加关注*/
        cancelAttention(id);
        /*刷新关心人员列表*/
        initAttentionIndexes();
    })
});

/**
 * 添加关注
 * @param missingID
 */
function addAttention(missingID) {
    var formData = new FormData();
    formData.append("missingID", missingID);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            window.alert(data);
        }
    };
    xhr.open("post", "/pages/AddAttentionController", true);
    xhr.send(formData);
}
/**
 * 取消关注
 * @param missingID
 */
function cancelAttention(missingID) {
    var formData = new FormData();
    formData.append("missingID", missingID);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            window.alert(data);
        }
    };
    xhr.open("post", "/pages/CancelAttentionController", true);
    xhr.send(formData);
}
/*----------------------------------------------------关心窗口-----------------------------------------------------------------------------*/
var attentionTotalPage = 0;
var attentionCurrentPage = 0;
var attentionStage;                       //看是否能整除
var attentionTotalRecords = 0;
var attentionPeopleList;

function initAttentionIndexes(){
    /*清除底图与filterclusters*/
    map.removeLayer(filterclusters);
    //map.removeLayer(clusters);
    clusters.setVisible(false);
    attentionPeopleList = null;
    attentionPeopleList = new Array();
    var xmlHttp= new XMLHttpRequest();
        xmlHttp.onreadystatechange = handleStateChange;
        xmlHttp.open("GET", "/pages/ReFreshAttentionController", true);
        xmlHttp.send(null);
       //回调用方法
    function handleStateChange() {
        //状态为4时表示请求已完成
        if(xmlHttp.readyState == 4) {
            //表示请求的资源存在
            if(xmlHttp.status == 200) {
                if (xmlHttp.responseText=="请先登录！"){
                    window.alert("请先登录！")
                }
                else {
                    //打开关心人员窗口
                    $("#attentionPanel").slideDown(2000);
                    showTable = "attentionTable";
                    var attentionPeolpleID = xmlHttp.responseText.split(',');
                    for (var j=0;j<attentionPeolpleID.length;j++){
                        for (var i=0;i<total_text.length;i++){
                            if (attentionPeolpleID[j].replace(/[^0-9]/ig,"") == parseInt(total_text[i].id)) {
                                attentionPeopleList.push(total_text[i]);
                            }
                        }
                    }
                    /*初始化关系人员页面信息*/
                    attentionCurrentPage = 0;
                    attentionTotalRecords = attentionPeopleList.length;
                    if(Number.isInteger(attentionTotalRecords/20)){
                        attentionStage = true; //可以整除
                        attentionTotalPage = attentionTotalRecords/20;
                    }
                    else {
                        attentionStage = false;
                        attentionTotalPage = parseInt(attentionTotalRecords/20)+1;
                    }
                    /*显示关心人员筛选图层*/
                    createFilterClusters(attentionPeopleList);
                    attentionTurnForward();
            }
        }
    }

}
}

/**
 * 关心人员向后翻页
 */
function attentionTurnForward() {
    var table = document.getElementById("attentionTable");
    var indexTip = document.getElementById("attentionPageIndex");
    /*判断无记录或者翻到尾页*/
    if (attentionCurrentPage == attentionTotalPage){
        if(attentionTotalPage==0){
            table.innerHTML="<div style='text-align: center;'>未找到任何记录!</div>"
            indexTip.innerHTML="0/0";
        }
        return;
    }
    if (attentionStage == false) {
        table.innerHTML = "";
        if (attentionCurrentPage < attentionTotalPage - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='cancelAttention'src='../libs/image/cancelAttention.png'/></td>"+
                "</tr>";
            for (var i = 0; i < 20; i++) {
                //清空原有数据
                var index = attentionCurrentPage * 20 + i;
                var textHtml = "<tr>" +
                    "<td>" + attentionPeopleList[index].type + "</td>" +
                    "<td>" + attentionPeopleList[index].id + "</td>" +
                    "<td>" + attentionPeopleList[index].name + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[index].lng + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[index].lat + "</td>" +
                    "<td class='cancelAttention'>取消关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        if (attentionCurrentPage == attentionTotalPage - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='cancelAttention'src='../libs/image/cancelAttention.png'/></td>"+
                "</tr>";
            for (var i = attentionCurrentPage * 20; i < attentionTotalRecords; i++) {
                //清空原有数据
                var textHtml = "<tr>" +
                    "<td>" + attentionPeopleList[i].type + "</td>" +
                    "<td>" + attentionPeopleList[i].id + "</td>" +
                    "<td>" + attentionPeopleList[i].name + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[i].lng + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[i].lat + "</td>" +
                    "<td class='cancelAttention'>取消关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        else {
            table.innerHTML = "";
            var insertHtml = "<tr>" +
                "<td style='width: 100px'>寻亲类别</td>" +
                "<td style='width: 100px'>寻亲编号</td>" +
                "<td style='width: 150px'>姓名</td>" +
                "<td><img id='cancelAttention'src='../libs/image/cancelAttention.png'/></td>"+
                "</tr>";
            for (var i = 0; i < 20; i++) {
                //清空原有数据
                var index = attentionCurrentPage * 20 + i;
                var textHtml = "<tr>" +
                    "<td>" + attentionPeopleList[index].type + "</td>" +
                    "<td>" + attentionPeopleList[index].id + "</td>" +
                    "<td>" + attentionPeopleList[index].name + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[index].lng + "</td>" +
                    "<td style='display: none'>" + attentionPeopleList[index].lat + "</td>" +
                    "<td class='cancelAttention'>取消关注</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        table.innerHTML = insertHtml;
        attentionCurrentPage = attentionCurrentPage + 1;
        indexTip.innerHTML = attentionCurrentPage + "/" + attentionTotalPage + "总记录数" + attentionTotalRecords;
    }

}

/**
 * 关心人员向前翻页
 */
function attentionTurnBack() {
    var table = document.getElementById("attentionTable");
    var indexTip = document.getElementById("attentionPageIndex");
    if (attentionCurrentPage==1||attentionCurrentPage==0)
        return;
    else {
        attentionCurrentPage = attentionCurrentPage-1;
        table.innerHTML = "";
        var insertHtml = "<tr>" +
            "<td style='width: 100px'>寻亲类别</td>" +
            "<td style='width: 100px'>寻亲编号</td>" +
            "<td style='width: 150px'>姓名</td>" +
            "<td><img id='cancelAttention'src='../libs/image/cancelAttention.png'/></td>"+
            "</tr>";
        for (var i = 0; i < 20; i++) {
            var index = (attentionCurrentPage-1) * 20 + i;
            var textHtml = "<tr id='"+index.toString()+ "'>" +
                "<td>" + attentionPeopleList[index].type + "</td>" +
                "<td>" + attentionPeopleList[index].id + "</td>" +
                "<td>" + attentionPeopleList[index].name + "</td>" +
                "<td style='display: none'>" +attentionPeopleList[index].lng + "</td>" +
                "<td style='display: none'>" +attentionPeopleList[index].lat + "</td>" +
                "<td class='cancelAttention'>取消关注</td>" +
                "</tr>";
            insertHtml += textHtml;
        }
        table.innerHTML=insertHtml;
        indexTip.innerHTML=attentionCurrentPage+"/"+attentionTotalPage+"总记录数"+attentionTotalRecords;
    }

}































/*-----------------------------交互式多边形-----------------------------begin*/
/**
 * 点击查询按钮触发
 * */
function queryVectorLayerByPnt() {
    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    drawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            //边线样式
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(drawVector);

    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Polygon',
        //绘制层数据源
        source: source
    });
    map.addInteraction(draw);

    //点击查询的回调函数
    draw.on('drawend', drawControlback);
}

/**
 * 关闭查询
 * */
function stopqueryVectorLayerByPnt() {
    if (draw != null)
    //移除交互绘制控件
        map.removeInteraction(draw);
    drawState = "off";
}

/**
 * 点击查询的回调函数
 * */
function drawControlback(feature) {
    //清空上一次查询结果与clusters
    clusters.setVisible(false);
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //创建一个用于查询的区
    var geomObj = new Zondy.Object.Polygon();
    geomObj.setByOL(feature.feature.values_.geometry);
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        geometry: geomObj,
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    //queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 10000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "127.0.0.1",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(drawQuerySuccess, drawQueryError);
}

/**
 * 查询失败回调
 * */
function drawQueryError(e) {
    window.alert("多边形查询失败！");
}

/**
 * 交互式查询成功回调
 * */
function drawQuerySuccess(result) {
    map.removeLayer(filterclusters);
    clearA();
    console.log(result);
    var features = new Array();
    for(var i=0; i<result.SFEleArray.length;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,"#fff");

    /*清除底图聚合标注，并添加筛选聚合标注*/
    map.addLayer(filterclusters);
    stopqueryVectorLayerByPnt();
}

/**
 * 点击交互式查询按钮触发
 * */
function interractiveQuery() {
    if (drawState=="off") {
        queryVectorLayerByPnt();
        drawState = "on"
    } else {
        stopqueryVectorLayerByPnt();
        drawState = "off";
    }
}

/**
 * 清除客户端查询结果信息
 * */
function clearA() {
    map.removeLayer(drawVector);
}
/*-----------------------------交互式多边形-----------------------------end*/

/**
 * 显示全部popup
 * */
function showAllPopup() {
    map.removeLayer(filterclusters);
    //map.addLayer(clusters);
    clusters.setVisible(true);
}

/**
 * 全网搜索
 * */
function internetSearch() {
    document.getElementById("internet_search").style.display = "block";
}

/**
 * 关闭网页
 * */
function closeInternet() {
    document.getElementById("internet_search_result").style.display = "none";
    document.getElementById("close_internet_btn").style.display = "none";
}

/*-----------------------------交互式点-----------------------------begin*/
var pointNearDis;
/**
 * 展示点查询半径设置框
 * */
function showPointSeachRadius() {
    document.getElementById("point-radius-box").style.display = "block";
}

/**
 * 确定半径
 * */
function surePointRadius() {
    pointNearDis = document.getElementById("point-radius-input").value/100;
    document.getElementById("point-radius-box").style.display = "none";
    queryVectorLayerPoint();
}

function queryVectorLayerPoint() {
    pointDrawState = "on";
    clearA();
    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    pointDrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //形状
            image: new ol.style.Circle({
                radius: 0
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(pointDrawVector);

    //实例化交互绘制类对象并添加到地图容器中
    pointDraw = new ol.interaction.Draw({
        type: 'Point',
        //绘制层数据源
        source: source
    });
    map.addInteraction(pointDraw);
    //点击查询的回调函数
    pointDraw.on('drawend', pointDrawControlback);
}

function pointDrawControlback(feature) {
    clusters.setVisible(false);
    clearPoint();
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //创建一个用于查询的点
    var geomObj = new Zondy.Object.PointForQuery();
    geomObj.setByOL(feature.feature.values_.geometry);
    //设置点的查询半径
    geomObj.nearDis = pointNearDis;
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        geometry: geomObj,
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 10000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "127.0.0.1",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(pointQuerySuccess, pointQueryError);
}

//查询失败回调
function pointQueryError(e) {
    //停止进度条
    window.alert("点查询失败！");
}

//查询成功回调
function pointQuerySuccess(result) {
    console.log(result);
    // 停止交互式查询
    map.removeLayer(filterclusters);
    var features = new Array();
    for(var i=0; i<result.SFEleArray.length;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,"#fff");

    /*清除底图聚合标注，并添加筛选聚合标注*/
    map.addLayer(filterclusters);
    pointStopQueryVectorLayerByPnt();
}

function pointStopQueryVectorLayerByPnt() {
    if (pointDraw != null)
    //移除交互绘制控件
        map.removeInteraction(pointDraw);
    pointDrawState = "off";
}

function clearPoint() {
    map.removeLayer(pointDrawVector);
}
/*-----------------------------交互式点-----------------------------end*/


/*-----------------------------交互式圆-----------------------------begin*/
function queryVectorLayerCircle() {
    circleDrawState = "on";
    clearCircle();
    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    circleDrawVextor = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            //边线样式
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(circleDrawVextor);

    //实例化交互绘制类对象并添加到地图容器中
    circleDraw = new ol.interaction.Draw({
        type: 'Circle',
        //绘制层数据源
        source: source
    });
    map.addInteraction(circleDraw);
    //点击查询的回调函数
    circleDraw.on('drawend', circleDrawControlback);
}
function circleDrawControlback(feature) {
    clearCircle();
    clusters.setVisible(false);
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //创建一个用于查询的圆
    var geomObj = new Zondy.Object.Circle();
    geomObj.setByOL(feature.feature.values_.geometry);
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        geometry: geomObj,
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 10000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "127.0.0.1",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(circleQuerySuccess, circleQueryError);
}

//查询失败回调
function circleQueryError(e) {
    //停止进度条
    window.alert("圆查询失败！");
}

//查询成功回调
function circleQuerySuccess(result) {
    console.log(result);
    // 停止交互式查询
    map.removeLayer(filterclusters);
    var features = new Array();
    for(var i=0; i<result.SFEleArray.length;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,"#fff");

    /*清除底图聚合标注，并添加筛选聚合标注*/
    map.addLayer(filterclusters);
    // 停止圆查询
    circleStopQueryVectorLayerByPnt();
}

function circleStopQueryVectorLayerByPnt() {
    if (circleDraw != null)
    //移除交互绘制控件
        map.removeInteraction(circleDraw);
    circleDrawState = "off";
}

function clearCircle() {
    map.removeLayer(circleDrawVextor);
}
/*-----------------------------交互式圆-----------------------------end*/

/*-----------------------------交互式拉框-----------------------------begin*/
function queryVectorLayerSquare() {
    squareDrawState = "on";
    clearSquare();
    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    squareDrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            //边线样式
            stroke: new ol.style.Stroke({
                color: 'blue',
                width: 1
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(squareDrawVector);

    var maxPoints = 2;
    geometryFunction = function (coordinates, geometry) {
        if (!geometry) {
            //多边形
            geometry = new ol.geom.Polygon(null);
        }
        var start = coordinates[0];
        var end = coordinates[1];
        geometry.setCoordinates([
            [start, [start[0], end[1]], end, [end[0], start[1]], start]
        ]);
        return geometry;
    };
    //实例化交互绘制类对象并添加到地图容器中
    squareDraw = new ol.interaction.Draw({
        type: 'LineString',
        //绘制层数据源
        source: source,
        geometryFunction: geometryFunction,
        //最大点数
        maxPoints: maxPoints
    });
    map.addInteraction(squareDraw);
    //点击查询的回调函数
    squareDraw.on('drawend', squareDrawControlback);
}
function squareDrawControlback(features) {
    clearSquare();
    clusters.setVisible(false);
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //创建一个用于查询的区
    var geomObj = new Zondy.Object.Polygon();
    geomObj.setByOL(features.feature.values_.geometry);
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
    });
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        geometry: geomObj,
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 10000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "127.0.0.1",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(squareQuerySuccess, squareQueryError);
}

//查询失败回调
function squareQueryError(e) {
    window.alert("拉框查询失败！");
}

//查询成功回调
function squareQuerySuccess(result) {
    console.log(result);
    // 停止交互式查询
    map.removeLayer(filterclusters);
    var features = new Array();
    for(var i=0; i<result.SFEleArray.length;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,"#fff");

    /*清除底图聚合标注，并添加筛选聚合标注*/
    map.addLayer(filterclusters);
    // 停止拉框查询
    squareStopQueryVectorLayerByPnt();
}

function squareStopQueryVectorLayerByPnt() {
    if (squareDraw != null)
    //移除交互绘制控件
        map.removeInteraction(squareDraw);
    squareDrawState = "off";
}

function clearSquare() {
    map.removeLayer(squareDrawVector);
}
/*-----------------------------交互式拉框-----------------------------end*/

/*-----------------------------交互式线-----------------------------begin*/
var pointObj = new Array();
var polyLine = null;
var pointListenerKey;
var lineNearDis;
/**
 * 显示半径设置框
 * */
function showLineRadius() {
    document.getElementById("line-radius-box").style.display = "block";
}

/**
 * 确定半径设置
 * */
function sureLineRadius() {
    document.getElementById("line-radius-box").style.display = "none";
    lineNearDis = document.getElementById("line-radius-input").value/100;
    queryVectorLayerLine();
}

function queryVectorLayerLine() {
    clearLine();
    lineDrawState = "on";
    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    lineDrawVector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            //边线样式
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(lineDrawVector);

    //实例化交互绘制类对象并添加到地图容器中
    lineDraw = new ol.interaction.Draw({
        type: 'LineString',
        //绘制层数据源
        source: source
    });
    map.addInteraction(lineDraw);
    // 打开地图点击位置监听
    openListener();
    //点击查询的回调函数
    lineDraw.on('drawend', queryByLine);

}

function queryByLine() {
    closeListener();
    clearLine();
    clusters.setVisible(false);
    console.log(pointObj);
    polyLine = new Zondy.Object.PolyLine(pointObj);
    polyLine.nearDis = lineNearDis;
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    //是否包含几何图形信息
    queryStruct.IncludeGeometry = true;
    //是否包含属性信息
    queryStruct.IncludeAttribute = true;
    //是否包含图形显示参数
    queryStruct.IncludeWebGraphic = false;
    //指定查询规则
    var rule = new Zondy.Service.QueryFeatureRule({
        //是否将要素的可见性计算在内
        EnableDisplayCondition: false,
        //是否完全包含
        MustInside: false,
        //是否仅比较要素的外包矩形
        CompareRectOnly: false,
        //是否相交
        Intersect: true
    });
    ///实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        geometry: polyLine,
        geometryType: "line",
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 1000;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "127.0.0.1",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(LineQuerySuccess, LineQueryError);
}

//查询失败回调
function LineQueryError(e) {
    window.alert("线查询失败！");
}

//查询成功回调
function LineQuerySuccess(result) {
    lineStopQueryVectorLayerByPnt();
    console.log(result);
    // 停止交互式查询
    map.removeLayer(filterclusters);
    var features = new Array();
    for(var i=0; i<result.SFEleArray.length;i++){
        //构造json信息
        var text={
            type:getValue(result,i,3),
            id: getValue(result,i,2),
            name:getValue(result,i,4),
            sex:getValue(result,i,5),
            birthDate:getValue(result,i,6),
            height:getValue(result,i,7),
            missingDate:getValue(result,i,8),
            missingPlace:getValue(result,i,9),
            missingDesc:getValue(result,i,10),
            missingExtraData:getValue(result,i,11),
            lng: parseFloat(getValue(result,i,0)),
            lat: parseFloat(getValue(result,i,1))
        };
        var coordinates = [text.lng,text.lat];
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //构造初始化clusters层
    filterclusters = createClusters(features,50,"../libs/image/filterclusters.png",0.5,"#fff");

    /*清除底图聚合标注，并添加筛选聚合标注*/
    map.addLayer(filterclusters);


}

//清除客户端查询结果信息
function clearLine() {
    map.removeLayer(lineDrawVector);
}

function lineStopQueryVectorLayerByPnt() {
    if (lineDraw != null)
    //移除交互绘制控件
        map.removeInteraction(lineDraw);
    lineDrawState = "off";
}

/**
 * 鼠标点击位置监听器
 **/
function listener(evt) {
    //鼠标单击点坐标
    var point = evt.coordinate;
    console.log(point);
    pointObj.push(new Zondy.Object.Point2D(point[0], point[1]));
}

/**
 * 鼠标点击点监听
 * */
function openListener() {
    pointObj = new Array();
    pointListenerKey = map.on('click', listener);
}

/**
 * 关闭鼠标点击监听
 * */
function closeListener() {
    /*map.un('click', listener);*/
    ol.Observable.unByKey(pointListenerKey);
    map.on('click', function (evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
        if (feature) {
            if (drawState=="off"&&pointDrawState=="off"&&circleDrawState=="off"&&lineDrawState=="off"&&
                squareDrawState=="off") {
                container.style.display = "block";
                clusterPopup(feature);
            }
        }
    });
}
/*-----------------------------交互式线---------------------------------------------------end*/

//定位框联动
function response() {
    var value=window.document.getElementById("mp-missingplace-p").selectedIndex;
    var x ;
    switch (value)
    {
        case 1:
            x="<option value=\"东城\" id=\"city_0\">东城</option><option value=\"西城\" id=\"city_1\">西城</option><option value=\"朝阳\" id=\"city_2\">朝阳</option><option value=\"丰台\" id=\"city_3\">丰台</option><option value=\"石景山\" id=\"city_4\">石景山</option><option value=\"海淀\" id=\"city_5\">海淀</option><option value=\"门头沟\" id=\"city_6\">门头沟</option><option value=\"房山\" id=\"city_7\">房山</option><option value=\"通州\" id=\"city_8\">通州</option><option value=\"顺义\" id=\"city_9\">顺义</option><option value=\"昌平\" id=\"city_10\">昌平</option><option value=\"大兴\" id=\"city_11\">大兴</option><option value=\"平谷\" id=\"city_12\">平谷</option><option value=\"怀柔\" id=\"city_13\">怀柔</option><option value=\"密云\" id=\"city_14\">密云</option><option value=\"延庆\" id=\"city_15\">延庆</option>";
            break;
        case 2:
            x="<option value=\"和平\" id=\"city_0\">和平</option><option value=\"河东\" id=\"city_1\">河东</option><option value=\"河西\" id=\"city_2\">河西</option><option value=\"南开\" id=\"city_3\">南开</option><option value=\"河北\" id=\"city_4\">河北</option><option value=\"红桥\" id=\"city_5\">红桥</option><option value=\"东丽\" id=\"city_6\">东丽</option><option value=\"西青\" id=\"city_7\">西青</option><option value=\"津南\" id=\"city_8\">津南</option><option value=\"北辰\" id=\"city_9\">北辰</option><option value=\"宁河\" id=\"city_10\">宁河</option><option value=\"武清\" id=\"city_11\">武清</option><option value=\"静海\" id=\"city_12\">静海</option><option value=\"宝坻\" id=\"city_13\">宝坻</option><option value=\"蓟县\" id=\"city_14\">蓟县</option><option value=\"滨海新区\" id=\"city_15\">滨海新区</option>";
            break;
        case 3:
            x="<option value=\"石家庄\" id=\"city_0\">石家庄</option><option value=\"唐山\" id=\"city_1\">唐山</option><option value=\"秦皇岛\" id=\"city_2\">秦皇岛</option><option value=\"邯郸\" id=\"city_3\">邯郸</option><option value=\"邢台\" id=\"city_4\">邢台</option><option value=\"保定\" id=\"city_5\">保定</option><option value=\"张家口\" id=\"city_6\">张家口</option><option value=\"承德\" id=\"city_7\">承德</option><option value=\"沧州\" id=\"city_8\">沧州</option><option value=\"廊坊\" id=\"city_9\">廊坊</option><option value=\"衡水\" id=\"city_10\">衡水</option>";
            break;
        case 4:
            x="<option value=\"太原\" id=\"city_0\">太原</option><option value=\"大同\" id=\"city_1\">大同</option><option value=\"阳泉\" id=\"city_2\">阳泉</option><option value=\"长治\" id=\"city_3\">长治</option><option value=\"晋城\" id=\"city_4\">晋城</option><option value=\"朔州\" id=\"city_5\">朔州</option><option value=\"晋中\" id=\"city_6\">晋中</option><option value=\"运城\" id=\"city_7\">运城</option><option value=\"忻州\" id=\"city_8\">忻州</option><option value=\"临汾\" id=\"city_9\">临汾</option><option value=\"吕梁\" id=\"city_10\">吕梁</option>";
            break;
        case 5:
            x="<option value=\"呼和浩特\" id=\"city_0\">呼和浩特</option><option value=\"包头\" id=\"city_1\">包头</option><option value=\"乌海\" id=\"city_2\">乌海</option><option value=\"赤峰\" id=\"city_3\">赤峰</option><option value=\"通辽\" id=\"city_4\">通辽</option><option value=\"鄂尔多斯\" id=\"city_5\">鄂尔多斯</option><option value=\"呼伦贝尔\" id=\"city_6\">呼伦贝尔</option><option value=\"巴彦淖尔\" id=\"city_7\">巴彦淖尔</option><option value=\"乌兰察布\" id=\"city_8\">乌兰察布</option><option value=\"兴安\" id=\"city_9\">兴安</option><option value=\"锡林郭勒\" id=\"city_10\">锡林郭勒</option><option value=\"阿拉善\" id=\"city_11\">阿拉善</option>";
            break;
        case 6:
            x="<option value=\"沈阳\" id=\"city_0\">沈阳</option><option value=\"大连\" id=\"city_1\">大连</option><option value=\"鞍山\" id=\"city_2\">鞍山</option><option value=\"抚顺\" id=\"city_3\">抚顺</option><option value=\"本溪\" id=\"city_4\">本溪</option><option value=\"丹东\" id=\"city_5\">丹东</option><option value=\"锦州\" id=\"city_6\">锦州</option><option value=\"营口\" id=\"city_7\">营口</option><option value=\"阜新\" id=\"city_8\">阜新</option><option value=\"辽阳\" id=\"city_9\">辽阳</option><option value=\"盘锦\" id=\"city_10\">盘锦</option><option value=\"铁岭\" id=\"city_11\">铁岭</option><option value=\"朝阳\" id=\"city_12\">朝阳</option><option value=\"葫芦岛\" id=\"city_13\">葫芦岛</option>";
            break;
        case 7:
            x="<option value=\"长春\" id=\"city_0\">长春</option><option value=\"吉林\" id=\"city_1\">吉林</option><option value=\"四平\" id=\"city_2\">四平</option><option value=\"辽源\" id=\"city_3\">辽源</option><option value=\"通化\" id=\"city_4\">通化</option><option value=\"白山\" id=\"city_5\">白山</option><option value=\"松原\" id=\"city_6\">松原</option><option value=\"白城\" id=\"city_7\">白城</option><option value=\"延边\" id=\"city_8\">延边</option>";
            break;
        case 8:
            x="<option value=\"哈尔滨\" id=\"city_0\">哈尔滨</option><option value=\"齐齐哈尔\" id=\"city_1\">齐齐哈尔</option><option value=\"鸡西\" id=\"city_2\">鸡西</option><option value=\"鹤岗\" id=\"city_3\">鹤岗</option><option value=\"双鸭山\" id=\"city_4\">双鸭山</option><option value=\"大庆\" id=\"city_5\">大庆</option><option value=\"伊春\" id=\"city_6\">伊春</option><option value=\"佳木斯\" id=\"city_7\">佳木斯</option><option value=\"七台河\" id=\"city_8\">七台河</option><option value=\"牡丹江\" id=\"city_9\">牡丹江</option><option value=\"黑河\" id=\"city_10\">黑河</option><option value=\"绥化\" id=\"city_11\">绥化</option><option value=\"大兴安岭\" id=\"city_12\">大兴安岭</option>";
            break;
        case 9:
            x="<option value=\"黄浦\" id=\"city_0\">黄浦</option><option value=\"卢湾\" id=\"city_1\">卢湾</option><option value=\"徐汇\" id=\"city_2\">徐汇</option><option value=\"长宁\" id=\"city_3\">长宁</option><option value=\"静安\" id=\"city_4\">静安</option><option value=\"普陀\" id=\"city_5\">普陀</option><option value=\"闸北\" id=\"city_6\">闸北</option><option value=\"虹口\" id=\"city_7\">虹口</option><option value=\"杨浦\" id=\"city_8\">杨浦</option><option value=\"闵行\" id=\"city_9\">闵行</option><option value=\"宝山\" id=\"city_10\">宝山</option><option value=\"嘉定\" id=\"city_11\">嘉定</option><option value=\"浦东新\" id=\"city_12\">浦东新</option><option value=\"金山\" id=\"city_13\">金山</option><option value=\"松江\" id=\"city_14\">松江</option><option value=\"奉贤\" id=\"city_15\">奉贤</option><option value=\"青浦\" id=\"city_16\">青浦</option><option value=\"崇明\" id=\"city_17\">崇明</option>";
            break;
        case 10:
            x="<option value=\"南京\" id=\"city_0\">南京</option><option value=\"无锡\" id=\"city_1\">无锡</option><option value=\"徐州\" id=\"city_2\">徐州</option><option value=\"常州\" id=\"city_3\">常州</option><option value=\"苏州\" id=\"city_4\">苏州</option><option value=\"南通\" id=\"city_5\">南通</option><option value=\"连云港\" id=\"city_6\">连云港</option><option value=\"淮安\" id=\"city_7\">淮安</option><option value=\"盐城\" id=\"city_8\">盐城</option><option value=\"扬州\" id=\"city_9\">扬州</option><option value=\"镇江\" id=\"city_10\">镇江</option><option value=\"泰州\" id=\"city_11\">泰州</option><option value=\"宿迁\" id=\"city_12\">宿迁</option>";
            break;
        case 11:
            x="<option value=\"杭州\" id=\"city_0\">杭州</option><option value=\"宁波\" id=\"city_1\">宁波</option><option value=\"温州\" id=\"city_2\">温州</option><option value=\"嘉兴\" id=\"city_3\">嘉兴</option><option value=\"湖州\" id=\"city_4\">湖州</option><option value=\"绍兴\" id=\"city_5\">绍兴</option><option value=\"金华\" id=\"city_6\">金华</option><option value=\"衢州\" id=\"city_7\">衢州</option><option value=\"舟山\" id=\"city_8\">舟山</option><option value=\"台州\" id=\"city_9\">台州</option><option value=\"丽水\" id=\"city_10\">丽水</option>";
            break;
        case 12:
            x="<option value=\"合肥\" id=\"city_0\">合肥</option><option value=\"芜湖\" id=\"city_1\">芜湖</option><option value=\"蚌埠\" id=\"city_2\">蚌埠</option><option value=\"淮南\" id=\"city_3\">淮南</option><option value=\"马鞍山\" id=\"city_4\">马鞍山</option><option value=\"淮北\" id=\"city_5\">淮北</option><option value=\"铜陵\" id=\"city_6\">铜陵</option><option value=\"安庆\" id=\"city_7\">安庆</option><option value=\"黄山\" id=\"city_8\">黄山</option><option value=\"滁州\" id=\"city_9\">滁州</option><option value=\"阜阳\" id=\"city_10\">阜阳</option><option value=\"宿州\" id=\"city_11\">宿州</option><option value=\"六安\" id=\"city_12\">六安</option><option value=\"亳州\" id=\"city_13\">亳州</option><option value=\"池州\" id=\"city_14\">池州</option><option value=\"宣城\" id=\"city_15\">宣城</option>";
            break;
        case 13:
            x="<option value=\"福州\" id=\"city_0\">福州</option><option value=\"厦门\" id=\"city_1\">厦门</option><option value=\"莆田\" id=\"city_2\">莆田</option><option value=\"三明\" id=\"city_3\">三明</option><option value=\"泉州\" id=\"city_4\">泉州</option><option value=\"漳州\" id=\"city_5\">漳州</option><option value=\"南平\" id=\"city_6\">南平</option><option value=\"龙岩\" id=\"city_7\">龙岩</option><option value=\"宁德\" id=\"city_8\">宁德</option>";
            break;
        case 14:
            x="<option value=\"南昌\" id=\"city_0\">南昌</option><option value=\"景德镇\" id=\"city_1\">景德镇</option><option value=\"萍乡\" id=\"city_2\">萍乡</option><option value=\"九江\" id=\"city_3\">九江</option><option value=\"新余\" id=\"city_4\">新余</option><option value=\"鹰潭\" id=\"city_5\">鹰潭</option><option value=\"赣州\" id=\"city_6\">赣州</option><option value=\"吉安\" id=\"city_7\">吉安</option><option value=\"宜春\" id=\"city_8\">宜春</option><option value=\"抚州\" id=\"city_9\">抚州</option><option value=\"上饶\" id=\"city_10\">上饶</option>";
            break;
        case 15:
            x="<option value=\"济南\" id=\"city_0\">济南</option><option value=\"青岛\" id=\"city_1\">青岛</option><option value=\"淄博\" id=\"city_2\">淄博</option><option value=\"枣庄\" id=\"city_3\">枣庄</option><option value=\"东营\" id=\"city_4\">东营</option><option value=\"烟台\" id=\"city_5\">烟台</option><option value=\"潍坊\" id=\"city_6\">潍坊</option><option value=\"济宁\" id=\"city_7\">济宁</option><option value=\"泰安\" id=\"city_8\">泰安</option><option value=\"威海\" id=\"city_9\">威海</option><option value=\"日照\" id=\"city_10\">日照</option><option value=\"莱芜\" id=\"city_11\">莱芜</option><option value=\"临沂\" id=\"city_12\">临沂</option><option value=\"德州\" id=\"city_13\">德州</option><option value=\"聊城\" id=\"city_14\">聊城</option><option value=\"滨州\" id=\"city_15\">滨州</option><option value=\"菏泽\" id=\"city_16\">菏泽</option>";
            break;
        case 16:
            x="<option value=\"郑州\" id=\"city_0\">郑州</option><option value=\"开封\" id=\"city_1\">开封</option><option value=\"洛阳\" id=\"city_2\">洛阳</option><option value=\"平顶山\" id=\"city_3\">平顶山</option><option value=\"安阳\" id=\"city_4\">安阳</option><option value=\"鹤壁\" id=\"city_5\">鹤壁</option><option value=\"新乡\" id=\"city_6\">新乡</option><option value=\"焦作\" id=\"city_7\">焦作</option><option value=\"濮阳\" id=\"city_8\">濮阳</option><option value=\"许昌\" id=\"city_9\">许昌</option><option value=\"漯河\" id=\"city_10\">漯河</option><option value=\"三门峡\" id=\"city_11\">三门峡</option><option value=\"南阳\" id=\"city_12\">南阳</option><option value=\"商丘\" id=\"city_13\">商丘</option><option value=\"信阳\" id=\"city_14\">信阳</option><option value=\"周口\" id=\"city_15\">周口</option><option value=\"驻马店\" id=\"city_16\">驻马店</option><option value=\"济源\" id=\"city_17\">济源</option>";
            break;
        case 0:
            x="<option value=\"武汉\" id=\"city_0\">武汉</option><option value=\"黄石\" id=\"city_1\">黄石</option><option value=\"十堰\" id=\"city_2\">十堰</option><option value=\"宜昌\" id=\"city_3\">宜昌</option><option value=\"襄阳\" id=\"city_4\">襄阳</option><option value=\"鄂州\" id=\"city_5\">鄂州</option><option value=\"荆门\" id=\"city_6\">荆门</option><option value=\"孝感\" id=\"city_7\">孝感</option><option value=\"荆州\" id=\"city_8\">荆州</option><option value=\"黄冈\" id=\"city_9\">黄冈</option><option value=\"咸宁\" id=\"city_10\">咸宁</option><option value=\"随州\" id=\"city_11\">随州</option><option value=\"恩施\" id=\"city_12\">恩施</option><option value=\"仙桃\" id=\"city_13\">仙桃</option><option value=\"潜江\" id=\"city_14\">潜江</option><option value=\"天门\" id=\"city_15\">天门</option><option value=\"神农架\" id=\"city_16\">神农架</option>";
            break;
        case 17:
            x="<option value=\"长沙\" id=\"city_0\">长沙</option><option value=\"株洲\" id=\"city_1\">株洲</option><option value=\"湘潭\" id=\"city_2\">湘潭</option><option value=\"衡阳\" id=\"city_3\">衡阳</option><option value=\"邵阳\" id=\"city_4\">邵阳</option><option value=\"岳阳\" id=\"city_5\">岳阳</option><option value=\"常德\" id=\"city_6\">常德</option><option value=\"张家界\" id=\"city_7\">张家界</option><option value=\"益阳\" id=\"city_8\">益阳</option><option value=\"郴州\" id=\"city_9\">郴州</option><option value=\"永州\" id=\"city_10\">永州</option><option value=\"怀化\" id=\"city_11\">怀化</option><option value=\"娄底\" id=\"city_12\">娄底</option><option value=\"湘西\" id=\"city_13\">湘西</option>";
            break;
        case 18:
            x="<option value=\"广州\" id=\"city_0\">广州</option><option value=\"韶关\" id=\"city_1\">韶关</option><option value=\"深圳\" id=\"city_2\">深圳</option><option value=\"珠海\" id=\"city_3\">珠海</option><option value=\"汕头\" id=\"city_4\">汕头</option><option value=\"佛山\" id=\"city_5\">佛山</option><option value=\"江门\" id=\"city_6\">江门</option><option value=\"湛江\" id=\"city_7\">湛江</option><option value=\"茂名\" id=\"city_8\">茂名</option><option value=\"肇庆\" id=\"city_9\">肇庆</option><option value=\"惠州\" id=\"city_10\">惠州</option><option value=\"梅州\" id=\"city_11\">梅州</option><option value=\"汕尾\" id=\"city_12\">汕尾</option><option value=\"河源\" id=\"city_13\">河源</option><option value=\"阳江\" id=\"city_14\">阳江</option><option value=\"清远\" id=\"city_15\">清远</option><option value=\"东莞\" id=\"city_16\">东莞</option><option value=\"中山\" id=\"city_17\">中山</option><option value=\"潮州\" id=\"city_18\">潮州</option><option value=\"揭阳\" id=\"city_19\">揭阳</option><option value=\"云浮\" id=\"city_20\">云浮</option>";
            break;
        case 19:
            x="<option value=\"南宁\" id=\"city_0\">南宁</option><option value=\"柳州\" id=\"city_1\">柳州</option><option value=\"桂林\" id=\"city_2\">桂林</option><option value=\"梧州\" id=\"city_3\">梧州</option><option value=\"北海\" id=\"city_4\">北海</option><option value=\"防城港\" id=\"city_5\">防城港</option><option value=\"钦州\" id=\"city_6\">钦州</option><option value=\"贵港\" id=\"city_7\">贵港</option><option value=\"玉林\" id=\"city_8\">玉林</option><option value=\"百色\" id=\"city_9\">百色</option><option value=\"贺州\" id=\"city_10\">贺州</option><option value=\"河池\" id=\"city_11\">河池</option><option value=\"来宾\" id=\"city_12\">来宾</option><option value=\"崇左\" id=\"city_13\">崇左</option>";
            break;
        case 20:
            x="<option value=\"海口\" id=\"city_0\">海口</option><option value=\"三亚\" id=\"city_1\">三亚</option><option value=\"三沙\" id=\"city_2\">三沙</option><option value=\"五指山\" id=\"city_3\">五指山</option><option value=\"琼海\" id=\"city_4\">琼海</option><option value=\"儋州\" id=\"city_5\">儋州</option><option value=\"文昌\" id=\"city_6\">文昌</option><option value=\"万宁\" id=\"city_7\">万宁</option><option value=\"东方\" id=\"city_8\">东方</option><option value=\"定安\" id=\"city_9\">定安</option><option value=\"屯昌\" id=\"city_10\">屯昌</option><option value=\"澄迈\" id=\"city_11\">澄迈</option><option value=\"临高\" id=\"city_12\">临高</option><option value=\"白沙\" id=\"city_13\">白沙</option><option value=\"昌江\" id=\"city_14\">昌江</option><option value=\"乐东\" id=\"city_15\">乐东</option><option value=\"陵水\" id=\"city_16\">陵水</option><option value=\"保亭\" id=\"city_17\">保亭</option><option value=\"琼中\" id=\"city_18\">琼中</option>";
            break;
        case 21:
            x="<option value=\"万州\" id=\"city_0\">万州</option><option value=\"涪陵\" id=\"city_1\">涪陵</option><option value=\"渝中\" id=\"city_2\">渝中</option><option value=\"大渡口\" id=\"city_3\">大渡口</option><option value=\"江北\" id=\"city_4\">江北</option><option value=\"沙坪坝\" id=\"city_5\">沙坪坝</option><option value=\"九龙坡\" id=\"city_6\">九龙坡</option><option value=\"南岸\" id=\"city_7\">南岸</option><option value=\"北碚\" id=\"city_8\">北碚</option><option value=\"万盛\" id=\"city_9\">万盛</option><option value=\"双桥\" id=\"city_10\">双桥</option><option value=\"渝北\" id=\"city_11\">渝北</option><option value=\"巴南\" id=\"city_12\">巴南</option><option value=\"长寿\" id=\"city_13\">长寿</option><option value=\"綦江\" id=\"city_14\">綦江</option><option value=\"潼南\" id=\"city_15\">潼南</option><option value=\"铜梁\" id=\"city_16\">铜梁</option><option value=\"大足\" id=\"city_17\">大足</option><option value=\"荣昌\" id=\"city_18\">荣昌</option><option value=\"璧山\" id=\"city_19\">璧山</option><option value=\"梁平\" id=\"city_20\">梁平</option><option value=\"城口\" id=\"city_21\">城口</option><option value=\"丰都\" id=\"city_22\">丰都</option><option value=\"垫江\" id=\"city_23\">垫江</option><option value=\"武隆\" id=\"city_24\">武隆</option><option value=\"忠县\" id=\"city_25\">忠县</option><option value=\"开县\" id=\"city_26\">开县</option><option value=\"云阳\" id=\"city_27\">云阳</option><option value=\"奉节\" id=\"city_28\">奉节</option><option value=\"巫山\" id=\"city_29\">巫山</option><option value=\"巫溪\" id=\"city_30\">巫溪</option><option value=\"黔江\" id=\"city_31\">黔江</option><option value=\"石柱\" id=\"city_32\">石柱</option><option value=\"秀山\" id=\"city_33\">秀山</option><option value=\"酉阳\" id=\"city_34\">酉阳</option><option value=\"彭水\" id=\"city_35\">彭水</option><option value=\"江津\" id=\"city_36\">江津</option><option value=\"合川\" id=\"city_37\">合川</option><option value=\"永川\" id=\"city_38\">永川</option><option value=\"南川\" id=\"city_39\">南川</option><option value=\"两江新区\" id=\"city_40\">两江新区</option>";
            break;
        case 22:
            x="<option value=\"成都\" id=\"city_0\">成都</option><option value=\"自贡\" id=\"city_1\">自贡</option><option value=\"攀枝花\" id=\"city_2\">攀枝花</option><option value=\"泸州\" id=\"city_3\">泸州</option><option value=\"德阳\" id=\"city_4\">德阳</option><option value=\"绵阳\" id=\"city_5\">绵阳</option><option value=\"广元\" id=\"city_6\">广元</option><option value=\"遂宁\" id=\"city_7\">遂宁</option><option value=\"内江\" id=\"city_8\">内江</option><option value=\"乐山\" id=\"city_9\">乐山</option><option value=\"南充\" id=\"city_10\">南充</option><option value=\"眉山\" id=\"city_11\">眉山</option><option value=\"宜宾\" id=\"city_12\">宜宾</option><option value=\"广安\" id=\"city_13\">广安</option><option value=\"达州\" id=\"city_14\">达州</option><option value=\"雅安\" id=\"city_15\">雅安</option><option value=\"巴中\" id=\"city_16\">巴中</option><option value=\"资阳\" id=\"city_17\">资阳</option><option value=\"阿坝\" id=\"city_18\">阿坝</option><option value=\"甘孜\" id=\"city_19\">甘孜</option><option value=\"凉山\" id=\"city_20\">凉山</option>";
            break;
        case 23:
            x="<option value=\"昆明\" id=\"city_0\">昆明</option><option value=\"曲靖\" id=\"city_1\">曲靖</option><option value=\"玉溪\" id=\"city_2\">玉溪</option><option value=\"保山\" id=\"city_3\">保山</option><option value=\"昭通\" id=\"city_4\">昭通</option><option value=\"丽江\" id=\"city_5\">丽江</option><option value=\"普洱\" id=\"city_6\">普洱</option><option value=\"临沧\" id=\"city_7\">临沧</option><option value=\"楚雄\" id=\"city_8\">楚雄</option><option value=\"红河\" id=\"city_9\">红河</option><option value=\"文山\" id=\"city_10\">文山</option><option value=\"西双版纳\" id=\"city_11\">西双版纳</option><option value=\"大理\" id=\"city_12\">大理</option><option value=\"德宏\" id=\"city_13\">德宏</option><option value=\"怒江\" id=\"city_14\">怒江</option><option value=\"迪庆\" id=\"city_15\">迪庆</option>";
            break;
        case 24:
            x="<option value=\"西安\" id=\"city_0\">西安</option><option value=\"铜川\" id=\"city_1\">铜川</option><option value=\"宝鸡\" id=\"city_2\">宝鸡</option><option value=\"咸阳\" id=\"city_3\">咸阳</option><option value=\"渭南\" id=\"city_4\">渭南</option><option value=\"延安\" id=\"city_5\">延安</option><option value=\"汉中\" id=\"city_6\">汉中</option><option value=\"榆林\" id=\"city_7\">榆林</option><option value=\"安康\" id=\"city_8\">安康</option><option value=\"商洛\" id=\"city_9\">商洛</option>";
            break;
        case 25:
            x="<option value=\"兰州市\" id=\"city_0\">兰州市</option><option value=\"嘉峪关\" id=\"city_1\">嘉峪关</option><option value=\"金昌\" id=\"city_2\">金昌</option><option value=\"白银\" id=\"city_3\">白银</option><option value=\"天水\" id=\"city_4\">天水</option><option value=\"武威\" id=\"city_5\">武威</option><option value=\"张掖\" id=\"city_6\">张掖</option><option value=\"平凉\" id=\"city_7\">平凉</option><option value=\"酒泉\" id=\"city_8\">酒泉</option><option value=\"庆阳\" id=\"city_9\">庆阳</option><option value=\"定西\" id=\"city_10\">定西</option><option value=\"陇南\" id=\"city_11\">陇南</option><option value=\"临夏\" id=\"city_12\">临夏</option><option value=\"甘南\" id=\"city_13\">甘南</option>";
            break;
        case 26:
            x="<option value=\"1\" id=\"city_0\">西安</option><option value=\"2\" id=\"city_1\">铜川</option><option value=\"3\" id=\"city_2\">宝鸡</option><option value=\"4\" id=\"city_3\">咸阳</option><option value=\"5\" id=\"city_4\">渭南</option><option value=\"6\" id=\"city_5\">延安</option><option value=\"7\" id=\"city_6\">汉中</option><option value=\"8\" id=\"city_7\">榆林</option><option value=\"9\" id=\"city_8\">安康</option><option value=\"10\" id=\"city_9\">商洛</option>"
            break;
        case 27:
            x="<option value=\"西宁\" id=\"city_0\">西宁</option><option value=\"海东\" id=\"city_1\">海东</option><option value=\"海北\" id=\"city_2\">海北</option><option value=\"黄南\" id=\"city_3\">黄南</option><option value=\"海南\" id=\"city_4\">海南</option><option value=\"果洛\" id=\"city_5\">果洛</option><option value=\"玉树\" id=\"city_6\">玉树</option><option value=\"海西\" id=\"city_7\">海西</option>";
            break;
        case 28:
            x="<option value=\"银川\" id=\"city_0\">银川</option><option value=\"石嘴山\" id=\"city_1\">石嘴山</option><option value=\"吴忠\" id=\"city_2\">吴忠</option><option value=\"固原\" id=\"city_3\">固原</option><option value=\"中卫\" id=\"city_4\">中卫</option>";
            break;
        case 29:
            x="<option value=\"银川\" id=\"city_0\">银川</option><option value=\"石嘴山\" id=\"city_1\">石嘴山</option><option value=\"吴忠\" id=\"city_2\">吴忠</option><option value=\"固原\" id=\"city_3\">固原</option><option value=\"中卫\" id=\"city_4\">中卫</option>";
            break;
        case 30:
            x="<option value=\"乌鲁木齐\" id=\"city_0\">乌鲁木齐</option><option value=\"克拉玛依\" id=\"city_1\">克拉玛依</option><option value=\"吐鲁番\" id=\"city_2\">吐鲁番</option><option value=\"哈密\" id=\"city_3\">哈密</option><option value=\"昌吉\" id=\"city_4\">昌吉</option><option value=\"博尔塔拉\" id=\"city_5\">博尔塔拉</option><option value=\"巴音郭楞\" id=\"city_6\">巴音郭楞</option><option value=\"阿克苏\" id=\"city_7\">阿克苏</option><option value=\"克孜勒苏\" id=\"city_8\">克孜勒苏</option><option value=\"喀什\" id=\"city_9\">喀什</option><option value=\"和田\" id=\"city_10\">和田</option><option value=\"伊犁\" id=\"city_11\">伊犁</option><option value=\"塔城\" id=\"city_12\">塔城</option><option value=\"阿勒泰\" id=\"city_13\">阿勒泰</option><option value=\"石河子\" id=\"city_14\">石河子</option><option value=\"阿拉尔\" id=\"city_15\">阿拉尔</option><option value=\"图木舒克\" id=\"city_16\">图木舒克</option><option value=\"五家渠\" id=\"city_17\">五家渠</option><option value=\"北屯\" id=\"city_18\">北屯</option>";
            break;
        case 31:
            x="<option value=\"台北市\" id=\"city_0\">台北市</option><option value=\"高雄市\" id=\"city_1\">高雄市</option><option value=\"基隆市\" id=\"city_2\">基隆市</option><option value=\"台中市\" id=\"city_3\">台中市</option><option value=\"台南市\" id=\"city_4\">台南市</option><option value=\"新竹市\" id=\"city_5\">新竹市</option><option value=\"嘉义市\" id=\"city_6\">嘉义市</option><option value=\"台北县\" id=\"city_7\">台北县</option><option value=\"宜兰县\" id=\"city_8\">宜兰县</option><option value=\"桃园县\" id=\"city_9\">桃园县</option><option value=\"新竹县\" id=\"city_10\">新竹县</option><option value=\"苗栗县\" id=\"city_11\">苗栗县</option><option value=\"台中县\" id=\"city_12\">台中县</option><option value=\"彰化县\" id=\"city_13\">彰化县</option><option value=\"南投县\" id=\"city_14\">南投县</option><option value=\"云林县\" id=\"city_15\">云林县</option><option value=\"嘉义县\" id=\"city_16\">嘉义县</option><option value=\"台南县\" id=\"city_17\">台南县</option><option value=\"高雄县\" id=\"city_18\">高雄县</option><option value=\"屏东县\" id=\"city_19\">屏东县</option><option value=\"澎湖县\" id=\"city_20\">澎湖县</option><option value=\"台东县\" id=\"city_21\">台东县</option><option value=\"花莲县\" id=\"city_22\">花莲县</option>";
            break;
        case 32:
            x="<option value=\"中西区\" id=\"city_0\">中西区</option><option value=\"东区\" id=\"city_1\">东区</option><option value=\"九龙城区\" id=\"city_2\">九龙城区</option><option value=\"观塘区\" id=\"city_3\">观塘区</option><option value=\"南区\" id=\"city_4\">南区</option><option value=\"深水埗区\" id=\"city_5\">深水埗区</option><option value=\"黄大仙区\" id=\"city_6\">黄大仙区</option><option value=\"湾仔区\" id=\"city_7\">湾仔区</option><option value=\"油尖旺区\" id=\"city_8\">油尖旺区</option><option value=\"离岛区\" id=\"city_9\">离岛区</option><option value=\"葵青区\" id=\"city_10\">葵青区</option><option value=\"北区\" id=\"city_11\">北区</option><option value=\"西贡区\" id=\"city_12\">西贡区</option><option value=\"沙田区\" id=\"city_13\">沙田区</option><option value=\"屯门区\" id=\"city_14\">屯门区</option><option value=\"大埔区\" id=\"city_15\">大埔区</option><option value=\"荃湾区\" id=\"city_16\">荃湾区</option><option value=\"元朗区\" id=\"city_17\">元朗区</option>";
            break;
        case 33:
            x="<option value=\"花地玛堂区\" id=\"city_0\">花地玛堂区</option><option value=\"圣安多尼堂区\" id=\"city_1\">圣安多尼堂区</option><option value=\"大堂区\" id=\"city_2\">大堂区</option><option value=\"望德堂区\" id=\"city_3\">望德堂区</option><option value=\"风顺堂区\" id=\"city_4\">风顺堂区</option><option value=\"氹仔\" id=\"city_5\">氹仔</option><option value=\"路环\" id=\"city_6\">路环</option>";
            break;
    }
    document.getElementById("mp-missingplace-c").innerHTML=x;
}

//逆地理编码,定位
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

                var view = map.getView();
                view.setCenter([lng,lat]);
                view.setZoom(16);
            }else{
                window.alert("定位失败！");
            }
        });
    })
}

//监听地图定位搜索框
$(document).ready(function () {
    $("#mp-missingplace-d").blur(function () {
        var province = document.getElementById("mp-missingplace-p").value;
        var city = document.getElementById("mp-missingplace-c").value;
        var detail = document.getElementById("mp-missingplace-d").value;
        console.log(province+city+detail);
        getLocation(province+city+detail);
    })
});