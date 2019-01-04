package bll.service;

import com.alibaba.fastjson.JSON;
import dal.dao.UserDao;
import dal.dao.UserFriendsDao;
import model.entity.User;
import model.utils.UserGroup;
import ui.utils.WebSocketUtils;

import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 用户好友相关业务逻辑
 */
public class UserFriendsService {

    // 用于好友列表查询
    private UserFriendsDao userFriendsDao = new UserFriendsDao();
    // 用于用户信息查询
    private UserDao userDao = new UserDao();

    /**
     * 获得某个用户的全部好友的userName，tel及当前登录状态,用于前端好友列表的展示
     *
     * @param userName 用户名
     * @return 好友列表，好友信息包含用户名和联系电话
     * */
    public List<User> getAllFriendsWithTel(String userName) {
        List<User> userList = userFriendsDao.getAllFriends(userName);
        for (int i=0;i<userList.size();i++) {
            User friend = userDao.find(userList.get(i).getUserName());
            userList.get(i).setTel(friend.getTel());
            if (WebSocketUtils.get(userList.get(i).getUserName())!=null) {
                userList.get(i).setStatus("available");
            } else {
                userList.get(i).setStatus("inactive");
            }
        }
        return userList;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        UserFriendsService service = new UserFriendsService();
        List<User> userList = service.getAllFriendsWithTel("user1");
        UserGroup group = new UserGroup();
        group.setUserList(userList);
        String jsonStr = JSON.toJSONString(group);
        System.out.println(jsonStr);
    }
}
