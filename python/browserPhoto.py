import requests
import json
import urllib
import ssl
import urllib.request as ur
from urllib.request import urlretrieve
import string
import threading
import os
# 1、a.py文件存放的路径下为（D:\Auto\eclipse\workspace\Testhtml\Test）
# 2、通过os.getcwd()获取的路径为：D:\Auto\eclipse\workspace\Testhtml\Test
# 3、使用os.getcwd()[:-4]截取到的路径为：D:\Auto\eclipse\workspace\Testhtml\
# 4、使用下面的命令则在3步骤下新建report文件夹，并将执行的结果会自动保存在report文件夹下

# 未设置全局取消证书验证
# 加上这条 当你urllib.urlopen一个 https 的时候会验证一次 SSL 证书 ，当目标使用的是自签名的证书时就会爆出该错误消息。
ssl._create_default_https_context = ssl._create_unverified_context

print('---start---')
# doingFlag = True # 是否继续执行

def getSogouImag(key,page,path):
  print('page: ', page)
  path = path+key+'/'
  # 判断该文件路径是否存在，不存在就创建
  if not os.path.exists(path):
    os.makedirs(path)

  # headers 遇到网站有反爬虫时，需要设置User-Agent等必要信息进行伪装
  headers = {
    'Connection': 'keep-alive',
    'Cookie': '_ga=GA1.2.1324360353.1634889730; _gid=GA1.2.1113333521.1634889730; user_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IkltZDFaWE4wSWc9PSIsImV4cCI6bnVsbCwicHVyIjoiY29va2llLnVzZXJfaWQifX0%3D--b548bfb6128337e510df4bc0505c18a91fda22f3',
    'Host': 'www.yestone.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
  }
  queryStringParam = { 'query': key, 'page': str(page) }
  url = ur.quote('https://www.yestone.com/yestone/images/search?query={key}&page={page}'.format(key=key, page=str(page)), safe=string.printable)

  # 获取接口或页面的内容
  imgs = requests.get(url, headers=headers, params=queryStringParam)
  jd = json.loads(imgs.text)
  jd = jd['items']

  # 把图片链接和名称存到数组
  imgsUrl = []
  titleList = []
  for j in jd:
    imgsUrl.append(j['thumbnail'])
    titleList.append(j['title'])

  m = 0
  for url in imgsUrl:
    try:
      pathUrl = path + '图片_{index}_{title}.jpg'.format(index=m, title=titleList[m])
      print(pathUrl + ' ---- Downloading...')
      urlretrieve(url, pathUrl)
      m = m + 1
    except urllib.error.URLError as e:
      print('文件下载失败!', e)
    except Exception as e:
      print(e)
  print('Download complete!')

# 多线程 面向对象
# run(): 用以表示线程活动的方法。
# start():启动线程活动。
# join([time]): 等待至线程中止。这阻塞调用线程直至线程的join() 方法被调用中止-正常退出或者抛出未处理的异常-或者是可选的超时发生。
# isAlive(): 返回线程是否活动的。
# getName(): 返回线程名。
# setName(): 设置线程名
class threadGetImage (threading.Thread):
  def __init__(self, key, index):
    threading.Thread.__init__(self)
    self.key = key
    self.index = index

  def run(self):
    getSogouImag(self.key, self.index,'d:/图片/')

# if __name__ == '__main__':
#    print('程序自身在运行')
# else:
#    print('我来自另一模块')
if __name__=='__main__':
  for i in range(1, 2, 1):
    th1 = threadGetImage('图片壁纸', i)
    th1.start()
    # th2 = threadGetImage('山水', i)
    # th2.start()
  print('---end---')
