/**
 * Created by Kingdrone on 517/8/7.
 */




var tableTotalPages = 0;
var tableCurrentPage = 0;
var Stage = null;                      //看是否能整除
var totalRecords = 0;
var missingPeopleList = null;
var missingID;
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
/**
 * 将毫秒时间戳转化为yyyy-mm-dd字符串
 * */
function TransformDateFormat(mill) {
    var date = new Date(mill);
    Date.prototype.toLocaleString = function() {
        var month = String(this.getMonth()+1);
        var date = String(this.getDate());
        if(month.length==1){
            month = '0'+month
        }
        if(date.length==1){
            date = '0'+date;
        }
        return this.getFullYear() + "-" + month + "-" + date;
    };
    return date.toLocaleString();
}

/**
 * 发送请求获得注册失踪人员信息
 * */
function GetMissingPeopleData() {
    //刷新参数
    tableTotalPages = 0;
    tableCurrentPage = 0;
    Stage = null;
    totalRecords = 0;
    missingPeopleList = null;
    missingID = null;
    var formData = new FormData();
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if(data=='请先登录！'){
                window.alert("请先登录！")
                return;
            }
            missingPeopleList = $.parseJSON(data);
            InitListIndexes();
            //加载地图
            InitMap();
        }
    };
    xhr.open("post", "ShowRegistratedMissingPeopleDataController", true);
    xhr.send(formData);
}
/**
 * 初始化List indexes，进行向后翻页
 * @constructor
 */
function InitListIndexes() {
    totalRecords = missingPeopleList.length;
    var temp  = totalRecords/5;
    if(Number.isInteger(temp)){
        tableTotalPages = parseInt(temp);
        Stage = true;
    }else {
        tableTotalPages = parseInt(temp) + 1;
        Stage = false;
    }
    MissingPeopleTurnForward();
}

/**
 * 转化找到与否
 * @param state
 * @returns {*}
 * @constructor
 */
function TransformState(state) {
    var temp;
    if(state==0) {
        temp = "未找到";
        return temp;
    }
    temp = "已找到";
    return temp;
}
/**
 * 向后翻页
 */
