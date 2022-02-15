<template>
    <!-- 九宫格抽奖机 -->
    <div class="gameBox">
        <!-- <div class="bg1"></div> -->
        <div class="start" @click="move">抽奖<br>({{lotteryNum}})次</div>
        <div>
            <div
                v-for="(item,i) in list"
                :key="i"
                :class="['list-item','item' + (i+1), {'active': index == i}]"
            >
                <div class="img1">
                    <img :src="item.image" />
                </div>
                <!-- <p>{{item.name}}</p>
				<p>{{item.id}}</p> -->
            </div>
        </div>

        <!-- 弹窗 -->
        <myMask :show.sync="showModel.getSuccess" type="1" w="607" h="653" showClear="true" bgClear="true">
        	<template slot="content">
        		<div class="totalBox">
        			<div class="toastTitle">
        				恭喜获得
        			</div>
        			<div class="toastContent">
        				<div class="toastBg">
        					{{getTitle}}
        				</div>
        			</div>
        			<p class="toastTip">已分别发放至你的【娃娃】&【优惠券】中， 请及时申请发货</p>
        			<img  @click="togo" class="togo" src="~imgurl/togo.png" alt="">
        		</div>
        	</template>
        </myMask>
    </div>
</template>

<script>
import { ToastPlugin, LoadingPlugin } from "vux";

Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);

import myMask from "./mask";

export default {
	props:['lotterys'],
    components: {
        myMask
    },
	
    data() {
        return {
			getTitle:'1乐币充值券+包邮券',
            showModel: {
                getSuccess:false
            },
            giftMsg: "",
            list: [
                { id: 0, name: "案例1", number: 1, image: "", type: 1 },
                { id: 1, name: "案例2", number: 1, image: "", type: 1 },
                { id: 2, name: "案例3", number: 1, image: "", type: 1 },
                { id: 3, name: "案例4", number: 1, image: "", type: 1 },
                { id: 4, name: "案例5", number: 1, image: "", type: 1 },
                { id: 5, name: "案例6", number: 1, image: "", type: 1 },
                { id: 6, name: "案例7", number: 1, image: "", type: 1 },
                { id: 7, name: "案例8", number: 1, image: "", type: 1 }
            ], //奖品列表
            index: 0, // 当前转动到哪个位置，第一次起点位置0,对应页面item1位置
            count: 8, // 总共有多少个位置
            times: 0, // 转动跑格子次数,
            cycle: 3, // 转动基本次数：即至少需要转动多少次再进入抽奖环节
            speed: 200, // 初始转动速度
            timer: 0, // 转动定时器
            prize: 0, // 中奖位置，接口返回
			lotteryNum:this.lotterys,				//抽奖次数
			pageJumpType:'',
			awardNum:0
        };
    },
	mounted() {
		// console.log('lotterys',this.lotterys)
	},
	computed:{
		
	},
	watch:{
		'showModel.getSuccess':{
			handler(val){
				if(!val){
					this.index = 0
				}
			}
		},
		lotterys(val){
			// console.log(456,val)
			this.lotteryNum = val
		}
	},
    methods: {
		togo(){
			if(this.pageJumpType == 'coin'){
				window.location.href = 'app://myWallet'
			}else if(this.pageJumpType == 'doll'){
				window.location.href = 'app://jump_dollpage'
			}else {			//积分商城
				window.location.href = 'app://couponPage'
			}
		},
        //点击开始抽奖
        move() {
            if (this.times != 0) {
                this.toast("正在抽奖中，请勿重复点击");
            } else {
                this.$vux.loading.show({
                    text: "Loading"
                });
                axios
                    .get(window.baseurl + "activity2020/new_user/luck_draw")
                    .then(res => {
						console.log(123456,res.data.data)
                        if (res.data.code == 1) {	// 
							this.pageJumpType = res.data.data.award_type
							this.awardNum = res.data.data.award_num
							this.lotteryNum = res.data.data.has_award_time
							this.getTitle = res.data.data.award_name
                            this.speed = 150; //每次抽奖速度初始化为200

                            this.prize = +res.data.data.award_num - 1;//从零开始计算
                            this.startRoll();						 //执行抽奖
                            this.giftMsg = 1;//res.data.data.name

                        } else {
                            this.toast(res.data.msg);//res.data.msg
                        }
                        this.$vux.loading.hide();
                    })
                    .catch(() => {
                        this.$vux.loading.hide();
                        this.toast("服务器错误");
                    });
            }
        },
        // 开始转动
        startRoll() {
            this.times += 1; // 转动次数
            this.oneRoll(); // 转动过程调用的每一次转动方法，这里是第一次调用初始化
            this.usePrize();
        },

        // 每一次转动
        oneRoll() {
            let index = this.index; // 当前转动到哪个位置
            const count = 8; // 总共有多少个位置
            index += 1;
            if (index > count - 1) {
                index = 0;
            }
            this.index = index;
        },

        usePrize() {
            // 如果当前转动次数达到要求 && 目前转到的位置是中奖位置
            if (this.times > this.cycle + 10 && this.prize === this.index) {
                clearTimeout(this.timer); // 清除转动定时器



                this.times = 0; // 转动跑格子次数初始化为0，可以开始下次抽奖
				// this.index = 0;
                this.$emit("getIndex"); // 调用父组件方法重新拉数据
                // if (this.prize == 2) {
                    this.showModel.getSuccess = true;
                // } else {
                    // this.showModel.gift = true;
                // }
				
            } else {
                if (this.times < this.cycle + 3) {
                    this.speed -= 4; // 加快转动速度
                } else {
                    this.speed += 10; // 抽奖即将结束，放慢转动速度
                }
                this.timer = setTimeout(this.startRoll, this.speed); //开始转动
            }
        },

        clear() {
			this.index = 0
            this.$refs.mask.clearMask();
        },
        toast(msg) {
            // toast信息
            this.$vux.toast.show({
                type: "text",
                text: msg,
                time: 1500,
                position: "middle"
            });
        }
    }
};
</script>

