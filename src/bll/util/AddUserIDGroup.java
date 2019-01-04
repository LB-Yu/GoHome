package bll.util;

/**
 * @author Huleryo
 * @date 2017/7/11
 *
 * 为face_token添加user_id返回的Json实体
 */
public class AddUserIDGroup {
    private String user_id;
    private String request_id;
    private int time_used;
    private String face_token;

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    public String getRequest_id() {
        return request_id;
    }

    public void setRequest_id(String request_id) {
        this.request_id = request_id;
    }

    public int getTime_used() {
        return time_used;
    }

    public void setTime_used(int time_used) {
        this.time_used = time_used;
    }

    public String getFace_token() {
        return face_token;
    }

    public void setFace_token(String face_token) {
        this.face_token = face_token;
    }
}