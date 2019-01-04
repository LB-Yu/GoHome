/**
 * Created by 余乐悠 on 2017/9/24.
 */

function init() {
    get_JSON();
}

function get_JSON() {
    $.ajax({
        type: "GET",
        url: "$$framework$$.json?1",
        dataType: "text",
        success: function (data) {
            //读取配置文件json结构数据
            //eval() 函数可计算某个字符串，并执行其中的的 JavaScript 代码。
            var json = eval("(" + data + ")");
            var tools = json.tools; //获取tools结点中插件配置信息
            var len = tools.length;//获取配置中的插件个数
            //循环获取tools中插件配置信息，动态创建对应菜单，设置click事件
            for (var i = 0; i < len; i++) {
                //设置功能插件的ID
                toolID = tools[i].id;
                // 在调用插件方法之前，先动态引用插件的js文件;tools[i].jsPage为插件js文件路径
                if (tools[i].jsPage != "" && tools[i].jsPage != undefined) {
                    loadjscssfile(tools[i].jsPage, "js", toolID);
                    console.log(tools[i].jsPage)
                }
            }
        }
    });
}

////动态加载js文件
function loadjscssfile(path, filetype, id) {
    var fileSrc = '$$tools$$/' + id; //解决多个插件引用导致toolid错误问题
    fileSrc += path;
    fileSrc += "?toolId=" + id;
    if (filetype == "js") { //判断文件类型
        var fileref = document.createElement('script'); //创建标签
        fileref.setAttribute("type", "text/javascript"); //定义属性type的值为text/javascript
        fileref.setAttribute("src", fileSrc); 	//文件的地址
    }
    else if (filetype == "css") { //判断文件类型
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", fileSrc);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}
