package bll.service;

import bll.util.MissingPeopleGroup;
import com.alibaba.fastjson.JSON;
import dal.dao.MissingPeopleDao;
import model.entity.MissingPeople;

import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/14
 *
 * 失踪人员相关逻辑操作
 */
public class MissingPeopleService {

    // 用于数据库查询
    private MissingPeopleDao missingPeopleDao = new MissingPeopleDao();

    /**
     * 获取失踪人员信息中的寻亲编号和经纬度
     *
     *@return json列表字符串
     */
    public String getIDAndLatlngJson() {
        List<MissingPeople> missingPeopleList = missingPeopleDao.findAllMissingPeople();
        MissingPeopleGroup missingPeopleGroup = new MissingPeopleGroup();
        missingPeopleGroup.setMissingPeopleList(missingPeopleList);
        String jsonStr = JSON.toJSONString(missingPeopleGroup);
        return jsonStr;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        MissingPeopleService missingPeopleService = new MissingPeopleService();
        System.out.println(missingPeopleService.getIDAndLatlngJson());
    }
}
