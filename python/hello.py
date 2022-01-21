'''
# 单行注释
print ("hello world!")
'''
# 多行注释1
# 多行注释2
'''
total = 1
if total > 5:
  print('true')
else:
  print('false')

# 字符串
str = '123456789'
print(str)            # 输出完整字符串
print(str[0:-1])      # 输出第一个到倒数第二个字符串
print(str[0])         # 输出第一个字符串
print(str[2:5])       # 输出第三个到第五个字符串
print(str[2:])        # 输出第三个开始的所有字符串
print(str[1:5:2])     # 输出第二个开始到第五个且每隔一个的字符(步长为2)
print(str * 2)        # 输出字符串两次
print(str + '你好啊')  # 拼接字符串
print(('--------------------------'))
print('hello\npython')  # 使用反斜杠(\)+n转义特殊字符  \n换行
print(r'hello\npython' + '换行\n111') # 在字符串前面加一个r，表示原始字符串，不会发生转义

# 等待用户输入
input('按下 enter 键后退出\n\n')

# 同一行显示多条语句 用;隔开
import sys; x = 'python'; sys.stdout.write(x + '\n')

# print 输出
x = 'a'
y = 'b'
# 换行输出
print(x)
print(y)
print('--------')
# 不换行输出
print(x, end=" ")
print(y)

# import与from...import
import sys # 导入整个sys模块
print('\npython路径为', sys.path) # 因为导入整个模块，所以需要 sys. 来调用
from sys import path
print('path', path) # 因为已经导入path成员，所以此处引用时不需要加sys.path

# 变量赋值
a = b = c = 1
print(a)
print(b)
print(c)
a, b, c = 1, 2, 'python'
print(a)
print(b)
print(c)

# 数值运算
print(5 + 4)    # 加法 9
print(4.3 - 2)  # 减法 2.3
print(3 * 7)    # 乘法 21
print(2 / 4)    # 除法，得到一个浮点数 0.5
print(2 // 4)   # 除法，得到一个整数 0
print(17 % 3)   # 取余 2
print(2 ** 5)   # 乘方 32

# 列表 数组
list = ['abcd', 786, 2.23, 'python', 70.2]
tinylist = [123, 'python']

print(list)             # 输出完整列表
print(list[0])          # 输出列表第一个元素
print(list[1:3])        # 输出列表第一个到第三个元素
print(list[2:])         # 输出列表第二个开始后的所有元素
print(list[:4])         # 输出列表开始到第四个元素
print(list[1:4:2])      # 输出列表第一个到第四个元素且每隔一个元素(步长为2)
print(list[::-1])       # 第三个参数为负数 用于翻转
print(tinylist * 2)     # 输出列表两次
print(list + tinylist)  # 拼接列表

# 元组 元组（tuple）与列表类似，不同之处在于元组的元素不能修改。元组写在小括号 () 里，元素之间用逗号隔开
tup = ('abcd', 786, 2.23, 'python', 70.2)
tinytup = (123, 'python')

print(tup)             # 输出完整元组
print(tup[0])          # 输出元组第一个元素
print(tup[1:3])        # 输出元组第一个到第三个元素
print(tup[2:])         # 输出元组第二个开始后的所有元素
print(tup[:4])         # 输出元组开始到第四个元素
print(tup[1:4:2])      # 输出元组第一个到第四个元素且每隔一个元素(步长为2)
print(tup[::-1])       # 第三个参数为负数 用于翻转
print(tinytup * 2)     # 输出元组两次
print(tup + tinytup)   # 拼接元组
tup1 = (1)             # 一个元素，需要在元素后添加逗号  1
tup2 = (1,)            # 一个元素，需要在元素后添加逗号  (1,)
print(tup1)
print(tup2)

# Set(集合) 可以使用大括号 { } 或者 set() 函数创建集合，注意：创建一个空集合必须用 set() 而不是 { }，因为 { } 是用来创建一个空字典
sites = {'Google', 'Taobao', 'Baidu', 'Zhihu', 'Baidu'}
print(sites) # 输出集合，重复的元素被自动去掉
if 'Zhihu' in sites: # 成员测试
  print('Zhihu 在集合中')
else:
  print('Zhihu 不在集合中')
# set可以进行集合运算
a = set('abracadabra')
b = set('alacazam')
print(a) # {'a', 'r', 'b', 'c', 'd'}
print(a - b) # a和b的差集 {'b', 'd', 'r'}
print(a | b) # a和b的并集 {'a', 'r', 'b', 'c', 'm', 'd', 'l', 'z'}
print(a & b) # a和b的交集 {'a', 'c'}
print(a ^ b) # a和b中不同时存在的元素 {'d', 'r', 'b', 'l', 'm', 'z'}
# c = set('Zhihu', 'Baid')
# print(c) 报错，只能传一个参数
'''

# 字典(js对象)  字典是一种映射类型，字典用 { } 标识，它是一个无序的 键(key) : 值(value) 的集合
dict = {}
dict['one'] = '1 - 菜鸟教程'
dict[2] = '2 - 菜鸟工具'
# dict.three = '3 - python' 不能这么赋值
tinydict = {'name': 'python', 'code': 1, 'site': 'www.runoob.com'}
print(dict)                   # 输出完整的字典
print(dict['one'])            # 输出键为'one'的值
print(dict[2])                # 输出键为 2 的值
# print(dict.one) 不能这么取值
print(tinydict)               # 输出完整的字典
print(tinydict.keys())        # 输出所有键
print(tinydict.values())      # 输出所有值
print(dict.keys())            # 输出所有键