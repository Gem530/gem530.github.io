<template>
    <div class="address-manage table-page">
        <el-button icon="Plus" type="primary" class="add-address-btn" @click="addressDialogRef.openDiaLog(1)">{{$t('addressPage.addShippingAddress')}}</el-button>
        <el-table scrollbar-always-on :data="state.tableData" border ref="tableRef" style="height: 100%;">
            <el-table-column align="center" :label="$t('addressPage.customerType')" prop="customerType" width="130">
                <template #="{row}">{{ (row.customerType+'') && $t(customerTypeEnum[row.customerType as '0'|'1']) }}</template>
            </el-table-column>
            <el-table-column align="center" :label="$t('addressPage.firstName')" prop="firstName" width="100"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.lastName')" prop="lastName" width="100"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.counrtyRegion')" prop="counrtyName" width="130"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.state')" prop="state" width="95"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.city')" prop="city" width="95"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.streetAddress')" prop="streetAddress" width="130"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.buildingHouseNo')" prop="buildingHouseNo" width="155"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.postalCode')" prop="postalCode" width="110"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.cellMobileNumber')" prop="userPhone" width="155"></el-table-column>
            <el-table-column align="center" :label="$t('addressPage.isDefault')" prop="isDefault" width="90">
                <template #="{row}">{{ row.isDefault && $t(yesOrNo[row.isDefault as '0'|'1']) }}</template>
            </el-table-column>
            <el-table-column align="left" :label="$t('orderPage.operation')" prop="make" min-width="300" fixed="right">
                <template #="{row}">
                    <el-button class="el-table-button" type="primary" @click="setDefault(row)">{{t('addressPage.setAsDefaultAddress')}}</el-button>
                    <el-button class="el-table-button" type="primary" @click="addressDialogRef.openDiaLog(2, row)">{{t('orderPage.edit')}}</el-button>
                    <el-button class="el-table-button" type="primary" @click="delAddress([row.id])">{{t('orderPage.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>

        <address-dialog ref="addressDialogRef" :isDefault="!state?.tableData?.length" @confirm="getAddressList"></address-dialog>
    </div>
</template>

<script setup lang="ts" name="AddressManage">
const { t } = useI18n()
definePageMeta({ layout: 'custom' })
useHead({ title: () => t('receivingAddress') })

// const formRef = ref()
const tableRef = ref()
const addressDialogRef = ref()
const state = reactive<Record<string, any>>({
    tableData: [],
})

// 获取地址列表
const getAddressList = (loading: boolean = false) => {
    $http('/purchase/address/userList', {
        method: 'get',
        loading
    }).then((res: any) => {
        state.tableData = res.data || []
    })
}

// 设为默认地址
const setDefault = (row: Record<string, any>) => {
    $http(`/purchase/address/setDefault/${row.id}`, {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        getAddressList()
    })
}

// 删除地址
const delAddress = (ids: string[]) => {
    ElMessageBox.confirm(
        t('addressPage.deleteThisAddress'),
        t('systemPrompt'),
        {
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
            type: 'warning',
        }
    ).then(() => {
        $http(`/purchase/address/${ids}`, {
            method: 'delete',
            loading: true,
        }).then((res: any) => {
            getAddressList()
        })
    })
}

onMounted(() => {
    getAddressList(true)
})
</script>

<style lang="scss" scoped>
.address-manage {
    .add-address-btn {
        margin-bottom: 20px;
    }

    .el-table-button {
        margin: 5px 10px 5px 0;
    }
}
</style>