function MissingPeopleTurnForward() {
    var table = document.getElementById("missingPeopleTable");
    var indexTip = document.getElementById("pageIndex");
    if (tableCurrentPage == tableTotalPages){
        if(tableTotalPages==0){
            table.innerHTML="<div style='text-align: center;'>未找到任何记录!</div>"
            indexTip.innerHTML="0/0";
        }
        return;
    }
    if (Stage == false) {
        table.innerHTML = "";
        if (tableCurrentPage < tableTotalPages - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px;height: 15px'>寻亲类别</td>" +
                "<td style='width: 100px;height: 15px'>寻亲编号</td>" +
                "<td style='width: 150px;height: 15px'>姓名</td>" +
                "<td style='width: 150px;height: 15px'>注册时间</td>" +
                "<td style='width: 60px;height: 15px'>状态</td>" +
                "<td style='width: 60px;height: 15px'>编辑</td>" +
                /*"<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+*/
                "</tr>";
            for (var i = 0; i < 5; i++) {
                //清空原有数据
                var index = tableCurrentPage * 5 + i;
                var state = TransformState(missingPeopleList[index].missingPeopleState);
                var textHtml = "<tr>" +
                    "<td>" + missingPeopleList[index].type + "</td>" +
                    "<td>" + missingPeopleList[index].missingID + "</td>" +
                    "<td>" + missingPeopleList[index].missingName + "</td>" +
                    "<td>" + getDateStr(missingPeopleList[index].registrationDate) + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[index].lng + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[index].lat + "</td>" +
                    "<td>"+state+"</td>" +
                    "<td class='up_date'>修改</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        if (tableCurrentPage == tableTotalPages - 1) {
            var insertHtml = "<tr>" +
                "<td style='width: 100px;height: 15px'>寻亲类别</td>" +
                "<td style='width: 100px;height: 15px'>寻亲编号</td>" +
                "<td style='width: 150px;height: 15px'>姓名</td>" +
                "<td style='width: 150px;height: 15px'>注册时间</td>" +
                "<td style='width: 60px;height: 15px'>状态</td>" +
                "<td style='width: 60px;height: 15px'>编辑</td>" +
                /*"<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+*/
                "</tr>";
            for (var i = tableCurrentPage * 5; i < totalRecords; i++) {
                //清空原有数据
                var state = TransformState(missingPeopleList[i].missingPeopleState);
                var textHtml = "<tr>" +
                    "<td>" + missingPeopleList[i].type + "</td>" +
                    "<td>" + missingPeopleList[i].missingID + "</td>" +
                    "<td>" + missingPeopleList[i].missingName + "</td>" +
                    "<td>" + getDateStr(missingPeopleList[i].registrationDate) + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[i].lng + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[i].lat + "</td>" +
                    "<td>"+state+"</td>" +
                    "<td class='updateMissingPeopleData'>修改</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        else {
            table.innerHTML = "";
            var insertHtml = "<tr>" +
                "<td style='width: 100px;height: 15px'>寻亲类别</td>" +
                "<td style='width: 100px;height: 15px'>寻亲编号</td>" +
                "<td style='width: 150px;height: 15px'>姓名</td>" +
                "<td style='width: 150px;height: 15px'>注册时间</td>" +
                "<td style='width: 60px;height: 15px'>状态</td>" +
                "<td style='width: 60px;height: 15px'>编辑</td>" +
                /*"<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+*/
                "</tr>";
            for (var i = 0; i < 5; i++) {
                //清空原有数据
                var index = tableCurrentPage * 5 + i;
                var state = TransformState(missingPeopleList[index].missingPeopleState);
                var textHtml = "<tr>" +
                    "<td>" + missingPeopleList[index].type + "</td>" +
                    "<td>" + missingPeopleList[index].missingID + "</td>" +
                    "<td>" + missingPeopleList[index].missingName + "</td>" +
                    "<td>" + getDateStr(missingPeopleList[index].registrationDate) + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[index].lng + "</td>" +
                    "<td style='display: none'>" + missingPeopleList[index].lat + "</td>" +
                    "<td>"+state+"</td>" +
                    "<td class='updateMissingPeopleData'>修改</td>" +
                    "</tr>";
                insertHtml += textHtml;
            }
        }
        table.innerHTML = insertHtml;
        tableCurrentPage = tableCurrentPage + 1;
        indexTip.innerHTML = tableCurrentPage + "/" + tableTotalPages + "总记录数" + totalRecords;
    }

}

/**
 * 向前翻页
 */
function MissingPeopleTurnBack() {
    var table = document.getElementById("missingPeopleTable");
    var indexTip = document.getElementById("pageIndex");
    if (tableCurrentPage==1)
        return;
    else {
        tableCurrentPage = tableCurrentPage-1;
        table.innerHTML = "";
        var insertHtml = "<tr>" +
            "<td style='width: 100px;height: 15px'>寻亲类别</td>" +
            "<td style='width: 100px;height: 15px'>寻亲编号</td>" +
            "<td style='width: 150px;height: 15px'>姓名</td>" +
            "<td style='width: 150px;height: 15px'>注册时间</td>" +
            "<td style='width: 60px;height: 15px'>状态</td>" +
            "<td style='width: 60px;height: 15px'>编辑</td>" +
            /*"<td><img id='addAttention'src='../libs/image/addAttention.png'/></td>"+*/
            "</tr>";
        for (var i = 0; i < 5; i++) {
            var index = (tableCurrentPage-1) * 5 + i;
            var state = TransformState(missingPeopleList[index].missingPeopleState);
            var textHtml = "<tr id='"+index.toString()+ "'>" +
                "<td>" + missingPeopleList[index].type + "</td>" +
                "<td>" + missingPeopleList[index].missingID + "</td>" +
                "<td>" + missingPeopleList[index].missingName + "</td>" +
                "<td>" + getDateStr(missingPeopleList[index].registrationDate) + "</td>" +
                "<td style='display: none'>" +missingPeopleList[index].lng + "</td>" +
                "<td style='display: none'>" +missingPeopleList[index].lat + "</td>" +
                "<td>"+state+"</td>" +
                "<td class='updateMissingPeopleData'>修改</td>" +
                "</tr>";
            insertHtml += textHtml;
        }
        table.innerHTML=insertHtml;
        indexTip.innerHTML=tableCurrentPage+"/"+tableTotalPages+"总记录数"+totalRecords;
    }
}
/**
 * 绑定表格点击事件
 */
$(document).ready(function () {
    /*添加关注事件*/
    $("table").delegate('.updateMissingPeopleData','click',function () {
        //获取missingID
        var test = $(this).parent()["0"].innerHTML;
        var id = $(test)[1].innerHTML;
        missingID = id;
        ShowPeopleData(id);
        //获取state
        var state = $(test)[6].innerHTML;
        if(state=="已找到"){
            document.getElementById("registration_form_mark").style.display="block";
            document.getElementById("tag_image").style.display="block";
        }else {
            document.getElementById("registration_form_mark").style.display="none";
            document.getElementById("tag_image").style.display="none";
        }
        //给表单经纬度赋初值
        var longitude = $(test)[4].innerHTML;
        var latitude = $(test)[5].innerHTML;
        $("#longitude").val(longitude);
        $("#latitude").val(latitude);
    });
    //进行定位
    $("table").delegate('tr','click',function () {
        var text=$(this)[0].innerHTML;
        var lng = $(text)[4].innerHTML;
        var lat = $(text)[5].innerHTML;
        view.setCenter([parseFloat(lng),parseFloat(lat)]);
        view.setZoom(10);
    });

    $("#mp-missingplace-d").blur(function () {
        getLocation($("#mp-missingplace-d").val());
    });
});
/**
 * 根据id显示失踪人员信息
 * @param id
 * @constructor
 */
function ShowPeopleData(id) {
    var missingPeople = null;
    for(var i = 0;i<missingPeopleList.length;i++){
        if(missingPeopleList[i].missingID == id)
            missingPeople = missingPeopleList[i];
    }
    var type = $("#mp-type");
    var name = $("#mp-name");
    var sex =  $('input[name=sex][checked]');
    var height = $("#mp-height");
    var birthDate = $("#mp-birthdate");
    var missingDate = $("#mp-lostdate");
    var missingPlaceDetail = $("#mp-missingplace-d");
    var missingPeopleDesc = $("#mp-description");
    var missingPeopleExtra = $("#mp-extra-description");
    //开始赋值
    type.val(missingPeople.type);
    name.val(missingPeople.missingName);
    if(missingPeople.sex == '男'){
        document.getElementById('sex_male').checked = true;
    }
    if(missingPeople.sex == '女'){
        document.getElementById('sex_female').checked = true;
    }
    if(missingPeople.sex =='未知') {
        document.getElementById('un_known').checked = true;
    }
    height.val(missingPeople.height);
    missingDate.val(TransformDateFormat(missingPeople.missingDate));
    birthDate.val(TransformDateFormat(missingPeople.birthDate));
    missingPlaceDetail.val(missingPeople.missingPlace);
    missingPeopleDesc.val(missingPeople.description);
    missingPeopleExtra.val(missingPeople.extraData);
    //照片
    var img = '<img class="img-rounded img_space" src="../libs/image/upload_missing_people_photo/' +id+ '.jpg" alt="preview"/>';
    $("#preview_box2").empty().append(img);
    //传missingID入表单
    $("#missingID").val(id);
}

/**
 * 进行修改
 */
function submitUpdate() {
    //更新后台
    $.ajax({
        cache: false,
        type: "POST",
        url:"http://localhost:8080/pages/UpdateMissingPeopleDataController", //把表单数据发送到Controller
        data:$("#mp-registration").serialize(), //要发送的是表单中的数据
        async: false,
        error: function(msg) {
            alert("请选中修改对象！");
            console.log(msg);
        },
        success: function(msg) {
            alert(msg);
            //清空表单
            ID("mp-type").value = "";
            ID("mp-name").value = "";
            ID("mp-height").value = "";
            ID("mp-birthdate").value = "";
            ID("mp-lostdate").value = "";
            ID("mp-missingplace-d").value = "";
            ID("mp-description").value = "";
            ID("mp-extra-description").value = "";
            ID("preview_box2").innerHTML = "";
        }
    });
    //更新前台
   UpdateQuery();
   //刷新列表
    GetMissingPeopleData();
}
/**
 * id获得DOM
 * @param id
 * @constructor
 */
function ID(id) {
    return document.getElementById(id);
}


// 图片文件
var photoFile;
// 图片内容信息
var photoData = "";
// 图片上传状态
var photoState = "";
// 图片文件表单
var formData;

/**
 * 图片处理
 * */
function processFiles(files) {
    photoFile = files[0];
    if (!isPicture(photoFile.name)) {
        window.alert("请上传正确的图片格式，支持.jpg/.png/.bmp!");
        return;
    }
    formData = new FormData();
    formData.append(photoFile.name, photoFile);
    uploadToServer(formData);
}

/**
 * 上传文件,检测人脸
 * */
function uploadToServer(formData) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            photoData = data;
            if (data == "成功检测到人脸！") {
                //创建FileReader
                var reader = new FileReader();
                //读取图片
                reader.readAsDataURL(photoFile);
                // 渲染文件
                reader.onload = function(arg) {
                    var img = '<img class="img-rounded img_space" src="' + arg.target.result + '" alt="preview"/>';
                    $("#preview_box2").empty().append(img);
                };
                // 上传图片
                uploadPhotoAndStore();
            } else {
                window.alert(data);
            }
        }
    };
    xhr.open("POST", "FaceDetectController", true);
    xhr.send(formData);
}

