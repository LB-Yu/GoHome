/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * webSocket消息
 */

var messageObj;

var Chat = {};

Chat.socket = null;

Chat.connect = (function(host) {
    if ('WebSocket' in window) {
        Chat.socket = new WebSocket(host);
    } else if ('MozWebSocket' in window) {
        Chat.socket = new MozWebSocket(host);
    } else {
        console.log('Error: WebSocket is not supported by this browser.');
        return;
    }
    // webSocket连接成功
    Chat.socket.onopen = function () {
        console.log('Info: WebSocket connection opened.');
    };
    // webSocket关闭
    Chat.socket.onclose = function () {
        console.log('Info: WebSocket closed.');
    };
    /**
     * 处理来自服务器的消息
     * */
    Chat.socket.onmessage = function (message) {
        var msgObj = JSON.parse(message.data);
        if (msgObj.extra==undefined) {  // 私人信息
            console.log(msgObj);
            friends[msgObj.from] += getMsgHTML(msgObj.message);
            console.log(friends[msgObj.from]);
            resetMsgList(friends[msgObj.from]);
        }
        if (msgObj.extra=="offLine") {  // 对方不在线
            window.alert(msgObj.extra);
        }
        if (msgObj.extra=="clue") { // 线索信息
            setMsgIconState();
            console.log(msgObj.message);
            messageObj = JSON.parse(msgObj.message);
            setSysMsgHtml(msgObj.message);
        }
    };
});

/**
 * 连接服务器函数
 * */
Chat.initialize = function() {
    if (window.location.protocol == 'http:') {
        Chat.connect('ws://' + window.location.host + '/websocket/chat');
    } else {
        Chat.connect('wss://' + window.location.host + '/websocket/chat');
    }
};

/**
 * 向服务器发送信息函数
 * */
Chat.sendMessage = (function(msg, from, to) {
    var message = {
        from: from,
        to: to,
        message: msg
    };
    Chat.socket.send(JSON.stringify(message));
});

/**
 * 初始化系统消息列表
 * */
function setSysMsgHtml(obj) {
    obj = JSON.parse(obj);
    var iframe = document.getElementById('SysMsg_iframe').contentWindow;
    var div = iframe.document.getElementById('message_list');
    var html = div.innerHTML;
    var temp = "";
    for (var i=0;i<obj.length;i++) {
        var state = "";
        if (obj[i].clueState==0) {
            state = "未确认";
        } else if (obj[i].clueState==1) {
            state = "已确认为本人";
        } else {
            state = "已确认非本人";
        }
        temp += '<div class="message">'+
            '<p class="m20 blue brush-title"><button onclick="configClue('+(i+1)+')" class="alert-api-button"><img src="../libs/image/clue_true.png"></button>'+
            '<button onclick="configClue('+(-i-1)+')" class="alert-api-button"><img src="../libs/image/clue_false.png"></button>'+
            '&nbsp;&nbsp;'+ parseTime(obj[i].uploadDate) +'上传&nbsp;&nbsp;&nbsp;&nbsp;对应失踪人员编号：'+ obj[i].missingID +'&nbsp;&nbsp;&nbsp;&nbsp;' +'<strong id="state'+i.toString()+'">'+state+ '</strong>' +'<button class="contact-btn" onclick="chatWithClueProvider('+i+')"><img src="../libs/image/contact.png"></button><span class="top-right">上传者：<strong>'+ obj[i].userName +'</strong></span></p>'+
            '<div class="message-text">'+
            '<p><strong>相&nbsp;&nbsp;似&nbsp;&nbsp;度：</strong>'+ (obj[i].confidence).toString() +'%&nbsp;&nbsp;可能为同一人</p>'+
            '<p ><strong>身&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;高：</strong>'+ obj[i].height + '</p>'+
            '<p><strong>性&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</strong>'+ obj[i].sex +'</p>'+
            '<p ><strong>发现时间：</strong>'+ parseTime(obj[i].findDate) +'</p>'+
            '<p ><strong>发现地点：</strong>'+ obj[i].findPlace +'</p>'+
            '<p><strong>相关描述：</strong></p>'+
            '<div class="description-box">'+ obj[i].description+
            '</div>'+
            '</div>'+
            '<div class="comparison-photos">'+
            '<p><strong>对比照片：</strong></p>'+
            '<div style="padding-left: 80px">'+
            '<p style="padding-left: 60px">'+
            '<strong>失踪人照片</strong>'+
            '</p>'+
            '<img class="photo" src="../libs/image/all_missing_people_photo/'+ obj[i].missingID +'.jpg">'+
            '</div>'+
            '<div style="float: right;margin-right: 150px;margin-top: -215px">'+
            '<p style="padding-left: 60px">'+
            '<strong>疑似人照片</strong>'+
            '</p>'+
            '<img class="photo" src="../libs/image/clue_missing_people/'+obj[i].clueID+'.jpg">'+
            '</div>'+
            '</div>'+
            '</div>';
    }
    div.innerHTML = temp + html;
}

