package ui.controller;

import dal.dao.AttentionDao;
import dal.dao.IAttentionDao;
import model.entity.MissingPeople;
import model.entity.User;
import org.apache.commons.fileupload.FileItem;


import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * @author Kingdrone
 * @date 2017/07/26
 *
 *添加关注控制器
 */
@WebServlet(name = "AddAttentionController")
public class AddAttentionController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException{
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 配置上传参数
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter pw = response.getWriter();
        HttpSession session = request.getSession();  // Servlet 中获取 Session 对象
        String userName = (String) session.getAttribute("userName"); //获取Session中userName
        if (userName==null) {
            pw.print("请先登录！");
            return;
        } else {
            AttentionDao addAttention = new AttentionDao();      //建立DAO对象
            DiskFileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            try {
                List<FileItem> items = upload.parseRequest(request);
                System.out.println(items.size());
                if (items != null && items.size() > 0) {
                    for (FileItem item : items) {
                        if (item.getFieldName().equals("missingID")) {
                            int missingID = Integer.parseInt(item.getString());
                            if (addAttention.AddAttention(userName, missingID)) {
                                pw.print("添加关注成功！");
                                System.out.println("添加关注成功！");
                            }
                            else {
                                pw.print("添加失败，请不要重复添加");
                                System.out.println("添加失败，请不要重复添加！");
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
