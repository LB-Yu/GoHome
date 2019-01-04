# -*- coding:utf-8 -*-
import urllib.request
import urllib
import re
import os
import pymysql
import geocoder
import time

# 获取当前时间
current_time = time.strftime('%Y-%m-%d', time.localtime(time.time()))


# 通过id进行信息获取
def get_content(id, data_base):
    content_url = "http://www.baobeihuijia.com/view.aspx?id="+id
    content_data = urllib.request.urlopen(content_url).read()
    content_data = content_data.decode('UTF-8')
    # 文本信息
    pattern2 = re.compile(r'<li><span>寻亲类别：</span>(.*?)</li>[\s\S]*'
                             + r'名：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'别：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'期：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'高：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'间：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'点：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'述：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'料：</span>([\s\S]*?)</li>[\s\S]*'
                             + r'间：</span>([\s\S]*?)</li>[\s\S]*'
                          )
    txt_match = re.search(pattern2, content_data)
    registration_date = str(txt_match[10]).split(" ")[0]
    registration_date = change_registration_date(registration_date)
    # 判断注册时间
    if registration_date == '2017-11-02':
        try:
            # 将文本信息插入mysql数据库,注意0是全部文本
            insert_data(txt_match, id, data_base)
            # 获取照片信息
            pattern1 = re.compile(r'<img class="cimg" src="(.*?)"')
            img_match = re.search(pattern1, content_data)
            img_url = 'http://www.baobeihuijia.com' + img_match[1]
            # 进行照片信息存储
            save_img(img_url, id+'.jpg')
        except data_base.Error:
            print(id+":Insert failed!")
        else:
            print(id+":Insert sucessed!")


# 插入mysql数据库
def insert_data(txt_match, id, data_base):
    birth_date = change_date(txt_match[4])
    missing_date = change_date(txt_match[6])
    registration_date = str(txt_match[10]).split(" ")
    registration_date = registration_date[0]
    cursor = data_base.cursor()
    # 获得经纬度
    location = get_location(txt_match[7])
    if len(location) > 0:
        sql = "INSERT INTO missing_people_data_table VALUES(" + \
                      id + ",'" + str(txt_match[1]) + "','" + str(txt_match[2]) + "','" + \
                      str(txt_match[3]) + "','" + birth_date + "','" + str(txt_match[5]) + "','" + \
                      missing_date + "','" + str(txt_match[7]) + "','" + str(txt_match[8]) + "','" + \
                      str(txt_match[9]) + "','" + registration_date + "'," + \
                      str(location[1]) + ',' + str(location[0]) + ',' + str(1) + ',' + '"admin"' + ',' + str(0) + ");"
        # print(sql)
        cursor.execute(sql)
        data_base.commit()
    else:
        print(id+":No missing location, cannot insert!")


# 照片存储
def save_img(image_url, file_name):
    u = urllib.request.urlopen(image_url)
    img_data = u.read()
    f = open(file_name, 'wb')
    f.write(img_data)
    f.close()


# 替换年月日
def change_date(date):
    date = date.replace('年','-')
    date = date.replace('月','-')
    date = date.replace('日','')
    # 未找到时间词即返回0-0-0
    if date.find('-') == -1:
        return '0-0-0'
    return date

# 更改注册时间格式为0000-00-00
def change_registration_date(registration_date):
    registration_date = registration_date.split('/')
    if len(registration_date[1]) == 1:
        registration_date[1] = '0'+registration_date[1]
    if len(registration_date[2]) == 1:
        registration_date[2] = '0'+registration_date[2]

    changed_registration_date = registration_date[0] + '-' + registration_date[1] + '-'\
                                + registration_date[2]
    return changed_registration_date


# 逆地理编码
def get_location(address):
    g = geocoder.baidu(address, key="TKBO91Psu8cjIXzkO1wnK4h8jgiQPlRR")
    return g.latlng


if __name__ == '__main__':
    os.chdir("G:\\GoHome\\web\\libs\\image\\all_missing_people_photo")
    url = "http://www.baobeihuijia.com/Index.aspx"
    data = urllib.request.urlopen(url).read()
    data = data.decode('UTF-8')
    pattern = re.compile(r'<input id="(.*?)-hid"')
    items = re.findall(pattern, data)
    # 创建数据库连接
    connection = pymysql.connect(host='127.0.0.1',
                                 port=3306,
                                 user='root',
                                 password='0407',
                                 db='gohome',
                                 charset='utf8',
                                 cursorclass=pymysql.cursors.DictCursor)
    for i in range(0, 100):
        get_content(items[i], connection)

    # print(current_time)




