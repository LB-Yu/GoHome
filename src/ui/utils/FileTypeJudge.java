package ui.utils;

import java.io.*;

/**
 * @author Huleryo
 * @date 2017/7/16
 *
 * 照片类型判断类
 */
public class FileTypeJudge {

    /**
     * 将byte[]转化为16进制字符串
     *
     * @param bytes
     * @return 16进制字符串
     * */
    public static String bytesToHexString(byte[] bytes) {
        StringBuilder stringBuilder = new StringBuilder();
        if (bytes==null || bytes.length<=0) {
            return null;
        }

        for (int i=0; i<bytes.length; i++) {
            int v = bytes[i] & 0xFF;
            String hv = Integer.toHexString(v);
            if (hv.length() < 2) {
                stringBuilder.append(0);
            }
            stringBuilder.append(hv);
        }
       return stringBuilder.toString();
    }

    public static String getFileHeader(InputStream inputStream) {
        byte[] bytes = new byte[28];

        try {
            inputStream.read(bytes, 0, 28);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return bytesToHexString(bytes);
    }

    public static FileType getType(InputStream inputStream) {
        String fileHeader = getFileHeader(inputStream);
        if (fileHeader==null || fileHeader.length()<=0){
            return null;
        }

        fileHeader = fileHeader.toUpperCase();

        FileType[] fileTypes = FileType.values();
        for (FileType fileType:fileTypes) {
            if (fileHeader.startsWith(fileType.getValue())) {
                return fileType;
            }
        }
        return null;
    }

    /**
     * 测试类
     * */
    public static void main(String[] args) {
        try {
            InputStream inputStream = new FileInputStream(new File("Z:\\4.jpg"));
            System.out.println(getType(inputStream).toString().equals("JPEG"));
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }
}
