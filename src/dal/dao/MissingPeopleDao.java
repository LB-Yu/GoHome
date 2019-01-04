package dal.dao;

import bll.util.MissingPeopleGroup;
import bll.util.Result;
import com.alibaba.fastjson.JSON;
import dal.utils.DBHelper;
import model.entity.MissingPeople;

import java.sql.*;
import java.util.*;
import java.util.Date;

/**
 * @author Kingdrone, Huleryo
 * @date 2017/7/11-12
 *
 * 对失踪人员相关数据库操作
 */
public class MissingPeopleDao implements IMissingPeopleDao{

    @Override
    public List<MissingPeople> findAllMissingPeople(){
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        List<MissingPeople> msPeopleList= new ArrayList<MissingPeople>();

        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from missing_people_data_table;";
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                MissingPeople missingPeople = new MissingPeople();
                missingPeople.setBirthDate(resultSet.getDate("birthDate"));
                missingPeople.setDescription(resultSet.getString("description"));
                missingPeople.setExtraData(resultSet.getString("extraData"));
                missingPeople.setHasPhoto(resultSet.getInt("hasPhoto"));
                missingPeople.setHeight(resultSet.getString("height"));
                missingPeople.setLat(resultSet.getDouble("lat"));
                missingPeople.setLng(resultSet.getDouble("lng"));
                missingPeople.setMissingID(resultSet.getInt("missingID"));
                missingPeople.setMissingDate(resultSet.getDate("missingDate"));
                missingPeople.setMissingName(resultSet.getString("missingName"));
                missingPeople.setMissingPlace(resultSet.getString("missingPlace"));
                missingPeople.setSex(resultSet.getString("sex"));
                missingPeople.setRegistrationDate(resultSet.getDate("registrationDate"));
                missingPeople.setType(resultSet.getString("type"));
                missingPeople.setUserName(resultSet.getString("userName"));
                missingPeople.setMissingPeopleState(resultSet.getInt("missingPeopleState"));
                msPeopleList.add(missingPeople);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return msPeopleList;
    }

