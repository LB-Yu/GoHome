/**
 * @author Huleryo
 * @date 2017/7/18
 *
 * 通用地图操作库
 */

/**
 * 创造底图
 * @returns {ol.Map}
 */
function createMap(mapCon, view) {
    return new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
                })
            })
        ],
        target: mapCon,
        view: view
    });
}

/**
 * 单击缩小功能
 * */
function zoomOut(map) {
    //获取地图视图
    var view = map.getView();
    //获得当前缩放级数
    var zoom = view.getZoom();
    //地图缩小一级
    view.setZoom(zoom - 1);
}

/**
 * 单击放大功能
 * */
function zoomIn(map) {
    //获取地图视图
    var view = map.getView();
    //获得当前缩放级数
    var zoom = view.getZoom();
    view.setZoom(zoom + 1);
    //地图放大一级
}

/**
 * 复位功能
 * */
function restore(map, center, zoom) {
    var view = map.getView();
    //初始中心点
    view.setCenter(center);
    //初始缩放级数
    view.setZoom(zoom);
}

/*---------------------popup相关函数----------------------begin*/

/*---------------------popup相关函数----------------------end*/
/**
 *  地图文档查询
 * */
function queryMap(gdb, mapName, num, onSuccess, onError) {
    // 初始化查询结构对象
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    // 设置查询结构不包含几何信息
    queryStruct.IncludeGeometry = true;
    queryStruct.IncludeAttribute = true;
    queryStruct.IncludeWebGraphic = false;
    // 实例化查询参数对象
    var queryParam = new Zondy.Service.QueryParameter(gdb, {
        resultFormat: "json",
        struct:  queryStruct });
    //设置查询要素数目
    queryParam.recordNumber = num;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryDocFeature(queryParam, mapName, 0, {
        ip:  "127.0.0.1",
        port: "6163"
    });
    // 查询成功与失败的回调
    queryService.query(onSuccess, onError);
}

/**
 *  地图查询——矢量要素查询
 *
 * */
function query(gdb, num, onSuccess, onError) {
    // 初始化查询结构对象
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    // 设置查询结构不包含几何信息
    queryStruct.IncludeGeometry = true;
    queryStruct.IncludeAttribute = true;
    queryStruct.IncludeWebGraphic = false;
    // 实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter(gdb, {
        resultFormat: "json",
        struct:  queryStruct });
    //设置查询要素数目
    queryParam.recordNumber = num;
    queryParam.pageIndex=0;
    queryParam.where = "";
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "localhost",
        port: "6163"
    });
    // 查询成功与失败的回调
    queryService.query(onSuccess, onError);
}
