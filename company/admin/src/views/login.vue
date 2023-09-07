<template>
  <div class="app-main">
    <div class="login-box">
      <el-card>
        <template #header>
          <h2 style="margin: 5px 0;text-align: center;">后台管理系统</h2>
        </template>
        <el-form
          ref="loginRef"
          :model="form"
          :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名">
              <template #prefix><g-icon icon="User"></g-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" type="password" @keyup.enter="loginHandle">
              <template #prefix><g-icon icon="Lock"></g-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="codeShow">
            <el-input v-model="form.code" placeholder="验证码" @keyup.enter="loginHandle">
              <template #prefix><g-icon icon="Lock"></g-icon></template>
            </el-input>
            <img :src="codeUrl" @click="getCodeImgAPI"/>
          </el-form-item>
          <el-button :loading="loading" type="primary" @click="loginHandle">
            <span v-if="!loading">登录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Cookies from 'js-cookie'
import * as tsType from '@/api/type'
import { useRouter } from 'vue-router'
import { getCodeImg } from '@/api/user'
import { encrypt } from '@/utils/jsencrypt'
import { removeItem } from '@/utils/storage'
import useUserStore from '@/store/modules/user'
const userStore = useUserStore()
const router = useRouter()

const codeUrl = ref('')
const loginRef = ref()
const loading = ref(false)
const codeShow = ref(false)
const form = ref<tsType.loginInfo>({
  uuid: undefined,
  code: undefined,
  password: '123456',
  username: 'superadmin',
})
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
})

const getCodeImgAPI = () => {
  getCodeImg().then((res: any) => {
    // console.log(res.img)
    if (res.captchaEnabled) {
      codeShow.value = res.captchaEnabled
    }
    codeUrl.value = "data:image/gif;base64," + res.img
    form.value.uuid = res.uuid
  })
}
// getCodeImgAPI()

const loginHandle = () => {
  loginRef.value.validate((val: Boolean) => {
    if (val) {
      loading.value = true
      const params = {
        uuid: form.value.uuid,
        code: form.value.code,
        username: form.value.username,
        password: encrypt(form.value.password) as string
      }
      userStore.login(params).then(() => {
        loading.value = false
        removeItem('tagsView')
        removeItem('defaultActive')
        router.replace('/')
      }).catch(() => {
        loading.value = false
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.app-main {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    width: 450px;
    height: 300px;

    .el-button {
      width: 100%;
    }
  }
}
</style>
