<!-- 聊天功能 -->
<!-- 1、点击聊天
判断是不是第一次聊天，如果是会在主表生成一条记录返回聊天主表id，并在聊天列表表分别插入两条记录，如果不是第一次聊天进入下一步
2、进入聊天对话框
获取上一次聊天聊天记录，将用户在此对话的在线状态改为在线
3、发送聊天信息
    3.1、先判断对方是否在线，不在线的话对方未读数+1
    3.2、将上一条最后一条消息状态改为否
    3.3、往聊天详情表插入聊天信息数据
4、删除聊天列表
将该用户的聊天列表删除状态改为删除 -->

插入 'insert into user_data(name, password, state) values(?, ?, ?)', [body.name, body.pass, 1]
查找 'select * from user where username = "' + query.username + '"'
更新 'update user set avator = ?, username = ?, tips = ?, email = ?, password = ? where userid = ?', [body.avator, body.username, body.tips, body.email, body.password, body.userid]
删除 `delete from article where articleid = ${query.articleid}`