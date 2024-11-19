<template>
    <div v-loading="loading" :element-loading-text="$t('login.loginIn')" element-loading-background="rgba(0,0,0,0.7)" class="social-callback"></div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'empty' })
//   import { login, callback } from '@/api/login';
//   import { setToken, getToken } from '@/utils/auth';
//   import { any } from '@/api/types';

const token = ref('')
const route = useRoute();
const loading = ref(true);


/**
 * 接收Route传递的参数
 * @param {Object} route.query.
 */
const code = route.query.code as string;
const state = route.query.state as string;
const source = route.query.source as string;
// const tenantId = localStorage.getItem("tenantId") ? localStorage.getItem("tenantId") as string : '000000';
const tenantId = '000000';

const login = (body: any) => {
    return new Promise((resolve, reject) => {
        $http('/auth/login', {
            method: 'POST',
            isToken: false,
            needStatus: true,
            // loading: true,
            body
        }, true).then((res: any) => {
            if (res.code == 200) {
                resolve(res)
            } else {
                reject(new Error(res.msg))
            }
        }).catch((err: any) => {
            reject(err)
        })
    })
}

const callback = (body: any) => {
    return new Promise((resolve, reject) => {
        $http('/auth/social/callback', {
            method: 'POST',
            body
        }).then((res: any) => {
            resolve(res)
        }).catch((err: any) => {
            reject(err)
        })
    })
}

const processResponse = async (res: any) => {
    if (res.code !== 200) {
        throw new Error(res.msg);
    }
    if (res.data !== null) {
        useAccessToken().value = res.data.access_token
        setLocal('useAccessToken')
    }
    // ElMessage.success('Login Success');
    // setTimeout(() => {
    location.href = env().VITE_APP_CONTEXT_PATH;
    // }, 2000);
};

const handleError = (error: any) => {
    ElMessage.error(error.message);
    // ElMessage.error('Login Fail');
    setTimeout(() => {
        location.href = env().VITE_APP_CONTEXT_PATH;
    }, 2000);
};

const callbackByCode = async (data: any) => {
    try {
        const res = await callback(data);
        await processResponse(res);
        loading.value = false;
    } catch (error) {
        handleError(error);
    }
};

const loginByCode = async (data: any) => {
    try {
        const res = await login(data);
        await processResponse(res);
        loading.value = false;
    } catch (error) {
        handleError(error);
    }
};

const init = async () => {
    const data: any = {
        socialCode: code,
        socialState: state,
        tenantId: tenantId,
        source: source,
        clientId: 'e5cd7e4891bf95d1d19206ce24a7b32e',
        grantType: 'social'
    };

    // if (!token.value) {
    await loginByCode(data);
    // } else {
    //     await callbackByCode(data);
    // }
};

onMounted(() => {
    getLocal()
    token.value = useAccessToken().value
    nextTick(() => {
        init();
    });
});
</script>

<style>
.social-callback {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}
</style>
  