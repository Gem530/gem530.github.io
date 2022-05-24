<template>
  <div class="component theme" ref="box" :style="`width: ${props.width};height: ${props.height};`">

    <div class="mask theme" v-show="state.flag" @click="state.flag = !state.flag">点击签署</div>

    <canvas
      ref="myCanvas"
    ></canvas>

    <div class="btn-box">
      <!-- 是否把底边栏的按钮移到侧边 btn-box-lefts -->
      <div class="btn-base">
        <div
          class="base-item"
          :key="i"
          v-for="(item, i) in state.btnsList"
          @click="item.fun()"
        >{{item.name}}</div>
      </div>

      <div class="btn-sub" v-show="state.subBtnFlag">
        <div
          class="base-item"
          :key="i"
          :style="returnColorOrWidth(item)"
          v-for="(item, i) in state.baseList"
          @click="chooseColorOrWidth(item.value)"
        >{{item.name}}</div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
export default { name: 'g-draw-board' }
</script>
<script setup lang="ts">
  import {
    ref,
    watch,
    nextTick,
    reactive,
    onMounted,
    defineProps,
    defineEmits,
    defineExpose,
    withDefaults
  } from 'vue'
  const emits = defineEmits(['upload'])
  /**
   * width="350px" // 非必填 签字板宽度 默认100%
   * height="350px" // 非必填 签字板高度 默认200px
   * background="#000" // 非必填 签字板背景色 默认#fff
   * default-color="pink" // 非必填 默认画笔颜色
   * default-thickness="7" // 非必填 默认画笔粗细
   * :colors="[{name:'黑',value:'#000'},{name:'粉',value:'pink'}]" // 非必填 画笔颜色列表 格式[{ name: '', value: '' }]
   * :thickness="[{name:'细',value:'1'},{name:'粗',value:'5'}]" // 非必填 画笔粗细列表 格式[{ name: '', value: '' }]
   * @upload="getImageBase" // 签字板结果 返回一个参数 blob 暂时是返回base64，便于演示结果
   */
  const props: any = withDefaults(defineProps<{
    width?: string, // 非必填 签字板宽度 默认100%
    height?: string, // 非必填 签字板高度 默认200px
    colors?: Array<{ name: string, value: string }>, // 非必填 画笔颜色列表 格式[{ name: '', value: '' }]
    thickness?: Array<{ name: string, value: string }>, // 非必填 画笔粗细列表 格式[{ name: '', value: '' }]
    background?: string, // 非必填 签字板背景色 默认#fff
    defaultColor?: string, // 非必填 默认画笔颜色
    defaultThickness?: string // 非必填 默认画笔粗细
  }>(), {
    width: '100%',
    height: '200px',
    colors: () => [{
      name: '红',
      value: '#ff0000',
    }, {
      name: '蓝',
      value: '#0000ff',
    }, {
      name: '黄',
      value: '#ffff00',
    }, {
      name: '紫',
      value: '#ff00ff',
    }, {
      name: '粉',
      value: 'pink',
    }],
    thickness: () => [{
      name: '细',
      value: '1',
    }, {
      name: '中',
      value: '3',
    }, {
      name: '粗',
      value: '7',
    }],
    background: '#fff',
    defaultColor: '#000',
    defaultThickness: '2'
  })
  const box = ref()
  const ctx = ref()
  const myCanvas = ref()
  const state: any = reactive({
    e: {
      pageX: '',
      pageY: ''
    },
    flag: true, // 控制遮挡层是否显示
    color: '#000', // 笔画颜色
    width: '', // canvas宽度
    height: '', // canvas高度
    subType: '', // 选择的二级按钮类型 colorsList颜色 widthsList笔画粗细
    moveFlag: false, // 是否开始签字
    thickness: '2', // 笔画粗细
    subBtnFlag: false, // 是否显示二级按钮
    baseList: [], // 二级按钮数组
    btnsList: [{
      name: '颜色',
      fun: () => openColorOrWidth('colors')
    }, {
      name: '粗细',
      fun: () => openColorOrWidth('thickness')
    }, {
      name: '清除',
      fun: () => clearCanvas()
    }, {
      name: '提交',
      fun: () => submitCanvas()
    }],
  })

  watch(() => props, (val, old) => {
    if (val.defaultColor) {
      state.color = val.defaultColor
    }
    if (val.defaultThickness) {
      state.thickness = val.defaultThickness
    }
  }, { deep: true, immediate: true })

  onMounted(() => {
    ctx.value = myCanvas.value.getContext('2d')
    resizeChange()

    window.addEventListener('mouseup', end)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', start)
    window.addEventListener('touchend', end)
    window.addEventListener('touchmove', move)
    window.addEventListener('touchstart', start)
  })

  const resizeChange = () => {
    nextTick(() => {
      state.width = props.width === '100%' ? (box.value.clientWidth + 'px') : props.width
      state.height = props.height === '100%' ? (box.value.clientHeight + 'px') : props.height
      // 改变canvas宽高时，会清空canvas已有内容
      myCanvas.value.setAttribute('width', state.width)
      myCanvas.value.setAttribute('height', state.height)
      clearCanvas()
    })
  }

  // 返回按钮样式
  const returnColorOrWidth = (item: Record<string, any>) => {
    return state.subType === 'colors' ?
      `color: ${item.value};border-color: ${state.color === item.value ? state.color : ''}` :
      `border-color: ${state.thickness === item.value ? state.color : ''}` // font-size: ${item.value}px;
  }

  // 打开颜色或者粗细选择框
  const openColorOrWidth = (type: string) => {
    if (state.subType !== type) {
      state.subBtnFlag = true
    } else {
      state.subBtnFlag = !state.subBtnFlag
    }
    state.subType = type
    state.baseList = props[state.subType]
  }

  // 选择颜色或者粗细
  const chooseColorOrWidth = (value: string) => {
    let temp = state.subType === 'colors' ? 'color' : 'thickness'
    state[temp] = value
    state.subBtnFlag = false
  }
  
  // 清除画布
  const clearCanvas = () => {
    ctx.value.fillStyle = props.background
    ctx.value.fillRect(0, 0, myCanvas.value.width, myCanvas.value.height)
  }

  // 提交画布
  const submitCanvas= () => {
    ctx.value.drawImage(myCanvas.value, 0, 0, myCanvas.value.width, myCanvas.value.height)
    const tempURL = myCanvas.value.toDataURL('image/png', 1) // 第二个参数是图片质量0-1，默认是0.92
    myCanvas.value.toBlob(function (blob: Blob) {
      emits('upload', tempURL)
    }, 'image/png')
  }

  // 根据pc或是移动端来返回坐标
  const returnXY = (event: MouseEvent|any) => {
    // 鼠标按下时的x/y坐标
    let e = { pageX: 0, pageY: 0 }
    if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
      const eventNew: TouchEvent = event
      e = { pageX: eventNew.touches[0].pageX, pageY: eventNew.touches[0].pageY }
    } else {
      e = { pageX: event.pageX, pageY: event.pageY }
    }
    return e
  }

  // 按下鼠标或者手指
  const start = (e: MouseEvent|TouchEvent) => {
    state.moveFlag = true
    state.e = returnXY(e)
  }

  // 鼠标或者手指移动
  const move = (e: MouseEvent|TouchEvent) => {
    if (!state.moveFlag || state.flag) return
    // div.getBoundingClientRect().top 获取当前元素离屏幕顶部距离
    const top = box.value.getBoundingClientRect().top
    const left = box.value.getBoundingClientRect().left
    const event = returnXY(e)
    ctx.value.beginPath()
    ctx.value.lineWidth = state.thickness // 设置画笔粗细
    ctx.value.strokeStyle = state.color // 设置画笔颜色
    ctx.value.moveTo(state.e.pageX - left, state.e.pageY - top)
    ctx.value.lineTo(event.pageX - left, event.pageY - top)
    ctx.value.stroke()
    state.e = event
  }

  // 鼠标或者手指抬起
  const end = () => {
    state.moveFlag = false
  }

  // 把方法抛出去，父组件才可以调用
  defineExpose({ resizeChange })
</script>

<style lang="scss" scoped>
.component {
  position: relative;
  border: 1px solid $borderColor;
  box-sizing: border-box;
  overflow: hidden;

  .mask {
    @include wh(100%, 100%);
    @include pcenter();
    @include flex();
    z-index: 10;
  }

  .btn-box {
    @include wh(100%, 30px);
    @include pcenter(100%, 0, 0, -100%);
    border-top: 1px solid $borderColor;
    z-index: 2;

    &.btn-box-lefts {
      position: absolute;
      top: 0;
      left: 0;
      transform: translate(30px, 0) rotate(90deg);
      transform-origin: 0 0;
    }

    .btn-base {
      @include wh(100%, 100%);
      @include flex(space-around);
    }

    .btn-sub {
      @include pcenter(0, 0, 0, -110%);
      @include wh(100%, 100%);
      @include flex(space-around);
    }

    .base-item {
      @include wh(50px, 100%, min);
      @include flex();
      background: $white;
      border: 1px solid $borderColor;
      color: $black;
    }
  }
}
</style>