package ui.controller;

import bll.service.SpiderService;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * @author Huleryo
 * @date 2017/7/31
 *
 * 爬取系统控制器
 */
@WebServlet(name = "SpiderController")
public class SpiderController extends HttpServlet {
    @Override
    public void init(ServletConfig config) {
        System.out.println("爬取系统开启");
        SpiderService spiderService = new SpiderService("G:\\GoHome\\src\\bll\\PythonSpider\\spider.py");
        spiderService.onSpiderSystem(23,30,0,12*60*60);
    }
}
