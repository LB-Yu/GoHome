<%--
  @author Huleryo
  @date 2017/7/1
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>

<%-- 获取访问用户状态 --%>
<%
    String userName = "";
    if (session.getAttribute("userName")!=null){
        userName = (String)session.getAttribute("userName");
    }

    if (session.getAttribute("isRemember")!=null){
        if (session.getAttribute("isRemember").equals("true")){
            String password = (String) session.getAttribute("password");
            Cookie userNameCookie = new Cookie("userName", userName);
            Cookie passwordCookie = new Cookie("password", password);
            response.addCookie(userNameCookie);
            response.addCookie(passwordCookie);
        }
    }

    Cookie[] cookies = request.getCookies();
    if (null!=cookies&&cookies.length>0){
        for (Cookie c:cookies){
            if (c.getName().equals("userName")){
                userName = c.getValue();
            }
            System.out.println("cookie name"+c.getName());
        }
    }
%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
    <meta name="renderer" content="webkit|ie-comp|ie-stand">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="keywords" content="JSP">
    <link rel="icon" href="libs/image/logo.png" type="image/x-icon"/>
    <title>回家！ GIS温暖回家路</title>

    <link rel="stylesheet" href="libs/css/sccl.css">
    <link rel="stylesheet" type="text/css" href="libs/skin/blue/skin.css" id="layout-skin" />
    <link rel="stylesheet" href="libs/css/login.css">
    <link href="libs/css/chat.css" rel="stylesheet" type="text/css">
    <script src="http://apps.bdimg.com/libs/jquery/1.8.2/jquery.js"></script>
    <script src="libs/lib/jquery-1.11.0.min.js" type="text/javascript"></script>
    <script src="libs/lib/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="libs/js/login.js" type="text/javascript"></script>
    <script src="libs/js/chat.js" type="text/javascript"></script>
    <script src="libs/js/init.js" type="text/javascript"></script>
    <script type="text/javascript">

        function showChat() {
            // 先更新好友列表
            initFriendsList();
            document.getElementById("index-chat-box").style.display = "block";
        }

        /**
         * 关闭消息聊天框
         * */
        function closeChat() {
            document.getElementById("index-chat-box").style.display = "none";
        }
    </script>
</head>

<body style="overflow-y: hidden">
<div class="layout-admin">
    <%-- 顶部导航栏 --%>
    <header class="layout-header">
        <%-- logo --%>
        <span class="header-logo">
            <img src="libs/image/logo.png" style="width: 35px;height: 35px">
        </span>
        <span class="header-logo" style="font-family: '李旭科书法 v1.4'">回家！</span>
        <%-- 移动设备状态菜单按钮 --%>
        <a class="header-menu-btn" style="cursor: pointer"><i class="icon-font">&#xe63c;</i></a>
        <%-- 右侧登录状态 --%>
        <ul id="login_state" class="header-bar">
            <%-- cookie操作判断用户是否登录 --%>
            <%
                if (userName.equals("")){
            %>
                <li class="header-bar-role"><a style="cursor: pointer" onclick="openLoginBox()">登录</a></li>
                <li class="header-bar-role"><span>|</span></li>
                <li class="header-bar-role"><a style="cursor: pointer" onclick="openRegisterBox()">注册</a></li>
            <%
            }else {
            %>
                <li class="header-bar-role"><img class="nav-img" src="libs/image/1.jpg"></li>
                <li class="header-bar-nav">
                    <a style="cursor: pointer"><%=userName%></a>
                    <ul class="header-dropdown-menu">
                        <li><a style="cursor: pointer">个人信息</a></li>
                        <li><a style="cursor: pointer" onclick="openLoginBox()">切换账户</a></li>
                    </ul>
                </li>
                <li class="header-bar-nav">
                    <img class="nav-msg" src="libs/image/message_have.png">
                    <ul class="header-dropdown-menu">
                        <li><a style="cursor: pointer" onclick="showChat()">私信</a></li>
                        <li><a style="cursor: pointer" onclick="OpenSysMsgBox()">系统通知</a></li>
                    </ul>
                </li>
                <li class="header-bar-role"><span>|</span></li>
                <li class="header-bar-role"><a style="cursor: pointer">注销</a></li>
            <%
                }
            %>
            <%-- 换肤按钮 --%>
            <li class="header-bar-nav">
                <a style="cursor: pointer" title="换肤"><i class="icon-font">&#xe612;</i></a>
                <ul class="header-dropdown-menu right dropdown-skin">
                    <li><a style="cursor: pointer" data-val="qingxin" title="清新">清新</a></li>
                    <li><a style="cursor: pointer" data-val="blue" title="蓝色">蓝色</a></li>
                    <li><a style="cursor: pointer" data-val="molv" title="墨绿">墨绿</a></li>

                </ul>
            </li>
        </ul>
    </header>
    <aside class="layout-side">
        <ul class="side-menu">
        </ul>
    </aside>

    <div class="layout-side-arrow">
        <div class="layout-side-arrow-icon"><i class="icon-font">&#xe6c7;</i></div>
    </div>

    <section class="layout-main">
        <div class="layout-main-tab">
            <button class="tab-btn btn-left"><i class="icon-font">&#xe628;</i></button>
            <nav class="tab-nav">
                <div class="tab-nav-content">
                    <a href="javascript:;" class="content-tab active" data-id="home.html">首页</a>
                </div>
            </nav>
            <button class="tab-btn btn-right"><i class="icon-font">&#xe629;</i></button>
        </div>
        <div class="layout-main-body" style="overflow-y: hidden">
            <iframe class="body-iframe" name="iframe0" width="100%" height="100%" src="pages/home_map.html" frameborder="0" data-id="home.html" seamless></iframe>
        </div>
    </section>

