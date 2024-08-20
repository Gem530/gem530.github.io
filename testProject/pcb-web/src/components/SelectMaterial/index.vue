<template>
    <el-dialog v-model="open" :title="props.title" width="80%" destroy-on-close @close="closeHandle">
        <el-row style="height: 480px;">
            <el-col :span="5" style="height: 100%;" class="ptable-card">
                <XTable
                    height="100%"
                    :pageShow="false"
                    class="ptable-content"
                    :="{...props.leftAttrs}"
                    :data="selectArr"
                    :columnList="selectColumnList">
                    <template #default-make="scope">
                        <el-tooltip content="删除" placement="top">
                            <el-button link type="primary" icon="CloseBold" :disabled="props.loading"
                                @click="delSelectData(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </XTable>
            </el-col>
            <el-col :span="19" style="height: 100%;" class="ptable-card">
                <XTable
                    height="100%"
                    :pageShow="true"
                    class="ptable-content"
                    :="{...props.rightAttrs}"
                    v-loading="props.loading"
                    v-model:page-size="form.pageSize"
                    v-model:current-page="form.pageNum"
                    :page-params="{ perfect: true, total: props.total }" :data="data"
                    :columnList="columnList" ref="selectTableRef" @searchChange="pageChange"
                    :checkbox-config="{ reserve: true }" :row-config="{ keyField: props.keyId }"
                    @checkbox-change="selectChangeEvent" @checkbox-all="selectAllChangeEvent">
                    <template #default-categoryId="scope">
                        <div>{{ scope.row.categoryName }}</div>
                    </template>
                </XTable>
            </el-col>
        </el-row>
        <template #footer>
            <div style="display: flex; justify-content: center;">
                <span class="dialog-footer">
                    <el-button :loading="props.buttonLoading" @click="closeHandle">取消</el-button>
                    <el-button :loading="props.buttonLoading" type="primary" @click="confirmHandle">确 定</el-button>
                </span>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts" name="SelectMaterial">
const attrs = useAttrs()
const slots = useSlots()
const selectTableRef = ref()
const emits = defineEmits(['update:show', 'update:loading', 'update:selectData', 'confirm', 'close', 'searchChange'])
const props = withDefaults(defineProps<{
    data: any[]
    total: number
    show: boolean
    title?: string
    leftAttrs?: any
    rightAttrs?: any
    loading: boolean
    selectData: any[]
    columnList: any[]
    keyId: string|number
    buttonLoading: boolean
    selectColumnList: any[]
    selectKeyId: string|number
}>(), {
    total: 0,
    keyId: 'id',
    show: false,
    loading: false,
    selectKeyId: 'id',
    leftAttrs: () => {},
    rightAttrs: () => {},
    buttonLoading: false,
})

// const dialogLoding = ref(false)
// const buttonLoading = ref(false)
const form = ref({
    pageNum: 1,
    pageSize: 20,
})

const open = computed({
    get() { return props.show },
    set(val: boolean) { emits('update:show', val) }
})
const selectLoading = computed({
    get() { return props.loading },
    set(val: boolean) { emits('update:loading', val) }
})
const selectArr = computed({
    get() { return props.selectData },
    set(val: any[]) { emits('update:selectData', val) }
})

watch(() => [props.show, props.selectData], (val: any, old: any) => {
    let showVal = val[0]
    let dataVal = val[1]
    if (showVal && dataVal?.length) {
        nextTick(() => {
            const $table = selectTableRef.value.xTableRef
            if ($table) {
                //过滤materialInventoryList中id在selectInventoryList中的数据，
                // let st = materialInventoryList.value.filter((item: any) => {
                //     return selectInventoryList.value.some((item2: any) => item[props.keyId] == item2[props.selectKeyId]);
                // });
                // //先为materialInventoryList中所有数据取消选中
                // $table.setCheckboxRow(materialInventoryList, false);
                // $table.setCheckboxRow(st, true);
                $table.setCheckboxRow(dataVal, true);
            }
        })
    }
})

//选择物料全选
const selectAllChangeEvent = () => {
    const $table = selectTableRef.value.xTableRef
    if ($table) {
        selectArr.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    }
}

//选择物料 单选
const selectChangeEvent = ({ checked, row }: any) => {
    const $table = selectTableRef.value.xTableRef
    if ($table) {
        selectArr.value = $table.getCheckboxReserveRecords().concat($table.getCheckboxRecords());
    }
}

/** 已选物料 删除按钮操作 */
const delSelectData = async (row?: any) => {
    const id = row[props.keyId];
    //删除已选物料
    selectArr.value = selectArr.value.filter(item => item[props.keyId] != id);

    const $table =  selectTableRef.value.xTableRef;
    if ($table) {
        $table.setCheckboxRow(row, false);
    }
}

// 搜索条件变化
const pageChange = (params: any) => {
    console.log('params', params)
    emits('searchChange', params)
}

// 确认事件
const confirmHandle = () => {
    emits('confirm')
    console.log('确认事件')
}

// 取消事件
const closeHandle = () => {
    selectArr.value = []
    emits('close')
    console.log('取消事件')
}
</script>

<style lang="scss" scoped></style>