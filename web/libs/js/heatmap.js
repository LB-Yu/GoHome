/**
 * @author Huleryo
 * @date 2017/7/19
 */

/**
 * 地图相关全局变量
 * */
var map;
var zoom = 4.5;
var center = [110.40623,35.529037];
var view = new ol.View({
    //地图初始中心点
    center: center,
    //地图初始显示级别
    zoom: zoom,
    projection: new ol.proj.get('EPSG:4326'),
    minZoom: zoom
});
// heatmap图层
var heatMapVector;
// 半径调节按钮
var heatMapRadius;
var heatMapblur;


window.onload = function () {
    heatMapRadius = document.getElementById("radius");
    heatMapblur = document.getElementById("blur");

    heatMapVector = new ol.layer.Heatmap({
        source: new ol.source.Vector({
            url: '../libs/kml/heatmap.kml',
            format: new ol.format.KML({
                extractStyles: false
            })
        }),
        //热点半径
        radius: parseInt(heatMapRadius.value, 10),
        //模糊尺寸
        blur: parseInt(heatMapblur.value, 10)
    });

    //实例化Map对象加载地图（底图+热点图）
    map = new ol.Map({
            layers: [
        //加载瓦片图层数据
        new ol.layer.Tile({
            //图层数据源
            source: new ol.source.XYZ({
                url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
            })
           })],
            target: 'mapCon',
            view: new ol.View({
                center: [113, 31],
                minZoom: 2,
                zoom: 4.5,
                projection: new ol.proj.get('EPSG:4326')
            })
    });
    map.addLayer(heatMapVector);

    //分别为另个参数设置控件（input）添加事件监听，动态设置热点图的参数
    heatMapRadius.addEventListener('input', function () {
        //设置热点图层的热点半径
        heatMapVector.setRadius(parseInt(heatMapRadius.value, 10));
    });
    heatMapblur.addEventListener('input', function () {
        //设置热点图层的模糊尺寸
        heatMapVector.setBlur(parseInt(heatMapblur.value, 10));
    });
};

function showDetailBox() {
    var box = document.getElementById("detailBox");
    if (box.style.display==""||box.style.display=="none") {
        box.style.display = "block";
    }
}

function closeDetailBox() {
    var box = document.getElementById("detailBox");
    if (box.style.display=="block") {
        box.style.display = "none";
    }
}
