package ui.controller;

import dal.dao.AttentionDao;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;


/**
 * Created by Kingdrone on 2017/7/29.
 */
@WebServlet(name = "ReFreshAttentionController")
public class ReFreshAttentionController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        String userName = (String)session.getAttribute("userName");
        System.out.println(userName);
        if(userName ==null) {
            printWriter.print("请先登录！");
            System.out.println("请先登录！");
        }else {
            /*进行显示关心人员列表*/
            AttentionDao attentionDao = new AttentionDao();
            ArrayList missingPeopleIDList = attentionDao.FindAttentionByUserName(userName);
            printWriter.print(missingPeopleIDList);
            System.out.println("成功显示关系人员列表!");
        }
    }
}
