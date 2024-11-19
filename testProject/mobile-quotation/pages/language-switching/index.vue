<template>
    <div class="lang-info">
        <nav-bar left-arrow>
            <template #title>{{ $t('languageSwitching') }}</template>
        </nav-bar>

        <div class="user-info-border"></div>
        <!-- <van-cell :title="$t('login.username')" :value="userInfo().value?.userName" />
        <van-cell :title="$t('login.email')" :value="userInfo().value?.email" /> -->
        <van-radio-group v-model="state.langInfo.value">
            <van-cell-group>
                <van-cell :title="item.name" clickable @click="chooseHandle(item, 3)" v-for="item in state.langList">
                    <template #right-icon>
                        <van-radio :name="item.value" />
                    </template>
                </van-cell>
                <!-- <van-cell title="单选框 2" clickable @click="checked = '2'">
                    <template #right-icon>
                        <van-radio name="2" />
                    </template>
                </van-cell> -->
            </van-cell-group>
        </van-radio-group>

        <van-button type="primary" class="sign-out" @click="saveHandle">{{ $t('save') }}</van-button>
    </div>
</template>

<script setup lang="ts" name="LanguageSwitching">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('languageSwitching') })

// const navTitle = computed(() => )
const state = reactive<Record<string, any>>({
    lang: '',
    langInfo: {
        value: '',
        name: ''
    },
    langList: [
        { name: 'English', value: 'en_US' },
        { name: 'Русский язык', value: 'ru_RU' },
        { name: '한국어', value: 'ko_KR' },
    ]
})

const chooseHandle = (value: string, type: number) => {
    if (type == 3) {
        // 货币信息
        state.langInfo = value
        // setLocal('useCurrencyInfo')
    }
    // state.lang = value.value
}

const saveHandle = () => {
    useLangInfo().value = state.langInfo
    setLocal('useLangInfo')
    // console.log(useLangInfo().value)
    useLang().value = state.langInfo.value
    localStorage.setItem('lang', useLang().value)
    location.reload()
    // useCountryInfo().value = state.countryInfo
    // useCurrencyInfo().value = state.currencyInfo
    // setLocal('useCountryInfo')
    // setLocal('useCurrencyInfo')
}

onMounted(() => {
    // state.countryInfo = useCountryInfo().value
    // state.currencyInfo = useCurrencyInfo().value
    const value = useLang().value
    const name = state.langList.find((f: any) => f.value == useLang().value)?.name
    state.langInfo = {
        name,
        value
    }
    // state.lang = value
    useLangInfo().value = state.langInfo
    // console.log(useLang().value, state.langInfo)
})
</script>

<style lang="scss" scoped>
.lang-info {
    .user-info-border {
        height: 10px;
        background: #f1f2f3;
    }
    .sign-out {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
    }
}
</style>