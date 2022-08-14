// 导入模块
require('./scoket/index')
const cors = require('cors')
const http = require('http')
const express = require('express')
const routerWeb = require('./router/web')
const webSocketHandler = require('./scoket/index')

const app = express()
const port = 80

// 解决跨域问题
app.use(cors())
// 解决前端传值，接受不到的问题
app.use(express.json())
// 静态资源 vue项目打包
app.use('/', express.static(__dirname + '/public'));

// 全局生成一个密钥  用于用户的token
app.set('secret', 'asfasdfgsdagdsfg')

// 注册路由
routerWeb(app)

const server = http.createServer(app)
webSocketHandler(server)

server.listen(port, () => {
    console.log('http://192.168.3.6:80')
})