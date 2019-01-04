package ui.controller;

import dal.dao.UserFriendsDao;
import org.apache.commons.fileupload.FileItem;
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
 * @date 2017/8/5
 *
 * 好友添加控制器
 */
@WebServlet(name = "AddFriendsController")
public class AddFriendsController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        String user1 = "";
        String user2 = "";
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            System.out.println(items.size());
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    if (item.getFieldName().equals("user1")) {
                        user1 = item.getString();
                    }
                    if (item.getFieldName().equals("user2")) {
                        user2 = item.getString();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (!user1.equals("")&&!user2.equals("")) {
            UserFriendsDao dao = new UserFriendsDao();
            boolean b1 = dao.addFriend(user1, user2);
            boolean b2 = dao.addFriend(user2, user1);
            if (b1==true&&b2==true) {
                printWriter.print("添加成功！");
            } else {
                printWriter.print("添加失败！");
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
