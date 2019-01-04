/**
 * Created by Kingdrone on 2017/8/1.
 */
var map = null;
var vectorLayer_new = null;

var container;
var content;
var closer;
var cluster_popup;
var clusters;                          //底层clusters层
var len = 0;                           //一个聚合簇中个数
var description = new Array();         //一个聚合簇中所有信息
var currentPage = 1;                       //一个聚合簇信息当前页面
var totalPage = 1;                         //总页面数
var showAndReturnStage = "close";             //还原显示状态

/*-----------------------------------------道路类别英汉转换表begin------------------------------------------*/
var translationMap =[];
translationMap['raod'] = "普通道路";
translationMap['residential'] = "住宅区道路";
translationMap['unclassified'] = "窄路";
translationMap['track'] = "小径(通常未铺设路面)";
translationMap['path'] = "普通街道";
translationMap['cycleway'] = "自行车专用道";
translationMap['footway'] = "步行小径、砾石路";
translationMap['secondary_link'] = "次要道路连接路";
translationMap['living_street'] = "步行街道";
translationMap['tertiary_link'] = "普通道路连接路";
translationMap['pedestrian'] = "行人专用街道";
translationMap['tertiary'] = "三级公路";
translationMap['service'] = "服务区道路";



/*-----------------------------------------道路类别英汉转换表end--------------------------------------------*/

window.onload= function () {
    // queryByAttribute();
    /*---------------------------------------------popup----------------------------------------------*/
    container = document.getElementById("popup");
    content = document.getElementById("popup-content");
    closer = document.getElementById("popup-closer");

    var SvrCfg = {
        vectUrl: "gdbp://MapGisLocal/GoHome/sfcls/roads_for_easy_to_lose.wl",
        ip: "localhost",
        port: "6163"
    };
    var view = new ol.View({
        //地图初始中心点
        center: [114.2874,30.5597],
        //地图初始显示级别
        zoom: 14,
        projection: new ol.proj.get('EPSG:4326')
    });
    map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        target: "mapCon",
        view: view
    });
    //创建一个图层
    vectorLayer_new = new Zondy.Map.Layer("武汉市易失路段", [SvrCfg.vectUrl], {
        ip: SvrCfg.ip,
        port: SvrCfg.port,
        isBaseLayer: true
    });
    map.addLayer(vectorLayer_new);

    /*---------------------------------------------添加popup至底图-------------------------------------------*/
    //创建popUp 的OverLayer
    cluster_popup = createPopupLayer();
    //添加popUp 至底图
    map.addOverlay(cluster_popup);
    /**
     * 为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
     */
    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });


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
};

/**
 * 单击监听事件
 * @param evt
 */
function listener(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) { return feature; });
    if (feature) {
        if (getFeatureLen(feature) != undefined){
            document.getElementById("popup").style.display = "block";
            clusterPopup(feature);
        }
    }
}

// 动态绑定
$(document).ready(function () {
    $("#third").delegate('img','click',function () {
        showAndReturn();
    })
})
//还原显示按钮触发事件
function showAndReturn()    {
    var thirdDiv = document.getElementById("third");
    if(showAndReturnStage=="close"){
        //打开还原显示
        LayerSubmit();
        //切换图标
        thirdDiv.innerHTML='<img style="width: 130px;height: 80px" src="../libs/image/openShow.png">';
        showAndReturnStage ="open";
    }
    else {
        //关闭还原显示
        LayerClear();
        //切换图标
        thirdDiv.innerHTML='<img style="width: 130px;height: 80px" src="../libs/image/closeShow.png">';
        showAndReturnStage = "close";
    }
}


//提交图层样式回调函数
function LayerSubmit() {
    //进行还原显示
    var layerSymbleShow = "true";
    //点状符号大小不固定
    var layerPntSizeFixed = "false";
    //线状符号大小不固定
    var layerLinSizeFixed = "false";
    //注记符号大小不固定
    var layerAnnSizeFixed = "false";
    //图象质量
    var layerDriverQuality = "2";
    //不显示坐标点
    var layerShowCoordPnt = "false";
    //不显示外包矩形
    var layerShowElemRect = "false";


    var layerDispStyle= SetCDisplayStyle(layerAnnSizeFixed, layerDriverQuality, layerLinSizeFixed,
        layerPntSizeFixed, layerShowCoordPnt, layerShowElemRect, layerSymbleShow, 0);
    vectorLayer_new.style = [layerDispStyle];
    // map.removeLayer(vectorLayer);
    // map.addLayer(vectorLayer);
    vectorLayer_new.refresh();

}
//设置提交图层样式
function SetCDisplayStyle(layerAnnSizeFixed, layerDriverQuality, layerLinSizeFixed,
                          layerPntSizeFixed, layerShowCoordPnt, layerShowElemRect,
                          layerSymbleShow, Index) {
    return new Zondy.Object.CDisplayStyleExtend({
        //注记符号大小固定
        AnnSizeFixed: layerAnnSizeFixed,
        //图像质量
        DriverQuality: layerDriverQuality,
        //线状符号大小固定
        LinSizeFixed: layerLinSizeFixed,
        //点状符号大小固定
        PntSizeFixed: layerPntSizeFixed,
        //显示坐标点
        ShowCoordPnt: layerShowCoordPnt,
        //显示元素的外包矩形
        ShowElemRect: layerShowElemRect,
        //是否进行还原显示
        SymbleShow: layerSymbleShow,
        //图层索引
        Index: Index
    });
}
/*---------------------------------------------关闭还原显示----------------------------------------------------*/

