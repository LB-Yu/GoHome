package ui.controller;

import bll.service.UserFriendsService;
import com.alibaba.fastjson.JSON;
import model.entity.User;
import model.utils.UserGroup;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/24
 *
 * 聊天信息初始化控制器
 */
@WebServlet(name = "ChatInitController")
public class ChatInitController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        String userName = (String)request.getSession().getAttribute("userName");
        String message = "";
        PrintWriter printWriter = response.getWriter();
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    // 获取客户端消息类型
                    if (item.getFieldName().equals("message")) {
                        message = item.getString();
                    }
                }
            }
        } catch (FileUploadException e) {
            e.printStackTrace();
        }

        // 处理客户端请求
        if (message.equals("initFriendsList")) {
            initFriendsList(userName, printWriter);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    /**
     * 向客户端发送好友列表json数据
     * */
    public void initFriendsList(String userName, PrintWriter printWriter){
        UserFriendsService service = new UserFriendsService();
        List<User> userList = service.getAllFriendsWithTel(userName);
        UserGroup group = new UserGroup();
        group.setUserList(userList);
        String jsonStr = JSON.toJSONString(group);
        printWriter.print(jsonStr);
    }
}