    @Override
    public MissingPeople findByID(int missingID) {
        MissingPeople missingPeople = null;
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from missing_people_data_table where missingID=?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,missingID);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                missingPeople = new MissingPeople();
                missingPeople.setBirthDate(resultSet.getDate("birthDate"));
                missingPeople.setDescription(resultSet.getString("description"));
                missingPeople.setExtraData(resultSet.getString("extraData"));
                missingPeople.setHasPhoto(resultSet.getInt("hasPhoto"));
                missingPeople.setHeight(resultSet.getString("height"));
                missingPeople.setLat(resultSet.getDouble("lat"));
                missingPeople.setLng(resultSet.getDouble("lng"));
                missingPeople.setMissingID(resultSet.getInt("missingID"));
                missingPeople.setMissingDate(resultSet.getDate("missingDate"));
                missingPeople.setMissingName(resultSet.getString("missingName"));
                missingPeople.setMissingPlace(resultSet.getString("missingPlace"));
                missingPeople.setSex(resultSet.getString("sex"));
                missingPeople.setRegistrationDate(resultSet.getDate("registrationDate"));
                missingPeople.setType(resultSet.getString("type"));
                missingPeople.setUserName(resultSet.getString("userName"));
                missingPeople.setMissingPeopleState(resultSet.getInt("missingPeopleState"));
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
            if (resultSet!=null) {
                try {
                    resultSet.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return missingPeople;
    }

    @Override
    public List<MissingPeople> findByIDArr(List<Result> results) {
        List<MissingPeople> missingPeopleList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from missing_people_data_table where " +
                    "missingID=? || missingID=? || missingID=? || missingID=?" +
                    "|| missingID=?;";
            preparedStatement = connection.prepareStatement(sql);
            for (int i=0;i<5;i++) {
                preparedStatement.setInt(i+1, Integer.parseInt(results.get(i).getUser_id()));
            }
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                int i = 0;
                for (;i<5;i++) {
                    if (Integer.parseInt(results.get(i).getUser_id())==resultSet.getInt("missingID")) {
                        break;
                    }
                }
                MissingPeople missingPeople = new MissingPeople();
                missingPeople.setDescription(resultSet.getString("description"));
                missingPeople.setBirthDate(resultSet.getDate("birthDate"));
                missingPeople.setExtraData(resultSet.getString("extraData"));
                missingPeople.setHasPhoto(resultSet.getInt("hasPhoto"));
                missingPeople.setHeight(resultSet.getString("height"));
                missingPeople.setLat(resultSet.getDouble("lat"));
                missingPeople.setLng(resultSet.getDouble("lng"));
                missingPeople.setMissingID(resultSet.getInt("missingID"));
                missingPeople.setMissingDate(resultSet.getDate("missingDate"));
                missingPeople.setMissingName(resultSet.getString("missingName"));
                missingPeople.setMissingPlace(resultSet.getString("missingPlace"));
                missingPeople.setSex(resultSet.getString("sex"));
                missingPeople.setRegistrationDate(resultSet.getDate("registrationDate"));
                missingPeople.setType(resultSet.getString("type"));
                missingPeople.setConfidence(results.get(i).getConfidence());
                missingPeople.setUserName(resultSet.getString("userName"));
                missingPeople.setMissingPeopleState(resultSet.getInt("missingPeopleState"));
                missingPeopleList.add(missingPeople);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        // 将结果按相似度排序
        Collections.sort(missingPeopleList, new Comparator<MissingPeople>() {
            @Override
            public int compare(MissingPeople o1, MissingPeople o2) {
                if (o1.getConfidence()-o2.getConfidence()>0) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
        return missingPeopleList;
    }

    @Override
    public boolean add(MissingPeople missingPeople) {
        boolean isAdded = false;
        Connection connection;
        PreparedStatement preparedStatement =null;
        try {
            connection = DBHelper.getConnection();
            String sql = "INSERT INTO missing_people_data_table VALUES(?,?,?,?," +
                    "?,?,?,?,?,?,?,?,?,?,?,?);";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,missingPeople.getMissingID());
            preparedStatement.setString(2,missingPeople.getType());
            preparedStatement.setString(3,missingPeople.getMissingName());
            preparedStatement.setString(4,missingPeople.getSex());
            preparedStatement.setDate(5,missingPeople.getBirthDate());
            preparedStatement.setString(6,missingPeople.getHeight());
            preparedStatement.setDate(7,missingPeople.getMissingDate());
            preparedStatement.setString(8,missingPeople.getMissingPlace());
            preparedStatement.setString(9,missingPeople.getDescription());
            preparedStatement.setString(10,missingPeople.getExtraData());
            preparedStatement.setDate(11,missingPeople.getRegistrationDate());
            preparedStatement.setDouble(12,missingPeople.getLng());
            preparedStatement.setDouble(13,missingPeople.getLat());
            preparedStatement.setInt(14,missingPeople.getHasPhoto());
            preparedStatement.setString(15,missingPeople.getUserName());
            preparedStatement.setInt(16,missingPeople.getMissingPeopleState());
            int i = preparedStatement.executeUpdate();
            if (1==i) {
                isAdded = true;
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
        return isAdded;
    }

    @Override
    public int findMaxMissingID() {
        int missingID = -1;
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select max(missingID) from missing_people_data_table;";
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            if (resultSet.next()) {
                missingID = resultSet.getInt("max(missingID)");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return missingID;
    }

    @Override
    public List<MissingPeople> findMissingIDLatlng(int gap) {
        List<MissingPeople> missingPeopleList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select missingID,lng,lat from missing_people_data_table where hasPhoto=1;";
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            int current = 1;
            while (resultSet.next()) {
                if (current%gap==0) {
                    MissingPeople missingPeople = new MissingPeople();
                    missingPeople.setMissingID(resultSet.getInt("missingID"));
                    missingPeople.setLng(resultSet.getDouble("lng"));
                    missingPeople.setLat(resultSet.getDouble("lat"));
                    missingPeopleList.add(missingPeople);
                    current += 1;
                } else {
                    current += 1;
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return missingPeopleList;
    }

    @Override
    public List<MissingPeople> getDailyRecommendation() {
        List<MissingPeople> missingPeopleList = new ArrayList<>();
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "select * from missing_people_data_table WHERE hasPhoto=1 order by missingDate desc limit 9;";
            preparedStatement = connection.prepareStatement(sql);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                MissingPeople missingPeople = new MissingPeople();
                missingPeople.setDescription(resultSet.getString("description"));
                missingPeople.setBirthDate(resultSet.getDate("birthDate"));
                missingPeople.setExtraData(resultSet.getString("extraData"));
                missingPeople.setHasPhoto(resultSet.getInt("hasPhoto"));
                missingPeople.setHeight(resultSet.getString("height"));
                missingPeople.setLat(resultSet.getDouble("lat"));
                missingPeople.setLng(resultSet.getDouble("lng"));
                missingPeople.setMissingID(resultSet.getInt("missingID"));
                missingPeople.setMissingDate(resultSet.getDate("missingDate"));
                missingPeople.setMissingName(resultSet.getString("missingName"));
                missingPeople.setMissingPlace(resultSet.getString("missingPlace"));
                missingPeople.setSex(resultSet.getString("sex"));
                missingPeople.setRegistrationDate(resultSet.getDate("registrationDate"));
                missingPeople.setType(resultSet.getString("type"));
                missingPeople.setUserName(resultSet.getString("userName"));
                missingPeople.setMissingPeopleState(resultSet.getInt("missingPeopleState"));
                missingPeopleList.add(missingPeople);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return missingPeopleList;
    }

    @Override
    public int[] getNearlyMissingNum(int n) {
        int[] result = new int[n];
        java.sql.Date today = new java.sql.Date((new Date()).getTime());
        java.sql.Date farDay = new java.sql.Date(today.getTime()-(n-1)*24*60*60*1000);
        Connection connection;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "Select * from missing_people_data_table where missingDate between ? and ?;";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setDate(1,farDay);
            preparedStatement.setDate(2,today);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()) {
                int dayIndex = (int) (today.getTime()-resultSet.getDate("missingDate").getTime())/(24*60*60*1000);
                dayIndex = n-1-dayIndex;
                System.out.println(dayIndex);
                System.out.println(resultSet.getInt("missingID"));
                result[dayIndex] += 1;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    @Override
    public boolean upDateMissingPeopleData(MissingPeople missingPeople){
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "UPDATE missing_people_data_table SET " +
                    "type = ?,  missingName = ?,sex = ?,birthDate = ?,height = ?,missingDate = ?," +
                    "missingPlace = ?, description = ?,extraData = ? WHERE missingId = ?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,missingPeople.getType());
            preparedStatement.setString(2,missingPeople.getMissingName());
            preparedStatement.setString(3,missingPeople.getSex());
            preparedStatement.setDate(4,missingPeople.getBirthDate());
            preparedStatement.setString(5,missingPeople.getHeight());
            preparedStatement.setDate(6,missingPeople.getMissingDate());
            preparedStatement.setString(7,missingPeople.getMissingPlace());
            preparedStatement.setString(8,missingPeople.getDescription());
            preparedStatement.setString(9,missingPeople.getExtraData());
            preparedStatement.setInt(10,missingPeople.getMissingID());
            System.out.println(preparedStatement);
            int i = preparedStatement.executeUpdate();
            if (i==1){
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        return false;
    }

    @Override
    public boolean upDateMissingPeopleStage(int missingID){
        Connection connection = null;
        PreparedStatement preparedStatement = null;

        try {
            connection = DBHelper.getConnection();
            String sql = "UPDATE missing_people_data_table SET missingPeopleState = 1 WHERE missingID =?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setInt(1,missingID);
            int i = preparedStatement.executeUpdate();
            if(i==1){
                System.out.println("更改状态成功！");
                return true;
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("更改状态失败！");
        return false;
    }


    @Override
    public ArrayList<MissingPeople> findMissingPeopleByUserName(String userName){
        ArrayList<MissingPeople> missingPeoples = new ArrayList<>();
        Connection connection = null;
        PreparedStatement preparedStatement = null;
        ResultSet resultSet = null;
        try {
            connection = DBHelper.getConnection();
            String sql = "SELECT * FROM missing_people_data_table WHERE userName = ?";
            preparedStatement = connection.prepareStatement(sql);
            preparedStatement.setString(1,userName);
            resultSet = preparedStatement.executeQuery();
            while (resultSet.next()){
                MissingPeople missingPeople = new MissingPeople();
                missingPeople.setBirthDate(resultSet.getDate("birthDate"));
                missingPeople.setDescription(resultSet.getString("description"));
                missingPeople.setExtraData(resultSet.getString("extraData"));
                missingPeople.setHasPhoto(resultSet.getInt("hasPhoto"));
                missingPeople.setHeight(resultSet.getString("height"));
                missingPeople.setLat(resultSet.getDouble("lat"));
                missingPeople.setLng(resultSet.getDouble("lng"));
                missingPeople.setMissingID(resultSet.getInt("missingID"));
                missingPeople.setMissingDate(resultSet.getDate("missingDate"));
                missingPeople.setMissingName(resultSet.getString("missingName"));
                missingPeople.setMissingPlace(resultSet.getString("missingPlace"));
                missingPeople.setSex(resultSet.getString("sex"));
                missingPeople.setRegistrationDate(resultSet.getDate("registrationDate"));
                missingPeople.setType(resultSet.getString("type"));
                missingPeople.setMissingPeopleState(resultSet.getInt("missingPeopleState"));
                missingPeople.setUserName(resultSet.getString("userName"));
                missingPeoples.add(missingPeople);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return missingPeoples;
    }


    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        MissingPeople missingPeople = new MissingPeople();
        missingPeople.setMissingID(3);
        missingPeople.setType("家寻宝贝");
        missingPeople.setMissingName("测试");
        missingPeople.setSex("男");
        missingPeople.setBirthDate(new java.sql.Date((new Date(1961,9,27)).getTime()));
        missingPeople.setHeight("174cm");
        missingPeople.setMissingDate(new java.sql.Date((new Date(2017,8,7)).getTime()));
        missingPeople.setMissingPlace("中国地质大学(武汉)");
        missingPeople.setDescription("长得非常的帅，瓜子脸，眉目清秀，很像刘德华！");
        missingPeople.setExtraData("应该不是湖北本地人，普通话说的很烂，王俊珏跟进！");
        missingPeople.setRegistrationDate(new java.sql.Date((new Date()).getTime()));
        missingPeople.setLng(110.123);
        missingPeople.setLat(50.258);
        missingPeople.setHasPhoto(1);
        missingPeople.setUserName("user");
        missingPeople.setMissingPeopleState(0);
        MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        boolean isAdded = missingPeopleDao.add(missingPeople);
        System.out.println(isAdded);
        /*  MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
          ArrayList<MissingPeople> missingPeoples;
          missingPeoples=missingPeopleDao.findMissingPeopleByUserName("admin");
          Iterator<MissingPeople> missingPeopleIterator = missingPeoples.iterator();
          while (missingPeopleIterator.hasNext()){
               System.out.println(missingPeopleIterator.next());
          }*/

        /*MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        MissingPeople missingPeople = missingPeopleDao.findByID(3173);
        MissingPeopleGroup group = new MissingPeopleGroup();
        group.addMissingPeople(missingPeople);
        String jsonStr = JSON.toJSONString(group);
        System.out.println(jsonStr);*/

        /*MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        List<MissingPeople> missingPeopleList = missingPeopleDao.findAllMissingPeople();
        System.out.println(missingPeopleList.size());
        MissingPeopleGroup group = new MissingPeopleGroup();
        group.setMissingPeopleList(missingPeopleList);
        String jsonStr = JSON.toJSONString(group);
        System.out.println(jsonStr);*/

        /*MissingPeopleDao dao = new MissingPeopleDao();
        List<MissingPeople> missingPeopleList = dao.getDailyRecommendation();
        String jsonStr = JSON.toJSONString(missingPeopleList);
        System.out.println(jsonStr);*/

        /*MissingPeopleDao dao = new MissingPeopleDao();
        int[] re = dao.getNearlyMissingNum(10);
        String jsonStr = JSON.toJSONString(re);
        System.out.println(jsonStr);*/
    }
}
