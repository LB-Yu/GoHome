package ui.utils;

import com.alibaba.fastjson.JSON;
import dal.dao.AttentionDao;
import dal.dao.MissingPeopleDao;
import model.entity.Clue;
import model.entity.User;
import ui.controller.Chat;

import java.math.BigDecimal;
import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/8/7
 *
 * 新上传的线索广播类
 */
public class ClueBroadcastUtil {


    /**
     * 将线索广播给关注涉及失踪人员的用户
     *
     * @param group 前台传送过来的线索实体类
     * @param clueID 当前线索的clueID
     * @param provider 线索提供者的用户名
     * */
    public static void brodcastClue(ClueGroup group, int clueID, String provider) {
        List missingIDList = group.getMissingIDList();
        // 对每一个missingID循环
        for (int i=0;i<missingIDList.size();i++) {
            // 查询关注该missingID的用户
            AttentionDao attentionDao = new AttentionDao();
            List<User> userList = attentionDao.getAllAttentionUser((int)missingIDList.get(i));
            MissingPeopleDao missingPeopleDao = new MissingPeopleDao();
            User user = new User();
            user.setUserName(missingPeopleDao.findByID((int)missingIDList.get(i)).getUserName());
            userList.add(user);
            if (userList.size()==0) {
                continue;
            }
            SimpleDateFormat sdf = new SimpleDateFormat("yy-MM-yy");
            java.util.Date date = null;
            try {
                //System.out.println(group.getFindDate());
                date = sdf.parse(group.getFindDate());
                //System.out.println(date);
            } catch (ParseException e) {
                e.printStackTrace();
            }
            Date findDate = new Date(date.getTime());
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
            clue.setUserName(provider);
            clue.setLng(group.getLng());
            clue.setLat(group.getLat());
            // 向每个用户广播
            for (int j=0;j<userList.size();j++) {
                List<Clue> clueList = new ArrayList<>();
                clueList.add(clue);
                String clueStr = JSON.toJSONString(clueList);
                MessageGroup messageGroup = new MessageGroup();
                messageGroup.setExtra("clue");
                messageGroup.setTo(userList.get(j).getUserName());
                messageGroup.setMessage(clueStr);
                String msgStr = JSON.toJSONString(messageGroup);
                Chat.broadcast(msgStr);
            }
        }
    }

    public static void main(String[] args) {

    }
}
