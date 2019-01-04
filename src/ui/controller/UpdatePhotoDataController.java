package ui.controller;

import dal.dao.MissingPeopleDao;
import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Created by Kingdrone on 2017/8/8.
 */
@WebServlet(name = "UpdatePhotoData")
public class UpdatePhotoDataController extends HttpServlet {
    // 文件上传目录
    private static final String UPLOAD_DIRECTORY = "D:\\Work_Space\\JavaPro\\GoHome\\web\\libs\\image\\all_missing_people_photo";

    // 文件配置
    private static final int MAX_FILE_SIZE = 1024*1024*2;
    private static final int MAX_REQUEST_SIZE = 1024*1024*3;
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("utf-8");
        response.setCharacterEncoding("utf-8");

        PrintWriter printWriter = response.getWriter();
        int missingID = 0;

        // Check that we have a file upload request
        boolean isMultipart = ServletFileUpload.isMultipartContent(request);
        // if not a file upload request return
        if (!isMultipart)
            return;
        // 配置上传参数
        DiskFileItemFactory factory = new DiskFileItemFactory();

        ServletFileUpload upload = new ServletFileUpload(factory);
        // 设置上传文件最大值
        upload.setFileSizeMax(MAX_FILE_SIZE);
        // 设置最大请求文件（包含表单数据和文件）
        upload.setSizeMax(MAX_REQUEST_SIZE);
        // 中文处理
        upload.setHeaderEncoding("utf-8");
        // 构造临时目录存储上传文件
        String uploadPath = UPLOAD_DIRECTORY;
        // 如果目录不存在则创建
        File uploadDir = new File(uploadPath);
        if (!uploadDir.exists()){
            uploadDir.mkdir();
        }

        try {
            List<FileItem> formItems = upload.parseRequest(request);

            if (formItems!=null&&formItems.size()>0){
                //迭代提取missingID
                for(FileItem item:formItems){
                    if (item.getFieldName().equals("missingID")) {
                        missingID = Integer.parseInt(item.getString());
                    }
                }
                // 迭代表单数据
                for (FileItem item:formItems){
                    if (!item.isFormField()){
                        if(missingID == 0){
                            printWriter.print("请先选择修改对象！");
                            System.out.println("请先选择修改对象！");
                            return;
                        }
                        String filePath = UPLOAD_DIRECTORY + File.separator + missingID + ".jpg";
                        File storeFile = new File(filePath);
                        item.write(storeFile);
                        printWriter.print("照片更改成功！");
                        System.out.println("照片更改成功！");
                        return;
                    }
                }
            }
        } catch (Exception e){
            printWriter.print("照片更改失败！ "+"错误信息："+e.getMessage());
        }
    }
}
