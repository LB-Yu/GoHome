package ui.utils;

import com.alibaba.fastjson.JSON;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 消息传送JSON实体类
 */
public class MessageGroup {

    private String from;
    private String to;
    private String message;
    private String extra;

    public String getExtra() {
        return extra;
    }

    public void setExtra(String extra) {
        this.extra = extra;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    /**
     * 测试方法
     * */
    public static void main(String[] args) {
        MessageGroup group = new MessageGroup();
        group.setFrom("user1");
        group.setTo("user2");
        String jsonStr = JSON.toJSONString(group);
        System.out.println(jsonStr);
    }
}
