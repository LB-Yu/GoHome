<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String userName = (String)session.getAttribute("userName");
%>
<html>
<head>
    <title>活动发起</title>
    <link href="../libs/lib/ol.css" rel="stylesheet" type="text/css"/>
    <link href="../libs/css/launch_activity.css" rel="stylesheet" type="text/css">
    <link href="../libs/css/chat.css" rel="stylesheet" type="text/css"/>
    <link href="../libs/lib/share.min.css" rel="stylesheet" type="text/css"/>
    <script src="http://apps.bdimg.com/libs/jquery/1.8.2/jquery.js"></script>
    <script src="../libs/lib/ol-debug.js" type="text/javascript"></script>
    <script src="../libs/lib/jquery-1.9.1.min.js" type="text/javascript"></script>
    <script src="../libs/lib/jquery.share.min.js" type="text/javascript"></script>
    <script src="../libs/js/map_utils.js" type="text/javascript"></script>
    <script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=8331d53c9b178f7354c52e29697c8a08"></script>
    <script src="../libs/lib/jspdf.min.js"  type="text/javascript"></script>
    <script src="../libs/lib/FileSaver.min.js" type="text/javascript"></script>
    <script src="../libs/js/launch_activity.js" type="text/javascript"></script>
</head>
<body>
    <%-- 地图 --%>
    <div id="mapCon"></div>
    <%-- 重置按钮 --%>
    <button class="restore" onclick="restore(map, center, zoom)">
        <span>
            <img class="restoreIcon" src="../libs/image/restore.png">
        </span>
    </button>
    <%-- 操作栏 --%>
    <input type="text" id="address" class="addressInput" placeholder="请输入地址进行定位" onblur="locate()"/>
    <button class="addMarkerBtn" onclick="Addmarker()">添加标注</button>
    <button class="drawPathBtn" onclick="drawPath()">绘制路线</button>
    <input type="text" id="addTextInput" class="addTextInput" placeholder="请输入需要添加的描述" onblur="AddText()" onfocus="setAdded()"/>
    <button class="clearBtn" onclick="clearAll()">清除</button>
    <div class="outPDF">
        <%-- 导出pdf按钮 --%>
        <button class="sim-button button14" id="outPdf">导出PDF</button>
    </div>
    <div class="outPNG">
        <%-- 导出png按钮 --%>
        <button class="sim-button button14" id="outPng">导出PNG</button>
    </div>
    <%-- 聊天界面 --%>
    <div id="chatbox">
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
                <img src="../libs/image/1_copy.jpg" />
                <div class="bubble">
                    我是老王
                </div>
            </div>

            <div class="message right">
                <img src="../libs/image/2_copy.jpg" />
                <div class="bubble">
                    我知道你是老王
                </div>
            </div>

            <div class="message">
                <img src="../libs/image/1_copy.jpg" />
                <div class="bubble">
                    Yeah, hold on

                </div>
            </div>

            <div class="message right">
                <img src="../libs/image/2_copy.jpg" />
                <div class="bubble">
                    Can you share a link for the tutorial?

                </div>
            </div>

            <div class="message">
                <img src="../libs/image/1_copy.jpg" />
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
    <%-- 分享按钮组 --%>
    <div class="share">
        <div class="social-share" data-sites="weibo,qq,qzone,tencent,wechat"></div>
    </div>
    <%-- 微博秀 --%>
    <div class="weiboXiu">
        <iframe width="100%" height="550" class="share_self"  frameborder="0" scrolling="no" src="http://widget.weibo.com/weiboshow/index.php?language=&width=0&height=550&fansRow=2&ptype=1&speed=0&skin=1&isTitle=0&noborder=0&isWeibo=1&isFans=0&uid=3199602860&verifier=624634dc&dpc=1"></iframe>
    </div>
</body>
<script>
    var $config ={
        // url                 : '', // 网址，默认使用 window.location.href
        source              : 'http://localhost:8080/pages/launch_activity.jsp', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
        title               : '寻亲活动发起', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
        description         : '这是一个寻亲活动，大家都来参加啊', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
        image               : '', // 图片, 默认取网页中第一个img标签
        sites               : ['weibo','qq','qzone','tencent','wechat'], // 启用的站点
        disabled            : ['google', 'facebook', 'twitter'], // 禁用的站点
        wechatQrcodeTitle   : "微信扫一扫：分享", // 微信二维码提示文字
        wechatQrcodeHelper  : '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'
    };
    $('.social-share').share($config);
</script>
</html>
