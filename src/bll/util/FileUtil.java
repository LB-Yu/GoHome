package bll.util;

import org.apache.commons.io.IOUtils;

import java.io.*;

/**
 * @author Huleryo
 * @date 2017/7/16
 *
 * 文件操作工具类
 */
public class FileUtil {

    /**
     * 从文件对象获取bytes数组
     *
     * @param f 文件对象
     * @return null 获取失败
     *          byte[] 文件数组
     */
    public static byte[] getBytesFromFile(File f) {
        if (f == null) {
            return null;
        }
        try {
            FileInputStream stream = new FileInputStream(f);
            ByteArrayOutputStream out = new ByteArrayOutputStream(1000);
            byte[] b = new byte[1000];
            int n;
            while ((n = stream.read(b)) != -1)
                out.write(b, 0, n);
            stream.close();
            out.close();
            return out.toByteArray();
        } catch (IOException e) {
        }
        return null;
    }

    public static byte[] getBytesFromInputStream(InputStream inputStream) {
        byte[] bytes = null;
        try {
            bytes = IOUtils.toByteArray(inputStream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return bytes;
    }
}
