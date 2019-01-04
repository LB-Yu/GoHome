package dal.dao;

import com.alibaba.fastjson.JSON;
import dal.utils.DBHelper;
import dal.utils.SqlUtil;
import model.entity.Clue;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * 对失踪线索的相关数据库操作
 */
public class ClueDao implements IClueDao{

    @Override
    public boolean addClue(Clue clue) {
        Connection connection;
        PreparedStatement preparedStatement;
        try {
            connection = DBHelper.getConnection();
            String sql = "Insert into clue_table values(?,?,?,?,?,?,?,?,?,?,?,?,?);";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,clue.getMissingID());
            preparedStatement.setFloat(2,clue.getConfidence());
            preparedStatement.setString(3,clue.getHeight());
            preparedStatement.setString(4,clue.getSex());
            preparedStatement.setDate(5,clue.getFindDate());
            preparedStatement.setString(6,clue.getFindPlace());
            preparedStatement.setInt(7,clue.getClueState());
            preparedStatement.setString(8,clue.getDescription());
            preparedStatement.setInt(9,clue.getClueID());
            preparedStatement.setDate(10,clue.getUploadDate());
            preparedStatement.setString(11,clue.getUserName());
            preparedStatement.setDouble(12,clue.getLng());
            preparedStatement.setDouble(13,clue.getLat());
            int result = preparedStatement.executeUpdate();
            if (result==1) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public boolean updateState(int state, int missingID, int clueID) {
        Connection connection;
        PreparedStatement preparedStatement;
        try {
            connection = DBHelper.getConnection();
            String sql = "Update clue_table set clueState=? where missingID=? and clueID=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,state);
            preparedStatement.setInt(2,missingID);
            preparedStatement.setInt(3,clueID);
            int result = preparedStatement.executeUpdate();
            if (1==result) {
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    @Override
    public List<Clue> getClueByMissingIDList(List missingIDList) {
        List<Clue> clueList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement;
        ResultSet resultSet;
        try {
            connection = DBHelper.getConnection();
            String sql = SqlUtil.multiFields("clue_table", "missingID", missingIDList.size(),"order by uploadDate desc");
            preparedStatement = connection.prepareStatement(sql);
            for (int i=1;i<=missingIDList.size();i++) {
                preparedStatement.setInt(i, (int)missingIDList.get(i-1));
            }
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                Clue clue = new Clue();
                clue.setMissingID(resultSet.getInt("missingID"));
                clue.setUserName(resultSet.getString("userName"));
                clue.setUploadDate(resultSet.getDate("uploadDate"));
                clue.setSex(resultSet.getString("sex"));
                clue.setHeight(resultSet.getString("height"));
                clue.setFindDate(resultSet.getDate("findDate"));
                clue.setDescription(resultSet.getString("description"));
                clue.setConfidence(resultSet.getFloat("confidence"));
                clue.setClueState(resultSet.getInt("clueState"));
                clue.setFindPlace(resultSet.getString("findPlace"));
                clue.setClueID(resultSet.getInt("clueID"));
                clue.setLng(resultSet.getDouble("lng"));
                clue.setLat(resultSet.getDouble("lat"));
                clueList.add(clue);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return clueList;
    }

    @Override
    public Clue getByMissingID(int missingID, int clueID) {
        Connection connection;
        PreparedStatement preparedStatement;
        ResultSet resultSet;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from clue table where missingID=? and clueID=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,missingID);
            preparedStatement.setInt(2,clueID);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                Clue clue = new Clue();
                clue.setMissingID(resultSet.getInt("missingID"));
                clue.setUserName(resultSet.getString("userName"));
                clue.setUploadDate(resultSet.getDate("uploadDate"));
                clue.setSex(resultSet.getString("sex"));
                clue.setHeight(resultSet.getString("height"));
                clue.setFindDate(resultSet.getDate("findDate"));
                clue.setDescription(resultSet.getString("description"));
                clue.setConfidence(resultSet.getFloat("confidence"));
                clue.setClueState(resultSet.getInt("clueState"));
                clue.setFindPlace(resultSet.getString("findPlace"));
                clue.setClueID(resultSet.getInt("clueID"));
                clue.setLng(resultSet.getDouble("lng"));
                clue.setLat(resultSet.getDouble("lat"));
                return clue;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public int getMaxClueID() {
        int maxClueID = -1;
        Connection connection;
        PreparedStatement preparedStatement;
        ResultSet resultSet;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select max(clueID) from clue_table;";
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                maxClueID = resultSet.getInt("max(clueID)");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return maxClueID;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        /*Clue clue = new Clue();
        clue.setClueID(1);
        clue.setClueState(0);
        clue.setConfidence(0.8f);
        clue.setDescription("帅");
        clue.setFindDate(new Date((new java.util.Date()).getTime()));
        clue.setFindPlace("地大");
        clue.setHeight("150cm");
        clue.setSex("男");
        clue.setUploadDate(new Date((new java.util.Date()).getTime()));
        clue.setUserName("admin");
        clue.setMissingID(3183);
        ClueDao dao = new ClueDao();
        dao.addClue(clue);*/

        /*ClueDao dao = new ClueDao();
        List missingID = new ArrayList();
        missingID.add(3173);
        missingID.add(3183);
        missingID.add(3189);
        List<Clue> clueList = dao.getClueByMissingIDList(missingID);
        System.out.println(JSON.toJSON(clueList));*/

        ClueDao dao = new ClueDao();
        System.out.println(dao.getMaxClueID());
    }
}
