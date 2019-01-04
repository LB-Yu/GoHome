/**
 * Created by Kingdrone on 2017/7/19.
 */

var gdb= "gdbp://MapGisLocal/示例数据/sfcls/missing_people_data_with_photo.txt";
var map;                               //底图
var num = 10000;                       //显示与查询数目
var container;
var content;
var closer;
var cluster_popup;
var len = 0;                           //一个聚合簇中个数
var description = new Array();         //一个聚合簇中所有信息
var currentPage;                       //一个聚合簇信息当前页面
var totalPage;                         //总页面数


/**
 * 页面加载时触发
 */
function clusterPopup() {
    container = document.getElementById("popup");
    content = document.getElementById("popup-content");
    closer = document.getElementById("popup-closer");

    //实例化Map对象加载地图，默认加载聚合标注图层
    var view= new ol.View({
        //地图初始中心点
        center: [114, 30],
        minZoom: 2,
        zoom: 8,
        projection: new ol.proj.get('EPSG:4326')
    })
    map = createMap("mapCon",view);

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
            clusterPopup(feature);
        }
    });
    //进行查询以及聚合簇加载
    addClusterTips();
};
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
        };
        var coordinates = [parseFloat(getValue(result,i,0)),parseFloat(getValue(result,i,1))];
        //构造点要素
        features[i] = new ol.Feature(
            {
                geometry:new ol.geom.Point(coordinates),
                text: text
            }
        );
    }
    //矢量要素数据源
    var source = new ol.source.Vector({
        features: features
    });
    //聚合标注数据源
    var clusterSource = new ol.source.Cluster({
        distance: 50,
        source: source
    });
    //加载聚合标注的矢量图层
    var styleCache = {};
    clusters = new ol.layer.Vector({
        source: clusterSource,
        style: function (feature) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
                style = [
                    new ol.style.Style({
                        image: new ol.style.Circle({
                            radius:20,
                            stroke: new ol.style.Stroke({
                                color: '#fff'
                            }),
                            fill: new ol.style.Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: '#fff'
                            })
                        })
                    })
                ];
                styleCache[size] = style;
            }
            return style;
        }
    });
    //将聚合标注添加至底图
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
    content.innerHTML ="";
    var html = "<div id='parentUl' class='pop-upcontainer pop-text'>" +
        "<div id='pageTuringImg'><img id='pageTurnBack' onclick='pageTurnBackFun()' src='../libs/image/pageBack.png'/>"+
        "<img id='pageTurnOver' onclick='pageTurnOverFun()' src='../libs/image/pageForward.png'/>"+
        "<p id='pageIndex'>"+currentPage+"/"+totalPage+"</p></div>"+
        "<h2 align='center'>详细信息</h2>"+
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



