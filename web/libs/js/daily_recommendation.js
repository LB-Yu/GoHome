/**
 * @author Huleryo
 * @date 2017/8/1
 */

// 推荐失踪人员信息全局变量
var missingPeopleData;
// 地图相关
var map;
var zoom = 12;
var center = [110.40623,32.529037];
var view = new ol.View({
    //地图初始中心点
    center: center,
    //地图初始显示级别
    zoom: zoom,
    minZoom: 12,
    projection: new ol.proj.get('EPSG:4326')
});

/**
 * 初始化函数
 * */
window.onload = function () {
    getMissingPeopleData();

    /**
     * 按妞点击事件
     * */
    $("#photo_table").delegate('a','click',function () {
        console.log($(this).context.id);
        var IdList = $(this).context.id.split("|");
        var prx = IdList[0];
        var id = IdList[1];
        if (prx=="detail") {
            console.log("显示详细信息框");
            ID("grey-bg").style.display = "block";
            $("body").css("overflow-y","hidden");
            showDetailBox(missingPeopleData.missingPeopleList[id]);
        } else if (prx=="heart") {

            var missingID = missingPeopleData.missingPeopleList[id].missingID;
            console.log(missingID);
            console.log(ID(missingID.toString()).innerHTML);
            if (ID(missingID.toString()).innerHTML=="关注") {
                addAttention(missingID);
            } else {
                removeAttention(missingID);
            }
        }
    });
    map = createMap("mapCon", view);
};

/**
 * 获取指定ID的dom对象
 * */
function ID(id) {
    return document.getElementById(id);
}

/**
 * 获得每一张照片的展示html
 * */
function getEachHtml(imgSrc, name, missingPlace, id) {
    return '<figure class="effect-winston">' +
            '<img class="image" src="../libs/image/all_missing_people_photo/'+imgSrc+'.jpg">'+
            '<figcaption>'+
            '<h2>'+
            name+'<br>'+
            '<span>'+
            missingPlace+
            '</span>'+
            '</h2>'+
            '<p>'+
            '<a id="detail|'+id+'" target="_blank">'+
            '<i class="icon-demo">'+
            '</i>'+
            '</a>'+
            '<a id="heart|'+id+'"target="_blank">'+
            '<i id="'+imgSrc+'">关注'+
            '</i>'+
            '</a>'+
            '</p>'+
            '</figcaption>'+
            '</figure>'
}

/**
 * 展示所有推荐人的照片
 * */
function showPhotos() {
    ID("-0").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[0].missingID, missingPeopleData.missingPeopleList[0].missingName, missingPeopleData.missingPeopleList[0].missingPlace, 0);
    ID("-1").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[1].missingID, missingPeopleData.missingPeopleList[1].missingName, missingPeopleData.missingPeopleList[1].missingPlace, 1);
    ID("-2").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[2].missingID, missingPeopleData.missingPeopleList[2].missingName, missingPeopleData.missingPeopleList[2].missingPlace, 2);
    ID("-3").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[3].missingID, missingPeopleData.missingPeopleList[3].missingName, missingPeopleData.missingPeopleList[3].missingPlace, 3);
    ID("-4").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[4].missingID, missingPeopleData.missingPeopleList[4].missingName, missingPeopleData.missingPeopleList[4].missingPlace, 4);
    ID("-5").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[5].missingID, missingPeopleData.missingPeopleList[5].missingName, missingPeopleData.missingPeopleList[5].missingPlace, 5);
    ID("-6").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[6].missingID, missingPeopleData.missingPeopleList[6].missingName, missingPeopleData.missingPeopleList[6].missingPlace, 6);
    ID("-7").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[7].missingID, missingPeopleData.missingPeopleList[7].missingName, missingPeopleData.missingPeopleList[7].missingPlace, 7);
    ID("-8").innerHTML = getEachHtml(missingPeopleData.missingPeopleList[8].missingID, missingPeopleData.missingPeopleList[8].missingName, missingPeopleData.missingPeopleList[8].missingPlace, 8);
}

/**
 * 异步请求获得推荐的失踪人员信息
 * */
function getMissingPeopleData() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            missingPeopleData = xhr.responseText;
            missingPeopleData = JSON.parse(missingPeopleData);
            console.log(missingPeopleData);
            showPhotos();
        }
    };
    xhr.open("post", "DailyRecommendationController", true);
    xhr.send(null);
}

/**
 * 显示详细信息展示框
 * */
function showDetailBox(obj) {
    ID("mType").innerHTML = "<strong>寻亲类别：</strong>" + obj.type;
    ID("mID").innerHTML = "<strong>寻亲编号：</strong>" + obj.missingID;
    ID("mName").innerHTML = "<strong>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</strong>" +　obj.missingName;
    ID("mSex").innerHTML = "<strong>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</strong>" + obj.sex;
    ID("mBirthday").innerHTML = "<strong>出生日期：</strong>" + parseTime(obj.birthDate);
    ID("mHeight").innerHTML = "<strong>身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高：</strong>" + obj.height;
    ID("mMissingDate").innerHTML = "<strong>失踪时间：</strong>" + parseTime(obj.missingDate);
    ID("mMissingPlace").innerHTML = "<strong>失踪地点：</strong>" + obj.missingPlace;
    ID("mDescription").innerHTML = "<strong>相关描述：</strong>" + obj.description;
    ID("mExtraData").innerHTML = "<strong>其他资料：</strong>" + obj.extraData;
    locate([obj.lng, obj.lat]);
    ID("detail-box").style.display = "block";
}

/**
 * 定位
 * */
function locate(lngLat) {
    map.getView().setCenter(lngLat);
    map.getView().setZoom(12);
}

/**
 * 关闭信息框
 * */
function closeBox() {
    ID("detail-box").style.display = "none";
    ID("grey-bg").style.display = "none";
    $("body").css("overflow-y","auto");
}

/**
 * 添加关注请求
 * */
function addAttention(missingID) {
    var formData = new FormData();
    formData.append("missingID", missingID);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="添加关注成功！") {
                document.getElementById(missingID).innerHTML = "取消关注";
            }
            window.alert(data);
        }
    };
    xhr.open("post", "AddAttentionController", true);
    xhr.send(formData);
}

/**
 * 取消关注请求
 * */
function removeAttention(missingID) {
    var formData = new FormData();
    formData.append("missingID", missingID);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="取消关心成功！") {
                document.getElementById(missingID).innerHTML = "关注";
            }
            window.alert(data);
        }
    };
    xhr.open("post", "CancelAttentionController", true);
    xhr.send(formData);
}

/**
 * 将毫秒转化为时间
 * */
function parseTime(mill) {
    var unixTimestamp = new Date(mill) ;
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "年" + (this.getMonth() + 1) + "月" + this.getDate() + "日 " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    };
    var commonTime = unixTimestamp.toLocaleString();
    return commonTime;
}