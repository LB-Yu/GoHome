package ui.controller;

import bll.util.MissingPeopleGroup;
import com.alibaba.fastjson.JSON;
import dal.dao.MissingPeopleDao;
import model.entity.MissingPeople;
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
 * @date 2017/7/21
 *
 * 照片标注请求控制器
 */
@WebServlet(name = "PhotoMarkerController")
public class PhotoMarkerController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter  printWriter = response.getWriter();
        int gap = 0;
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            System.out.println(items.size());
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    if (item.getFieldName().equals("gap")) {
                        gap = Integer.parseInt(item.getString());
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (gap==0) {
            printWriter.print("间隔参数错误！");
        } else {
            MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
            List<MissingPeople> missingPeopleList = missingPeopleDao.findMissingIDLatlng(gap);
            MissingPeopleGroup group = new MissingPeopleGroup();
            group.setMissingPeopleList(missingPeopleList);
            String jsonStr = JSON.toJSONString(group);
            printWriter.print(jsonStr);
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
