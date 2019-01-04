package dal.dao;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;

/**
 * @author Huleryo
 * @date 2017/8/17
 *
 * IGServer Rest请求类，进行要素图层的增删查改
 */
public class IGServerRest {

    private static final String  baseUrl = "http://localhost:6163/igs/rest/mrfs/layer/";

    public String queryByID(int missingID) {
        String queryUrl = baseUrl + "query?f=json&gdbp=gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt" +
                "&geometryType=&geometry=&where=%E5%AF%BB%E4%BA%B2%E7%BC%96%E5%8F%B7='5'&structs={IncludeAttribute:true,IncludeGeometry:false,IncludeWebGraphic:false}";
        System.out.println(queryUrl);
        return sendGet(queryUrl);
    }

    public String add() {
        String content = "{\"AttStruct\":{\"FldNumber\":15,\"FldName\":[\"经度\",\"纬度\",\"寻亲编号\",\"寻亲类别\",\"姓名\",\"性别\",\"出生日期\",\"失踪时身高\",\"失踪时间\",\"失踪地点\",\"寻亲者特征描述\",\"其他资料\",\"注册时间\",\"经度1\",\"纬度1\"],\"FldType\":[\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\"]},\"SFEleArray\":[{\"AttValue\":[\"104.900557798252\",\"25.0951480559269\",\"5\",\"家寻宝贝\",\"老王\",\"女\",\"2001年02月28日\",\"未知\",\"2017年05月21日\",\"贵州省,黔西南布依族苗族自治州,杜鹃花街道\",\"身穿牛仔外套白色衬衣，和女仔裤，衬衣上有花边，是黑色的边\",\"\",\"2017/5/22 14:07:21\",\"104.900557798252\",\"25.0951480559269\"],\"fGeom\":null,\"ftype\":1,\"GraphicInfo\":null}]}";
        String addUrl = baseUrl + "addFeatures?f=json&gdbp=gdbp://MapGisLocal/GoHome/sfcls/missing_people_data_with_photo.txt&guid=null&s={\"AttStruct\":{\"FldNumber\":15,\"FldName\":[\"经度\",\"纬度\",\"寻亲编号\",\"寻亲类别\",\"姓名\",\"性别\",\"出生日期\",\"失踪时身高\",\"失踪时间\",\"失踪地点\",\"寻亲者特征描述\",\"其他资料\",\"注册时间\",\"经度1\",\"纬度1\"],\"FldType\":[\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\",\"string\"]},\"SFEleArray\":null,\"TotalCount\":0}";
        String result = "";
        try {
            result = getDataByPost(addUrl, content);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return result;
    }

    private static String getData(String getURL){
        URL getUrl;
        try {
            getUrl = new URL(getURL);
            System.out.println(getUrl.toString());
            HttpURLConnection connection = (HttpURLConnection) getUrl.openConnection();
            connection.connect();
            //取得输入流，并使用Reader读取,设置编码,否则中文乱码
            BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));
            String lines;
            lines = reader.readLine();
            reader.close();
            connection.disconnect();
            return lines;
        } catch (MalformedURLException e) {
            e.printStackTrace();
            return "";
        }catch (IOException e) {
            e.printStackTrace();
            return "";
        }

    }

    public static String sendGet(String url) {
        String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = url;
            URL realUrl = new URL(urlNameString);
            // 打开和URL之间的连接
            URLConnection connection = realUrl.openConnection();
            // 建立实际的连接
            connection.connect();
            // 定义 BufferedReader输入流来读取URL的响应
            in = new BufferedReader(new InputStreamReader(
                    connection.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            System.out.println("发送GET请求出现异常！" + e);
            e.printStackTrace();
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;
    }

    /** 发送POST请求
     * @param POST_URL REST服务地址
     * @pa content 参数
     */
    public static String getDataByPost(String POST_URL,String content) throws IOException{
        // Post请求的url，与get不同的是不需要带参数
        URL postUrl = new URL(POST_URL);
        System.out.println(postUrl.toString());
        // 打开连接
        HttpURLConnection connection = (HttpURLConnection)postUrl.openConnection();
        connection.setDoOutput(true);
        connection.setDoInput(true);
        connection.setRequestMethod("POST");
        connection.setUseCaches(false);
        connection.setInstanceFollowRedirects(true);
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.connect();
        DataOutputStream out = new DataOutputStream(connection.getOutputStream());
        out.writeBytes(content);
        out.flush();
        out.close(); // flush and close
        BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream(),"utf-8"));//设置编码,否则中文乱码
        String line=reader.readLine();
        reader.close();
        connection.disconnect();
        return line;
    }

    /**
     * 测试函数
     * */
    public static void main(String[] args) {
        IGServerRest igServerRest = new IGServerRest();
        System.out.println(igServerRest.add());
        System.out.println(igServerRest.queryByID(5));
    }
}
