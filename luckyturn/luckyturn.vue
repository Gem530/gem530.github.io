<template>
    <!-- 转盘玩法组件 -->
    <!-- 
        栗子：
            <lucky-turn :luckIndex="luckIndex" :isShowPrz="true" @endPlay="endPlay" ref="lucky"></lucky-turn>
     -->
    <div
        :class="['wheel-bg', isShowPrz && 'demo_css']"
        :style="{
            width: `${ luckyW / 750 * 10 }rem` || '',
            height: `${ luckyH / 750 * 10 }rem` || '',
            transform: rotate_angle,
            transition: rotate_transition
        }"
    >
        <div v-show="isShowPrz">
            <!-- 转盘的每个格子 通常不需要，一般UI是直接画在背景图中了 -->
            <div :class="['prize_item', `prize_item_${+index+1}`]" v-for="(item,index) in prize_list" :key="index"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'luckyTurn',
    /**
     * 传入参数
     * @param {Number} luckIndex    中奖下标 用来控制最终转盘停留的角度
     * @param {Number} luckyW       转盘图片宽度
     * @param {Number} luckyH       转盘图片高度
     * @param {Number} luckyImg     转盘图片地址
     * @param {Number} isShowPrz    控制是否显示转盘上的八等分格子，通常用来没有切图时的调试
     * @param {Function} endPlay    一轮抽奖后的回调函数
     */
    props: ["luckIndex", "luckyW", "luckyH", "luckyImg", "isShowPrz"],
    data() {
        return {
            awardName: "", // 奖品名称

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
        };
    },
    methods: {
        // 父组件调用此方法开
        rotate_handle() {
            this.index = this.luckIndex;
            this.rotating();
        },
        // 开始转盘
        rotating() {
            if (!this.click_flag) return;

            var during_time = 5; // 默认为1s
            var random = Math.floor(Math.random() * 7);
            var result_index = this.index; // 最终要旋转到哪一块，对应prize_list的下标
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
            var rand_circle = 4; // 附加多转几圈，2-3
            this.click_flag = false; // 旋转结束前，不允许再次触发

            // 转动盘子
            var rotate_angle =
                this.start_rotating_degree +
                rand_circle * 360 +
                result_angle[result_index] -
                (this.start_rotating_degree % 360);

            // 在之前的角度基础上再进行角度增加
            this.start_rotating_degree = rotate_angle;
            this.rotate_angle = "rotate(" + rotate_angle + "deg)";

            // 旋转结束后，允许再次触发
            setTimeout(() => {

                this.click_flag = true;
                this.$emit("endPlay", this.click_flag)
            }, during_time * 1000 + 1500); // 延时，保证转盘转完
        }
    }
};
</script>

<style lang="less">

.demo_css {
    background-color: #e3e3e3;
    border-radius: 50%;
}
.wheel-bg {
    position: relative;
    margin: 0 auto;
    margin-top: 314px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    width: 600px;
    height: 600px;
    // 网络资源图片，低版本ios测试机出现图片一闪一闪的问题，直接改成本地的了
    background-image: url('~imgurl/lucky_bg.png');
    background-size: contain;
    background-position: 50% 50%;
    overflow: hidden;
}

.prize_item {
    position: absolute;
    z-index: 3;
    width: 122px;
    height: 243px;

    &_1 {
        top: 0;
        right: 165px;
        transform: rotate(20deg);

        background: cornflowerblue;
    }
    &_2 {
        top: 98px;
        right: 53px;
        transform: rotate(67deg);

        background: lightcyan;
    }
    &_3 {
        top: 232px;
        right: 70px;
        transform: rotate(-250deg);

        background: lawngreen;
    }
    &_4 {
        top: 334px;
        right: 164px;
        transform: rotate(-205deg);

        background: lightgreen;
    }
    &_5 {
        top: 328px;
        left: 164px;
        transform: rotate(-160deg);

        background: lightcoral;
    }
    &_6 {
        top: 232px;
        left: 70px;
        transform: rotate(-111deg);

        background: darkmagenta;
    }
    &_7 {
        top: 98px;
        left: 53px;
        transform: rotate(-69deg);

        background: lightpink;
    }
    &_8 {
        top: 0;
        left: 165px;
        transform: rotate(-20deg);

        background: lightgoldenrodyellow;
    }
}
</style>
