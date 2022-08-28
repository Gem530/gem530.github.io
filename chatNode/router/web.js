// 导出路由
module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const jwt = require('jsonwebtoken')
    // 加密：const token = jwt.sign({ id: result[0].userid }, app.get('secret'))
    // 解密：let { id } = jwt.verify(token, req.app.get('secret'))
    const db = require('../connect/db')

    // 处理请求体数据模块
    const parser = require('body-parser')
    router.use(parser.urlencoded({ extended: false }))

    // 响应数据结果
    const mesRes = (message, code, data) => {
        return {
            message,
            code, // code为1接口正确，code为0接口错误
            data
        }
    }

    // --------------------------------------------- 基础接口 ---------------------------------------------
    // 注册接口
    router.post('/register', (req, res) => {
        // res.send('user')
        // db.query(sql语句, [参数], (err, result) => {})
        const body = req.body
        const sql = 'insert into user_data(name, password, state) values(?, ?, ?)'
        const param = [body.name, body.pass, 1]
        db.query(sql, param, (err, result) => {
            if (err) {
                let errTxt = err.message
                if (errTxt.indexOf('Duplicate entry') !== -1) errTxt = '用户名已存在'
                return res.send(mesRes(errTxt, 0, err))
            }
            res.send(mesRes('注册成功', 1, result))
        })
    })

    // 登录接口
    router.post('/login', (req, res) => {
        // res.send('user')
        // db.query(sql语句, [参数], (err, result) => {})
        const body = req.body
        const sql = `select * from user_data where name = '${body.name}' and password = '${body.pass}'`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            let code = 1
            let message = '登录成功'
            if (!result.length) { code = 0; message = '账号或密码错误!' }
            const token = jwt.sign({ id: result[0].Id }, app.get('secret'))
            res.send({ ...mesRes(message, code, result), token })
        })
    })

    // 判断 是否登录 中间件
    const loginAuth = (req, res, next) => {
        const token = (req.headers.token || '').replace('Bearer ', '').replace(/"/g, '')
        // 判断是否存在token
        if (!token) return res.status(401).send(mesRes('请先登录', 0, ''))

        // 解析token，取token中的用户id
        let { id } = jwt.verify(token, req.app.get('secret'))
        if (!id) return res.status(401).send(mesRes('请先登录', 0, ''))

        next()
    }

    // --------------------------------------------- 用户接口 ---------------------------------------------
    // 用户信息修改
    router.post('/updateUserInfo', loginAuth, (req, res) => {
        const body = req.body
        const sql = `update user_data set name = ?, tips = ?, avator = ? where Id = ?`
        const param = [body.username || '未知', body.tips || '', body.avator || '', body.userId]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('用户信息修改', 1, result))
        })
    })

    // 用户在线状态更新
    router.post('/updateUserState', loginAuth, (req, res) => {
        const body = req.body
        const sql = `update user_data set state = ? where Id = ?`
        const param = [body.state, body.userId]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('用户在线状态更新', 1, result))
        })
    })

    // const returnList = (req, res, str, sqlstr) => {
    //     const body = req.body
    //     const page = body.page || 1
    //     const pageSize = body.pageSize || 10
    //     const sql = `select * from user_data where name != '${body.name}' order by createTime desc limit ${(page - 1) * pageSize}, ${pageSize}`
    //     db.query(sql, (err, result) => {
    //         if (err) return res.send(mesRes(err.message, 0, err))
    //         res.send(mesRes('获取用户列表', 1, result))
    //     })
    // }

    // 用户列表接口
    router.post('/userList', loginAuth, (req, res) => {
        const body = req.body
        const page = body.page || 1
        const pageSize = body.pageSize || 10
        const sql = `select * from user_data where name like '%${body.name}%' order by createTime desc limit ${(page - 1) * pageSize}, ${pageSize}`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户列表', 1, result))
        })
    })

    // 获取用户信息
    router.get('/getUserInfo', loginAuth, (req, res) => {
        const body = req.query
        const sql = `select * from user_data where Id = '${body.userId}'`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户信息', 1, result))
        })
    })

    // --------------------------------------------- 用户好友接口 ---------------------------------------------
    // 获取用户好友列表
    router.post('/userFriendList', loginAuth, (req, res) => {
        const body = req.body
        const sql = `select f.Id, f.friend_id, u.name as name from friend f, user_data u where f.user_id = '${body.userId}' and f.friend_id = u.Id and f.link = 1 order by f.createTime desc`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户好友列表', 1, result))
        })
    })

    // 删除好友
    router.delete('/delFriend', loginAuth, (req, res) => {
        const body = req.body
        const sql = `delete from friend where Id = ${body.firendId}`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('删除好友', 1, result))
        })
    })

    // 获取用户好友申请列表
    router.post('/userFriendRequestList', loginAuth, (req, res) => {
        const body = req.body
        const sql = `select f.Id, f.send_id, u.name, f.state from friend_request f, user_data u where f.send_id = u.Id and f.recv_id = '${body.userId}' and f.state != 1 order by f.createTime desc`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户好友申请列表', 1, result))
        })
    })

    // 发起好友申请
    router.post('/friendApply', loginAuth, (req, res) => {
        const body = req.body
        const sql = 'insert into friend_request (send_id, recv_id, state) values (?, ?, ?)'
        const param = [body.sendId, body.recvId, 0]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('发起好友申请', 1, result))
        })
    })

    // 好友申请处理
    router.post('/updateFriendRequest', loginAuth, (req, res) => {
        const body = req.body
        const sql = `update friend_request set state = ? where Id = ?`
        // state 2拒绝 1通过 0未处理
        const param = [body.state, body.id]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            // res.send(mesRes('好友申请处理', 1, result))
            insertFriend(body.id, res)
        })
    })
    // 生成好友记录
    const insertFriend = (id, res) => {
        db.query(`select * from friend_request where Id = ${id}`, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            const body = result[0]
            db.query('insert into friend (user_id, friend_id, state, link) values (?, ?, ?, ?)', [body.send_id, body.recv_id, 1, 1], (errs, results) => {
                if (errs) return res.send(mesRes(errs.message, 0, errs))
                res.send(mesRes('好友申请处理', 1, results))
            })
        })
    }

    // 给好友发消息
    router.post('/sendMsgFriend', loginAuth, (req, res) => {
        const body = req.body
        const sql = 'insert into chat_msg (send_id, recv_id, msg, state) values (?, ?, ?, ?)'
        const param = [body.sendId, body.recvId, body.msg, 2]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('给好友发消息', 1, result))
        })
    })

    // 获取消息列表
    router.get('/getMsgList', loginAuth, (req, res) => {
        const body = req.query
        const sql = `select distinct m.send_id, u.name from chat_msg m, user_data u where m.recv_id = '${body.userId}' and u.Id = m.send_id  order by m.createTime desc`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取未读消息列表', 1, result))
        })
    })

    // 获取未读消息列表
    router.get('/getUnreadMsg', loginAuth, (req, res) => {
        const body = req.query
        const sql = `select send_id, count(send_id) as total from chat_msg where recv_id = '${body.userId}' and state = 2 order by createTime desc`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取未读消息列表', 1, result))
        })
    })

    // 获取用户与该好友聊天记录
    router.post('/getUserMsgRecord', loginAuth, (req, res) => {
        const body = req.body
        const page = body.page || 1
        const pageSize = body.pageSize || 10
        const sql = `select *,(select name from user_data where id = '${body.sendId}') as send_name,(select name from user_data where id = '${body.recvId}') as recv_name from chat_msg where (send_id = '${body.sendId}' and recv_id = '${body.recvId}') or ((send_id = '${body.recvId}' and recv_id = '${body.sendId}')) order by createTime asc limit ${(page - 1) * pageSize}, ${pageSize}`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户好友申请列表', 1, result))
        })
    })

    // 改变消息状态
    router.post('/updateUnreadMsg', loginAuth, (req, res) => {
        const body = req.body
        const sql = `update chat_msg set state = ? where send_id = ? and recv_id = ?`
        // state 2未接受到消息 1成功发送 0发送失败
        const param = [1, body.sendId, body.recvId]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('改变消息状态', 1, result))
        })
    })

    // ---------------------------------------------  群接口 ---------------------------------------------
    // 获取用户群列表
    router.post('/userGroupList', loginAuth, (req, res) => {
        const body = req.body
        const sql = `select * from group_member where member_id = '${body.userId}' order by createTime desc`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户群列表', 1, result))
        })
    })

    // 获取用户群申请列表
    router.post('/userGroupRequestList', loginAuth, (req, res) => {
        const body = req.body
        const page = body.page || 1
        const pageSize = body.pageSize || 10
        const sql = `select * from group_request where Id = '${body.userId}' order by createTime desc limit ${(page - 1) * pageSize}, ${pageSize}`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户群申请列表', 1, result))
        })
    })

    // 获取用户群成员列表
    router.post('/userGroupMemberList', loginAuth, (req, res) => {
        const body = req.body
        const page = body.page || 1
        const pageSize = body.pageSize || 10
        const sql = `select * from group_member where Id = '${body.groupId}' order by createTime desc limit ${(page - 1) * pageSize}, ${pageSize}`
        db.query(sql, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('获取用户群成员列表', 1, result))
        })
    })

    // 建群
    router.post('/createGroup', loginAuth, (req, res) => {
        const body = req.body
        const sql = 'insert into my_groups (group_name, group_member_num) values (?, ?)'
        const param = [body.groupName, body.members.length]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            // res.send(mesRes('建群', 1, result))
            insertGroupMember(result.insertId, body.groupName, body.members, res)
        })
    })
    // 添加群成员
    const insertGroupMember = (id, name, arr, res) => {
        const sql = 'insert into group_member (group_id, group_name, member_id, member_state, link) values ?'
        const param = []
        arr.forEach((item) => {
            // [群id，群名，成员id，成员身份（0：普通 1：管理 2：群主），是否为成员]
            param.push([id, name, item.id, item.type, 1])
        })
        db.query(sql, [param], (errs, results) => {
            if (errs) return res.send(mesRes(errs.message, 0, errs))
            res.send(mesRes('建群', 1, results))
        })
    }

    // 发起群申请
    router.post('/groupApply', loginAuth, (req, res) => {
        const body = req.body
        const sql = 'insert into group_request (send_id, recv_id, group_id, state, link) values (?, ?, ?, ?, ?)'
        const param = [body.sendId, body.recvId, body.groupId, 0, 0]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('发起群申请', 1, result))
        })
    })

    // 群申请处理
    router.post('/updateGroupRequest', loginAuth, (req, res) => {
        const body = req.body
        const sql = `update group_request set state = ? where Id = ?`
        // state 2拒绝 1通过 0未处理
        const param = [body.state, body.id]
        db.query(sql, param, (err, result) => {
            if (err) return res.send(mesRes(err.message, 0, err))
            res.send(mesRes('群申请处理', 1, result))
        })
    })

    // 注册路由
    app.use('/api', router)
}