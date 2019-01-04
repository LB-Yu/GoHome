package ui.controller;

import com.alibaba.fastjson.JSON;
import dal.dao.ClueDao;
import model.entity.Clue;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import ui.utils.ClueBroadcastUtil;
import ui.utils.ClueGroup;
import ui.utils.MessageGroup;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.logging.SimpleFormatter;

/**
 * @author Huleryo
 * @date 2017/8/7
 *
 * 线索提供控制器
 */
@WebServlet(name = "AddClueController")
public class AddClueController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();
        String userName = (String) request.getSession().getAttribute("userName");
        if (userName==null) {
            printWriter.print("请先登录系统！");
            return;
        }
        String message = "";

        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();
        ServletFileUpload upload = new ServletFileUpload(factory);
        try {
            List<FileItem> items = upload.parseRequest(request);
            if (items!=null&&items.size()>0) {
                for (FileItem item:items) {
                    if (item.getFieldName().equals("message")) {
                        message = URLDecoder.decode(item.getString(), "utf-8");
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        ClueGroup group = null;
        int clueID = -1;
        boolean result = true;
        if (!message.equals("")) {
            group = JSON.parseObject(message, ClueGroup.class);
            SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-dd");
            java.util.Date date = null;
            try {
                date = sdf.parse(group.getFindDate());
            } catch (ParseException e) {
                e.printStackTrace();
            }
            Date findDate = new Date(date.getTime());
            ClueDao dao = new ClueDao();
            clueID = dao.getMaxClueID() + 1;
            for (int i=0;i<group.getNum();i++) {
                Clue clue = new Clue();
                clue.setMissingID((int)(group.getMissingIDList().get(i)));
                clue.setConfidence(((BigDecimal)group.getConfidenceList().get(i)).floatValue());
                clue.setHeight(group.getHeight());
                clue.setSex(group.getSex());
                clue.setFindDate(findDate);
                clue.setFindPlace(group.getFindPlace());
                clue.setClueState(0);
                clue.setDescription(group.getDescription());
                clue.setClueID(clueID);
                clue.setUploadDate(new Date((new java.util.Date()).getTime()));
                clue.setUserName(userName);
                clue.setLng(group.getLng());
                clue.setLat(group.getLat());
                boolean b = dao.addClue(clue);
                if (b==false) {
                    result = false;
                }
            }
        }

        if (result==true) { // 所有线索插入成功
            printWriter.print("线索提交成功！");
            // 向关注线索涉及的失踪人员的用户广播最新信息
            ClueBroadcastUtil.brodcastClue(group, clueID, userName);
        } else {    // 存在插入失败的线索
            printWriter.print("线索提交失败！");
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }
}
