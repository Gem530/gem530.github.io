import pako from 'pako'
import mitt from 'mitt'
import NodeWebSocket from 'ws'

const emitter = mitt()

/* 解压gzip */
function ungzip(data: any,callback?: any){
  return new Promise((resolve, reject) => {
    if(data instanceof Blob){
      const reader = new FileReader();
      reader.readAsBinaryString(data)
      reader.onloadend = ()=>{
        const result: any = reader?.result;
        if(result){
          const resultArrChar = result.split('').map((x: any)=>x.charCodeAt(0));
          const charData = new Uint8Array(resultArrChar);
          const resData = JSON.parse(pako.inflate(charData,{to:'string'}))
          if(callback && typeof callback === 'function'){
            callback(resData)
          }
          resolve(resData)
        }
      }
    }
  })
 }

class Socket {
  // ws实例
  ws: any = null;
  // wsUrl
  wsUrl = '';
  // 心跳时间间隔
  heartTime = 5000;
  // 火币的ping
  serverPing = undefined;
  // 定时器Id
  timerId: any = null;
  constructor(wsUrl: string, config: any = {}) {
    wsUrl && (this.wsUrl = wsUrl)
    //创建WebSocket实例
    this.created();
    window.onbeforeunload = ()=>{
        //监听浏览器关闭时销毁
        this.destroy();
    }
  }
  created () {
    const WS = "WebSocket" in window ? WebSocket : NodeWebSocket
    if (WS) {
      if (!this.ws && this.wsUrl) {
        let ws = new WS(this.wsUrl);
        ws.onopen = this.onopen.bind(this)
        ws.onerror = this.onerror.bind(this)
        ws.onclose = this.onclose.bind(this)
        ws.onmessage = this.onmessage.bind(this)
        this.ws = ws
      }
    } else {
      console.log('Not WebSocket')
    }
  }
  onopen () {
    this.heartStart()
  }
  onerror (error: any) {
    console.error('error', error)
    this.heartStop()
    this.created()
  }
  onclose () {
    this.heartStop()
    this.ws.close()
  }
  async onmessage (event: any) {
    // console.log('message:', event)
    try {
      if (event.data instanceof Blob) {
        const data: any = await ungzip(event.data)
        if (data.ping) {
          this.serverPing = data.ping
        } else if (data && data.ch) {
            // emitter 发送消息
            emitter.emit(this.getSubscribName(['send', data.ch]), data);
        }
        // console.log('data:', data)
      }
    } catch (err) {}
  }
  sendMsg (data: any, callback?: any) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data))
      // emitter 接受消息 直接通过回调函数接受到,无需通过onmessage全局接受
      callback && emitter.on(this.getSubscribName(['send', data.sub]), callback)
    }
  }
  unSendMsg (data: any) {
    if (this.ws) {
      this.ws.send(JSON.stringify(data))
      // emitter 接受消息 直接通过回调函数接受到,无需通过onmessage全局接受
      // callback && emitter.on(this.getSubscribName(['send', data.sub]), callback)
    }
  }
  destroy () {
    this.onclose()
  }
  heartStart () {
    // console.log(1, this.serverPing, this.timerId)
    if (this.serverPing) {
      this.ws.send(JSON.stringify({pong: this.serverPing}))
    }
    if (!this.timerId) {
      this.timerId = setInterval(() => {
        if (this.ws) {
          // console.log(JSON.stringify({pong: this.serverPing}))
          this.ws.send(JSON.stringify({pong: this.serverPing}))
        }
      }, this.heartTime)
    }
  }
  heartStop () {
    if (this.timerId) {
      clearInterval(this.timerId)
      this.timerId = null
    }
  }
  getSubscribName (arr: string[]) {
    let cbkey =""
    if(arguments && arguments.length>0){
        const argumentsArr = arr
        argumentsArr.forEach(v=>cbkey+=`${v}@`)
    }
    return `${cbkey}${this.wsUrl}`
  }
}

export default Socket