/**
 * 将毫秒转化为时间
 * */
function parseTime(mill) {
    var unixTimestamp = new Date(mill) ;
    Date.prototype.toLocaleString = function() {
        return this.getFullYear() + "-" + (this.getMonth() + 1) + "-" + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
    };
    var commonTime = unixTimestamp.toLocaleString();
    return commonTime;
}

/**
 * 确认线索
 * */
function configClue(id) {
    if (id>0) {
        configClueRequest(id-1, 1);
    } else {
        configClueRequest(-id-1, 2);
    }
}

/**
 * 确认请求
 * */
function configClueRequest(i, state) {
    if (parent.messageObj[i].clueState!=0) {
        window.alert("该线索已被确认！");
        return;
    }
    var formData = new FormData();
    formData.append("missingID", parent.messageObj[i].missingID);
    formData.append("clueID", parent.messageObj[i].clueID);
    formData.append("state", state);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            window.alert(data);
            if (data=="修改成功！") {
                changeClueState(i, state);
            }
        }
    };
    xhr.open("post", "ClueConfigController", true);
    xhr.send(formData);
}

/**
 * 修改消息展示列表的消息确认状态
 * */
function changeClueState(i, state) {
    var str = "";
    if (state==1) {
        str = "已确认为同一人";
    }
    if (state==2) {
        str = "已确认非同一人";
    }
    document.getElementById("state"+i.toString()).innerHTML = str;
}

/**
 * 与线索提供者聊天按钮事件
 * */
function chatWithClueProvider(id) {
    if (parent.userName==parent.messageObj[id].userName) {
        window.alert("当前用户即为该线索提供者！");
        return;
    }
    var formData = new FormData();
    formData.append("user1", parent.userName);
    formData.append("user2", parent.messageObj[id].userName);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            if (data=="添加成功！") {
                parent.initFriendsList();
                parent.showChat();
            }
        }
    };
    xhr.open("post", "AddFriendsController", true);
    xhr.send(formData);
}

/*-------------------------------------聊天界面-----------------------------------begin*/
// 当前再聊好友
var currentFriend;
// 保存列表好友消息
var friends = {};

/**
 * 获取单条发送来的信息html显示字符串
 * */
function getMsgHTML(msg) {
    return '<div class="message">' +
        '<img src="libs/image/1_copy.jpg" />'+
        '<div class="bubble">'+
        msg +
        '</div>'+
        '</div>';
}

/**
 * 获取单条发送的出去的信息html显示字符串
 * */
function getMsgRightHTML(msg) {
    return '<div class="message right">'+
        '<img src="libs/image/2_copy.jpg" />'+
        '<div class="bubble">'+
        msg +
        '</div>'+
        '</div>';
}

/**
 * 重置信息显示列表的内容
 * */
function resetMsgList(html) {
    document.getElementById("chat-messages").innerHTML = html;
    console.log(document.getElementById("chat-messages").innerHTML);
}

/**
 * 点击发送按钮
 * */
function sendMsg() {
    var msgInput = document.getElementById("message-input");
    var msg = msgInput.value;
    if (msg==""||msg=="Send message...")
        return;
    msgInput.value = 'Send message...';
    friends[currentFriend] += getMsgRightHTML(msg);
    resetMsgList(friends[currentFriend]);
    console.log(userName);
    console.log(currentFriend);
    Chat.sendMessage(msg, userName, currentFriend);
}

