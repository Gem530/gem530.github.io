<template>
    <el-dialog
        width="50%"
        v-model="open"
        destroy-on-close
        :title="props.title"
        custom-class="ptable-dialog">
        <div class="ptable-card">
            <XTable
                :showHead="false"
                :pageShow="false"
                :data="props.data"
                height="100%"
                class="ptable-content"
                :columnList="columnList">
                <template #content-expand="{ row }">
                    <div style="padding-left: 59px;">
                        <XTable
                            :pageShow="false"
                            :data="row.attributes"
                            class="xtable-header-bg"
                            :columnList="subColumnList">、
                        </XTable>
                    </div>
                </template>
            </XTable>
        </div>
    </el-dialog>
</template>

<script setup lang="ts" name="OperatRecord">
const emits = defineEmits(['update:show'])
const props = withDefaults(defineProps<{
    data: any[],
    show?: boolean,
    title?: string,
}>(), {
    show: true,
    data: () => [],
    title: '查看操作记录',
})
const open = computed({
    get () {
        return props.show
    },
    set (val) {
        emits('update:show', val)
    }
})
const columnList = ref([
    {title: "序号", field: 'index', type: 'seq', align: 'center', width: '60' },
    {field: "expand", type: 'expand', width: '40', align: 'center'},
    {
        // width: '110',
        title: '操作人',
        field: 'operator',
        align: 'center',
    },
    {
        // width: '110',
        title: '操作事件',
        field: 'operationAlias',
        align: 'center',
    },
    {
        // width: '110',
        title: '操作时间',
        field: 'operationTime',
        align: 'center',
    },
])
const subColumnList = ref([
    // {title: "序号", field: 'index', type: 'index', align: 'center', width: '60' },
    {
        // width: '110',
        title: '修改数据',
        field: 'attributeAlias',
        align: 'center',
    },
    {
        // width: '110',
        title: '修改前',
        field: 'oldValue',
        align: 'center',
    },
    {
        // width: '110',
        title: '修改后',
        field: 'newValue',
        align: 'center',
    },
])
</script>

<style lang="scss" scoped>
// .opera-record-dialog {
//     max-height: 90%;
// }
</style>