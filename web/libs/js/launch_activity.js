/**
 * @author Huleryo
 * @date 2017/7/24
 */

/**
 * 初始化函数
 * */
window.onload = function () {
    var exportButton = document.getElementById('outPdf');

    osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM({})
    });
    map = new ol.Map({
        layers: [osmLayer],
        target: 'mapCon',
        view: view
    });
    map.addControl(scaleLineControl);
    // 添加矢量标注图层
    map.addLayer(iconVectorLayer);

    map.addLayer(pathVector);

    map.addLayer(textVectorLayer);


    // 导出pdf
    exportButton.addEventListener('click', function () {

        exportButton.disabled = true;
        document.body.style.cursor = 'progress';

        var resolution = 72;
        var width = Math.round(A4[0] * resolution / 25.4);
        var height = Math.round(A4[1] * resolution / 25.4);
        var size = /** @type {ol.Size} */ (map.getSize());
        var extent = map.getView().calculateExtent(size);

        var source = osmLayer.getSource();

        var tileLoadStart = function () {
            ++loading;
        };

        var tileLoadEnd = function () {
            ++loaded;
            if (loading === loaded) {
                var canvas = this;
                window.setTimeout(function () {
                    loading = 0;
                    loaded = 0;
                    var data = canvas.toDataURL('image/png');
                    var pdf = new jsPDF('landscape', undefined, 'a4');
                    pdf.addImage(data, 'JPEG', 0, 0, A4[0], A4[1]);
                    pdf.save('map.pdf');
                    source.un('tileloadstart', tileLoadStart);
                    source.un('tileloadend', tileLoadEnd, canvas);
                    source.un('tileloaderror', tileLoadEnd, canvas);
                    map.setSize(size);
                    map.getView().fit(extent, size);
                    map.renderSync();
                    exportButton.disabled = false;
                    document.body.style.cursor = 'auto';
                }, 100);
            }
        };

        map.once('postcompose', function (event) {
            source.on('tileloadstart', tileLoadStart);
            source.on('tileloadend', tileLoadEnd, event.context.canvas);
            source.on('tileloaderror', tileLoadEnd, event.context.canvas);
        });

        map.setSize([width, height]);
        map.getView().fit(extent, /** @type {ol.Size} */ (map.getSize()));
        map.renderSync();

    }, false);
    // 导出png
    document.getElementById('outPng').addEventListener('click', function () {
        map.once('postcompose', function (event) {
            var canvas = event.context.canvas;
            canvas.toBlob(function (blob) {
                saveAs(blob, 'map.png');
            });
        });
        map.renderSync();
    });
    init();
};

// 记录当前绘制功能打开个数
var state = 0;

/*--------------------------------------地图显示----------------------------------begin*/
/**
 * 地图显示相关全局变量
 * */
var map;
var zoom = 4.5;
var center = [105.40623,32.529037];
var view = new ol.View({
    //地图初始中心点
    center: center,
    //地图初始显示级别
    zoom: zoom,
    projection: new ol.proj.get('EPSG:4326'),
    maxZoom: 16.5,
    minZoom: 4.5
});
var osmLayer;
//实例化比例尺控件（ScaleLine）
var scaleLineControl = new ol.control.ScaleLine({
    //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
    units: "metric"
});

/*--------------------------------------地图显示----------------------------------end*/

