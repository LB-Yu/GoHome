package dal.dao;

import dal.utils.DBHelper;
import model.entity.MissingPeople;
import model.entity.User;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kingdrone on 2017/7/26.
 * 添加关注，在user_attention_table中插入字段
 */
public class AttentionDao implements IAttentionDao {
    /**
     * 检查，并添加关注
     * @param userName
     * @param missingID
     * @return
     */
    public boolean AddAttention(String userName, int missingID){
        Connection connection;
        PreparedStatement preparedStatement = null;
        if (!CheckAttention(userName,missingID)){
            try {
                connection = DBHelper.getConnection();
                String sql = "INSERT INTO user_attention_table VALUES(?,?);";
                preparedStatement = connection.prepareStatement(sql);
                preparedStatement.setString(1,userName);
                preparedStatement.setInt(2,missingID);
                int result = preparedStatement.executeUpdate();
                if (result > 0) return true;
            }catch (Exception e){
                e.printStackTrace();
                return false;
            }
        }
        return false;
    }

    /**
     * 检查是否已经添加
     * @param userName
     * @param missingID
     * @return
     */
    public boolean CheckAttention(String userName, int missingID){
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "SELECT * FROM user_attention_table WHERE userName = ? AND missingID = ?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            preparedStatement.setInt(2,missingID);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
            return true;
        }
        return false;
    }

    @Override
    public boolean cancelAttention(String userName, int missingID) {
        boolean isCancel = false;
        Connection connection;
        PreparedStatement preparedStatement = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Delete from user_attention_table where userName=? and missingID=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1, userName);
            preparedStatement.setInt(2, missingID);
            int result = preparedStatement.executeUpdate();
            if (result==1) {
                isCancel = true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isCancel;
    }

    /**
     * 查看当前用户关注对象ID
     * @param userName
     * @return missingID
     */
    public ArrayList FindAttentionByUserName(String userName){
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        ArrayList missingPeopleIDList = new ArrayList();

        try {
            connection = DBHelper.getConnection();
            String sql = "SELECT * FROM user_attention_table WHERE userName = ?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()){
                missingPeopleIDList.add(resultSet.getInt("missingID"));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return missingPeopleIDList;
    }

    @Override
    public List<User> getAllAttentionUser(int missingID) {
        List<User> userList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement;
        ResultSet resultSet;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from user_attention_table where missingID=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,missingID);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                User user = new User();
                user.setUserName(resultSet.getString("userName"));
                userList.add(user);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return userList;
    }


    public static void main(String[] args) {
        /*MissingPeople mp = new MissingPeople();
        User user = new User();
        AttentionDao add = new AttentionDao();
        try {
            mp.setMissingID(2);
            mp.setType("宝贝回家");
            mp.setMissingName("哈哈");
            Date sqlDate = java.sql.Date.valueOf("2010-08-20");
            mp.setMissingDate(sqlDate);
            mp.setBirthDate(sqlDate);
            mp.setExtraData("");
            mp.setHeight("");
            mp.setMissingPlace("");
            mp.setSex("");
            mp.setRegistrationDate(sqlDate);
            mp.setDescription("");
            mp.setLng(123.2);
            mp.setLat(45.1);
            mp.setHasPhoto(1);
            user.setUserName("admin");
            user.setPassword("admin");
            user.setLocation("中国地质大学");
            user.setTel("123456");
            add.AddAttention("admin",6);
        } catch (Exception e) {
            e.printStackTrace();
        }*/
        AttentionDao dao = new AttentionDao();
        //System.out.println(dao.cancelAttention("admin", 1));
        dao.AddAttention("user1", 0);
        dao.AddAttention("user1", 1);
    }

}