/**
 * 将图片上传到服务器存储
 * */
function uploadPhotoAndStore() {
    var xhr = new XMLHttpRequest();
    formData.append("missingID",missingID);
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            window.alert(data);
        }
    };
    xhr.open("POST", "UpdatePhotoData", true);
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
 * 标记为已找到
 * @param missingID 失踪人员id
 * @constructor
 */
function TagFound() {
    //1、获取到xmlhttprequest 对象
    var xmlhttp = new XMLHttpRequest();
    //2、xmlhttprequest的响应事件
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            var ajaxResult = xmlhttp.responseText;
            //5.1.2 利用jquery的方法,对于jQuery.parseJSON(),键值必须为双引号
            /* var ajaxResult = jQuery.parseJSON(xmlhttp.responseText); */
            alert(ajaxResult);
        }
    }
    //3、准备获取ajax请求
    //3.1 对于get请求,带参数的方式,直接在open函数的请求地址带上参数
    xmlhttp.open("POST", "TagFoundController", true);
    //4、发送ajax请求
    xmlhttp.setRequestHeader("Content-type",
        "application/x-www-form-urlencoded");
    var url = "missingID="+missingID.toString();
    xmlhttp.send(url);
    //同时在igs上修改
    TagFoundQuery();
    //刷新列表
    GetMissingPeopleData();
    //标记找到，图片显示
    document.getElementById("registration_form_mark").style.display="block";
    document.getElementById("tag_image").style.display="block";
};
var vectorSource;
var map = null;
var center = [100.40623,35.529037];
var zoom = 5;
var view = new ol.View({
    //地图初始中心点
    center: center,
    //地图初始显示级别
    zoom: zoom,
    minZoom: 3.5,
    projection: new ol.proj.get('EPSG:4326')
});
function InitMap() {

    map = createMap("mapCon",view)

    //矢量标注的数据源
    vectorSource= new ol.source.Vector();
    //矢量标注图层
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    //添加矢量图层
    map.addLayer(vectorLayer);

    for(var i = 0;i<missingPeopleList.length;i++){
        var coordinate = [missingPeopleList[i].lng,missingPeopleList[i].lat];
        addVectorLabel(coordinate);
    }
};
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
    vectorSource.addFeature(newFeature);
}
/**
 * 创建矢量标注样式函数,设置image为图标ol.style.Icon
 * @param {ol.Feature} feature 要素
 */