</div>
<%-- 登录框 --%>
<div class="login-event" id="login_event">
    <div class="login-box">
        <header>
            <h1>登录</h1>
        </header>
        <form id="login_form" method="post">
            <div class="login-message" id="login_message">
            </div>
            <div class="input-outer">
                <img src="libs/image/user.png" class="icon"/>
                <input class="text" type="text" placeholder="用户名" name="userName"/>
            </div>
            <div class="input-outer">
                <img src="libs/image/password.png" class="icon">
                <input class="text" type="password" placeholder="密码" name="password"/>
            </div>
            <div class="extra">
                <input name="isRemember" type="checkbox">
                <span>记住用户名</span>
                <span class="right"><a>忘记密码</a></span>
            </div>
            <div class="login-btn">
                <a class="act-but" href="javascript:;" onclick="doLogin()">登录</a>
            </div>
        </form>
    </div>
</div>
<%-- 注册框 --%>
<div class="register-event" id="register_event">
    <div class="register-box">
        <header>
            <h1>注册</h1>
        </header>
        <form method="post" id="register_form">
            <div class="login-message" id="register_message"></div>
            <div class="input-outer">
                <img src="libs/image/user.png" class="icon"/>
                <input class="text" type="text" placeholder="请输入用户名" id="userName" name="userName" onfocus="clearMsg()"/>
            </div>
            <div class="input-outer">
                <img src="libs/image/tel.png" class="icon"/>
                <input class="text" type="tel" placeholder="请输入联系电话" id="tel" name="tel" onfocus="clearMsg()"/>
            </div>
            <div class="input-outer">
                <img src="libs/image/location.png" class="icon"/>
                <input class="text" type="text" placeholder="请输入所在地" id="location" name="location" onfocus="clearMsg()"/>
            </div>
            <div class="input-outer">
                <img src="libs/image/password.png" class="icon">
                <input class="text" type="password" placeholder="请输入密码" id="password1" name="password" onfocus="clearMsg()"/>
            </div>
            <div class="input-outer">
                <img src="libs/image/password.png" class="icon">
                <input class="text" type="password" placeholder="请确认密码" id="password2" onfocus="clearMsg()"/>
            </div>
            <div class="login-btn">
                <a class="act-but" href="javascript:void(0)" onclick="doRegister()">注册</a>
            </div>
        </form>
    </div>
</div>
<div class="login-bg" id="login_bg" onclick="closeBox()"></div>
<%-- 系统消息显示框 --%>
<div id="SysMsg-box">
    <div class="SysMsg-title">关注动态</div>
    <iframe id="SysMsg_iframe" class="SysMsg-content" frameborder="0" height="90%" width="98%" src="pages/message_list.html"></iframe>
</div>
<div id="SysMsg-bg" onclick="closeSysMsgBox()"></div>
<%-- 聊天框 --%>
<div id="index-chat-box">
    <div id="friendslist">
        <div id="topmenu">
            <span class="friends"></span>
            <span class="chats"></span>
            <span class="history" onclick="closeChat()"></span>
        </div>
        <%-- 好友列表 --%>
        <div id="friends"></div>
    </div>

    <div id="chatview" class="p1">
        <!-- 顶部 -->
        <div id="profile">
            <div id="close">
                <div class="cy"></div>
                <div class="cx"></div>
            </div>
            <p>Miro Badev</p>
            <span>miro@badev@gmail.com</span>
        </div>
        <!-- 消息列表 -->
        <div id="chat-messages">
            <div class="message">
                <img src="libs/image/1_copy.jpg" />
                <div class="bubble">
                    我是老王
                </div>
            </div>

            <div class="message right">
                <img src="libs/image/2_copy.jpg" />
                <div class="bubble">
                    我知道你是老王
                </div>
            </div>

            <div class="message">
                <img src="libs/image/1_copy.jpg" />
                <div class="bubble">
                    Yeah, hold on

                </div>
            </div>

            <div class="message right">
                <img src="libs/image/2_copy.jpg" />
                <div class="bubble">
                    Can you share a link for the tutorial?

                </div>
            </div>

            <div class="message">
                <img src="libs/image/1_copy.jpg" />
                <div class="bubble">
                    Yeah, hold on
                </div>
            </div>

        </div>
        <!-- 底部消息发送框 -->
        <div id="sendmessage">
            <input type="text" id="message-input" value="Send message..." />
            <button id="send" onclick="sendMsg()">发送</button>
        </div>
    </div>
</div>
<script type="text/javascript" src="libs/lib/jquery-1.9.0.min.js"></script>
<script type="text/javascript" src="libs/js/sccl-util.js"></script>
<script type="text/javascript" src="libs/js/sccl.js"></script>
</body>

</html>


