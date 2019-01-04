package ui.controller;

import bll.service.UserService;
import model.entity.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * @author Huleryo
 * @date 2017/7/13
 *
 * 用户登录控制类
 */
@WebServlet(name = "UserRegisterController")
public class UserRegisterController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        String userName = request.getParameter("userName");
        String tel = request.getParameter("tel");
        String location = request.getParameter("location");
        String password = request.getParameter("password");
        UserService userService = new UserService();
        PrintWriter printWriter = response.getWriter();
        System.out.println(userName);
        System.out.println(tel);
        System.out.println(location);
        System.out.println(password);
        if (userService.isUserExist(userName)) {
            printWriter.print("用户名已存在！");
            return;
        }
        if ((!tel.equals(""))&&(!location.equals(""))&&(!password.equals(""))) {
            User user = new User();
            user.setUserName(userName);
            user.setTel(tel);
            user.setLocation(location);
            user.setPassword(password);
            if (userService.addUser(user)) {
                HttpSession session = request.getSession();
                session.setAttribute("userName",userName);
                printWriter.print("注册成功");
            } else {
                printWriter.print("注册失败");
            }
        }
    }
}
