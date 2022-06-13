<template>
    <div class="contanir theme">
        <div class="box">
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
        </div>
    </div>
</template>

<script lang="ts">
    export default { name: 'login' }
</script>
<script setup lang="ts">
    import { reactive, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import gCode from '@/components/g-code/index.vue'
    import GMessage from '@/components/g-message/index'

    const router = useRouter()

    const state = reactive({
        num: '',
        name: '',
        pass: '',
        code: ''
    })
    state.num = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    // https://zhuanlan.zhihu.com/p/481640259 解决给组件加name的方法
    // 因为使用auto-import插件，会自动导入onMounted等vue或vue-router的方法，所以不需要每次都导入
    onMounted(() => {
        // console.log('onMounted')
    })

    // 刷新验证码
    const changeCode = () => {
        state.num = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000)
    }

    // 校验
    const checkHandle = () => {
        console.log(state)
        if (state.name !== 'admin') return '账号错误'
        else if (state.pass !== 'admin') return '密码错误'
        else if (state.code.toString() !== state.num.toString()) return '验证码不一致'
        else return true
    }

    // 登录方法
    const loginHandle = () => {
        console.log(checkHandle())
        if (checkHandle() !== true) {
            GMessage({message: checkHandle(), type: 'error', duration: 1500})
            return false
        }
        GMessage({ message: '登录成功', type: 'success', duration: 2000 })
        sessionStorage.setItem('token', 'user:admin')
        router.push('/index')
    }
</script>

<style lang="scss" scoped>
    .contanir {
        width: 100vw;
        height: 100vh;
        background: url('@/assets/img/login.jpeg') no-repeat;
        background-size: cover;
        
        .box {
            border: 1px solid;
            border-image: linear-gradient(#00ffff, #0000ff) 10 60;
            background: linear-gradient(145deg, rgba(53, 43, 77, 0.5), rgba(97, 86, 182, 0.5));
            color: #ffffff;
            padding: 40px 20px;
            @include wh(350px, 420px);
            @include pcenter(50%, 10%, -50%, 0);
            box-sizing: border-box;

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
                cursor: pointer;
            }
        }
    }
</style>