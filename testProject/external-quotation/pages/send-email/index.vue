<template>
    <div class="send-email-box flex flex-column">
        <div class="send-email-title one">{{$t('companyAndProductIntroduction1')}}</div>
        <div class="send-email-title">{{$t('companyAndProductIntroduction2')}}</div>
        <div class="send-email">
            <el-form ref="formRef" :model="form" :rules="rules" @submit.native.prevent>
                <!-- <div class="send-email-subtitle" @click="toRegister" v-html="$t('login.needNew', { signUp: `<span class='pointer toRegister'>${$t('login.signUp')}</span>` })"></div> -->

                <el-form-item prop="email">
                    <el-input type="text" v-model="form.email" :placeholder="$t('login.email')" clearable></el-input>
                </el-form-item>

                <!-- <el-form-item prop="googleToken">
                    <div id="robotDom"></div>
                    <el-input v-model="form.googleToken" v-show="false"></el-input>
                </el-form-item> -->

                <div class="send-email-flex"></div>

                <el-button type="primary" @click="sendMsgHandle">{{ $t('login.submit') }}</el-button>
                
                <div v-if="route.query?.getAllhhh == 'false'">
                    <el-button @click="submitAllList">Get All</el-button>
                </div>
                <div v-if="route.query?.getAllhhh == 'false'">
                    <el-button @click="submitAllListUnique">Get All Unique</el-button>
                </div>

            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts" name="Forget">
// definePageMeta({ layout: 'login' })
import dayjs from 'dayjs'

const { t } = useI18n()
const route = useRoute()

const formRef = ref()
const list = ref<string[]>([])
const form = ref<Record<string, any>>({
    email: undefined,
    password: undefined,
    confirmPassword: undefined,
    remember: undefined,
    code: undefined,
    googleToken: undefined,
})
const validateEmail = (rule: any, value: any, callback: any) => {
    if (value == '' || value == undefined || value == null) {
        callback(new Error(t('login.email')))
    } else if (!validEmail(value)) {
        callback(new Error(t('login.emailFormat')))
    } else {
        callback()
    }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value == '' || value == undefined || value == null) {
        callback(new Error(t('login.confirmPassword')))
    } else if (value !== form.value.password) {
        callback(new Error(t('login.passNotMatch')))
    } else {
        callback()
    }
}
const rules = ref({
    email: [{ validator: validateEmail, trigger: 'blur' }],
    password: [{ required: true, message: () => t('login.password'), trigger: 'blur' }],
    confirmPassword: [{ validator: validatePass2, trigger: 'blur' }],
    code: [{ required: true, message: () => t('login.verificationCode'), trigger: 'blur' }],
    googleToken: [{ required: true, message: () => t('login.googleCheck'), trigger: 'blur' }],
})

const sendMsgHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            setEmail()
            let email = form.value.email
            $http('/purchase/email/send', {
                method: 'POST',
                body: form.value.email
            }).then((res: any) => {
                if (res.code == 200) {
                    // ElMessage.success(t('sentToEmail'))
                    // navigateTo('/login')
                    form.value.email = undefined
                    ElMessageBox.confirm(
                        t('sentToEmail',{email: email}),
                        // t('systemPrompt'),
                        {
                        confirmButtonText: t('confirm'),
                        // cancelButtonText: t('cancel'),
                        showCancelButton: false,
                        closeOnClickModal: false,
                        type: 'success',
                        }
                    ).then(() => {
                    }).catch(() => {})
                }
            })
        }
    })
}