var createLabelStyle = function (feature) {
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
                // scale:0.5,
                //透明度
                opacity: 0.75,
                //图标的url
                src: '../libs/image/location_in_data_update.png'
            })
        )
    });
};




/*---------------------------------------同时也在IGS上修改--------------------------------------------------------*/
function UpdateQuery() {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    queryStruct.IncludeGeometry = true;
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        resultFormat: "json",
        struct: queryStruct
    });
    //根据寻亲编号查询
    var sql = "寻亲编号=" + "'" + missingID + "'";

    queryParam.where = sql;
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "localhost",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(UpdateSuccess, UpdateError);
}

//查询失败回调
function UpdateError(e) {
    window.alert(e);
}

//查询成功回调
function UpdateSuccess(result) {
    console.log(result);
    var feature = result.getFeatureByIndex(0);
    var values = feature.getAttValueArray();
    //获取表单信息
    var type = $("#mp-type").val();
    var name = $("#mp-name").val();
    var sex  = document.getElementsByName('sex');
    var height = $("#mp-height").val();
    var birthDate = $("#mp-birthdate").val();
    var missingDate = $("#mp-lostdate").val();
    var missingPlaceDetail = $("#mp-missingplace-d").val();
    var missingPeopleDesc = $("#mp-description").val();
    var missingPeopleExtra = $("#mp-extra-description").val();
    for (var i=0; i<sex.length; i++) {
        if (sex[i].checked) {
            sex = sex[i].value;
        }
    }
    var change_data = [$("#longitude").val(),$("#latitude").val(),values[2],type,name,sex,height,birthDate,missingDate,
    missingPlaceDetail,missingPeopleDesc,missingPeopleExtra,values[12],values[13],$("#longitude").val(),$("#latitude").val(),
    values[16]];

    feature.setAttValues(change_data);
    var featureSet = new Zondy.Object.FeatureSet();
    featureSet.addFeature(feature);
    console.log(featureSet);
    updateInfomation(featureSet);

}


