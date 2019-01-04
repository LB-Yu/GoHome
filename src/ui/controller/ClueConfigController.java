package ui.controller;

import bll.service.ChatService;
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
 * 线索认证请求
 */
@WebServlet(name = "ClueConfigController")
public class ClueConfigController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        int missingID = -1;
        int clueID = -1;
        int state = -1;
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            System.out.println(items.size());
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    if (item.getFieldName().equals("missingID")) {
                        missingID = Integer.parseInt(item.getString());
                    }
                    if (item.getFieldName().equals("clueID")) {
                        clueID = Integer.parseInt(item.getString());
                    }
                    if (item.getFieldName().equals("state")) {
                        state = Integer.parseInt(item.getString());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (missingID!=-1&&clueID!=-1) {
            String userName = (String)request.getSession().getAttribute("userName");
            ChatService service = new ChatService();
            String result = service.configClue(userName, missingID, clueID,state);
            if (result.equals("successfully")) {
                printWriter.print("修改成功！");
            } else if (result.equals("permission_deny")) {
                printWriter.print("您不是该失踪的人员信息的登记者，无权确认本条线索！");
            } else {
                printWriter.print("未知错误！");
            }
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
