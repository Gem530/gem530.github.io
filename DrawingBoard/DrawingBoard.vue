<template>
  <div>

    <div class="check-box-sign" ref="checkMasterSignNode">
      <div class="check-sign-tip" v-show="tempMasterFlag" @click="tempMasterFlag = false">点击此处签署</div>
      <img :src="imgNew" style="width: 100%; height: 100%;" v-if="tempMasterFlag && imgNew">
      <canvas
        ref="checkMasterSign"
        v-else
        @touchend="touchEndSign"
        @touchmove="touchMoveSign"
        @touchstart="touchStartSign">
      </canvas>

      <div class="check-sign-bottom" v-show="!tempMasterFlag">
        <el-button @click="selectColorWidth('color')">颜色</el-button>
        <el-button @click="selectColorWidth('width')">粗细</el-button>
        <el-button @click="clearCanvas">清除</el-button>
        <el-button @click="sureCanvasToImg">确认提交</el-button>
      </div>

      <div class="check-sign-choose" v-show="masterColorFlag">
        <div class="check-color-item"
          :key="index"
          :style="`background: ${item}`"
          v-for="(item, index) in colorList"
          @click="chooseColorWidth('color', item)">
        </div>
      </div>

      <div class="check-sign-choose" v-show="masterWidthFlag">
        <div class="check-width-item"
          :key="item.id"
          v-for="item in widthList"
          @click="chooseColorWidth('width', item.id)">
          {{item.name}}
        </div>
      </div>
    </div>

  </div>
</template>

<script lang='ts'>
import {
  uploadFileApi
} from '@/api/commonApi'
import { Component, Vue, Prop, Watch, Ref } from 'vue-property-decorator'
// import { getStaffContactApi } from '@/api/commonApi'

@Component
export default class CheckOrder extends Vue {
  @Prop() img!: string

  @Ref() readonly checkMasterSign: any
  @Ref() readonly checkMasterSignNode: any

  imgNew = ''

  tempTechFlag = true;

  tempMasterPath = [{
    x: 0,
    y: 0
  }]; // 存储手指移动位置 车主、施工中心签名 位置数组

  tempMasterFlag = true;

  colorList = ['#000', '#f00', '#0f0', '#00f']; // 画板颜色列表
  widthList = [{
    id: 3,
    name: '细'
  }, {
    id: 5,
    name: '中'
  }, {
    id: 7,
    name: '粗'
  }]; // 画板粗细列表

  canvasColor = '#000'; // 画板颜色
  canvasWidth = 3; // 画笔粗细

  masterColorFlag = false; // true 选择检车主画板color 面板显示
  masterWidthFlag = false; // true 选择检车主画板width 面板显示

  @Watch('img')
  onImgChanged (val: string): void {
    if (val) {
      this.imgNew = val
    }
  }

  created (): void {
    console.log(1)
    this.imgNew = this.img
  }

  mounted (): void {
    const w = this.checkMasterSignNode.clientWidth
    const h = this.checkMasterSignNode.clientHeight
    this.checkMasterSign.setAttribute('width', w)
    this.checkMasterSign.setAttribute('height', h)
  }

  // 选择显示 画板颜色/粗细
  selectColorWidth (type1: string): void {
    if (type1 === 'color') {
      this.masterColorFlag = !this.masterColorFlag
      this.masterWidthFlag = false
    } else {
      this.masterWidthFlag = !this.masterWidthFlag
      this.masterColorFlag = false
    }
  }

  // 选择画板颜色/粗细
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  chooseColorWidth (type: string, item: any): void {
    if (type === 'color') {
      this.canvasColor = item
    } else {
      this.canvasWidth = Number(item)
    }
    console.log(type, item)
    this.hideColorWidth()
  }

  // 隐藏 颜色、粗细 框
  hideColorWidth (): void {
    this.masterWidthFlag = false
    this.masterColorFlag = false
  }

  // 确认签名，形成图片上传
  sureCanvasToImg (): void {
    this.hideColorWidth()
    const canvas = this.$refs.checkMasterSign as HTMLCanvasElement

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    canvas.toBlob(function (blob) {
      const formData = new FormData()
      formData.append('file', blob || '')
      // formData.append('image_type', 'discern_vin')
      uploadFileApi(formData).then((res: any) => {
        // console.log(res)
        that.tempMasterFlag = true
        that.imgNew = res.data.ossUrl
        that.$emit('uploadCanvasImg', res)
      }).catch(err => that.$dialog.alert({
        title: '提示',
        message: `上传图片失败: ${err.message}`
      }))
    }, 'image/png')
  }

  // 签名板事件
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  touchStartSign (e: any): void {
    const point = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    }

    // 选择检验师 或者 车主签名板
    this.tempMasterPath.push(point)
  }

  // 签名板事件
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  touchMoveSign (e: any): void {
    e.preventDefault() // 阻止手指滑动时 页面滚动
    // 选择检验师 或者 车主签名板
    const canvas = this.$refs.checkMasterSign as HTMLCanvasElement
    const canvasNode = this.$refs.checkMasterSignNode as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const point = {
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    }

    this.tempMasterPath.push(point)

    const oldXY = this.tempMasterPath[this.tempMasterPath.length - 2]
    const left = canvasNode.offsetLeft
    const top = canvasNode.offsetTop
    // console.log(oldXY.x, oldXY.y, left, top)

    // 实现签名
    ctx.beginPath()
    ctx.moveTo(oldXY.x - left, oldXY.y - top)
    ctx.strokeStyle = this.canvasColor // 选择画笔颜色
    ctx.lineWidth = this.canvasWidth // 选择画笔粗细
    ctx.lineTo(point.x - left, point.y - top)
    ctx.stroke()
  }

  // 签名板事件
  touchEndSign (): void {
    console.log('手指离开canvas画板')
  }

  // 清除canvas画板
  clearCanvas (): void {
    const canvas = this.$refs.checkMasterSign as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    ctx.clearRect(0, 0, 1000, 1000)
    this.tempMasterPath = []
    this.tempMasterFlag = true
    this.hideColorWidth()
  }
}
</script>

<style lang='scss' scoped>
@import 'DrawingBoard.scss';
</style>
