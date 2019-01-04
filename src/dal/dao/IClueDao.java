package dal.dao;

import model.entity.Clue;

import java.util.List;

/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * 失踪人员线索数据接口，对应clue_table
 */
public interface IClueDao {
    /**
     * 插入记录
     *
     * @param clue 需要插入的记录
     * @return true 插入成功
     *          false 插入失败
     * */
    boolean addClue(Clue clue);

    /**
     * 修改状态
     *
     * @param state 线索状态，0未确认，1确认是，2确认否
     * @return true 修改成功
     *          false 修改失败
     * */
    boolean updateState(int state, int missingID, int clueID);

    /**
     * 根据missingID列表查询线索,并按上传时间逆序排列
     *
     * @param missingIDList missingID列表
     * @return 查询到的线索列表
     * */
    List<Clue> getClueByMissingIDList(List missingIDList);

    /**
     * 根据missingID与clueID查找线索记录
     *
     * @param missingID 需要查找记录的missingID
     * @param clueID 需要查找记录的clueID
     * @return clue 查找到的记录
     *          null 未查找到记录
     * */
    Clue getByMissingID(int missingID, int clueID);

    /**
     * 查找最大的clueID
     *
     * @return -1 查找失败
     *          clueID 查找成功
     * */
    int getMaxClueID();
}
