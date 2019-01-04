package dal.dao;

import model.entity.User;

/**
 * @author Huleryo
 * @date 2017/7/1
 *
 * 用户数据接口,对应user_table
 */

public interface IUserDao {
    /**
     * 根据用户名查找用户
     * @param userName user name
     * @return user found or null not find
     * */
    User find(String userName);

    /**
     * add new user
     * @param user user added
     * @return true add successfully or false failed
     * */
    boolean add(User user);

    /**
     * 修改密码
     * @param password 新密码
     * @return true update successfully or false failed
     * */
    boolean updatePassword(String userName, String password);
}