/*--------------------------------------军标绘制----------------------------------begin*/
//军标绘制图层
var drawLayer;
//矢量资源
var source;
//绘制工具
var drawTool;
//修改工具
var modifyTool;
//移动工具
var dragTool;
//选择工具
var selectTool;
//拉框选择工具
var boxSelectTool;
//选中要素数组
var selectedFeatures;
//样式数组
var styles;
//初始化
function init() {
    source = new ol.source.Vector({ wrapX: false });
    drawLayer = new ol.layer.Vector({
        source: source,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: $('#FillClr').val()
            }),
            stroke: new ol.style.Stroke({
                color: $('#LinClr').val(),
                lineCap: $('#LinHeadType').val(),
                lineJoin: $('#LinJointType').val(),
                lineDash: [parseInt($('#LinDash').val()), parseInt($('#LinDot').val())],
                width: parseInt($('#LinWidth').val())
            }),
            image: new ol.style.Circle({
                radius: parseInt($('#PntRadius').val()),
                fill: new ol.style.Fill({
                    color: $('#FillClr').val()
                })
            })
        })
    });

    map.addLayer(drawLayer);

    drawTool = new MilStd.tool.MilStdDrawTool(map);
    drawTool.on(MilStd.event.MilStdDrawEvent.DRAW_END, onDrawEnd, false, this);
}

//绘制军标
function drawArrow(type) {
    removeInteractions();
    switch (type) {
        case "SimpleArrow":
            var milParam = new MilStd.MilstdParams({
                headHeightFactor: 0.15,
                headWidthFactor: 0.4,
                neckHeightFactor: 0.75,
                neckWidthFactor: 0.1,
                tailWidthFactor: 0.1,
                hasSwallowTail: true,
                swallowTailFactor: 0.1
            });
            drawTool.activate(MilStd.EnumMilstdType.SimpleArrow, milParam, "drawSimpleArrow");
            break;
        case "DoubleArrow":
            var milParam = new MilStd.MilstdParams({
                headHeightFactor: 0.15,
                headWidthFactor: 0.8,
                neckHeightFactor: 0.7,
                neckWidthFactor: 0.4
            });
            drawTool.activate(MilStd.EnumMilstdType.DoubleArrow, milParam, "drawDoubleArrow");
            break;
        case "StraightArrow":
            var milParam = new MilStd.MilstdParams({
                headHeightFactor: 0.1,
                headWidthFactor: 1.3,
                neckHeightFactor: 1.0,
                neckWidthFactor: 0.7,
                tailWidthFactor: 0.07,
                hasSwallowTail: false,
                swallowTailFactor: 0
            });
            drawTool.activate(MilStd.EnumMilstdType.StraightArrow, milParam, "drawStraightArrow");
            break;
        case "SingleLineArrow":
            var milParam = new MilStd.MilstdParams({
                headHeightFactor: 0.1,
                headWidthFactor: 1.3
            });
            drawTool.activate(MilStd.EnumMilstdType.SingleLineArrow, milParam, "drawdrawSingleLineArrow");
            break;
        case "TriangleFlag":
        case "RectFlag":
        case "CurveFlag":
            drawTool.activate(type, null, "drawFlag");
            break;
        //十字箭头指北针
        case "ArrowCross":
        //圆形尖角指北针
        case "CircleClosedangle":
        //尖角指北针
        case "Closedangle":
        //双向尖角指北针
        case "DoubleClosedangle":
        //四角指北针
        case "Fourstar":
        //菱形指北针
        case "Rhombus":
        //同向尖角指北针
        case "SameDirectionClosedangle":
        //三角指北针
        case "Triangle":
        //风向标指北针
        case "Vane":
            drawTool.activate(type, null, "drawCompass");
            break;
        //贝塞尔曲线成区
        case "Bezier":
        //贝塞尔曲线
        case "BezierLine":
        //集结区
        case "AssemblyArea":
            drawTool.activate(type, null, "drawBazier");
            break;
        default:
    }
};
//绘制完成后的回调
function onDrawEnd(event) {
    var drawStyle = new ol.style.Style({
        fill: new ol.style.Fill({
            color: $('#FillClr').val()
        }),
        stroke: new ol.style.Stroke({
            color: $('#LinClr').val(),
            lineCap: $('#LinHeadType').val(),
            lineJoin: $('#LinJointType').val(),
            lineDash: [parseInt($('#LinDash').val()), parseInt($('#LinDot').val())],
            width: parseInt($('#LinWidth').val())
        }),
        image: new ol.style.Circle({
            radius: parseInt($('#PntRadius').val()),
            fill: new ol.style.Fill({
                color: $('#FillClr').val()
            })
        })
    });

    var feature = event.feature;
    feature.setStyle(drawStyle);
    source.addFeature(feature);
}

