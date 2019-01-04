package bll.util;

import com.alibaba.fastjson.JSON;
import com.megvii.cloud.http.CommonOperate;
import com.megvii.cloud.http.FaceOperate;
import com.megvii.cloud.http.FaceSetOperate;
import com.megvii.cloud.http.Response;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;

import static bll.util.FileUtil.getBytesFromFile;

/**
 * @author Huleryo
 * @date 2017/7/10
 *
 * 静态类
 * Face++相关预处理
 */
public class FaceppUtil {

    private static final String API_KEY = "Z9lN8z_iD8exwYxpT1CiLv3s5bZZ0bT-";
    private static final String API_SECRET = "LUZTTBb5idZn8mC7ED8Pe_dnGpj_Iuu3";

    /**
     * @param faceSetName 自定义FaceSet名称，可唯一标识
     *                    打印返回的Json字符串
     *                    <p>
     *                    创建FaceSet
     */
    public static void createFaceSet(String faceSetName) {
        FaceSetOperate faceSetOperate = new FaceSetOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = faceSetOperate.createFaceSet(null, faceSetName,
                    null, null, null, 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String json = new String(response.getContent());
        System.out.println(json);
    }

    /**
     * @param outerID 需要删除FaceSet的outer_id
     *                <p>
     *                删除FaceSet,并打印返回信息
     */
    public static void deleteFaceSet(String outerID) {
        FaceSetOperate operate = new FaceSetOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = operate.deleteFaceSetByOuterId(outerID, 0);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
    }

    /**
     * @param faceSetName 需要获取的FaceSet自定义名称
     *                    输出返回的Json字符串
     *                    <p>
     *                    由自定义FaceSet名称获取FaceSet的详细信息
     */
    public static void getFaceSets(String faceSetName) {
        FaceSetOperate faceSetOperate = new FaceSetOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = faceSetOperate.getDetailByOuterId(faceSetName);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String json = new String(response.getContent());
        System.out.println(json);
    }

    /**
     * @param fileByte 图片文件的byte
     * @return 照片face_token, 请求错误返回null
     * <p>
     * 获取一张照片的face_token，返回Json对应DetectGroup
     */
    public static String getFaceToken(byte[] fileByte) {
        CommonOperate operate = new CommonOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = operate.detectByte(fileByte, 0, null);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
        DetectGroup group = JSON.parseObject(jsonStr, DetectGroup.class);
        if (group.getFaces().size() > 0) {
            List<Face> faces = group.getFaces();
            return faces.get(0).getFace_token();
        } else {
            return null;
        }
    }

    /**
     * @param faceToken 需要添加user_id的face_token
     * @param userId    user_id
     * @return true添加成功
     * <p>
     * 为指定face_token添加user_id
     */
    public static boolean addUserId(String faceToken, String userId) {
        FaceOperate faceOperate = new FaceOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = faceOperate.faceSetUserId(faceToken, userId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
        AddUserIDGroup group = JSON.parseObject(jsonStr, AddUserIDGroup.class);
        if (group.getUser_id()!=null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param faceToken 需要添加的face_token
     * @param outerID   标识FaceSet的outer_id
     * @return true添加成功
     * <p>
     * 向指定FaceSet中添加Face_token，返回Json对应AddFaceTokenGroup
     */
    public static boolean addFaceToken(String faceToken, String outerID) {
        FaceSetOperate operate = new FaceSetOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = operate.addFaceByOuterId(faceToken, outerID);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
        AddFaceTokenGroup group = JSON.parseObject(jsonStr, AddFaceTokenGroup.class);
        if (group.getFace_added() == 1) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 删除FaceSet中所有Face
     *
     * */
    public static void deleteAllFaces(String outerID) {
        FaceSetOperate operate = new FaceSetOperate(API_KEY,API_SECRET,false);
        Response response =null;
        try {
            response = operate.removeFaceFromFaceSetByOuterId(outerID,"RemoveAllFaceTokens");
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
    }

    /**
     * 移除一张照片的faceToken
     *
     * */
    public static void removeFace(String outerID, String faceToken) {
        FaceSetOperate operate = new FaceSetOperate(API_KEY, API_SECRET, false);
        Response response = null;
        try {
            response = operate.removeFaceFromFaceSetByOuterId(outerID, faceToken);
        } catch (Exception e) {
            e.printStackTrace();
        }
        String jsonStr = new String(response.getContent());
        System.out.println(jsonStr);
    }

    /**
     * @param dirPath 文件夹路径
     * @return 文件夹数组
     * <p>
     * 列举文件夹下所有照片
     */
    public static File[] listFiles(String dirPath) {
        File fatherFile = new File(dirPath);
        File[] files = fatherFile.listFiles();
        return files;
    }

    /**
     * 将指定文件夹中的照片,添加到指定FaceSet,并打印信息
     */
    public static void addFaceByDir(String outerID, String dirPath) {
        File[] files = listFiles(dirPath);
        for (int i = 0; i < files.length; i++) {
            String faceToken;
            String userID = files[i].getName().substring(0, files[i].getName().length() - 4);
            File photo = new File(files[i].getAbsolutePath());
            System.out.println("第"+i+"张照片名称"+files[i].getName());
            byte[] buff = getBytesFromFile(photo);

            // 获取face_token
            while (true) {
                faceToken = getFaceToken(buff);
                if (faceToken != null) {
                    System.out.println("第" + i + "张照片face_token获取成功");
                    break;
                }
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("第" + i + "张照片face_token获取失败");
            }

            // 为face_token添加user_id
            while (true) {
                boolean isSuccessful = addUserId(faceToken, userID);
                if (isSuccessful == true) {
                    System.out.println("第" + i + "张照片user_id添加成功");
                    break;
                }
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("第" + i + "张照片user_id添加失败");
            }

            // 将face_token加入FaceSet
            while (true) {
                boolean isSuccessful = addFaceToken(faceToken, outerID);
                // 添加成功
                if (isSuccessful == true) {
                    System.out.println("第" + i + "张照片添加成功！");
                    break;
                }
                // 添加失败,0.5s后再次请求
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("第" + i + "张照片添加失败！");
            }
        }
    }

    /**
     * 执行函数
     */
    public static void main(String[] args) {
        addFaceByDir("MissingPeoplePhoto","G:\\test");
        //deleteAllFaces("MissingPeoplePhoto");
        //getFaceSets("MissingPeoplePhoto");
        //removeFace("MissingPeoplePhoto", "71ac75e1301167b0f7fcca64a41562de");
    }
}
