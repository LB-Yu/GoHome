package ui.utils;

import com.alibaba.fastjson.JSON;
import model.entity.Clue;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;


/**
 * @author Huleryo
 * @date 2017/8/7
 *
 * 前台传送的线索表单信息解析
 */
public class ClueGroup {

    private int num;
    private List missingIDList = new ArrayList();
    private List confidenceList = new ArrayList();
    private String height;
    private String sex;
    private String findPlace;
    private String  findDate;
    private String description;
    private double lng;
    private double lat;

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    public List getMissingIDList() {
        return missingIDList;
    }

    public void setMissingIDList(List missingIDList) {
        this.missingIDList = missingIDList;
    }

    public List getConfidenceList() {
        return confidenceList;
    }

    public void setConfidenceList(List confidenceList) {
        this.confidenceList = confidenceList;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getFindPlace() {
        return findPlace;
    }

    public void setFindPlace(String findPlace) {
        this.findPlace = findPlace;
    }

    public String getFindDate() {
        return findDate;
    }

    public void setFindDate(String findDate) {
        this.findDate = findDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        /*String jsonStr = "{\"num\":2,\"missingIDList\":[0,1],\"confidenceList\":[92.718,83.74],\"height\":\"174cm\",\"sex\":\"男\",\"findPlace\":\"中国地质大学\",\"findDate\":\"2017-08-07\",\"description\":\"帅\",\"lng\":114.384018,\"lat\":30.506981}";
        ClueGroup group = JSON.parseObject(jsonStr, ClueGroup.class);
        Clue clue = new Clue();
        System.out.println(group.getMissingIDList().get(0));
        System.out.println(((BigDecimal)group.getConfidenceList().get(0)).floatValue());
        clue.setConfidence(((BigDecimal)group.getConfidenceList().get(0)).floatValue());*/

        String json = "{\"num\":2,\"missingIDList\":[0,1],\"confidenceList\":[92.718,83.74],\"height\":\"174cm\",\"sex\":\"男\",\"findPlace\":\"中国地质大学\",\"findDate\":\"2017-08-01\",\"description\":\"胡赛\",\"lng\":114.384018,\"lat\":30.506981}";
        ClueGroup clueGroup = JSON.parseObject(json,ClueGroup.class);
        float confidence = ((BigDecimal)(clueGroup.getConfidenceList().get(1))).floatValue();
        System.out.println(confidence);
    }
}