//修改军标
function modifyArrow() {
    removeInteractions();
    modifyTool = new MilStd.ModifyTool(map);
    modifyTool.activate();
};

//移动军标
function moveArrow() {
    removeInteractions();

    dragTool = new MilStd.DragPan(map);
    dragTool.activate();
};

//移除选中的军标
function removeArrow() {
    removeInteractions();

    boxSelectTool = new ol.interaction.DragBox({
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 255, 1]
            })
        })
    });
    map.addInteraction(boxSelectTool);
    boxSelectTool.on('boxend', function (e) {
        selectedFeatures = new Array();
        var extent = boxSelectTool.getGeometry().getExtent();
        source.forEachFeatureIntersectingExtent(extent, function (feature) {
            selectedFeatures.push(feature);
        });
        if (selectedFeatures && selectedFeatures.length > 0) {
            for (var i = 0; i < selectedFeatures.length; i++) {
                source.removeFeature(selectedFeatures[i]);
            }
        }
    });
}

var inputObjStyleEx = null;
//*设置颜色选择器
function showcolors(ids) {
    var o = document.getElementById(ids);
    inputObjStyleEx = o;
    showColorPicker(o, o, colorchangStyleEx);
}
function colorchangStyleEx(e) {
    inputObjStyleEx.style.background = inputObjStyleEx.value;
}

//修改样式
function editGeom() {
    removeInteractions();

    selectTool = new ol.interaction.Select();
    map.addInteraction(selectTool);

    boxSelectTool = new ol.interaction.DragBox({
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: [0, 0, 255, 1]
            })
        })
    });
    map.addInteraction(boxSelectTool);
    boxSelectTool.on('boxend', function (e) {
        selectedFeatures = new Array();
        styles = new Array();
        var extent = boxSelectTool.getGeometry().getExtent();
        source.forEachFeatureIntersectingExtent(extent, function (feature) {
            styles.push(feature.getStyle());
            selectedFeatures.push(feature);
            var editStyle = getEditStyle();
            feature.setStyle(editStyle);
            $('#cancelEditBtn').linkbutton({ disabled: false })
        });
    });

    selectTool.on('select', function (e) {
        styles = new Array();
        selectedFeatures = e.selected;
        if (selectedFeatures && selectedFeatures.length > 0) {
            for (var i = 0; i < selectedFeatures.length; i++) {
                styles.push(selectedFeatures[i].getStyle());
                var editStyle = getEditStyle();
                selectedFeatures[i].setStyle(editStyle);
            }
        }
        $('#cancelEditBtn').linkbutton({ disabled: false })
    });
}

//获取表单样式信息
function getEditStyle() {
    var style = new ol.style.Style({
        fill: new ol.style.Fill({
            color: $('#FillClr').val()
        }),
        stroke: new ol.style.Stroke({
            color: $('#LinClr').val(),
            lineCap: $('#LinHeadType').val(),
            lineJoin: $('#LinJointType').val(),
            lineDash: [parseInt($('#LinDash').val()), parseInt($('#LinDot').val())],
            width: parseInt($('#LinWidth').val())
        }),
        image: new ol.style.Circle({
            radius: parseInt($('#PntRadius').val()),
            fill: new ol.style.Fill({
                color: $('#FillClr').val()
            })
        })
    });

    return style;
}
//撤销样式修改
function cancelEditGeom() {
    if (selectedFeatures && selectedFeatures.length > 0) {
        for (var i = 0; i < selectedFeatures.length; i++) {
            selectedFeatures[i].setStyle(styles[i]);
        }
    }
    selectedFeatures = new Array();
    styles = new Array();
    $('#cancelEditBtn').linkbutton({ disabled: true });
}

