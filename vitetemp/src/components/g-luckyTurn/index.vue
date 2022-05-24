<template>
  <div class="component theme"><!-- 九宫格抽奖机 -->
      <!-- 转盘玩法组件 -->
      <!-- 
          栗子：
              <lucky-turn :luckIndex="luckIndex" :isShowPrz="true" @endPlay="endPlay" ref="lucky"></lucky-turn>
      -->
      div  ios低版本会出现图片闪烁
      <div
          :class="['wheel-bg', state.isShowPrz && 'demo_css']"
          :style="{
              width: `${ state.luckyW / 750 * 10 }rem` || '',
              height: `${ state.luckyH / 750 * 10 }rem` || '',
              transform: state.rotate_angle,
              transition: state.rotate_transition
          }"
      >
          <div v-show="state.isShowPrz">
              <!-- 转盘的每个格子 通常不需要，一般UI是直接画在背景图中了 -->
              <div :class="['prize_item', `prize_item_${+index+1}`]" v-for="(item,index) in state.prize_list" :key="index"></div>
          </div>
      </div>
      canvas
      <canvas
        id="myCanvas"
        :class="['wheel-bg-canvas', state.isShowPrz && 'demo_css']"
        :style="{
            width: `${ state.luckyW / 750 * 10 }rem` || '',
            height: `${ state.luckyH / 750 * 10 }rem` || '',
            transform: state.rotate_angle,
            transition: state.rotate_transition
        }"
      ></canvas>

      <!-- 应在父组件显示按钮 -->
      <div class="box-btn">
        <div class="box-arrow"></div>
        <button @click="rotate_handle">开始</button>
      </div>
  </div>
</template>

<script lang="ts">
export default { name: 'gLuckyTurn' }
</script>
<script setup lang="ts">
    import { onMounted, defineEmits } from 'vue'
    const emits = defineEmits(['endPlay'])
    /**
     * 传入参数
     * @param {Number} luckIndex    中奖下标 用来控制最终转盘停留的角度
     * @param {Number} luckyW       转盘图片宽度
     * @param {Number} luckyH       转盘图片高度
     * @param {Number} luckyImg     转盘图片地址
     * @param {Number} isShowPrz    控制是否显示转盘上的八等分格子，通常用来没有切图时的调试
     * @param {Function} endPlay    一轮抽奖后的回调函数
     */
    const state: any = reactive({
        // props-----
        luckIndex: 0, // 第一位从0开始计算
        luckyW: 1500,
        luckyH: 1500,
        isShowPrz: false,
        // props-----
        awardName: "", // 奖品名称

        imgWidth: 0,
        imgHeight: 0,
        prize_list: [
            {}, {}, {}, {}, {}, {}, {}, {}
        ], // 奖品列表
        start_rotating_degree: 0, // 初始旋转角度
        rotate_angle: 0, // 将要旋转的角度
        start_rotating_degree_pointer: 0, // 指针初始旋转角度
        rotate_angle_pointer: 0, // 指针将要旋转的度数
        rotate_transition: "transform 6s ease-in-out", // 初始化选中的过度属性控制
        rotate_transition_pointer: "transform 12s ease-in-out", // 初始化指针过度属性控制
        click_flag: true, // 是否可以旋转抽奖
        index: 0 // 中奖编号
    })
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        console.log('onMounted')
        const can: any = document.querySelector('#myCanvas')
        var ctx = can.getContext('2d')
        
        // 导入底图
        const baseImg: HTMLImageElement|any = new Image()
        baseImg.crossorigin = 'Anonymous'
        baseImg.src = 'https://gem530.github.io/img/lucky_bg.png'

        baseImg.onload = () => {
            state.imgWidth = baseImg.width
            state.imgHeight = baseImg.height
            can.width = state.imgWidth
            can.height = state.imgHeight
            // canvas的width和height要与图片width和height相等，是为了图片不模糊，但是canvas的style里的width和height可以不同
            console.log(state.luckyW, can.width, can.height, baseImg.width, baseImg.height)
            console.log(state.luckyW / 750 * 10 * 16)
            ctx.drawImage(baseImg, 0, 0, 666, 665)
        }
    })

    // 父组件调用此方法开
    const rotate_handle = () => {
        state.index = state.luckIndex
        rotating()
    }

    // 开始转盘
    const rotating = () => {
        if (!state.click_flag) return

        var during_time = 5; // 默认为1s
        var random = Math.floor(Math.random() * 7)
        var result_index = state.index; // 最终要旋转到哪一块，对应prize_list的下标
        var result_angle = [
            337.5,
            292.5,
            247.5,
            202.5,
            157.5,
            112.5,
            67.5,
            22.5
        ]; // 最终会旋转到下标的位置所需要的度数
        var rand_circle = 4 // 附加多转几圈，2-3
        state.click_flag = false // 旋转结束前，不允许再次触发

        // 转动盘子
        var rotate_angle =
            state.start_rotating_degree +
            rand_circle * 360 +
            result_angle[result_index] -
            (state.start_rotating_degree % 360)

        // 在之前的角度基础上再进行角度增加
        state.start_rotating_degree = rotate_angle
        state.rotate_angle = "rotate(" + rotate_angle + "deg)"

        // 旋转结束后，允许再次触发
        setTimeout(() => {

            state.click_flag = true
            emits("endPlay", state.click_flag)
            console.log(state.click_flag)
        }, during_time * 1000 + 1500) // 延时，保证转盘转完
    }
