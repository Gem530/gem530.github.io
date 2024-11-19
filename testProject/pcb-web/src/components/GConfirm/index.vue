<template>
    <el-dialog v-model="show" :="attrs" @close="closeHandle">
        <template #default>
            <slot name="default">
                <XTable :pageShow="false" :showHead="false" max-height="600px" :data="data" :columnList="columnList">
                    <template #default-errorDetail="{ row }">
                        <template v-if="row.errorDetail?.length">
                            <div v-for="item in row.errorDetail">{{item}}</div>
                        </template>
                    </template>
                </XTable>
            </slot>
        </template>
        <template #footer>
            <el-button @click="closeHandle">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup name="GConfirm" lang="ts">
const attrs = useAttrs()
const emits = defineEmits(['update:show'])

const show = ref(false)
const data = ref<any[]>([])
const columnList = ref<any[]>([])
const promiseFun = ref<any>()

// 打开抽屉
const openHandle = (val: any) => {
    show.value = true
    data.value = val?.data || []
    columnList.value = val?.columnList || []
    return new Promise((resolve) => {
        promiseFun.value = resolve
    })
}

// 关闭弹框
const closeHandle = () => {
    show.value = false
    promiseFun.value({cancel: true})
}

defineExpose({ openHandle, closeHandle })
</script>

<style lang="scss" scoped></style>