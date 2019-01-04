/**
 * Created by Kingdrone on 2017/7/12.
 */
//矢量标注的数据源
var vectorSource = new ol.source.Vector();
/*
var ms1 = new MissingPeople([237803,'家寻宝贝','不可以','女','2002-04-06','2厘米左右', , , ,116.28,39.54])
var ms2 = new MissingPeople([237803,'家寻宝贝','可以','女','2002-04-06','2厘米左右', , , ,110.28,39.54])
*/

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
                // scale:0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../libs/image/location.png'           //标注图标
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
}

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

/**
 * 动态创建popup的具体内容
 * @param {string} title
 * var jason1 = {
    id:123,
    type:"家寻宝贝",
    name:"老余",
    sex:"女",
    birthdate:"",
    height:"",
    missingdate:"",
    missingplace:"",
    mssingdesc:"",
    lng:116.28,
    lat:39.54
}
 */
function addFeatrueInfo(info) {
    var type = "寻亲类别："+info.type;
    var id =   "寻亲编号："+info.id;
    var name = "姓名：" +info.name;
    var sex = "性别：" +info.sex;
    var birthdate="出生日期："+info.birthdate;
    var height="身高:"+info.height;
    var missingdate = "失踪日期："+info.missingdate;
    var missingdesc = "描述："+info.missingdesc;
    var missingplace ="失踪地点："+info.missingplace;

    //新增div元素
    var elementDiv = document.createElement('div');
    elementDiv.className = "text";
    //elementDiv.innerText = info.att.text;
    //添加]<p>标签
    var txttype = document.createElement('p');
    txttype.className = "p";
    setInnerText(txttype, type);
    elementDiv.appendChild(txttype);
    //添加]<p>标签
    var txtid = document.createElement('p');
    txtid.className = "p";
    setInnerText(txtid, id);
    elementDiv.appendChild(txtid);
    //添加]<p>标签
    var txtname = document.createElement('p');
    txtname.className = "p";
    setInnerText(txtname, name);
    elementDiv.appendChild(txtname);
    //添加]<p>标签
    var txtsex = document.createElement('p');
    txtsex.className = "p";
    setInnerText(txtsex, sex);
    elementDiv.appendChild(txtsex);
    //添加]<p>标签
    var txtbirthdate = document.createElement('p');
    txtbirthdate.className = "p";
    setInnerText(txtbirthdate, birthdate);
    elementDiv.appendChild(txtbirthdate);
    //添加]<p>标签
    var txtheight = document.createElement('p');
    txtheight.className = "p";
    setInnerText(txtheight,height);
    elementDiv.appendChild(txtheight);
    //添加]<p>标签
    var txtmissingdate = document.createElement('p');
    txtmissingdate.className = "p";
    setInnerText(txtmissingdate, missingdate);
    elementDiv.appendChild(txtmissingdate);
    //添加]<p>标签
    var txtmissingdesc = document.createElement('p');
    txtmissingdesc.className = "p";
    setInnerText(txtmissingdesc, missingdesc);
    elementDiv.appendChild(txtmissingdesc);
    //添加]<p>标签
    var txtmissingplace = document.createElement('p');
    txtmissingplace.className = "p";
    setInnerText(txtmissingplace, missingplace);
    elementDiv.appendChild(txtmissingplace);

    // 为content添加div子节点
    content.appendChild(elementDiv);
    //在div中添加<p>标签

    //新增img元素
    var elementImg = document.createElement('img');
    var img_path = "../libs/image/missing_people_photo/"+info.id+".jpg";
    elementImg.setAttribute("style", "width:100px;height:100px");
    elementImg.src = img_path;
    // 为content添加img子节点
    content.appendChild(elementImg);
}
/**
 * 动态设置元素文本内容（兼容）
 */
function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}



var jason1 = {
    id:29260,
    type:"家寻宝贝",
    name:"老余",
    sex:"女",
    birthdate:"",
    height:"",
    missingdate:"",
    missingplace:"",
    missingdesc:"ssss",
    lng:116.28,
    lat:39.54
};
var jason2 = {
    id:28315,
    type:"家寻宝贝",
    name:"老余",
    sex:"男",
    birthdate:"",
    height:"",
    missingdate:"",
    missingplace:"",
    missingdesc:"dddd",
    lng:115.28,
    lat:39.54
};
addVectorLabel([jason1.lng,jason1.lat],jason1);
addVectorLabel([jason2.lng,jason2.lat],jason2);



