package ui.controller;

import com.alibaba.fastjson.JSON;
import dal.dao.MissingPeopleDao;
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
 * @date 2017/8/2
 *
 * 实时图表数据控制器
 */
@WebServlet(name = "GraphController")
public class GraphController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        MissingPeopleDao dao = new MissingPeopleDao();
        String message = "";
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            System.out.println(items.size());
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    message = item.getString();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        // 获取近10日失踪人员数据
        if (message.equals("nearly 10 days")) {
            int[] numList = dao.getNearlyMissingNum(10);
            String jsonStr = JSON.toJSONString(numList);
            printWriter.print(jsonStr);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