//清除图层样式回调函数
function LayerClear() {
    var docDispStyle = new Zondy.Object.CDisplayStyleExtend();
    vectorLayer_new.style = [docDispStyle];
    vectorLayer_new.refresh();
}



/*-------------------------------------------交互式点击查询-----------------------------------------------*/
var  draw;
var drawLayer;
function queryVectorLayerByPnt() {
    /**
     * 为map移除点击事件监听
     */
    map.un('click', listener);

    //实例化一个矢量图层Vector作为绘制层
    var source = new ol.source.Vector({ wrapX: false });
    var vector = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            //形状
            image: new ol.style.Circle({
                radius: 0
            })
        })
    });
    //将绘制层添加到地图容器中
    map.addLayer(vector);

    //实例化交互绘制类对象并添加到地图容器中
    draw = new ol.interaction.Draw({
        type: 'Point',
        //绘制层数据源
        source: source
    });
    map.addInteraction(draw);
    //点击查询的回调函数
    draw.on('drawend', drawControlback);

}

function drawControlback(feature) {
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
    geomObj.nearDis = 0.0005;
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
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/roads_for_easy_to_lose.wl", {
        geometry: geomObj,
        resultFormat: "json",
        rule: rule,
        struct: queryStruct
    });
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "localhost",
        port: "6163"
    });

    queryService.query(querySuccess, queryError);
}


//每次查询后即自动关闭
function stopqueryVectorLayerByPnt() {
    /**
     * 为map添加点击事件监听，捕获信息
     */
    map.on('click', listener);
    if (draw != null){
        //移除交互绘制控件
        map.removeInteraction(draw);
    }
}

//清除客户端查询结果信息
function clearA() {
    if (map.getLayers().array_.length > 1) {
        for (var i = map.getLayers().array_.length - 1; i > 1; i--) {
            map.removeLayer(map.getLayers().array_[i]);
        }
    }
    else
        return;
    document.getElementById("tipsForRoads").style.display = "none";
}
/**
 * 易失路段等级转化
 * @param KWeight 权重
 * @returns {number} 等级
 */
function transFormClass(KWeight) {
    if(KWeight<0.1){
        return "可能失踪";
    }
    if (KWeight>0.1&&KWeight<0.11){
        return "较易失踪";
    }
    if (KWeight>0.11&&KWeight<0.3){
        return "易失踪";
    }
    if (KWeight>0.3&&KWeight<1.0){
        return "非常易失踪";
    }
    if (KWeight>1.0&&KWeight<10.0){
        return "极易失踪";
    }
}


var points = null;
/*----------------------------------------------------查询成功、失败回调---------------------------------------------------------*/
function querySuccess(result) {
    stopqueryVectorLayerByPnt();
    if(result.TotalCount==0)return;
    /*成功后弹出道路详情框框*/
    var tipsForRoads = document.getElementById("tipsForRoads");
    tipsForRoads.style.display = "block";
    var RoadType = result.SFEleArray["0"].AttValue[6];
    var KWeight = result.SFEleArray["0"].AttValue[13];
    points =result.SFEleArray["0"].fGeom.LinGeom["0"].Line.Arcs["0"].Dots;
    //转化易失踪等级
    var KWClass = transFormClass(KWeight);
    console.log(RoadType);
    var RoadTypeCN = translationMap[RoadType];

    /*为tipsForRoads添加内容*/
    tipsForRoads.innerHTML='<div class="panel-heading">道路详情</div>'+
            '<div class="thumbnail" id="tipsForRoads_body">'+
            '<img style="width: 250px;height: 150px;margin-top: -5px" src="../libs/image/road/'+RoadType+'_road.jpg">'+
            '<table class="table" style="width: 250px;height:40px;font-size: smaller">'+
            '<tr>'+
            '<td>道路类别：</td>'+
            '<td>'+RoadTypeCN+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>易失踪等级：</td>'+
            '<td>'+KWClass+'</td>'+
            '</tr>'+
            '<tr>'+
            '<td>易失踪指数:</td>'+
            '<td>'+ KWeight +'</td>'+
            '</tr>'+
            '</table>'+
            '<div class="caption" style="margin-top: -15px">'+
            '<p><a id="showEnvironment" href="#" class="btn btn-primary" role="button">周边情况</a>'+
            '<a id="closeTips" href="#" class="btn btn-default" style="margin-left: 50px" role="button">关闭</a></p>'+
            '</div>'+
            '</div>';
    //初始化Zondy.Format.PolygonJSON类
    var format = new Zondy.Format.PolygonJSON();
    //将MapGIS要素JSON反序列化为ol.Feature类型数组
    var features = format.read(result);
    //实例化一个矢量图层drawLayerr用于高亮显示结果
    var drawSource = new ol.source.Vector({
        //是否在地图水平坐标轴上重复
        wrapX: false
    });
    drawSource.addFeatures(features);
    drawLayer = new ol.layer.Vector({
        source: drawSource,
        style: new ol.style.Style({
            //填充色
            fill: new ol.style.Fill({
                color: 'rgb(0, 255, 255)'
            }),
            //边线样式
            stroke: new ol.style.Stroke({
                color: 'rgb(100,149,237)',
                width: 10
            })
        })
    });
    map.addLayer(drawLayer);
}
/**
 * 查询失败显示失败信息
 * @param e
 */
