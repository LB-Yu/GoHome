package model.entity;

import javax.servlet.annotation.WebServlet;
import java.sql.Date;

/**
 * @author Kingdrone,Huleryo
 * @date 2017/7/11-12
 *
 * 失踪人员实体类
 */
public class MissingPeople {
    /**
     * 属性
     */
    private int  missingID;
    private String type;
    private String missingName;
    private String sex;
    private Date birthDate;
    private String height;
    private Date missingDate;
    private String missingPlace;
    private String description;
    private String extraData;
    private Date  registrationDate;
    private double lng;
    private double lat;
    private int hasPhoto;
    private float confidence;
    private String userName;
    private int missingPeopleState;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public int getMissingPeopleState() {
        return missingPeopleState;
    }

    public void setMissingPeopleState(int missingPeopleState) {
        this.missingPeopleState = missingPeopleState;
    }

    public float getConfidence() {
        return confidence;
    }

    public void setConfidence(float confidence) {
        this.confidence = confidence;
    }

    public MissingPeople() {}

    public int getMissingID() {
        return missingID;
    }

    public void setMissingID(int missingID) {
        this.missingID = missingID;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMissingName() {
        return missingName;
    }

    public void setMissingName(String missingName) {
        this.missingName = missingName;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public Date getMissingDate() {
        return missingDate;
    }

    public void setMissingDate(Date missingDate) {
        this.missingDate = missingDate;
    }

    public String getMissingPlace() {
        return missingPlace;
    }

    public void setMissingPlace(String missingPlace) {
        this.missingPlace = missingPlace;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExtraData() {
        return extraData;
    }

    public void setExtraData(String extraData) {
        this.extraData = extraData;
    }

    public Date getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(Date registrationDate) {
        this.registrationDate = registrationDate;
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

    public int getHasPhoto() {
        return hasPhoto;
    }

    public void setHasPhoto(int hasPhoto) {
        this.hasPhoto = hasPhoto;
    }
}
