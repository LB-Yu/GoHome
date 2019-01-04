package dal.dao;

import model.entity.MissingPeople;
import model.entity.User;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kingdrone on 2017/7/26.
 */
public interface IAttentionDao {
    /**
     * 添加关注
     * @param userName  用户名
     * @param missingID 失踪人员ID
     * @return          true 成功
     *                  false 失败
     */
    boolean AddAttention(String userName, int missingID);

    /**
     * 检查是否已关注
     * @param userName 用户名
     * @param missingID 失踪人员ID
     * @return          true 已关注
     *                  false 未关注
     */
    boolean CheckAttention(String userName, int missingID);


    /**
     * 取消关注
     *
     * @param userName 用户名
     * @param missingID 失踪人员ID
     * @return true 成功
     *          false 失败
     * */
    boolean cancelAttention(String userName, int missingID);

    /**
     * 根据userName查询失踪人员
     * @param userName
     * @return 失踪人员ID list
     */
    ArrayList FindAttentionByUserName(String userName);

    /**
     * 查找所有关注给定missingID的用户
     * */
    List<User> getAllAttentionUser(int missingID);
}
