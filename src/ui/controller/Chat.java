package ui.controller;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

import javax.servlet.http.HttpSession;
import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

import bll.service.ChatService;
import com.alibaba.fastjson.JSON;
import model.entity.Clue;
import org.apache.juli.logging.Log;
import org.apache.juli.logging.LogFactory;

import ui.utils.GetHttpSessionConfigurator;
import ui.utils.HTMLFilter;
import ui.utils.MessageGroup;
import ui.utils.WebSocketUtils;

/**
 * @author Huleryo
 * @date 2017/7/23
 *
 * webSocket服务，包含聊天与消息推送功能
 */
@ServerEndpoint(value = "/websocket/chat", configurator=GetHttpSessionConfigurator.class)
public class Chat {

    private String userName;
    private Session session;

    public Chat() {}


    /**
     * 客户端上线初始化
     * */
    @OnOpen
    public void start(Session session, EndpointConfig config) {
        HttpSession httpSession= (HttpSession) config.getUserProperties().get(HttpSession.class.getName());
        userName = (String)httpSession.getAttribute("userName");
        System.out.println("Chat中的userName=" + userName);

        this.session = session;
        WebSocketUtils.put(userName, this.session);

        // 检测是否有线索
        ChatService chatService = new ChatService();
        // 查找上传者与关注者的最新线索
        String clueStr = chatService.getLatestClue(userName);
        if (clueStr!=null) {
            MessageGroup group = new MessageGroup();
            group.setTo(userName);
            // 信息标识为服务器发送的线索信息
            group.setExtra("clue");
            group.setMessage(clueStr);
            String jsonMsg = JSON.toJSONString(group);
            broadcast(jsonMsg);
        }
    }

    /**
     * 客户端下线
     * */
    @OnClose
    public void end() {
        WebSocketUtils.remove(userName);
    }

    /**
     * 接收到来自客户端的消息
     * */
    @OnMessage
    public void incoming(String message) {
        broadcast(message);
    }

    /**
     * error
     * */
    @OnError
    public void onError(Throwable t) throws Throwable {
        System.out.println("Chat Error: " + t.toString());
    }

    /**
     * 消息处理
     * */
    public static void broadcast(String message) {
        /*System.out.println(message);
        // 客户端消息
        MessageGroup group = JSON.parseObject(message, MessageGroup.class);
        String fromUserName = group.getFrom();
        String toUserName = group.getTo();
        String msg = group.getMessage();
        Session fromSession = WebSocketUtils.get(fromUserName);
        Session toSession = WebSocketUtils.get(toUserName);
        // 服务器发送消息对象
        MessageGroup messageGroup = new MessageGroup();
        if (toSession!=null) {  // 目的地在线
            try {
                // 发送给目的地的信息包含来源和消息内容
                messageGroup.setFrom(fromUserName);
                messageGroup.setMessage(msg);
                String temp = JSON.toJSONString(messageGroup);
                toSession.getBasicRemote().sendText(temp);
            } catch (IOException e) {
                e.printStackTrace();
            }
        } else {    // 目的地离线
            // 向发送方返回目的地离线信息
            messageGroup.setExtra("offLine");
            String temp = JSON.toJSONString(messageGroup);
            try {
                fromSession.getBasicRemote().sendText(temp);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }*/
        System.out.println(message);
        // 消息解析
        MessageGroup messageGroup = JSON.parseObject(message, MessageGroup.class);

        if (messageGroup.getExtra()==null) {    // 无附加标识，为来自客户端的消息
            String from = messageGroup.getFrom();
            String to = messageGroup.getTo();
            String content = messageGroup.getMessage();
            Session fromSession = WebSocketUtils.get(from);
            Session  toSession = WebSocketUtils.get(to);
            // 向客户端发送的消息对象
            MessageGroup toClientMsg = new MessageGroup();
            if (toSession!=null) {  // 目的地在线
                try {
                    // 发送给目的地的信息包含来源和消息内容
                    toClientMsg.setFrom(from);
                    toClientMsg.setMessage(content);
                    String temp = JSON.toJSONString(toClientMsg);
                    toSession.getBasicRemote().sendText(temp);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            } else {    // 目的地离线
                // 向发送方返回目的地离线信息
                toClientMsg.setExtra("offLine");
                String temp = JSON.toJSONString(toClientMsg);
                try {
                    fromSession.getBasicRemote().sendText(temp);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else if (messageGroup.getExtra().equals("clue")) {    // 服务器推送线索
            String to = messageGroup.getTo();
            String content = messageGroup.getMessage();
            Session toSession = WebSocketUtils.get(to);
            if (toSession!=null) {
                try {
                    toSession.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        } else if (messageGroup.getExtra().equals("test")) {
            String to = messageGroup.getTo();
            String content = messageGroup.getMessage();
            Session toSession = WebSocketUtils.get(to);
            if (toSession!=null) {
                try {
                    toSession.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        /*for (Chat client : connections) {
            try {
                synchronized (client) {
                    client.session.getBasicRemote().sendText(msg);
                }
            } catch (IOException e) {
                log.debug("Chat Error: Failed to send message to client", e);
                connections.remove(client);
                try {
                    client.session.close();
                } catch (IOException e1) {
                    // Ignore
                }
                String message = String.format("* %s %s",
                        client.nickname, "has been disconnected.");
                broadcast(message);
            }
        }*/
    }
}
