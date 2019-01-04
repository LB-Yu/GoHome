package bll.util;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/17.
 *
 * 人脸搜索返回的Json所对应的实体
 */
public class FaceSearchGroup {

    private String request_id;
    private String time_used;
    private List<Result> results = new ArrayList<>();

    public String getRequest_id() {
        return request_id;
    }

    public void setRequest_id(String request_id) {
        this.request_id = request_id;
    }

    public String getTime_used() {
        return time_used;
    }

    public void setTime_used(String time_used) {
        this.time_used = time_used;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}
