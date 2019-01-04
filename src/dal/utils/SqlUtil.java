package dal.utils;

/**
 * @author Huleryo
 * @date 2017/8/4
 *
 * sql语句生成类
 */
public class SqlUtil {

    /**
     * 通过同个字段的多个限制查询多条语句
     *
     * @param tableName 表名
     * @param field 字段名
     * @param n  限制条件个数
     * @return sql语句
     */
    public static String multiFields(String tableName, String field, int n, String extra) {
        String sql = "Select * from " + tableName +" where ";
        for (int i=0;i<n;i++) {
            if (i==0) {
                sql += field + "=? ";
            } else if (i==n-1) {
                if (extra!=null) {
                    sql += "or " + field + "=? " + extra + ";";
                } else {
                    sql += "or " + field + "=?;";
                }
            } else {
                sql += "or " + field + "=? ";
            }
        }
        return sql;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        //System.out.println(multiFields("user_table", "userName", 3,));
    }
}
