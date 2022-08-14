import GMessage from '@/components/g-message/index.ts'
import user from '@/store/modules/user.ts'
//new WebSocket()，就触发了服务器端的connection事件
// var wsUrl = 'wss://192.168.3.6:9000/'
// var ws = new WebSocket('wss://192.168.3.6:9000/')
const wsSURL = import.meta.env.VITE_APP_WSS_URL
var wsUrl = wsSURL
var ws = new WebSocket(wsSURL)
let lockReconnect = false // 是否重连
let timeoutnum = null // 断线重连
let timeout = 10000 // 10秒一次心跳

const initScoket = (serveUrl = wsUrl) => {
    ws = new WebSocket(serveUrl)
    //当连接上服务器端，即打开连接后，触发
    ws.onopen = function () {
        // ws.send(JSON.stringify({ eventType: 'HEARTPING' }))
        heartHandle.reset()
        heartHandle.start()
    }
    //当接收到（服务器端的）信息后，触发
    ws.onmessage = function (event) {
        // var chatroot = chat.value
        // chatroot.innerHTML += '<br/>' + event.data
        if (event.data.indexOf('HEARTPING') === -1) {
            window.dispatchEvent(new CustomEvent('onmessageWS', {
                detail: {
                    data: event.data
                }
            }))
        } else {
            console.log('心跳：' + event.data)
        }
    }
    //当服务器端关闭时，触发
    ws.onclose = function () {
        lockReconnect = false
        console.log('Closed')
        reconnect()
    }
    //当出错时，触发
    ws.onerror = function (err) {
        lockReconnect = false
        console.log('Error:' + err)
        reconnect()
    }
}

const sendWs = (msg) => {
    ws.send(JSON.stringify(msg))
}

const reconnect = () => {
    if (lockReconnect) return
    lockReconnect = true
    // 没连接上会一直重连，设置延迟避免请求过多
    timeoutnum && clearTimeout(timeoutnum)
    timeoutnum = setTimeout(() => {
        initScoket(wsUrl)
        lockReconnect = false
    }, timeout)
}

const heartHandle = {
    timeout: 5000,
    timeoutObj: null,
    reset: () => {
        clearInterval(heartHandle.timeoutObj)
        return this
    },
    start: () => {
        heartHandle.timeoutObj = setInterval(function(){
            ws.send(JSON.stringify({ eventType: 'HEARTPING' }))
            // console.log("给服务器发送:heartbeat")
        }, heartHandle.timeout)
    }
}

export { sendWs, initScoket }