package ui.controller;

import dal.dao.MissingPeopleDao;
import org.python.antlr.ast.Str;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Kingdrone on 2017/8/8.
 */
@WebServlet(name = "TagFoundController")
public class TagFoundController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        String userName = (String) session.getAttribute("userName");
        if(userName == null){
            printWriter.print("请先登录！");
            return;
        }
        String missingID = request.getParameter("missingID");
        if(missingID == null){
            printWriter.print("未选中修改对象！");
            return;
        }
        MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        //更改状态
        boolean check = missingPeopleDao.upDateMissingPeopleStage(Integer.parseInt(missingID));
        if(check){
            System.out.println("标记为已找到！");
            printWriter.print("标记为已找到！");
        }else {
            System.out.println("标记失败！");
            printWriter.println("标记失败");
        }
        return;

    }
}
