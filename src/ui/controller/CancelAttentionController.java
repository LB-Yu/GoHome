package ui.controller;

import dal.dao.AttentionDao;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
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
import java.util.ArrayList;
import java.util.List;

/**
 * @author Kingdrone
 *
 */
@WebServlet(name = "CancelAttentionController")
public class CancelAttentionController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setCharacterEncoding("utf-8");
        request.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("userName");             //获取session中userName
        if (userName == null){
            printWriter.print("请先登录！");
            System.out.print("请先登录!");
            return;
        }
        else {
            /*进行取消关心*/
            DiskFileItemFactory factory = new DiskFileItemFactory();
            ServletFileUpload upload = new ServletFileUpload(factory);
            try {
                List<FileItem> items = upload.parseRequest(request);
                System.out.print(items.size());
                if (items.size() > 0) {
                    for (FileItem item : items) {
                        if (item.getFieldName().equals("missingID")) {
                            int missingID = Integer.parseInt(item.getString());
                            AttentionDao attentionDao = new AttentionDao();
                            if (attentionDao.cancelAttention(userName,missingID)){
                                System.out.print("取消关心成功！");
                                printWriter.print("取消关心成功！");
                            }
                        }
                    }
                }
            } catch (FileUploadException e) {
                e.printStackTrace();
            }
        }

    }
}
