package dal.dao;

import dal.utils.DBHelper;
import model.entity.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 用户好友列表相关数据库操作,对应user_friends_table表
 */
public class UserFriendsDao implements IUserFriendsDao{

    @Override
    public boolean addFriend(String userName, String friendName) {
        // 判断是否添加成功
        boolean isAdd = false;
        // 若已经是好友直接返回true
        if (isFriends(userName, friendName)) {
            return true;
        }
        Connection connection;
        PreparedStatement preparedStatement = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Insert into user_friends_table values(?, ?);";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            preparedStatement.setString(2,friendName);
            int i = preparedStatement.executeUpdate();
            if (i==1) {
                isAdd = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isAdd;
    }

    @Override
    public boolean isFriends(String userName, String friendName) {
        boolean isFriends = false;
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from user_friends_table where userName=? and friendName=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, userName);
            preparedStatement.setString(2,friendName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                isFriends = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isFriends;
    }

    @Override
    public List<User> getAllFriends(String userName) {
        List<User> userList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from user_friends_table where userName=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                User user = new User();
                user.setUserName(resultSet.getString("friendName"));
                userList.add(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userList;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        UserFriendsDao dao = new UserFriendsDao();
        boolean i = dao.addFriend("user1", "admin");
        System.out.println(i);
    }
}
