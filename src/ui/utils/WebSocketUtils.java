package ui.utils;

import javax.websocket.Session;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author Huleryo
 * @date 2017/7/23
 *
 * webSocket工具类
 */
public class WebSocketUtils {

    // 用于保存上线的用户ID，及Session
    private static Map<String, Session> map = new ConcurrentHashMap<String, Session>();

    /**
     * 添加上线用户
     *
     * @param userID 用户名
     * @param session 对应Session
     * */
    public static void put(String userID, Session session) {
        map.put(userID, session);
        System.out.println("用户"+userID+"已上线！");
        System.out.println("当前在线总人数"+getTotalOnlineCount());
    }

    /**
     *  通过userID获取对应Session
     *
     *  @param userID 用户名
     *  @return 对应Session
     * */
    public static Session get(String userID) {
        return map.get(userID);
    }

    /**
     * 获取除去自身之外的全部Session
     *
     * @param userID 自身用户名
     * @return 其余用户Session
     * */
    public static List<Session> getOtherSession(String userID) {
        List<Session> result = new ArrayList<>();
        Set<Map.Entry<String, Session>> set = map.entrySet();
        for (Map.Entry<String, Session> s:set) {
            if (!s.getKey().equals(userID)) {
                result.add(s.getValue());
            }
        }
        return result;
    }

    /**
     * 下线，去除指定userID的Session
     *
     *@param userID 用户名
     * */
    public static void remove(String userID) {
        map.remove(userID);
        System.out.println("用户"+userID+"已下线！");
        System.out.println("当前在线总人数"+getTotalOnlineCount());
    }

    /**
     * 判断某个用户是否在线
     * @param userID 用户名
     * @return true 在线
     *          false 离线
     * */
    public static boolean hasConnecction(String userID) {
        return map.containsKey(userID);
    }

    /**
     * 获取当前在线总人数
     * */
    public static int getTotalOnlineCount() {
        return map.size();
    }
}