<style lang="less" scoped>
.gameBox {
	// outline: 3px solid green;
    margin: 0 auto;
    margin-top: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 540px;
    height: 480px;
    // border-radius: 8px;
    // background: red no-repeat left top;
    background-size: 326px 326px;
    position: relative;

    .bg1 {
        position: absolute;
        left: 4.5px;
        top: 4px;
        width: 540px;
        height: 550px;
        // background: yellow no-repeat center;
        // background-size: 317px 317px;
    }
    .bg2 {
        position: absolute;
        left: 4.5px;
        top: 4px;
        width: 317px;
        height: 317px;
        // background: blue no-repeat center;
        // background-size: 317px 317px;
    }
    .start {
		// outline: 3px solid red;
        position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
		
        padding-top: 45px;
        width: 150px;
        height: 150px;
        background: url('~imgurl/page03/time.png') no-repeat;
        background-size: contain;
        background-position: center;
		font-size: 24px;
		text-align: center;
		color: white;
    }

    .list-item {
		// outline: orange;
        position: absolute;
        width: 150px;
        height: 150px;
        // background: rgba(255, 255, 255, 1);
        // border: 2px solid rgba(227, 161, 0, 1);
        border-radius: 8px;
        .img1 {
            margin: 15px auto 3px;
            width: 35px;
            height: 35px;
            img {
                width: 100%;
                height: auto;
            }
        }
        p {
            text-align: center;
            font-size: 13px;
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
        }
    }
    .item1 {
        left: 40px;
        top: 10px;
        background: url('~imgurl/page03/nine01.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
			border-radius: 24px;
            border:4px solid #ff25ba;
        }
    }
    .item2 {
        left: 195px;
        top: 10px;
        background: url('~imgurl/page03/nine02.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
           border-radius: 24px;
           border:4px solid #ff25ba;
        }
    }
    .item3 {
        left: 350px;
        top: 10px;
         background: url('~imgurl/page03/nine03.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
            border-radius: 24px;
            border:4px solid #ff25ba;
        }
    }
    .item4 {
        left: 350px;
        top: 165px;
         background: url('~imgurl/page03/nine04.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
           border-radius: 24px;
           border:4px solid #ff25ba;
        }
    }
    .item5 {
        left: 350px;
        top: 320px;
         background: url('~imgurl/page03/nine05.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
            border-radius: 24px;
            border:4px solid #ff25ba;
        }
    }
    .item6 {
        left: 195px;
        top: 320px;
         background: url('~imgurl/page03/nine06.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
           border-radius: 24px;
           border:4px solid #ff25ba;
        }
    }
    .item7 {
        left: 40px;
        top: 320px;
         background: url('~imgurl/page03/nine07.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
            border-radius: 24px;
            border:4px solid #ff25ba;
        }
    }
    .item8 {
        left: 40px;
        top: 165px;
         background: url('~imgurl/page03/nine08.png') no-repeat;
        background-size: contain;
        background-position: 50% 50%;
        &.active {
            border-radius: 24px;
            border:4px solid #ff25ba;
        }
    }
    // .active {
    //     background: #fff2b1;
    // }
}

.img_box {
    margin: 0 auto;
    margin-top: 215px;
    width: 414px;
    height: 306px;
    line-height: 306px;
    text-align: center;
}
.gift_img {
    display: inline-block;
    vertical-align: middle;
    width: 414px;
    height: 306px;

    &0 {
        width: 192px;
        height: 248px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &1 {
        width: 216px;
        height: 224px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &3 {
        width: 228px;
        height: 112px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &4 {
        width: 230px;
        height: 123px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &5 {
        width: 133px;
        height: 256px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &6 {
        width: 168px;
        height: 251px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
    &7 {
        width: 135px;
        height: 279px;
        background: red;
        background-size: contain;
        background-position: 50% 50%;
    }
}
.gift_msg {
    margin: 0 auto;
    margin-top: 30px;
    width: 426px;
    height: 46px;
    line-height: 46px;
    text-align: center;
    font-size: 35px;
    font-family: Alibaba PuHuiTi;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.gift_btn {
    margin: 0 auto;
    margin-top: 36px;
    width: 325px;
    height: 93px;

    background: orange;
    background-size: contain;
    background-position: 50% 50%;
}
.lose_btn {
    margin-top: 608px;

    background: green;
    background-size: contain;
    background-position: 50% 50%;
}

// // // // 共用类
//
// toast
.vux-loading {
    .weui-toast {
        top: 44%;
        width: 160px;
        min-height: 130px;
        background: rgba(26, 26, 26, 0.8);
        // background: none;
        font-size: 20px;
    }
}
.vux-toast {
    .weui-toast {
        font-size: 28px;
    }
    .weui-toast__content {
        font-size: 20px;
    }
}
</style>

