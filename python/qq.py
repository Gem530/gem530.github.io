from selenium import webdriver

import requests

driver = webdriver.Chrome()

url = 'https://user.qzone.qq.com/'

driver.get(url)

# 在driver中操作完登录之后，在程序中回车继续

input("继续?")

cookies = driver.get_cookies() #这里就获取了浏览器中的cookies