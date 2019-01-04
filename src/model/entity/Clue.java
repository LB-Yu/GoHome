package model.entity;

import java.sql.Date;

/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * 线索实体类
 */
public class Clue {

    private int missingID;
    private float confidence;
    private String height;
    private String sex;
    private Date findDate;
    private String findPlace;
    private int clueState;
    private String description;
    private int clueID;
    private Date uploadDate;
    private String userName;
    private double lat;
    private double lng;

    public double getLat() {
        return lat;
    }

    public void setLat(double lat) {
        this.lat = lat;
    }

    public double getLng() {
        return lng;
    }

    public void setLng(double lng) {
        this.lng = lng;
    }



    public int getMissingID() {
        return missingID;
    }

    public void setMissingID(int missingID) {
        this.missingID = missingID;
    }

    public float getConfidence() {
        return confidence;
    }

    public void setConfidence(float confidence) {
        this.confidence = confidence;
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

    public Date getFindDate() {
        return findDate;
    }

    public void setFindDate(Date findDate) {
        this.findDate = findDate;
    }

    public String getFindPlace() {
        return findPlace;
    }

    public void setFindPlace(String findPlace) {
        this.findPlace = findPlace;
    }

    public int getClueState() {
        return clueState;
    }

    public void setClueState(int clueState) {
        this.clueState = clueState;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getClueID() {
        return clueID;
    }

    public void setClueID(int clueID) {
        this.clueID = clueID;
    }

    public Date getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(Date uploadDate) {
        this.uploadDate = uploadDate;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
