package model.utils;

import model.entity.User;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 用户信息Json实体类
 */
public class UserGroup {

    private List<User> userList = new ArrayList<>();

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }
}
