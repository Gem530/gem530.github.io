import requests
import json
import urllib
import ssl
import re
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
  # path = path+key+'/'
  # # 判断该文件路径是否存在，不存在就创建
  # if not os.path.exists(path):
  #   os.makedirs(path)

  # headers 遇到网站有反爬虫时，需要设置User-Agent等必要信息进行伪装
  headers = {
    'Connection': 'keep-alive',
    'Cookie': 'BIDUPSID=D3B8BA2E5832A9012ED30464AD5A903A; PSTM=1623896930; __yjs_duid=1_6706080aa957786f42d1ebb0e65de9481623896939246; ab_jid=53acc174d99f31dfee5843d889763a3bc03c; ab_jid_BFESS=53acc174d99f31dfee5843d889763a3bc03c; BAIDUID=4C104DE76C1C501EE5B7B62A1BC1AE14:FG=1; BDUSS_BFESS=lHaEo4Y0phRFV4TWROeTN5TjRzZW5UQ1dpUX5BZm1OamROdU03YWdidHA0UnhoSUFBQUFBJCQAAAAAAAAAAAEAAABO3LqfaGVqaWFqdW41MzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGlU9WBpVPVgN1; BDORZ=B490B5EBF6F3CD402E515D22BCDA1598; BDSFRCVID=N50OJeC62CjPwQTHHxuRb5sBPQXM3QQTH6f3LxgshK-JNT5A-xNyEG0PhM8g0Kub1_UmogKK3gOTH4PF_2uxOjjg8UtVJeC6EG0Ptf8g0f5; H_BDCLCKID_SF=tJIe_C-atC-3Hn7gMtTJq4FDhUn2etJyaR32bInvWJ5TMCoqDqQjQ-Cn0fcNK-Dt-b7WKfbyH66cShPCb6bvjPLt-P5MKncOBa6XXR5Y3l02V-OEe-t2ynLV2xbRbtRMW20e0h7mWIbmsxA45J7cM4IseboJLfT-0bc4KKJxbnLWeIJIjjC5D6jbDH8eJTn0bTAX0-bD2J5ffjrnh6RJLPPgyxomtjjt5CcK0lcdXbT4VJnPKh64bjLX-lb9LUkqKCOx_T6xQprvJlRJDptWqt0kQttjQnJPfIkja-5t0-OcMn7TyU45bU47yaOT0q4Hb6b9BJcjfU5MSlcNLTjpQT8r5MDOK5OhJRLeoIL2fI_abDvwhDTbbtIt-fTEaPoXHD7yWCk53qbcOR5Jj65TjPK8yt672MntJIbaQUcC5lvGhD0R3MA--t4jjMLqXnOU-D0O2nbGKj6osq0x0hbYe-bQypoa-5bUJIOMahkb5h7xOKbMQlPK5JkgMx6MqpQJQeQ-5KQN3KJmfbL9bT3tjjTLjNujt5LqfKresJoq2RbhKROvhj4KXh4gyxoObtRxtTcUaRrd2qQTolCm26QHhfPU5RDeLU3kBTn9LMnx--t58h3_XhjJ3PTyQttjQn3yKmvbLxAEa-PWsJ7TyU45bU47yaOT0q4Hb6b9BJcjfU5MSlcNLTjpQT8r5MDOK5OuJRLH_C-XtCLahIv6hn5OqR-8Mq702D6D-4o2WbCQBDK28pcNLTDKLPIr5nQnBUvObGra_4OPLUji8DOh0qO1j45yXh7Mb-viHmQw-I5pH4nFJq5jDh3sXjksD-Rt5jodQCjy0hvctb3cShPm0MjrDRLbXU6BK5vPbNcZ0l8K3l02V-bIe-t2b6Qh-p52f6_8tJIO3f; BDSFRCVID_BFESS=N50OJeC62CjPwQTHHxuRb5sBPQXM3QQTH6f3LxgshK-JNT5A-xNyEG0PhM8g0Kub1_UmogKK3gOTH4PF_2uxOjjg8UtVJeC6EG0Ptf8g0f5; H_BDCLCKID_SF_BFESS=tJIe_C-atC-3Hn7gMtTJq4FDhUn2etJyaR32bInvWJ5TMCoqDqQjQ-Cn0fcNK-Dt-b7WKfbyH66cShPCb6bvjPLt-P5MKncOBa6XXR5Y3l02V-OEe-t2ynLV2xbRbtRMW20e0h7mWIbmsxA45J7cM4IseboJLfT-0bc4KKJxbnLWeIJIjjC5D6jbDH8eJTn0bTAX0-bD2J5ffjrnh6RJLPPgyxomtjjt5CcK0lcdXbT4VJnPKh64bjLX-lb9LUkqKCOx_T6xQprvJlRJDptWqt0kQttjQnJPfIkja-5t0-OcMn7TyU45bU47yaOT0q4Hb6b9BJcjfU5MSlcNLTjpQT8r5MDOK5OhJRLeoIL2fI_abDvwhDTbbtIt-fTEaPoXHD7yWCk53qbcOR5Jj65TjPK8yt672MntJIbaQUcC5lvGhD0R3MA--t4jjMLqXnOU-D0O2nbGKj6osq0x0hbYe-bQypoa-5bUJIOMahkb5h7xOKbMQlPK5JkgMx6MqpQJQeQ-5KQN3KJmfbL9bT3tjjTLjNujt5LqfKresJoq2RbhKROvhj4KXh4gyxoObtRxtTcUaRrd2qQTolCm26QHhfPU5RDeLU3kBTn9LMnx--t58h3_XhjJ3PTyQttjQn3yKmvbLxAEa-PWsJ7TyU45bU47yaOT0q4Hb6b9BJcjfU5MSlcNLTjpQT8r5MDOK5OuJRLH_C-XtCLahIv6hn5OqR-8Mq702D6D-4o2WbCQBDK28pcNLTDKLPIr5nQnBUvObGra_4OPLUji8DOh0qO1j45yXh7Mb-viHmQw-I5pH4nFJq5jDh3sXjksD-Rt5jodQCjy0hvctb3cShPm0MjrDRLbXU6BK5vPbNcZ0l8K3l02V-bIe-t2b6Qh-p52f6_8tJIO3f; H_PS_PSSID=34067_31660_34712_34584_34504_34830_34579_34873_26350_34828_22160; delPer=0; BAIDUID_BFESS=4C104DE76C1C501EE5B7B62A1BC1AE14:FG=1; BDRCVFR[dG2JNJb_ajR]=mk3SLVN4HKm; BDRCVFR[-pGxjrCMryR]=mk3SLVN4HKm; PSINO=1; BA_HECTOR=212h2k84258lagagfo1gn54rd0q; userFrom=ala; ab_bid=9b4957c1ad41f2dfa3a529a5f952671a7f44; ab_sr=1.0.1_MzJmODc0MDFhZDIyZDY3Y2RmOTE4MGFmZTRhYWM4NjUyNDBmMTg3ZTFhYmE5NzNhNTNiNjUxZTQwNzAyYjI3NmUxMjZiYzg1YmU4ZjdlZmIwYmFiMGEwYzM4NTY1ZWVhNGNiNzE2NGY5ZmYxN2RmMzNhOTk5NDAxMGMzMmRmMWI5NDBlZTgzNGEzODczMjJjMDI4YTRjZGIxMGI4NGRkZWY4YjJkYWYxOGU0MmIyMDkzYzZlY2M1NDNjYjNmNTFi',
    'Host': 'miao.baidu.com',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36'
  }
  params = {
    'tn': 'resultjson_com',
    'logid': '11288811365655969017',
    'ipn': 'rj',
    'ct': '201326592',
    'is': '',
    'fp': 'result',
    'queryWord': key,
    'cl': '2',
    'lm': '-1',
    'ie': 'utf-8',
    'oe': 'utf-8',
    'adpicid': '',
    'st': '-1',
    'z': '0',
    'ic': '0',
    'hd': '0',
    'latest': '0',
    'copyright': '0',
    'word': key,
    's': '',
    'se': '',
    'tab': '',
    'width': '',
    'height': '',
    'face': '0',
    'istype': '2',
    'qc': '',
    'nc': '1',
    'fr': '',
    'expermode': '',
    'nojc': '',
    'acjsonfr': 'click',
    'pn': '30',
    'rn': '30',
    'itg': '1',
    'gsm': '1e',
    '1634899452215': ''
  }
  # https://image.baidu.com/search/index?ct=201326592&tn=baiduimage&word=%E5%9B%BE%E7%89%87%E5%A3%81%E7%BA%B8&pn=0&ie=utf-8&oe=utf-8&cl=2&lm=-1&fr=ala&se=&sme=
  url = 'https://image.baidu.com/search/index?'
  imgs = requests.get(url=url, headers=headers, params=params)
  print(imgs)

  # # 获取接口或页面的内容
  # imgs = requests.get(url, headers=headers, params=queryStringParam)
  # jd = json.loads(imgs.text)
  # jd = jd['items']

  # # 把图片链接和名称存到数组
  # imgsUrl = []
  # titleList = []
  # for j in jd:
  #   imgsUrl.append(j['thumbnail'])
  #   titleList.append(j['title'])

  # m = 0
  # for url in imgsUrl:
  #   try:
  #     pathUrl = path + '图片_{index}_{title}.jpg'.format(index=m, title=titleList[m])
  #     print(pathUrl + ' ---- Downloading...')
  #     urlretrieve(url, pathUrl)
  #     m = m + 1
  #   except urllib.error.URLError as e:
  #     print('文件下载失败!', e)
  #   except Exception as e:
  #     print(e)
  # print('Download complete!')

getSogouImag('图片壁纸', 1,'d:/图片/')
# # 多线程 面向对象
# # run(): 用以表示线程活动的方法。
# # start():启动线程活动。
# # join([time]): 等待至线程中止。这阻塞调用线程直至线程的join() 方法被调用中止-正常退出或者抛出未处理的异常-或者是可选的超时发生。
# # isAlive(): 返回线程是否活动的。
# # getName(): 返回线程名。
# # setName(): 设置线程名
# class threadGetImage (threading.Thread):
#   def __init__(self, key, index):
#     threading.Thread.__init__(self)
#     self.key = key
#     self.index = index

#   def run(self):
#     getSogouImag(self.key, self.index,'d:/图片/')

# # if __name__ == '__main__':
# #    print('程序自身在运行')
# # else:
# #    print('我来自另一模块')
# if __name__=='__main__':
#   for i in range(1, 2, 1):
#     th1 = threadGetImage('图片壁纸', i)
#     th1.start()
#     th2 = threadGetImage('山水', i)
#     th2.start()
#   print('---end---')
