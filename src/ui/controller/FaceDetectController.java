package ui.controller;

import bll.service.FaceppService;
import bll.util.FileUtil;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import ui.utils.FileTypeJudge;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.List;

/**
 * @author Huleryo
 * @date 2017/7/21
 *
 * 人脸检测控制类
 */
@WebServlet(name = "FaceDetectController")
public class FaceDetectController extends HttpServlet {

    // 文件配置
    private static final int MAX_FILE_SIZE = 1024*1024*2;
    private static final int MAX_REQUEST_SIZE = 1024*1024*3;

    // 临时文件夹路径
    private static final String TEMP_UPLOAD_FILE_PATH = "G:\\GoHome\\web\\libs\\image\\temp_upload";

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");
        PrintWriter printWriter = response.getWriter();

        // Check that we have a file upload request
        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        // if not a file upload request return
        if (!isMultipart) {
            return;
        }

        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();

        ServletFileUpload upload = new ServletFileUpload(factory);
        // 设置上传文件最大值
        upload.setFileSizeMax(MAX_FILE_SIZE);
        // 设置最大请求文件（包含表单数据和文件）
        upload.setSizeMax(MAX_REQUEST_SIZE);
        // 中文处理
        upload.setHeaderEncoding("utf-8");

        try {
            List<FileItem> items = upload.parseRequest(request);

            if (items!=null&&items.size()>0) {
                // 迭代表单数据
                for (FileItem item:items) {
                    if (!item.isFormField()) {
                        InputStream  file = item.getInputStream();
                        if (FileTypeJudge.getType(file)==null) {
                            printWriter.print("图像格式错误！");
                            return;
                        } else {    // 照片格式正确进行人脸检测
                            FaceppService service = new FaceppService();
                            File uploadFile = new File(TEMP_UPLOAD_FILE_PATH);
                            if (!uploadFile.exists()) {
                                uploadFile.mkdir();
                            }
                            String filePath = TEMP_UPLOAD_FILE_PATH+File.separator+item.getName();
                            File tempFile = new File(filePath);
                            item.write(tempFile);
                            String result = service.getFaceToken(
                                    FileUtil.getBytesFromFile(tempFile));
                            // 删除临时文件
                            tempFile.delete();
                            if (result==null) {
                                printWriter.print("未检测到人脸！");
                                return;
                            } else {
                                if (result.equals("multi-faces")) {
                                    printWriter.print("检测到多个人脸！");
                                    return;
                                } else if (request.equals("CONCURRENCY_LIMIT_EXCEEDED")) {
                                    printWriter.print("网络请求错误！");
                                    return;
                                } else {
                                    printWriter.print("成功检测到人脸！");
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            printWriter.print("网络未连接！");
        }
    }
}
