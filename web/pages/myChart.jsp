<%--
  Created by IntelliJ IDEA.
  User: 余乐悠
  Date: 2017/7/23
  Time: 21:24
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%
    String sessionID = session.getId();
    session.setAttribute("userName", "user1");
    System.out.println(sessionID);
%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<div>
    <label>从：</label>
    <input type="text" name="from" id="from"/>
    <label>发送到：</label>
    <input type="text" name="to" id="to"/>
</div>
<div>
    <label>消息内容</label>
    <input type="text" name="message" id="message">
    <input type="button" value="发送" onclick="Chat.sendMessage()"/>
</div>
</body>
<script>
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

        Chat.socket.onopen = function () {
            console.log('Info: WebSocket connection opened.');
        };

        Chat.socket.onclose = function () {
            console.log('Info: WebSocket closed.');
        };

        Chat.socket.onmessage = function (message) {
            console.log(message);
            console.log(message.data);
        };
    });

    Chat.initialize = function() {
        if (window.location.protocol == 'http:') {
            Chat.connect('ws://' + window.location.host + '/websocket/chat');
        } else {
            Chat.connect('wss://' + window.location.host + '/websocket/chat');
        }
    };

    Chat.sendMessage = (function() {
        var from = document.getElementById("from").value;
        var to = document.getElementById("to").value;
        var message = document.getElementById('message').value;
        var message = {
            from: from,
            to: to,
            message: message
        };
        console.log(JSON.stringify(message));
        Chat.socket.send(JSON.stringify(message));
    });

    Chat.initialize();
</script>
</html>
