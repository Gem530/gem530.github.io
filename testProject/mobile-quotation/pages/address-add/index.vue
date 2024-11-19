<template>
    <div class="address-add">
        <nav-bar left-arrow><template #title?>{{ $t('addressPage.addShippingAddress') }}</template></nav-bar>
        <van-form ref="formRef" class="form-flex" label-align="top" @submit="confirmHandle">
            <van-cell-group inset>
                <van-field :label="$t('addressPage.customerType')" name="customerType">
                    <template #input>
                        <van-radio-group v-model="state.form.customerType" direction="horizontal">
                            <van-radio :class="{'is-checked': '0' == state.form.customerType}" name="0">{{$t(customerTypeEnum['0'])}}</van-radio>
                            <van-radio :class="{'is-checked': '1' == state.form.customerType}" name="1">{{$t(customerTypeEnum['1'])}}</van-radio>
                        </van-radio-group>
                    </template>
                </van-field>
                <van-field
                    :label="$t('addressPage.firstName')" name="firstName" required
                    v-model="state.form.firstName" :placeholder="$t('addressPage.firstName')" show-word-limit maxlength="50"
                    :rules="[{ required: true, message: $t('addressPage.firstName')}]"
                ></van-field>
                <van-field
                    :label="$t('addressPage.lastName')" name="lastName" required
                    v-model="state.form.lastName" :placeholder="$t('addressPage.lastName')" show-word-limit maxlength="50"
                    :rules="[{ required: true, message: $t('addressPage.lastName')}]">
                </van-field>
                <g-select v-model="state.form.counrtyRegion" :label="$t('addressPage.counrtyRegion')" name="counrtyRegion" required
                    :rules="[{ required: true, message: $t('addressPage.counrtyRegion') }]" :data="state.countryList"
                    :dataFormat="{text: 'countryName', value: 'id'}" :placeholder="$t('addressPage.counrtyRegion')">
                    <template #title="{row}">
                        <div class="flex flex-start">
                            <SvgIcon :name="row.icon" class="glob-country-icon"></SvgIcon>
                            <span class="pl-5">{{ row.countryName }}</span>
                        </div>
                    </template>
                </g-select>
                <van-field
                    :label="$t('addressPage.state')" name="state" required
                    v-model="state.form.state" :placeholder="$t('addressPage.state')" show-word-limit maxlength="50"
                    :rules="[{ required: true, message: $t('addressPage.state')}]">
                </van-field>
                <van-field
                    :label="$t('addressPage.city')" name="city" required
                    v-model="state.form.city" :placeholder="$t('addressPage.city')" show-word-limit maxlength="50"
                    :rules="[{ required: true, message: $t('addressPage.city')}]">
                </van-field>
                <van-field
                    :label="$t('addressPage.streetAddress')" name="streetAddress" required
                    v-model="state.form.streetAddress" :placeholder="$t('addressPage.streetAddress')" show-word-limit maxlength="100"
                    :rules="[{ required: true, message: $t('addressPage.streetAddress')}]">
                </van-field>
                <van-field
                    :label="$t('addressPage.buildingHouseNo')" name="buildingHouseNo"
                    v-model="state.form.buildingHouseNo" :placeholder="$t('addressPage.buildingHouseNo')" show-word-limit maxlength="50">
                </van-field>
                <van-field
                    :label="$t('addressPage.postalCode')" name="postalCode" required
                    v-model="state.form.postalCode" :placeholder="$t('addressPage.postalCode')" show-word-limit maxlength="10"
                    :rules="[{ required: true, message: $t('addressPage.postalCode')}]">
                </van-field>
                <van-field
                    :label="$t('addressPage.cellMobileNumber')" name="userPhone" required
                    v-model="state.form.userPhone" :placeholder="$t('addressPage.cellMobileNumber')" show-word-limit maxlength="20"
                    :rules="[{ required: true, message: $t('addressPage.cellMobileNumber')}]">
                </van-field>
            </van-cell-group>
            <div class="form-btn">
                <van-button round block type="primary" native-type="submit">{{$t('confirm')}}</van-button>
            </div>
        </van-form>
    </div>
</template>

<script setup lang="ts" name="AddressAdd">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('addressPage.addShippingAddress') })
const formRef = ref()
const emits = defineEmits(['update:show', 'confirm', 'cancel'])
// const props = withDefaults(defineProps<{
//     isDefault: boolean
//     // show: boolean
// }>(), {
//     isDefault: false
//     // show: false
// })
// const open = computed({
//     get () {
//         return props.show
//     },
//     set (val: boolean) {
//         emits('update:show', val)
//     }
// })

// // 只能输入数字
// const validateNumber = (rule: any, value: any, callback: any) => {
//     if (!validNumber(value)) {
//         callback(new Error('Must number'))
//         // callback(new Error(t('onlineInfo.onlyIntegers')))
//     } else {
//         callback()
//     }
// }

const open = ref(false)
const state = reactive<Record<string, any>>({
    dialogType: 1, // 1新增收货地址 2编辑收货地址
    dialogTitle: '',
    dialogVisible: false,
    // currentRow: undefined,
    form: {
        id: undefined,
        userId: undefined, // 用户id
        isDefault: undefined, // 是否默认: 1-默认 0-不默认
        customerType: 0, // 客户类型：0-公司 1-个人
        firstName: undefined,
        lastName: undefined,
        counrtyRegion: undefined,
        state: undefined,
        city: undefined,
        streetAddress: undefined,
        buildingHouseNo: undefined,
        postalCode: undefined,
        userPhone: undefined,
    },
    tableData: [],
    countryList: [],
})

// 获取地址列表
const getCountryList = () => {
    $http('/system/country/queryCountryList', {
        method: 'get',
    }).then((res: any) => {
        state.countryList = res.data || []
    })
}

// 新增地址
const addAddress = (body: Record<string, any>) => {
    $http('/purchase/address', {
        method: 'post',
        loading: true,
        body
    }).then((res: any) => {
        // getAddressList()
        // emits('confirm')
        useRouter().go(-1)
    })
}

// 编辑地址
const editAddress = (body: Record<string, any>) => {
    $http('/purchase/address', {
        method: 'put',
        loading: true,
        body
    }).then((res: any) => {
        // getAddressList()
        emits('confirm')
    })
}

// const openDiaLog = (type: number, row?: any) => {
//     state.dialogType = type
//     if (state.dialogType == 1) {
//         state.dialogTitle = t('addressPage.addShippingAddress')
//         initForm()
//     } else if (state.dialogType == 2) {
//         state.dialogTitle = t('addressPage.editShippingAddress')
//         // state.currentRow = row
//         state.form = deepClone(row)
//     }
//     open.value = true
//     nextTick(() => formRef.value.clearValidate())
// }

const initForm = () => {
    for (let key in state.form) {
        state.form[key] = undefined
    }
    state.form.customerType = 0
}

// 确认弹框
const confirmHandle = () => {
    const params = deepClone(state.form)
    params.userId = userInfo().value.userId
    addAddress(params)
}

onMounted(() => {
    getCountryList()
})

// defineExpose({ openDiaLog })
</script>

<style lang="scss" scoped>
.address-add {
    background: #f1f3f6;
    padding: 16px 0;

    .form-btn {
        margin: 16px;
    }
}
</style>