package dal.dao;

import model.entity.User;

import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 用户好友数据接口，对应user_friends
 */
public interface IUserFriendsDao {

    /**
     * 为用户添加好友
     *
     * @param username 用户名
     * @param friendName 好友名
     * @return true 添加成功
     *          false 添加失败
     * */
    boolean addFriend(String username, String friendName);

    /**
     * 判断用户之间是否为好友
     *
     * @param userName 用户名
     * @param friendName 好友名
     * @return true 是好友
     *          false 不是好友
     * */
    boolean isFriends(String userName, String friendName);

    /**
     * 查找某个用户的全部好友
     *
     * @param userName 需要查找的用户名
     * @return 该用户的全部好友
     * */
    List<User> getAllFriends(String userName);
}