/**
 * 初始化聊天界面
 * */
function initChatBg() {
    // 聊天界面顶部背景
    var preloadbg = document.createElement('img');
    //preloadbg.src = '../libs/image/timeline1';
    // 联系人搜索区
    $('#searchfield').focus(function () {
        if ($(this).val() == 'Search contacts...') {
            $(this).val('');
        }
    });
    $('#searchfield').focusout(function () {
        if ($(this).val() == '') {
            $(this).val('Search contacts...');
        }
    });
    // 聊天界面消息发送区
    $('#sendmessage input').focus(function () {
        if ($(this).val() == 'Send message...') {
            $(this).val('');
        }
    });
    $('#sendmessage input').focusout(function () {
        if ($(this).val() == '') {
            $(this).val('Send message...');
        }
    });

    // 依次点击好友列表
    $('.friend').each(function () {
        $(this).click(function () {
            var childOffset = $(this).offset();
            var parentOffset = $(this).parent().parent().offset();
            var childTop = childOffset.top - parentOffset.top;
            var clone = $(this).find('img').eq(0).clone();
            var top = childTop + 12 + 'px';
            $(clone).css({ 'top': top }).addClass('floatingImg').appendTo('#index-chat-box');
            setTimeout(function () {
                $('#profile p').addClass('animate');
                $('#profile').addClass('animate');
            }, 100);
            setTimeout(function () {
                $('#chat-messages').addClass('animate');
                $('.cx, .cy').addClass('s1');
                setTimeout(function () {
                    $('.cx, .cy').addClass('s2');
                }, 100);
                setTimeout(function () {
                    $('.cx, .cy').addClass('s3');
                }, 200);
            }, 150);
            $('.floatingImg').animate({
                'width': '68px',
                'left': '108px',
                'top': '20px'
            }, 200);
            var name = $(this).find('p strong').html();
            var email = $(this).find('p span').html();
            $('#profile p').html(name);
            $('#profile span').html(email);
            $('.message').not('.right').find('img').attr('src', $(clone).attr('src'));
            $('#friendslist').fadeOut();
            $('#chatview').fadeIn();
            $('#close').unbind('click').click(function () {
                $('#chat-messages, #profile, #profile p').removeClass('animate');
                $('.cx, .cy').removeClass('s1 s2 s3');
                $('.floatingImg').animate({
                    'width': '40px',
                    'top': top,
                    'left': '12px'
                }, 200, function () {
                    $('.floatingImg').remove();
                });
                setTimeout(function () {
                    $('#chatview').fadeOut();
                    $('#friendslist').fadeIn();
                }, 50);
            });
            currentFriend = name;
            $('#chat-messages').html(friends[name]);
        });
    });
}

/**
 * 获取显示好友列表中单个好友的html代码
 * */
function getFriendHTML(user, tel, status) {
    return '<div class="friend">'+
        '<img src="../libs/image/1_copy.jpg" />'+
        '<p>'+
        '<strong>'+user+'</strong>'+
        '<span><br>'+'联系电话:'+tel+'</span>'+
        '</p>'+
        '<div class="status '+status+'"></div>'+
        '</div>';
}

/**
 * 获取整个好友列表的html代码
 * */
function getFriendsListHTML(data) {
    var obj = JSON.parse(data);
    var friendsList = "";
    for (var i=0;i<obj.userList.length;i++) {
        friendsList +=getFriendHTML(obj.userList[i].userName,obj.userList[i].tel,
            obj.userList[i].status);
        friends[obj.userList[i].userName] = "";
    }
    return friendsList;
}

/**
 * 向服务器发出更新好友列表请求
 * */
function initFriendsList() {
    var formData = new FormData();
    formData.append("message", "initFriendsList");

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = xhr.responseText;
            // 更新好友列表
            document.getElementById("friends").innerHTML = getFriendsListHTML(data);
            initChatBg();
        }
    };
    xhr.open("post", "/pages/ChatInitController", true);
    xhr.send(formData);
}
/*-------------------------------------聊天界面-----------------------------------end*/