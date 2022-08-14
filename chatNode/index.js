// 导入模块
require('./scoket/index')
const cors = require('cors')
const express = require('express')
const routerWeb = require('./router/web')

const app = express()


const http = require('http')
const port = 80



// 解决跨域问题
app.use(cors())
// 解决前端传值，接受不到的问题
app.use(express.json())

app.use('/', express.static(__dirname + '/public'));

// 全局生成一个密钥  用于用户的token
app.set('secret', 'asfasdfgsdagdsfg')

// 注册路由
routerWeb(app)



const server = http.createServer(app)

// ws与express共用一个端口
const websocket = require('ws').Server
// const wss = new websocket({ port: 9000 })
const wss = new websocket({ server })
let clients = [] // 记录客户端对象
let i = 0 // 记录客户端序号
// 广播信息
const broadcast = (msg, ws) => { // broadcast是把信息发布（广播）给其他客户端
    for (let key in clients) { // clients：记录着所有的客户端对象
        clients[key].send(msg + '')
    }
}
// 绑定事件connection，此事件是有客户端连接时触发
wss.on('connection', (ws) => {
    ws.name = ++i
    clients.push(ws) // 把客户端对象保存起来

    // 给客户端绑定message消息事件，当客户发消息时，触发该事件
    ws.on('message', (msg) => { // 给客户端对象message事件，有信息发过来了
        // clients[key].send(ws.name + '说：' + msg)
        // console.log(':' + msg)
        broadcast(msg, ws) // 把客户端发过来的信息，广播给客户端
    })

    ws.on('close', () => { // 给客户端对象绑定close事件，客户端关闭了
        console.log(ws.name + '离开了聊天室')
    })
})

server.listen(port, () => {
    console.log('http://192.168.3.6:80')
})



// // 起服务
// app.listen(80, () => {
//     console.log('http://192.168.3.6:80')
// })