//更新信息
function updateInfomation(featureSet) {
    var editService = new Zondy.Service.EditLayerFeature("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt",
        { ip: "127.0.0.1", port: "6163"}
    );

    editService.update(featureSet, updateSuccess());
}


function updateSuccess() {
    console.log("要素更新成功！");
};
/*--------------------------------------------标记已找到同时在igs上修改---------------------------------------------------------------*/
function TagFoundQuery() {
    //初始化查询结构对象，设置查询结构包含几何信息
    var queryStruct = new Zondy.Service.QueryFeatureStruct();
    queryStruct.IncludeGeometry = true;
    //实例化查询参数对象
    var queryParam = new Zondy.Service.QueryByLayerParameter("gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt", {
        resultFormat: "json",
        struct: queryStruct
    });
    //根据寻亲编号查询
    var sql = "寻亲编号=" + "'" + missingID + "'";

    queryParam.where = sql;
    //设置查询分页号
    queryParam.pageIndex = 0;
    //设置查询要素数目
    queryParam.recordNumber = 20;
    //实例化地图文档查询服务对象
    var queryService = new Zondy.Service.QueryLayerFeature(queryParam, {
        ip: "localhost",
        port: "6163"
    });
    //执行查询操作，querySuccess为查询回调函数
    queryService.query(TagFoundSuccess, TagFoundError);
}

//查询失败回调
function TagFoundError(e) {
    window.alert(e);
}

//查询成功回调
function TagFoundSuccess(result) {
    console.log(result);
    var feature = result.getFeatureByIndex(0);
    var values = feature.getAttValueArray();
    var change_data = [values[0],values[1],values[2],values[3],values[4],values[5],values[6],values[7],values[8],
        values[9],values[10],values[11],values[12],values[13],values[14],values[15],
        1];
    feature.setAttValues(change_data);
    var featureSet = new Zondy.Object.FeatureSet();
    featureSet.addFeature(feature);
    console.log(featureSet);
    updateInfomation(featureSet);
}


/*--------------------------------------------更新要素----------------------------------------------------------*/
/**
 * 逆地理编码
 * @type {null}
 */
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
                $("#longitude").val(lng);
                $("#latitude").val(lat);
            }else{
                window.alert("定位失败！");
            }
        });
    })
}



window.onload = function () {
    //得到失踪人员信息并进行刷新地图
    GetMissingPeopleData();
};