//移除所有控件
function removeInteractions() {
    $('#cancelEditBtn').linkbutton({ disabled: true });

    if (drawTool) {
        drawTool.deactivate();
    }
    if (modifyTool) {
        modifyTool.deactivate();
    }
    if (dragTool) {
        dragTool.deactivate();
    }
    if (selectTool) {
        map.removeInteraction(selectTool);
    }
    if (boxSelectTool) {
        map.removeInteraction(boxSelectTool);
    }
}

//清除所有要素
function removeAllFeatures() {
    removeInteractions();
    source.clear();
}
/*--------------------------------------军标绘制----------------------------------end*/

/*--------------------------------------图片标注----------------------------------begin*/
// 记录图片标注功能是否打开
var markerState = "off";
/**
 * 创建矢量标注样式函数,设置image为图标ol.style.Icon
 * @param {ol.Feature} feature 要素
 */
var createLabelStyle = function (feature) {
    return new ol.style.Style({
        /**{olx.style.IconOptions}类型*/
        image: new ol.style.Icon(
            ({
                anchor: [0.1, 0.08],
                anchorOrigin: 'bottom-left',
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                offsetOrigin: 'top-right',
                // offset:[0,10],
                //图标缩放比例
                scale:0.375,
                //透明度
                opacity: 0.9,
                //图标的url
                src: '../libs/image/photo_maker.png'
            })
        )
    });
};

var iconVectorSource = new ol.source.Vector({
    features: []
});
//矢量标注图层
var iconVectorLayer = new ol.layer.Vector({
    source: iconVectorSource
});

// 实例化overlay标注，添加到地图容器中
//为地图容器添加单击事件监听
function Addmarker() {
    if (markerState=="off") {
        markerState = "on";
    } else {
        markerState = "off";
    }
    map.on('click', function (evt) {
        if (markerState=="off"||drawPathState=="on"||textAddState=="on") {
            return;
        }
        //鼠标单击点坐标
        var point = evt.coordinate;
        //添加一个新的标注（矢量要素）
        addVectorLabel(point);
    });
}

/**
 * 添加一个新的标注（矢量要素）
 * @param {ol.Coordinate} coordinate 坐标点
 */
function addVectorLabel(coordinate) {
    //新建一个要素 ol.Feature
    var newFeature = new ol.Feature({
        //几何信息
        geometry: new ol.geom.Point(coordinate)
    });
    //设置要素的样式
    newFeature.setStyle(createLabelStyle(newFeature));
    //将新要素添加到数据源中
    iconVectorSource.addFeature(newFeature);
}

/**
 * 清除照片标注
 * */
function clearMarker() {
    map.removeLayer(iconVectorLayer);
    iconVectorSource = new ol.source.Vector({
        features: []
    });
//矢量标注图层
    iconVectorLayer = new ol.layer.Vector({
        source: iconVectorSource
    });
    map.addLayer(iconVectorLayer);
}
/*--------------------------------------图片标注----------------------------------end*/

/*--------------------------------------路线绘制----------------------------------begin*/
var drawPathState = "off";
//创建一个矢量资源
var pathSource = new ol.source.Vector();

var styleFunction = function (feature) {
    var geometry = feature.getGeometry();
    var styles = [
        //设置线的样式
        new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff0000',
                width: 4
            })
        })
    ];
    geometry.forEachSegment(function (start, end) {
        var dx = end[0] - start[0];
        var dy = end[1] - start[1];
        var rotation = Math.atan2(dy, dx);
        //arrows
        styles.push(new ol.style.Style({
            geometry: new ol.geom.Point(end),
            image: new ol.style.Icon({
                src: "../libs/image/arrow.png",
                anchor: [0.75, 0.5],
                scale:0.2,
                rotateWithView: false,
                rotation: -rotation
            })
        }));
    });
    return styles;
};
//创建一个矢量图层，并添加矢量资源和设置起样式
var pathVector = new ol.layer.Vector({
    source: pathSource,
    style: styleFunction
});

