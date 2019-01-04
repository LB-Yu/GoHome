package dal.dao;

import bll.util.Result;
import model.entity.MissingPeople;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Kingdrone, Huleryo
 * @date 2017/7/11-12
 *
 * 失踪人员数据接口,对应missing_people_data_table
 */
public interface IMissingPeopleDao {
    /**
     * 返回所有失踪人员信息
     * */
    List<MissingPeople> findAllMissingPeople();

    /**
     * 通过寻亲编号查找记录
     *
     * @param missingID 寻亲编号
     * @return 查找到的记录
     * */
    MissingPeople findByID(int missingID);

    /**
     * 通过人脸搜索返回的结果中的user_id搜索失踪人员信息,并添加confidence
     *
     * @param results 结果列表，长度必须为5
     * @return 搜索到的失踪人员列表
     * */
    List<MissingPeople> findByIDArr(List<Result> results);

    /**
     * 添加记录
     *
     * @param missingPeople  需要添加的记录
     * @return true添加成功，false添加失败
     * */
    boolean add(MissingPeople missingPeople);

    /**
     * 查询数据库中missingID的最大值
     *
     * @return missingID的最大值 成功
     *          -1 失败
     * */
    int findMaxMissingID();

    /**
     * 查找missingID及lng lat
     *
     * @param gap 查询间隔
     * @return 查询到的失踪人员列表
     * */
    List<MissingPeople> findMissingIDLatlng(int gap);

    /**
     * 查询今日推荐失踪人员
     *
     * @return 返回最近失踪的九个人
     * */
    List<MissingPeople> getDailyRecommendation();

    /**
     * 返回最近n天的失踪人员人数
     *
     * @param n 最近n天,n从1开始表示今天
     * @return 最近n天的失踪人数，按日期最远至最近的顺序排列
     * */
    int[] getNearlyMissingNum(int n);

    /**
     * 更新失踪人员信息
     * @param missingPeople 失踪人员
     * @return 成功与否
     */
    boolean upDateMissingPeopleData(MissingPeople missingPeople);

    /**
     * 标记为已找到
     * @return 标记成功与否
     */
    boolean upDateMissingPeopleStage(int missingID);

    /**
     * 根据userName找注册者的失踪人员
     * @param userName 注册者用户名
     * @return 失踪人员列表
     */
    ArrayList<MissingPeople> findMissingPeopleByUserName(String userName);
}
