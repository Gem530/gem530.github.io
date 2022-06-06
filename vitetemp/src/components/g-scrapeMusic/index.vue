<template>
    <!-- 刮刮乐 -->
    <div class="component theme" ref="box">
        <img
            ref="oImg"
            :src="props.url"
            :style="`width: ${props.width};height: ${props.height};`">
        <!-- <input type="text" name="" ref="txt"> -->
    </div>
</template>

<script lang="ts">
export default { name: 'g-scrape-music' }
</script>
<script setup lang="ts">
    import { onMounted, ref, defineProps, defineEmits } from 'vue'
    const emits = defineEmits(['getResult'])
    const box = ref()
    // const txt = ref()
    const oImg = ref()
    const props = withDefaults(defineProps<{
        url?: string, // 底层图片
        width?: string, // 图片宽度
        height?: string, // 图片高度
        maxArea?: number // 刮开多少，自动展示所有
    }>(), {
        url: '',
        width: '300px',
        height: '300px',
        maxArea: 30
    })
    let flag = ref(true)
    if (navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
        flag.value = true
    } else {
        flag.value = false
    }
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        console.log('onMounted')
        //oImg.readyState 图片加载状态
        if( oImg.value.readyState === "complete" ){
            draw() //true表示已经加载完成 执行draw()方法
        } else {
            //图片加载完成执行draw方法
            oImg.value.onload = function () {
                draw()
            }
        }
    })

    const draw = () => {    //等图片加载完成后再添加canvas画布在上面
        const can: HTMLCanvasElement|any = document.createElement('canvas') //创建一个canvas画布
        can.width = oImg.value.width //等于图片的宽高
        can.height = oImg.value.height
        can.style.position = "absolute"    //canvas画布设置浮动会漂浮在图片上
        can.style.zIndex = 2
        can.style.left = oImg.value.offsetLeft + "px" //保存与画布位置一致
        can.style.top = oImg.value.offsetTop + "px"
        //找到图片的父级：parentNode  在oImg子元素前面添加canvas标签：insertBefore
        oImg.value.parentNode.insertBefore( can, oImg.value ) //在img前面去插入canvas标签
        let ctx = can.getContext('2d')
        ctx.fillStyle = "#bbb" //刮刮乐的颜色
        ctx.fillRect( 0, 0, oImg.value.width, oImg.value.height) //填充宽度

        //合成:处理合成图片的透明样式；
        //拖拽的时候，canvas图层显示透明；destination-out：新图形与原图形重叠部分透明
        ctx.globalCompositeOperation = "destination-out"
        ctx.strokeStyle = "#eee"   //触笔的颜色 随便  因为它终究变成透明
        ctx.lineWidth = 30    //拖动时开始画线的线宽
        ctx.lineCap = "round"  //这两步是把画笔变成圆形

        // div.getBoundingClientRect().top 获取当前元素离屏幕顶部距离
        const top = box.value.getBoundingClientRect().top
        const left = box.value.getBoundingClientRect().left

        if (!flag.value) {
            // pc端
            //按下，移动，抬起事件
            can.onmousedown = function(e: MouseEvent){
                e = e || window.event  //兼容低版本IE浏览器
                //e.pageX距离文档右边缘； offsetLeft：canvas画布距离文档的右边距离
                let x = e.pageX - can.offsetLeft - left   //得到的x是在canvas上的坐标值
                let y = e.pageY - can.offsetTop - top
                ctx.beginPath()
                // ctx.moveTo(  x,y )//从哪里开始来画
                ctx.arc( x,y,15,0,6.3,false )  //点第一下是画一个圆
                ctx.fill()
                //按下后拖拽
                can.onmousemove  = function(e: MouseEvent){   //拖动时一直执行下面
                    e = e || window.event  //兼容低版本IE浏览器
                    e.preventDefault()
                    ctx.beginPath()    //拖动时开始画线
                    ctx.moveTo(x,y) //起始点   
                    ctx.lineTo(e.pageX - can.offsetLeft - left, e.pageY - can.offsetTop - top) //移动的过程

                    //每次移动的时候，样式所在的坐标；
                    x = e.pageX - can.offsetLeft - left   //第二次渲染刮图片效果的起始点应该在上一次的终止点
                    y = e.pageY - can.offsetTop - top
                    ctx.stroke()   //弹出图形并恢复画布
                }
                document.onmouseup = function(){
                    //抬起后将事件注销
                    can.onmousemove = null
                    this.onmouseup = null
                    check()    //完成后通过像素计算刮过的的百分比
                }
            }
        } else {
            // 移动端
            //按下，移动，抬起事件
            can.ontouchstart = function(e: TouchEvent){
                // event = e || window.event  //兼容低版本IE浏览器
                // return new Promise((resolve, reject))
                // 鼠标按下时的x/y坐标
                // let e = { pageX: 0, pageY: 0 }
                // if (flag) {
                //     document.addEventListener('touchend', this.moveEnd)
                //     e = { pageX: event.touches[0].pageX, pageY: event.touches[0].pageY }
                // } else {
                //     e = { pageX: event.pageX, pageY: event.pageY }
                // }
                // return e
                //e.pageX距离文档右边缘； offsetLeft：canvas画布距离文档的右边距离
                let x = e.touches[0].pageX - can.offsetLeft - left   //得到的x是在canvas上的坐标值
                let y = e.touches[0].pageY - can.offsetTop - top
                ctx.beginPath()
                // ctx.moveTo(  x,y )//从哪里开始来画
                ctx.arc( x,y,15,0,6.3,false )  //点第一下是画一个圆
                ctx.fill()
                //按下后拖拽
                can.ontouchmove  = function(e: TouchEvent){   //拖动时一直执行下面
                    e = e || window.event  //兼容低版本IE浏览器
                    e.preventDefault()
                    ctx.beginPath()    //拖动时开始画线
                    ctx.moveTo(x,y) //起始点   
                    ctx.lineTo(e.touches[0].pageX - can.offsetLeft - left, e.touches[0].pageY - can.offsetTop - top) //移动的过程

                    //每次移动的时候，样式所在的坐标；
                    x = e.touches[0].pageX - can.offsetLeft -left   //第二次渲染刮图片效果的起始点应该在上一次的终止点
                    y = e.touches[0].pageY - can.offsetTop - top
                    ctx.stroke()   //弹出图形并恢复画布
                }
                document.ontouchend = function(){
                    //抬起后将事件注销
                    can.onmousemove = null
                    this.onmouseup = null
                    check()    //完成后通过像素计算刮过的的百分比
                }
            }
        }

        const check = () => {   
            //获取画布的像素列表
            let data = ctx.getImageData( 0,0,can.width,can.height).data
            let n = 0  //计算透明像素的个数
            for( let i = 0; i<data.length; i+=4 ){    //感觉这一步比较消耗性能
                //RGBA
                if( data[i]== 0 && data[i+1] ==0 && data[i+2] ==0&&data[i+3] ==0 ){
                    n++
                }
            }
            let f = n*100/(can.width*can.height)  //算出所刮的面积的占比；
            // txt.value.value = `刮开面积:${f.toFixed(2)}%`
            //刮开面积的比例
            if( f > props.maxArea ){   //如果所刮的面积大于30%   则将canvas画布整体清除fillRect
                ctx.beginPath()
                ctx.fillRect( 0,0,can.width , can.height )
                // txt.value.value = "刮开面积大于30%，全部显示"
            }
            emits('getResult', {
                currentArea: f,
                isSuccess: f > props.maxArea
            })
        }
    }
</script>

<style lang="scss" scoped>

</style>