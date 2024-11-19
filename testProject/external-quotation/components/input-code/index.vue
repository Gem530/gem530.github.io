<template>
    <el-form-item class="input-code" :="attrs">
        <div class="flex flex-between">
            <el-input v-model="code" :placeholder="$t('login.verificationCode')"></el-input>
            <el-button type="primary" :loading="loading" @click="sendCode" :disabled="countDown>0"
            >{{countDown ? countDown : $t('login.send')}}</el-button>
        </div>
    </el-form-item>
</template>

<script setup lang="ts" name="InputCode">
const { t } = useI18n()
const attrs = useAttrs()
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
    email: string|undefined,
    modelValue: string|undefined
}>(),{
    modelValue: undefined
})
const crtEmail = computed(() => props.email)
const code = computed({
    get () {
        return props.modelValue
    },
    set (val: any) {
        emits('update:modelValue', val)
    }
})
const loading = ref(false)
const countDown = ref(0)

const initCount = () => {
    let timer: any = null
    timer = setInterval(() => {
        countDown.value -= 1
        if (countDown.value == 0) {
            clearInterval(timer)
        }
    }, 1000)
}

const sendCode = () => {
    if (!crtEmail.value) {
        ElMessage.error(t('home.pleaseEnter') + t('login.email'))
        return
    }
    loading.value = true
    $http('/resource/email/code', {
        method: 'get',
        params: {
            email: crtEmail.value
        }
    }).then((res: any) => {
        // console.log(res)
        if (res.code == 200) {
            loading.value = false
            countDown.value = 60
            initCount()
        }
    })
    
    // setTimeout(() => {
    // loading.value = false
    //     countDown.value = 60
    //         initCount()
    // }, 2000)
}
</script>

<style lang="scss" scoped>
.input-code {
    .el-input {
        height: 50px;
    }
    .flex {
        width: 100%;
        .el-button {
            width: 120px;
            height: 50px;
            font-size: 18px;
            margin-left: 10px;
        }
    }
}
</style>