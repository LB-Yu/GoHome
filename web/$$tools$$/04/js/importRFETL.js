/**
 * Created by 余乐悠 on 2017/9/24.
 */

var toolIdNM1 = "";

//获取工具插件ID
var fileName = "import.js";
var isLoadNM = false;  // 判断并引用jquery.easyui文件
var scripts = document.getElementsByTagName("script");
console.log(scripts.length);

for (var i = 0; i < scripts.length; i++) {

    var src = scripts[i].src;
    if (src.indexOf("jquery.easyui.min.js") !== -1) {
        isLoadNM = true;
    }
    if (src.indexOf(fileName) !== -1) {
        src = src.substring(src.lastIndexOf(fileName+ "?") + (fileName.length + 1));
        var array = src.split("&");
        for (var j = 0; j < array.length; j++) {
            var finalObj = array[j].split("=");
            if (finalObj[j] == "toolId")
                toolIdNM1 = finalObj[j + 1]; //获取tool的id
        }
    }
}

//if (!isLoadNM) {
//    loadjscssfile("/lib/xxx.css", "css", toolIdNM);
//    loadjscssfile("/lib/xxx.js", "js", toolIdNM);
//}

//引用功能插件自身文件
loadjscssfile("/js/roads_for_easy_to_lose.js", "js", toolIdNM1); //引用GIS功能插件js文件
