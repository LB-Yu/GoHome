package model.entity;

/**
 * @author Huleryo
 * @date 2017/7/1
 *
 * 用户实体类
 */
public class User {
    /**
     * 属性
     * */
    private String userName;    // 用户名
    private String password;    // 密码
    private String tel;         // 手机号码
    private String location;    // 所在地
    private String status;      // 登录状态

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public User() {}

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        User user = new User();
        System.out.println(user.getLocation());
        user.setLocation("湖北");
        System.out.println(user.getLocation());
    }
}
