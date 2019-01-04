package bll.service;

import com.alibaba.fastjson.JSON;
import dal.dao.AttentionDao;
import dal.dao.ClueDao;
import dal.dao.MissingPeopleDao;
import model.entity.Clue;
import model.entity.MissingPeople;

import java.util.List;

/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * 消息推送相关业务逻辑
 */
public class ChatService {

    private AttentionDao attentionDao = new AttentionDao();
    private ClueDao clueDao = new ClueDao();
    private MissingPeopleDao missingPeopleDao = new MissingPeopleDao();

    /**
     * 查询当前用户关注失踪人员以及上传失踪人员是否有最新线索
     *
     * @param userName 用户名
     * @return null 无最新线索
     *          json string
     * */
    public String getLatestClue(String userName) {
        // 查找用户关心的失踪人员
        List attentionList = attentionDao.FindAttentionByUserName(userName);
        // 查找用户上传的失踪人员
        List<MissingPeople> uploadList = missingPeopleDao.findMissingPeopleByUserName(userName);
        System.out.println(JSON.toJSONString(uploadList));
        String result;
        if (attentionList.size()<=0&&uploadList.size()<=0) {
            return null;
        }
        if (uploadList!=null&&uploadList.size()>0) {
            for (int i=0;i<uploadList.size();i++) {
                attentionList.add(uploadList.get(i).getMissingID());
            }
        }
        List<Clue> clueList = clueDao.getClueByMissingIDList(attentionList);
        result = JSON.toJSONString(clueList);
        return result;
    }

    /**
     * 确认线索状态
     *
     * @param userName 发起确认请求的用户名
     * @param missingID 相关线索的missingID
     * @param clueID 相关线索的clueID
     * @param state 需要修改的状态
     * @return successfully 修改成功
     *          permission_deny 权限不允许
     *          failed 未知错误
     * */
    public String configClue(String userName, int missingID, int clueID, int state) {
        Clue clue = clueDao.getByMissingID(missingID, clueID);
        MissingPeople missingPeople = missingPeopleDao.findByID(missingID);
        // 权限不允许
        if (!userName.equals(missingPeople.getUserName())) {
            return "permission_deny";
        }
        // 权限允许，进行修改
        boolean b = clueDao.updateState(state, missingID, clueID);
        if (b==true) {
            return "successfully";
        } else {
            return "failed";
        }
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        ChatService chatService = new ChatService();
        System.out.println(chatService.getLatestClue("user1"));
    }
}