</script>

<style lang="scss" scoped>
.demo_css {
    position: relative;
    background-color: #e3e3e3;
    border-radius: 50%;
}
.wheel-bg {
    position: relative;
    margin: 0 auto;
    /* margin-top: 314px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    width: 600px;
    height: 600px;
    /* // 网络资源图片，低版本ios测试机出现图片一闪一闪的问题，直接改成本地的了 */
    /* 无效，应使用canvas画布来实现 */
    background-image: url('https://gem530.github.io/img/lucky_bg.png');
    background-size: contain;
    background-position: 50% 50%;
    overflow: hidden;
}
.wheel-bg-canvas {
    position: relative;
    margin: 0 auto;
    /* margin-top: 314px; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    /* width: 600px;
    height: 600px; */
    /* // 网络资源图片，低版本ios测试机出现图片一闪一闪的问题，直接改成本地的了 */
    /* 无效，应使用canvas画布来实现 */
    /* background-image: url('./img/lucky_bg.png');
    background-size: contain;
    background-position: 50% 50%; */
    overflow: hidden;
}

.prize_item {
    position: absolute;
    z-index: 3;
    width: 122px;
    height: 243px;
}

.prize_item_1 {
    top: 0;
    right: 165px;
    transform: rotate(20deg);

    background: cornflowerblue;
}
.prize_item_2 {
    top: 98px;
    right: 53px;
    transform: rotate(67deg);

    background: lightcyan;
}
.prize_item_3 {
    top: 232px;
    right: 70px;
    transform: rotate(-250deg);

    background: lawngreen;
}
.prize_item_4 {
    top: 334px;
    right: 164px;
    transform: rotate(-205deg);

    background: lightgreen;
}
.prize_item_5 {
    top: 328px;
    left: 164px;
    transform: rotate(-160deg);

    background: lightcoral;
}
.prize_item_6 {
    top: 232px;
    left: 70px;
    transform: rotate(-111deg);

    background: darkmagenta;
}
.prize_item_7 {
    top: 98px;
    left: 53px;
    transform: rotate(-69deg);

    background: lightpink;
}
.prize_item_8 {
    top: 0;
    left: 165px;
    transform: rotate(-20deg);

    background: lightgoldenrodyellow;
}

.box-btn {
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translate(-50%, 0);
}

.box-btn .box-arrow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -100%);
    width: 5px;
    height: 25px;
    background: #000000;
}
</style>