<template>
    <div class="contanir theme">
        <div class="box" :class="{ 'box-mobile': !store.getters.base.isPc }">
            <div class="login-title">LOGIN</div>
            <div class="form-input">
                <span>账 号：</span>
                <input type="text" placeholder="账号：admin" v-model="state.name">
            </div>
            <div class="form-input">
                <span>密 码：</span>
                <input type="password" placeholder="密码：admin" v-model="state.pass">
            </div>
            <div class="form-input code">
                <input type="text" placeholder="请输入验证码" v-model="state.code">
                <g-code :num="state.num" :w="60" :h="30" @click="changeCode"></g-code>
            </div>
            <button @click="loginHandle">登录</button>
            <button @click="registerHandle">注册</button>
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'login' }
</script>
<script setup lang="ts">
    import { reactive, onMounted } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter } from 'vue-router'
    import { initScoket } from '@/util/ws.js'
    import {
        loginAPI,
        registerAPI
    } from '@/api/index'
    import gCode from '@/components/g-code/index.vue'
    import GMessage from '@/components/g-message/index'

    const store = useStore()
    const router = useRouter()

    const state = reactive({
        num: '',
        name: 'admin',
        pass: 'admin',
        code: ''
    })

    const reg = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
    store.dispatch('setBaseAction', { isPc: !reg })

    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 刷新验证码
    const changeCode = () => {
        state.num = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
        state.code = state.num
    }
    changeCode()

    // 校验
    const checkHandle = () => {
        // console.log(state)
        if (!state.name) return '账号不能为空'
        else if (!state.pass) return '密码不能为空'
        if (state.code.toString() !== state.num.toString()) return '验证码不一致'
        else return true
    }

    // 登录方法
    const loginHandle = () => {
        // console.log(checkHandle())
        if (checkHandle() !== true) {
            GMessage({message: checkHandle(), type: 'error', duration: 1500})
            return false
        }
        const param = {
            name: state.name,
            pass: state.pass
        }
        loginAPI(param).then((res) => {
            GMessage({ message: '登录成功', type: 'success', duration: 2000 })
            // if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
            //     mobile
            // } else {
            //     pc
            // }
            console.log(res)
            const data = res.data[0]
            store.dispatch('setUserAction', { name: state.name, avator: data.avator, userId: data.Id })
            initScoket()
            sessionStorage.setItem('token', JSON.stringify(res.token))
            const pathUrl = !reg ? '/index' : '/chat'
            router.push(pathUrl)
        }).catch((err) => {
            GMessage({ message: '登录失败：' + err.message, type: 'error', duration: 2000 })
        })
    }

    // 注册方法
    const registerHandle = () => {
        const param = {
            name: state.name,
            pass: state.pass
        }
        registerAPI(JSON.parse(JSON.stringify(param))).then(res => {
            // console.log(res)
            GMessage({ message: res.message, type: 'success', duration: 2000 })
        }).catch(err => {
            // console.log(err, err.message)
            GMessage({ message: '注册失败：' + err.message, type: 'error', duration: 2000 })
        })
    }
</script>

<style lang="scss" scoped>
    .contanir {
        width: 100vw;
        height: 100vh;
        background: url('@/assets/img/login.jpeg') no-repeat;
        background-size: cover;
        box-sizing: border-box;
        
        .box {
            border: 1px solid;
            border-image: linear-gradient(#00ffff, #0000ff) 10 60;
            background: linear-gradient(145deg, rgba(53, 43, 77, 0.5), rgba(97, 86, 182, 0.5));
            color: #ffffff;
            padding: 40px 20px;
            @include wh(350px, 435px);
            @include pcenter(50%, 10%, -50%, 0);
            box-sizing: border-box;

            &.box-mobile {
                width: 85%;
                @include pcenter(50%, 50%, -50%, -50%);
            }

            .login-title {
                padding-left: 10px;
                margin-bottom: 50px;
                font-size: 30px;
                font-weight: 400;
                text-align: center;
                letter-spacing: 16px;
                -webkit-box-reflect: below -10px linear-gradient(transparent, rgba(255, 255, 255, 0.5));
                text-transform: uppercase;
            }

            .form-input {
                @include wh(100%, 30px);
                @include flex();
                margin-bottom: 30px;

                input {
                    flex: 1;
                    height: 30px;
                    padding-left: 10px;
                    margin-left: 10px;
                    outline: none;
                    box-sizing: border-box;
                }

                &.code {
                    input {
                        margin-left: 0;
                        margin-right: 10px;
                    }
                    .component {
                        flex: none;
                    }
                }
            }

            button {
                width: 100%;
                height: 40px;
                background: linear-gradient(145deg, rgba(53, 43, 77, 1), rgba(97, 86, 182, 1));
                border: none;
                font-size: 16px;
                color: #ffffff;
                border-radius: 40px;
                margin-bottom: 10px;
                cursor: pointer;
            }
        }
    }
</style>