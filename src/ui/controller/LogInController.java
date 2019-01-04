package ui.controller;

import bll.service.UserService;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author Huleryo
 * @date 2017/7/1
 *
 * 用户登录控制类
 */

@WebServlet(name = "LogInController")
public class LogInController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        String userName = request.getParameter("userName");
        String password = request.getParameter("password");
        String isRemember = request.getParameter("isRemember");
        UserService userService = new UserService();
        PrintWriter printWriter = response.getWriter();
        if (userService.isUserExist(userName)){
            if (userService.validLogIn(userName, password)){
                HttpSession session = request.getSession();
                session.setAttribute("userName", userName);
                // 记住用户名和密码,若点击记住则isRemember的值为on
                if (isRemember!=null){
                    session.setAttribute("isRemember", "true");
                    session.setAttribute("password", password);
                }
            }else { // 密码错误
                // 返回密码错误信息
                printWriter.print("密码错误！");
                /*request.getRequestDispatcher("login.jsp").
                        forward(request, response);*/
                return;
            }
        }else { // 用户名不存在
            // 返回用户名不存在信息
            printWriter.print("用户名不存在！");
            /*request.getRequestDispatcher("login.jsp").
                    forward(request, response);*/
            return;
        }
        // 登录成功，返回用户名
        printWriter.print(userName);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        HttpSession session = request.getSession();
        session.setAttribute("userName", null);
        printWriter.print("注销成功！");
    }
}
