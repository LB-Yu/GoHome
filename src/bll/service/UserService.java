package bll.service;

import dal.dao.UserDao;
import model.entity.User;

/**
 * @author Huleryo
 * @date 2017/7/1
 *
 * 用户相关逻辑操作
 */
public class UserService {

    // 用于数据库操作
    private UserDao userDao = new UserDao();

    /**
     * 判断用户是否存在
     * @param userName user's name need to judge if is exist
     * @return true if exist or false
     * */
    public boolean isUserExist(String userName){
        if (null==userDao.find(userName)){
            return false;
        }else {
            return true;
        }
    }

    /**
     * 判断用户名与密码是否匹配
     * @param userName user's name need to judge
     * @param password password
     * */
    public boolean validLogIn(String userName, String password){
        User user = userDao.find(userName);
        if (user.getPassword().equals(password)){
            return true;
        }else {
            return false;
        }
    }

    /**
     * 添加用户
     * @param user 需要添加的用户
     * @return true添加成功，false添加失败
     * */
    public boolean addUser(User user) {
        if (userDao.add(user)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 测试
     * */
    public static void main(String args[]){
        UserService userService = new UserService();
        System.out.println(userService.isUserExist("admin"));
        System.out.println(userService.validLogIn("admin", "admin"));
    }
}
