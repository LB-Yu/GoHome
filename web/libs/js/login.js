/**
 * @author Huleryo
 * @date 2017/7/13
 */

/**
 * 登录相关全局变量
 * */
var userName;

/**
 * 打开登录框
 * */
function openLoginBox(){
    document.getElementById("login_event").style.display="block";
    document.getElementById("login_bg").style.display="block";
}

/**
 * 关闭弹出框
 * */
function closeBox(){
    var del=document.getElementById("login_event");
    var bg_filter=document.getElementById("login_bg");
    bg_filter.style.display="none";
    del.style.display="none";
    document.getElementById("register_event").style.display = "none";
}

/**
 * 登录ajax请求
 * */
function doLogin(){
    $.ajax({
        cache: false,
        type: "POST",
        url:"http://localhost:8080/pages/LogInController", //把表单数据发送到Controller
        data:$("#login_form").serialize(), //要发送的是ajaxFrm表单中的数据
        async: false,
        error: function(request) {
            alert(request);
        },
        success: function(data) {
            if (data=="用户名不存在！"||data=="密码错误！") {
                document.getElementById("login_message").innerHTML = data;
            } else {
                userName = data;
                // 登录成功后连接到webSocket服务
                Chat.initialize();
                // 切换导航栏状态
                changeLoginState();
            }
        }
    });
}

/**
 * 打开注册框
 * */
function openRegisterBox() {
    document.getElementById("register_event").style.display = "block";
    document.getElementById("login_bg").style.display = "block";
}

/**
 * 注册
 * */
function doRegister() {
    // 验证表单数据
    var userName = document.getElementById("userName").value;
    var userNameReg = new RegExp("^[a-zA-Z0-9]{3,11}$");
    if (!userNameReg.test(userName)) {
        document.getElementById("register_message").innerHTML = "用户名需由3-11位的数字和字母组成！";
        return;
    }

    var tel = document.getElementById("tel").value;
    var telReg = new RegExp("^[0-9]{11}$");
    if (!(telReg.test(tel))) {
        document.getElementById("register_message").innerHTML = "请输入正确的联系电话！";
        return;
    }

    var location = document.getElementById("location").value;
    if (location=="") {
        document.getElementById("register_message").innerHTML = "请输入所在地！";
        return;
    }

    var password1 = document.getElementById("password1").value;
    var passwordReg = new RegExp("^[a-zA-Z0-9]{6,16}$");
    if (!(passwordReg.test(password1))) {
        document.getElementById("register_message").innerHTML = "密码需由6-16位字母和数字组成！";
        return;
    }

    var password2 = document.getElementById("password2").value;
    if (password1!=password2) {
        document.getElementById("register_message").innerHTML = "两次密码不一致！";
        return;
    }

    // ajax请求
    $.ajax({
        cache: false,
        type: "POST",
        url:"http://localhost:8080/pages/UserRegisterController", //把表单数据发送到Controller
        data:$("#register_form").serialize(), //要发送的是ajaxFrm表单中的数据
        async: false,
        error: function(request) {
            alert(request);
        },
        success: function(data) {
            if (data=="注册成功") {
                document.getElementById("register_message").innerHTML = data;
                window.location.href = "../index.jsp";
            } else {
                document.getElementById("register_message").innerHTML = data;
            }
        }
    });
}

function clearMsg() {
    document.getElementById("register_message").innerHTML = "";
}

/**
 * 登陆成功后把导航栏转换为登录状态
 * */
function changeLoginState() {
    var dom = document.getElementById("login_state");
    dom.innerHTML = '<li class="header-bar-role"><img class="nav-img" src="libs/image/1.jpg"></li>'+
        '<li class="header-bar-nav">'+
        '<a style="cursor: pointer">'+userName+'</a>'+
        '<ul class="header-dropdown-menu">'+
        '<li><a style="cursor: pointer">个人信息</a></li>'+
        '<li><a style="cursor: pointer" onclick="openLoginBox()">切换账户</a></li>'+
        '</ul>'+
        '</li>'+
        '<li class="header-bar-nav">'+
        '<img class="nav-msg" id="message_icon" src="libs/image/message_no.png">'+
        '<ul class="header-dropdown-menu">'+
        '<li><a style="cursor: pointer" onclick="showChat()">私信</a></li>'+
        '<li><a style="cursor: pointer" onclick="OpenSysMsgBox()">系统通知</a></li>'+
        '</ul>'+
        '</li>'+
        '<li class="header-bar-role"><span>|</span></li>'+
        '<li class="header-bar-role"><a style="cursor: pointer" onclick="logoutRequest()">注销</a></li>'+
        '<li class="header-bar-nav">'+
        '<a style="cursor: pointer" title="换肤"><i class="icon-font">&#xe612;</i></a>'+
        '<ul class="header-dropdown-menu right dropdown-skin">'+
        '<li><a style="cursor: pointer" data-val="qingxin" title="清新">清新</a></li>'+
        '<li><a style="cursor: pointer" data-val="blue" title="蓝色">蓝色</a></li>'+
        '<li><a style="cursor: pointer" data-val="molv" title="墨绿">墨绿</a></li>'+
        '</ul>'+
        '</li>';
    closeBox();
}

/**
 * 注销后把导航栏转换为未登录状态
 * */
function changeLogoutState() {
    var dom = document.getElementById("login_state");
    dom.innerHTML = '<li class="header-bar-role"><a style="cursor: pointer" onclick="openLoginBox()">登录</a></li>'+
        '<li class="header-bar-role"><span>|</span></li>'+
        '<li class="header-bar-role"><a style="cursor: pointer" onclick="openRegisterBox()">注册</a></li>'+
        '<li class="header-bar-nav">'+
        '<a style="cursor: pointer" title="换肤"><i class="icon-font">&#xe612;</i></a>'+
        '<ul class="header-dropdown-menu right dropdown-skin">'+
        '<li><a style="cursor: pointer" data-val="qingxin" title="清新">清新</a></li>'+
        '<li><a style="cursor: pointer" data-val="blue" title="蓝色">蓝色</a></li>'+
        '<li><a style="cursor: pointer" data-val="molv" title="墨绿">墨绿</a></li>'+
        '</ul>'+
        '</li>';
}

/**
 * 注销请求
 * */
function logoutRequest() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="注销成功！") {
                changeLogoutState();
            }
        }
    };
    xhr.open("get", "LogInController", true);
    xhr.send(null);
}

/**
 * 改变消息图标的状态
 * */
function setMsgIconState() {
    var src = document.getElementById("message_icon").getAttribute("src");
    if (src=="libs/image/message_no.png") {
        document.getElementById("message_icon").setAttribute("src", "libs/image/message_have.png");
    } else {
        document.getElementById("message_icon").setAttribute("src", "libs/image/message_no.png");
    }
}

/**
 * 打开系统消息框
 * */
function OpenSysMsgBox() {
    document.getElementById("SysMsg-box").style.display = "block";
    document.getElementById("SysMsg-bg").style.display = "block";
}

/**
 * 关闭系统消息框
 * */
function closeSysMsgBox() {
    document.getElementById("SysMsg-box").style.display = "none";
    document.getElementById("SysMsg-bg").style.display = "none";
}