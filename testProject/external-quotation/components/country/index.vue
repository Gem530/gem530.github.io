<template>
    <el-popover :width="350" placement="bottom" popper-class="default-country-popper">
        <template #reference>
            <slot name="reference"></slot>
        </template>
        <div class="country-box">
            <!-- <div class="country-box-title">{{$t('country')}}</div>
            <el-collapse v-model="state.country" border>
                <el-collapse-item title="Consistency" name="1">
                    <template #title>
                        <div class="country-item no-margin flex flex-start">
                            <SvgIcon v-if="state.countryInfo?.icon" :name="state.countryInfo?.icon" class="country-item-icon glob-country-icon"></SvgIcon>
                            <div class="country-item-name">{{ state.countryInfo?.name }}</div>
                        </div>
                    </template>
                    <el-input
                        clearable
                        v-model="state.countryName"
                        class="country-seacrh"
                        placeholder="Please input country name">
                    </el-input>
                    <div class="country-list">
                        <template v-for="item in state.countryList" :key="item.icon">
                            <div class="country-item flex flex-start pointer hover-blue"
                                @click="chooseHandle(item, 1)"
                                :class="{'is-active': item.name == state.countryInfo?.name }"
                                v-if="item.name.toLocaleLowerCase().includes(state.countryName.toLocaleLowerCase())">
                                <SvgIcon :name="item.icon" class="country-item-icon glob-country-icon" v-if="item?.icon"></SvgIcon>
                                <div class="country-item-name">{{ item.name }}</div>
                            </div>
                        </template>
                    </div>
                </el-collapse-item>
            </el-collapse> -->

            <div class="country-box-title margin-top">{{$t('languageSwitching')}}</div>
            <el-collapse v-model="state.lang" border>
                <el-collapse-item title="Consistency" name="1">
                    <template #title>
                        <div class="country-item no-margin flex flex-start">
                            <div class="country-item-name">{{ state.langInfo?.name }}</div>
                            <!-- <div class="country-item-value">{{ state.langInfo?.value }}</div> -->
                        </div>
                    </template>
                    <div class="country-list currency-list">
                        <div class="country-item flex flex-start pointer hover-blue"
                            :key="item.name"
                            v-for="item in state.langList"
                            :class="{'is-active': item.name == state.langInfo?.name }"
                            @click="chooseHandle(item, 3)">
                            <div class="country-item-name">{{ item.name }}</div>
                            <!-- <div class="country-item-value">{{ item.value }}</div> -->
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <!-- <div class="country-box-title margin-top">{{$t('currency')}}</div>
            <el-collapse v-model="state.currency" border>
                <el-collapse-item title="Consistency" name="1">
                    <template #title>
                        <div class="country-item no-margin flex flex-start">
                            <div class="country-item-name">{{ state.currencyInfo?.name }}</div>
                            <div class="country-item-value">{{ state.currencyInfo?.value }}</div>
                        </div>
                    </template>
                    <div class="country-list currency-list flex flex-start">
                        <div class="country-item flex flex-start pointer hover-blue"
                            :key="item.name"
                            v-for="item in state.currencyList"
                            :class="{'is-active': item.name == state.currencyInfo?.name }"
                            @click="chooseHandle(item, 2)">
                            <div class="country-item-name">{{ item.name }}</div>
                            <div class="country-item-value">{{ item.value }}</div>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse> -->
            <el-button round plain type="primary" class="country-save" @click="saveHandle">{{$t('save')}}</el-button>
        </div>
    </el-popover>
</template>

<script setup lang="ts" name="Country">
const { t } = useI18n()
const state = reactive<Record<string, any>>({
    lang: '',
    country: '',
    currency: '',
    langInfo: {
        value: '',
        name: ''
    },
    countryInfo: {},
    currencyInfo: {},
    countryName: '',
    countryList: [
        { name: 'Us', icon: 'us' },
        { name: 'Tr', icon: 'tr' },
        { name: 'China', icon: 'cn' },
    ],
    currencyList: [
        { name: 'USD', value: '$' },
        { name: 'RMB', value: '￥' },
    ],
    langList: [
        { name: 'English', value: 'en_US' },
        { name: 'Русский язык', value: 'ru_RU' },
        { name: '한국어', value: 'ko_KR' },
    ]
})

const chooseHandle = (value: string, type: number) => {
    if (type == 1) {
        // 国家信息
        state.countryInfo = value
        // setLocal('useCountryInfo')
    } else if (type == 3) {
        // 货币信息
        state.langInfo = value
        // setLocal('useCurrencyInfo')
    } else {
        // 货币信息
        state.currencyInfo = value
        // setLocal('useCurrencyInfo')
    }
    state.lang = ''
    state.country = ''
    state.currency = ''
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
    useLangInfo().value = state.langInfo
    // console.log(useLang().value, state.langInfo)
})
</script>

<style lang="scss" scoped>
.default-country-popper {
    .country-box {
        .country-box-title {
            margin-bottom: 10px;
            &.margin-top {
                margin-top: 10px;
            }
        }

        :deep(.el-collapse) {
            border: 1px solid #eee;
            border-radius: 2px;

            .el-collapse-item__header {
                height: 35px;
                border-bottom: 1px solid #eee;
                padding: 10px;
            }

            .el-collapse-item__content {
                padding: 10px;

                .country-seacrh {
                    margin-bottom: 10px;
                }

                .country-list {
                    max-height: 200px;
                    overflow-y: auto;

                    &.currency-list {
                        flex-wrap: wrap;
                        .country-item {
                            flex: none;
                            width: 33%;
                        }
                    }
                }
            }
        }

        .country-item {
            margin-bottom: 5px;
            &.no-margin {
                margin: 0;
            }
            &.is-active {
                color: var(--el-color-primary);
            }
            .country-item-icon {
                margin-right: 10px;
            }
            .country-item-value {
                margin-left: 5px;
            }
        }

        .country-save {
            width: 100%;
            margin-top: 10px;
        }
    }
}
</style>