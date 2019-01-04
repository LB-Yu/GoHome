package ui.controller;

import dal.dao.IMissingPeopleDao;
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
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author Kingdrone
 * @date 2017/7/21
 *
 * 用户注册控制类
 */
@WebServlet(name = "MissingPeopleRegistrationController")
public class MissingPeopleRegistrationController extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        String userName = (String)request.getSession().getAttribute("userName");
        if (userName==null) {
            printWriter.print("请先登录！");
            return;
        }
        //获取最大的missingID
        MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        int maxMissingID = missingPeopleDao.findMaxMissingID() + 1;
        // 获取表单数据
        String type = request.getParameter("mp-type");
        String name = request.getParameter("mp-name");
        String sex = request.getParameter("mp-sex");
        String birthDate = request.getParameter("mp-birthdate");
        String height = request.getParameter("mp-height");
        String lostDate = request.getParameter("mp-lostdate");
        String missingPlace = request.getParameter("mp-missingplace-p")+","+request.getParameter("mp-missingplace-c")+","+request.getParameter("mp-missingplace-d");
        String description = request.getParameter("mp-description");
        String extra_Des = request.getParameter("mp-extra-description");
        // 注册时间
        Date nowTime = new Date();
        SimpleDateFormat matter = new SimpleDateFormat("yyyy-MM-dd");
        String registrationDate=(matter.format(nowTime));
        // 经纬度
        double lng = Float.parseFloat(request.getParameter("lng"));
        double lat = Float.parseFloat(request.getParameter("lat"));

        MissingPeople ms = new MissingPeople();
        ms.setMissingID(maxMissingID);
        ms.setType(type);
        ms.setMissingName(name);
        ms.setSex(sex);
        ms.setBirthDate(java.sql.Date.valueOf(birthDate));
        ms.setHeight(height);
        ms.setMissingDate(java.sql.Date.valueOf(lostDate));
        ms.setMissingPlace(missingPlace);
        ms.setDescription(description);
        ms.setExtraData(extra_Des);
        ms.setRegistrationDate(java.sql.Date.valueOf(registrationDate));
        ms.setHasPhoto(1);
        ms.setLng(lng);
        ms.setLat(lat);
        ms.setUserName(userName);
        boolean result = missingPeopleDao.add(ms);
        System.out.println(result);
        if (result) {
            printWriter.print("信息登记成功！");
        } else {
            printWriter.print("信息登记失败！");
        }
    }
}
