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
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/8/1
 *
 * 今日推荐控制器
 */
@WebServlet(name = "DailyRecommendationController")
public class DailyRecommendationController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("userName");

        MissingPeopleDao dao = new MissingPeopleDao();
        List<MissingPeople> missingPeopleList = dao.getDailyRecommendation();
        MissingPeopleGroup group = new MissingPeopleGroup();
        group.setMissingPeopleList(missingPeopleList);
        String jsonStr = JSON.toJSONString(group);
        printWriter.print(jsonStr);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
