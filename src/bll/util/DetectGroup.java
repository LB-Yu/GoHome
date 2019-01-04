package bll.util;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/8
 *
 * 人脸检测API所返回的Json实体,CommonOperate.detect...返回的Json实体
 */
public class DetectGroup {

    private String image_id;
    private String request_id;
    private int time_used;
    private String error_message;

    public String getError_message() {
        return error_message;
    }

    public void setError_message(String error_message) {
        this.error_message = error_message;
    }

    List<Face> faces = new ArrayList<>();

    public String getImage_id() {
        return image_id;
    }

    public void setImage_id(String image_id) {
        this.image_id = image_id;
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

    public List<Face> getFaces() {
        return faces;
    }

    public void setFaces(List<Face> faces) {
        this.faces = faces;
    }

    public void addFaces(Face faces) {
        this.faces.add(faces);
    }
}