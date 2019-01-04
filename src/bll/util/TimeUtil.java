package bll.util;

import java.util.Calendar;
import java.util.Timer;
import java.util.TimerTask;

/**
 * @author Huleryo
 * @date 2017/7/31
 *
 * 时间处理类
 */
public class TimeUtil {

    /**
     * 获取指定时间Calendar
     *
     * @param hour 小时，24小时制
     * @param minute 分钟
     * @param second 秒
     * @return Calender对象
     * */
    public static Calendar getCalender(int hour, int minute, int second) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, hour);
        calendar.set(Calendar.MINUTE, minute);
        calendar.set(Calendar.SECOND, second);
        return calendar;
    }

    public static void main(String[] args) {
       /* Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 21);
        calendar.set(Calendar.MINUTE, 25);
        calendar.set(Calendar.SECOND, 59);

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                System.out.println("执行");
            }
        }, calendar.getTime(), 1000);*/
       getCalender(10,10,10);
    }
}
