package bll.util;

import com.alibaba.fastjson.JSON;
import model.entity.MissingPeople;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/14
 *
 * 失踪人员信息json实体，数据库查询获得
 */
public class MissingPeopleGroup {
    private List<MissingPeople> missingPeopleList = new ArrayList<>();

    public List<MissingPeople> getMissingPeopleList() {
        return missingPeopleList;
    }

    public void setMissingPeopleList(List<MissingPeople> missingPeopleList) {
        this.missingPeopleList = missingPeopleList;
    }

    public void addMissingPeople(MissingPeople missingPeople) {
        missingPeopleList.add(missingPeople);
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        MissingPeople m = new MissingPeople();
        m.setMissingID(123);
        m.setLat(2.58);
        m.setLng(5.58);
        m.setMissingName("yu");
        MissingPeopleGroup mg = new MissingPeopleGroup();
        mg.addMissingPeople(m);
        String s = JSON.toJSONString(mg);
        System.out.println(s);
    }
}
