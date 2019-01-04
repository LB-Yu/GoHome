package bll.service;

import bll.util.TimeUtil;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.Calendar;
import java.util.Timer;
import java.util.TimerTask;

/**
 * @author Huleryo
 * @date 2017/7/31
 *
 * 数据爬取服务
 */
public class SpiderService {

    private String command;

    public SpiderService(String path) {
        command = "python " + path;
    }

    /**
     * 执行爬取任务
     * */
    public void executeSpider() throws IOException{
        Process process = Runtime.getRuntime().exec(command);
        InputStreamReader ir = new InputStreamReader(process.getInputStream());
        LineNumberReader input = new LineNumberReader(ir);
        String line;
        while((line = input.readLine()) != null)
            System.out.println(line);
        input.close();
        ir.close();
    }

    /**
     * 开启爬取系统
     *
     * @param hour 小时，24小时制
     * @param minute 分钟
     * @param second 秒
     * @param period 执行周期，以秒为单位
     * */
    public void onSpiderSystem(int hour, int minute, int second, int period) {
        Calendar calendar = TimeUtil.getCalender(hour,minute,second);
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                try {
                    executeSpider();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }, calendar.getTime(), period*1000);
    }

    public static void main(String[] args) {
        SpiderService spiderService = new SpiderService("G:\\GoHome\\src\\bll\\PythonSpider\\spider.py");
        try {
            spiderService.executeSpider();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //spiderService.onSpiderSystem();
    }
}
