<template>
    <el-dialog v-model="open" :title="state.dialogTitle" width="800px">
        <el-form ref="formRef" :model="state.form" :rules="state.rules"
            class="form-flex" label-position="top">
            <el-form-item :label="$t('addressPage.company')" prop="customerType">
                <el-radio :label="0" border v-model="state.form.customerType">{{$t(customerTypeEnum['0'])}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('addressPage.individualCustomer')" prop="customerType">
                <el-radio :label="1" border v-model="state.form.customerType">{{$t(customerTypeEnum['1'])}}</el-radio>
            </el-form-item>
            <el-form-item :label="$t('addressPage.firstName')" prop="firstName">
                <el-input type="text" v-model="state.form.firstName" :placeholder="$t('addressPage.firstName')" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.lastName')" prop="lastName">
                <el-input type="text" v-model="state.form.lastName" :placeholder="$t('addressPage.lastName')" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.counrtyRegion')" prop="counrtyRegion" class="half">
                <el-select v-model="state.form.counrtyRegion" :placeholder="$t('addressPage.counrtyRegion')" filterable>
                    <!-- <el-option label="US" value="us"></el-option> -->
                    <el-option :label="item.countryName" :value="item.id" :key="item.id" v-for="item in state.countryList">
                        <div class="flex flex-between">
                            <SvgIcon :name="item.icon" class="glob-country-icon"></SvgIcon>
                            <span>{{ item.countryName }}</span>
                        </div>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('addressPage.state')" prop="state" class="half">
                <el-input type="text" v-model="state.form.state" :placeholder="$t('addressPage.state')" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.city')" prop="city">
                <el-input type="text" v-model="state.form.city" :placeholder="$t('addressPage.city')" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.streetAddress')" prop="streetAddress">
                <el-input type="text" v-model="state.form.streetAddress" :placeholder="$t('addressPage.streetAddress')" show-word-limit maxlength="100"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.buildingHouseNo')" prop="buildingHouseNo">
                <el-input type="text" v-model="state.form.buildingHouseNo" :placeholder="$t('addressPage.buildingHouseNo')" show-word-limit maxlength="50"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.postalCode')" prop="postalCode">
                <el-input type="text" v-model="state.form.postalCode" :placeholder="$t('addressPage.postalCode')" show-word-limit maxlength="10"></el-input>
            </el-form-item>
            <el-form-item :label="$t('addressPage.cellMobileNumber')" prop="userPhone">
                <el-input type="text" v-model="state.form.userPhone" :placeholder="$t('addressPage.cellMobileNumber')" show-word-limit maxlength="20">
                    <!-- <template #prepend>
                        <el-select v-model="state.form.counrtyRegion" placeholder="Counrty/Region" style="width: 150px;">
                            <el-option label="US" value="us"></el-option>
                            <el-option label="Ind" value="ind"></el-option>
                        </el-select>
                    </template> -->
                </el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelHandle">{{$t('cancel')}}</el-button>
                <el-button type="primary" @click="confirmHandle">{{$t('confirm')}}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="AddressDialog">
const { t } = useI18n()
const formRef = ref()
const emits = defineEmits(['update:show', 'confirm', 'cancel'])
const props = withDefaults(defineProps<{
    isDefault: boolean
    // show: boolean
}>(), {
    isDefault: false
    // show: false
})
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
    rules: {
        firstName: [{ required: true, message: () => t('addressPage.firstName'), trigger: 'blur' }],
        lastName: [{ required: true, message: () => t('addressPage.lastName'), trigger: 'blur' }],
        counrtyRegion: [{ required: true, message: () => t('addressPage.counrtyRegion'), trigger: 'change' }],
        state: [{ required: true, message: () => t('addressPage.state'), trigger: 'blur' }],
        city: [{ required: true, message: () => t('addressPage.city'), trigger: 'blur' }],
        streetAddress: [{ required: true, message: () => t('addressPage.streetAddress'), trigger: 'blur' }],
        postalCode: [
            { required: true, message: () => t('addressPage.postalCode'), trigger: 'blur' },
            // { validator: validateNumber, trigger: 'blur' }
        ],
        userPhone: [
            { required: true, message: () => t('addressPage.cellMobileNumber'), trigger: 'blur' },
            // { validator: validateNumber, trigger: 'blur' }
        ],
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
        emits('confirm')
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

const openDiaLog = (type: number, row?: any) => {
    state.dialogType = type
    if (state.dialogType == 1) {
        state.dialogTitle = t('addressPage.addShippingAddress')
        initForm()
    } else if (state.dialogType == 2) {
        state.dialogTitle = t('addressPage.editShippingAddress')
        // state.currentRow = row
        state.form = deepClone(row)
    }
    open.value = true
    nextTick(() => formRef.value.clearValidate())
}

const initForm = () => {
    for (let key in state.form) {
        state.form[key] = undefined
    }
    state.form.customerType = 0
}

// 关闭弹框
const cancelHandle = () => {
    open.value = false
    nextTick(() => {
        emits('cancel')
        initForm()
    })
}
// 确认弹框
const confirmHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            const params = deepClone(state.form)
            params.userId = userInfo().value.userId
            // console.log(params, userInfo().value)
            // 1新增收货地址 2编辑收货地址
            if (state.dialogType == 1) {
                // params.id = state.tableData.length
                // state.tableData.push(params)
                params.isDefault = props.isDefault ? '1' : '0'
                addAddress(params)
            } else if (state.dialogType == 2) {
                const i = state.tableData.findIndex((v: any) => v.id == params.id)
                state.tableData[i] = params
                editAddress(params)
            }
            cancelHandle()
        }
    })
}

onMounted(() => {
    getCountryList()
})

defineExpose({ openDiaLog })
</script>

<style lang="scss" scoped>

.form-flex {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    
    .el-form-item {
        width: 49%;

        .el-radio {
            width: 100%;
        }

        &.half {
            width: 23.5%;
        }

        // &:nth-child(even) {
        //     margin-right: 10px;
        // }
    }
}
</style>