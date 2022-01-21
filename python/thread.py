import threading
# 多线程 + 面向对象
class threadTest (threading.Thread):
  def __init__(self, key, str):
    threading.Thread.__init__(self)
    self.key = key
    self.str = str
  
  def run(self):
    print(self.key, self.str)

if __name__=='__main__':
  for i in range(1, 10, 1):
    th1 = threadTest(i, 1)
    th1.start()
    th2 = threadTest(i, 2)
    th2.start()
  print('complate')

# 执行结果
# 1 1
# 1 2
# 2 1
# 2 2
# 3 1
# 3 2
# 4 1
# 4 2
# 5 1
# 5 2
# 6 1
# 6 2
# 7 1
# 7 2
# 8 1
# 8 2
# 9 1
# 9 2
# complate