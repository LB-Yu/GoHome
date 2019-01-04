package bll.util;

/**
 * @author Huleryo
 * @date 2017/7/8
 *
 * faces实体
 */
public class Face {

    private FaceRectangle face_rectangle = new FaceRectangle();
    private String face_token;

    public FaceRectangle getFace_rectangle() {
        return face_rectangle;
    }

    public void setFace_rectangle(FaceRectangle face_rectangle) {
        this.face_rectangle = face_rectangle;
    }

    public String getFace_token() {
        return face_token;
    }

    public void setFace_token(String face_token) {
        this.face_token = face_token;
    }
}
