package ui.controller;

import com.alibaba.fastjson.JSON;
import dal.dao.AttentionDao;
import dal.dao.MissingPeopleDao;
import model.entity.MissingPeople;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created by Kingdrone on 2017/8/7.
 */
@WebServlet(name = "ShowRegistratedMissingPeopleDataController")
public class ShowRegistratedMissingPeopleDataController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("userName");             //获取session中userName
        if(userName == null){
            printWriter.print("请先登录！");
            return;
        }
        //开始根据userName查询missingID
        ArrayList<MissingPeople> missingPeopleList;
        MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        missingPeopleList = missingPeopleDao.findMissingPeopleByUserName(userName);
        String jsonStr = JSON.toJSONString(missingPeopleList);
        System.out.println(jsonStr);
        printWriter.print(jsonStr);
    }
}