var interaction = new ol.interaction.Draw({
    source: pathSource,
    type: ('LineString')
});

/**
 * 绘制路线函数
 * */
function drawPath() {
    if (drawPathState=="off") {
        map.addInteraction(interaction);
        drawPathState = "on";
    } else {
        map.removeInteraction(interaction);
        drawPathState = "off";
    }

}

/**
 * 清除路线绘制
 * */
function clearPath() {
    map.removeLayer(pathVector);
    pathSource = new ol.source.Vector();
    pathVector = new ol.layer.Vector({
        source: pathSource,
        style: styleFunction
    });
    map.addLayer(pathVector);
}
/*--------------------------------------路线绘制----------------------------------end*/

/*--------------------------------------文字描述----------------------------------begin*/
var textAddState = "off";
/**
 * 创建矢量标注样式函数,设置image为图标ol.style.Icon
 * @param {ol.Feature} feature 要素
 */
var createTextStyle = function (feature) {
    return new ol.style.Style({
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
//矢量标注的数据源
var textVectorSource = new ol.source.Vector({
    features: []
});
//矢量标注图层
var textVectorLayer = new ol.layer.Vector({
    source: textVectorSource
});

var isTextAdded = false;

function setAdded() {
    isTextAdded = false;
    map.removeInteraction(interaction);
    drawPathState = "off";
    textAddState = "on";
}

//为地图容器添加失去焦点事件监听
function AddText() {
    if (document.getElementById("addTextInput").value=="")
        return;
    map.on('click', function (evt) {
        var text = document.getElementById("addTextInput").value;
        if (isTextAdded==true)
            return;
        //鼠标单击点坐标
        var point = evt.coordinate;
        //添加一个新的标注（矢量要素）
        addTextVectorLabel(point, text);
        isTextAdded = true;
        document.getElementById("addTextInput").value = ""
        textAddState = "off";
    });
}

/**
 * 添加一个新的标注（矢量要素）
 * @param {ol.Coordinate} coordinate 坐标点
 */
function addTextVectorLabel(coordinate, text) {
    //新建一个要素 ol.Feature
    var newFeature = new ol.Feature({
        //几何信息
        geometry: new ol.geom.Point(coordinate),
        //名称属性
        name: text
    });
    //设置要素的样式
    newFeature.setStyle(createTextStyle(newFeature));
    //将新要素添加到数据源中
    textVectorSource.addFeature(newFeature);
}

/**
 * 清除文字描述
 * */
function clearText() {
    map.removeLayer(textVectorLayer);
    textVectorSource = new ol.source.Vector({
        features: []
    });
    //矢量标注图层
    textVectorLayer = new ol.layer.Vector({
        source: textVectorSource
    });
    map.addLayer(textVectorLayer);
}
/*--------------------------------------文字描述----------------------------------end*/

/**
 * 定位
 **/
function locate() {
    var address = document.getElementById("address").value;
    AMap.service('AMap.Geocoder',function(){//回调函数
        //实例化Geocoder
        geocoder = new AMap.Geocoder({
        });
        //TODO: 使用geocoder 对象完成相关功能
        geocoder.getLocation(address, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                //TODO:获得了有效经纬度，可以做一些展示工作
                //比如在获得的经纬度上打上一个Marker
                var lat = result.geocodes[0].location.lat;
                var lng = result.geocodes[0].location.lng;
                console.log([lng, lat]);
                view.setCenter([lng, lat]);
                view.setZoom(14.5);
            }else{
                window.alert("定位失败！");
            }
        });
    })
}

/**
 * 清除
 * */
function clearAll() {
    clearMarker();
    clearPath();
    clearText();
}

/*--------------------------------------导出pdf----------------------------------begin*/
var A4 = [297, 210];
var loading = 0;
var loaded = 0;


/*--------------------------------------导出pdf----------------------------------end*/


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