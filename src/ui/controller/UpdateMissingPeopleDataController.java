package ui.controller;

import dal.dao.MissingPeopleDao;
import model.entity.MissingPeople;
import org.python.antlr.ast.Str;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Kingdrone on 2017/8/7.
 */
@WebServlet(name = "UpdateMissingPeopleDataController")
public class UpdateMissingPeopleDataController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        // 获取表单数据
        String type = request.getParameter("mp-type");
        String name = request.getParameter("mp-name");
        String sex = request.getParameter("sex");
        String birthDate = request.getParameter("mp-birthdate");
        String height = request.getParameter("mp-height");
        String lostDate = request.getParameter("mp-lostdate");
        String missingPlace = request.getParameter("mp-missingplace-d");
        String description = request.getParameter("mp-description");
        String extraDes = request.getParameter("mp-extra-description");
        String missingID = request.getParameter("missingID");
        String longitude = request.getParameter("longitude");
        String latitude = request.getParameter("latitude");
        if(missingID == null){
            printWriter.print("未选中修改对象！");
            return;
        }
        MissingPeople missingPeople = new MissingPeople();
        missingPeople.setType(type);
        missingPeople.setMissingName(name);
        missingPeople.setSex(sex);
        missingPeople.setBirthDate(java.sql.Date.valueOf(birthDate));
        missingPeople.setHeight(height);
        missingPeople.setMissingDate(java.sql.Date.valueOf(lostDate));
        missingPeople.setMissingPlace(missingPlace);
        missingPeople.setDescription(description);
        missingPeople.setExtraData(extraDes);
        missingPeople.setLng(Double.parseDouble(longitude));
        missingPeople.setLat(Double.parseDouble(latitude));
        missingPeople.setMissingID(Integer.parseInt(missingID));
        MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
        if(missingPeopleDao.upDateMissingPeopleData(missingPeople)){
            printWriter.print("修改成功!");
            System.out.print("修改成功！");
            return;
        }else {
            printWriter.print("修改失败！");
        }

    }
}