function queryError(e) {
    stopqueryVectorLayerByPnt();
}


/*----------------------------------绑定关闭按钮,显示详情按钮-------------------------------------------------------*/
$(document).ready(function () {
    $("#tipsForRoads").delegate('#closeTips','click',function () {
        document.getElementById("tipsForRoads").style.display = "none";
    })
    $("#tipsForRoads").delegate('#showEnvironment','click',function () {
        showRaadiusBox();
    })
})




/**
 * 附加
 * 根据feature构造cluster层
 * @param features
 * return clusters
 */
function createClusters(features,distance,radius,circleColor,fillColor,textColor) {
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
                        image: new ol.style.Circle({
                            radius:radius,
                            stroke: new ol.style.Stroke({
                                color: circleColor
                            }),
                            fill: new ol.style.Fill({
                                color: fillColor
                            })
                        }),
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
    addFeatrueInfo(description[currentPage-1]);
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
    return feature.values_.features.length;
}
/*----------------------------------PopUp层-------------------------------------------------------*/
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
    content.innerHTML ="";
    var html = "<div id='parentUl' class='pop-upcontainer pop-text'>" +
        "<div id='pageTuringImg'><img id='pageTurnBack' onclick='pageTurnBackFun()' src='../libs/image/pageBack.png'/>"+
        "<img id='pageTurnOver' onclick='pageTurnOverFun()' src='../libs/image/pageForward.png'/>"+
        "<p id='pageIndex'>"+currentPage+"/"+totalPage+"</p></div>"+
        "<h1 align='center'>寻亲详细信息</h1>"+
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

/*--------------------------------------线查询---------------------------------begin*/
var pointObj = new Array();
var polyLine = null;
var nearDis;

function lineSearch(points) {
    pointObj = new Array();
    for (var i=0;i<points.length;i++) {
        pointObj.push(new Zondy.Object.Point2D(points[i].x, points[i].y));
    }
    queryByLine();
}

function queryByLine() {
    polyLine = new Zondy.Object.PolyLine(pointObj);
    polyLine.nearDis = nearDis;
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
    var features = new Array();
    console.log(result);
    for(var i=0;i<result.TotalCount;i++) {
        //构造json信息
        var text = {
            type: getValue(result, i, 3),
            id: getValue(result, i, 2),
            name: getValue(result, i, 4),
            sex: getValue(result, i, 5),
            birthDate: getValue(result, i, 6),
            height: getValue(result, i, 7),
            missingDate: getValue(result, i, 8),
            missingPlace: getValue(result, i, 9),
            missingDesc: getValue(result, i, 10),
            missingExtraData: getValue(result, i, 11),
            lng: parseFloat(getValue(result, i, 0)),
            lat: parseFloat(getValue(result, i, 1))
        };
        var coordinates = [text.lng, text.lat];
        //构造点要素
        features[i] = new ol.Feature(
            {
                geometry: new ol.geom.Point(coordinates),
                text:text
            }
        );
    }
    //构造初始化clusters层
    clusters = createClusters(features,0.0001,10,'#fff','#13fff2','#fff');
    //将聚合标注添加至底图
    map.addLayer(clusters);
}
/*--------------------------------------线查询---------------------------------end*/
/**
 * 显示半径设置框
 * */
function showRaadiusBox() {
    document.getElementById("radius-box").style.display = "block";
}

/**
 * 半径设置确定按钮
 * */
function doSearch() {
    nearDis = document.getElementById("radius-input").value;
    nearDis = nearDis/1000;
    lineSearch(points);
    document.getElementById("radius-input").value = "";
    console.log(nearDis);
    document.getElementById("radius-box").style.display = "none";
}