// 获取本地所有邮箱
const getAllList = () => {
    const tempList = getLocalStorage('inroductionList')
    list.value = tempList ? JSON.parse(tempList) : []
    // console.log(list.value, typeof list.value)
}
// 邮箱存储到本地
const setEmail = () => {
    // const tempList = getLocalStorage('inroductionList')
    // list.value = tempList ? JSON.parse(tempList) : []
    getAllList()
    list.value.push(form.value.email)
    setLocalStorage('inroductionList', list.value)
}
// 所有邮箱传给后端
const submitAllList = () => {
    getAllList()
    let tempAllList = deepClone(list.value)
    console.log('submitAllList', tempAllList)

    if (route.query?.ecl == 'false') {
        let execlList = []
        for (let i = 0; i < tempAllList.length; i++) {
            execlList.push([tempAllList[i]])
        }
        // console.log(execlList)
        exportExcelByTable(execlList, ['邮箱'])
    }
}
// 所有邮箱去重后传给后端
const submitAllListUnique = () => {
    getAllList()
    let tempAllListUnique = deepClone(list.value)
    tempAllListUnique = [...new Set(tempAllListUnique)]
    console.log('submitAllListUnique', tempAllListUnique)

    if (route.query?.ecl == 'false') {
        let execlList = []
        for (let i = 0; i < tempAllListUnique.length; i++) {
            execlList.push({email:tempAllListUnique[i]})
        }
        // console.log(execlList)
        exportExcelByTable(execlList, ['邮箱'])
    }

    // let tempHead = '标题'
    // let tempData = '数据'
    // let headList = []
    // let datas = []
    // // 10000行，100列，超过更多的位数就会报错:RangeError: Invalid string length
    // for (let i = 1; i <= 100000; i++) {
    //     // 行
    //     let tempDataList: any = {}
    //     for (let j = 1; j <= 200; j++) {
    //         // 列
    //         if (i == 1) {
    //             headList.push(tempHead +'-列:'+ j)
    //         }
    //         tempDataList['key'+j] = tempData +'-行:'+i+'-列:'+j
    //     }
    //     datas.push(tempDataList)
    // }
    // console.log(datas, headList)

    // let headList = ['ID','名称','年龄','身高','体重','学校','爱好','语文','数学','英语','历史','地理','生物','物理','化学','高数']
    // let datas = []
    // for (let i = 0; i < 10000000; i++) {
    //     datas.push({
    //         id: i + 1,
    //         name: '张三',
    //         age: 15,
    //         height: 150,
    //         weight: 90,
    //         school: '二中',
    //         like: '跑步',
    //         yuwen: 91,
    //         shuxue: 92,
    //         yinyu: 53,
    //         lishi: 104,
    //         dili: 105,
    //         shengwu: 86,
    //         wuli: 97,
    //         huaxue: 78,
    //         gaoshu: 79,
    //     })
    // }
    // exportExcelByTable(datas, headList, '模拟数据', '大批量数据导出测试_'+dayjs(new Date()).format('YYYY-MM-DD HH_mm_ss'))
}


function onloadCallback(googleToken: any) {
    form.value.googleToken = googleToken
    formRef.value.validateField('googleToken')
    // console.log('googleToken---', form.value.googleToken)
}

const toRegister = (e: any) => {
    const classList = e?.target?.classList?.value || ''
    if (classList.includes('toRegister')) {
        navigateTo('/register')
    }
}

onMounted(() => {
    // (window as any).grecaptcha.enterprise.render('robotDom', {
    //     'sitekey': env().VITE_SITE_KEY,
    //     'callback': onloadCallback
    // })
})
</script>

<style lang="scss" scoped>
.send-email-box {
    min-height: calc(100vh - 60px - 227px);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8)), url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/webcome-bg.png');
    background-size: 100% 100%;
    
    .send-email-title {
        // width: 800px;
        margin: 0 auto 50px;
        text-align: center;
        font-size: 36px;
        font-weight: 600;

        &.one {
            margin-bottom: 20px;
        }
    }
    .send-email {
        width: 500px;
    
        .send-email-subtitle {
            margin: 20px 0 40px;
    
            :deep(.toRegister) {
                color: var(--el-color-primary);
            }
        }
    
        .el-input {
            width: 100%;
            height: 60px;
            font-size: 16px;
        }
        .el-button {
            width: 100%;
            height: 50px;
            margin-bottom: 20px;
            font-size: 18px;
        }
    
        .send-email-flex {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 30px;
            margin-bottom: 30px;
            :deep(.el-checkbox) {
                .el-checkbox__inner {
                    width: 16px;
                    height: 16px;
                }
                .el-checkbox__label {
                    font-size: 16px;
                }
            }
        }
    }
}
</style>