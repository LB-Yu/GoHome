package bll.util;

/**
 * @author Huleryo
 * @date on 2017/7/17.
 *
 * 人脸搜索返回结果
 */
public class Result {
    private float confidence;
    private String user_id;
    private String face_token;

    public float getConfidence() {
        return confidence;
    }

    public void setConfidence(float confidence) {
        this.confidence = confidence;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getFace_token() {
        return face_token;
    }

    public void setFace_token(String face_token) {
        this.face_token = face_token;
    }
}
