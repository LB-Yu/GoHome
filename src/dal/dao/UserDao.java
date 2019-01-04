package dal.dao;

import dal.utils.DBHelper;
import model.entity.User;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author Huleryo
 * @date 2017/7/1
 *
 * 用户相关数据库访问操作
 */
public class UserDao implements IUserDao{

    @Override
    public User find(String userName) {
        User user = null;
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try{
            connection = DBHelper.getConnection();
            String sql = "Select * from user_table where userName=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()){
                user = new User();
                user.setUserName(resultSet.getString("userName"));
                user.setPassword(resultSet.getString("password"));
                user.setTel(resultSet.getString("tel"));
                user.setLocation(resultSet.getString("location"));
            }
        }catch (Exception e){
            e.printStackTrace();
            return null;
        } finally {
            // 释放结果集
            if (resultSet!=null){
                try {
                    resultSet.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            if (preparedStatement!=null){
                try {
                    preparedStatement.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        return user;
    }

    @Override
    public boolean add(User user) {
        // 判断是否插入成功
        boolean isAdd = false;
        Connection connection;
        PreparedStatement preparedStatement =null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Insert into user_table values(?,?,?,?);";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,user.getUserName());
            preparedStatement.setString(2,user.getPassword());
            preparedStatement.setString(3,user.getTel());
            preparedStatement.setString(4,user.getLocation());
            int i = preparedStatement.executeUpdate();
            if (1==i){
                isAdd = true;
            }
        } catch (Exception e){
            e.printStackTrace();
        } finally {
            if (preparedStatement!=null){
                try {
                    preparedStatement.close();
                }catch (Exception e){
                    e.printStackTrace();
                }
            }
        }
        return isAdd;
    }

    @Override
    public boolean updatePassword(String userName, String password) {
        boolean isUpdated = false;
        Connection connection;
        PreparedStatement preparedStatement = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "UPDATE user_table SET password=? where userName=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,password);
            preparedStatement.setString(2,userName);
            int i = preparedStatement.executeUpdate();
            if (1==i) {
                isUpdated = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (preparedStatement!=null) {
                try {
                    preparedStatement.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return isUpdated;
    }

    public static void main(String[] args){
        /*User u;
        UserDao userDao = new UserDao();
        u = userDao.find("Yuleryo");
        System.out.print(u.getUserName());*/

        Date nowTime = new Date();
        SimpleDateFormat matter = new SimpleDateFormat(
                "yyyy-MM-dd");
        String regisrationdate=(matter.format(nowTime));
        System.out.println(regisrationdate);
    }
}
