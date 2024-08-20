<!--订单详情列表
    columnResize
    resize
-->

<template>
    <!-- :cellSpan="onGridCellSpan"
              @pageChange="onGridPageChange"
              @sortChange="onGridSortChange"
              @rowDblClick="rowDblClick"
              @rowContextMenu="rowContextMenu" -->
    <div class="XTable-header">
        <div class="showText">
            <template v-if="props.searchShow">
                <el-tag v-for="(item, index) in showList" :key="index" class="mx-1" closable :disable-transitions="false"
                    @close="deleteShowList(index)">
                    {{ item.label }}
                </el-tag>
                <el-tag class="mx-1" @click="deleteAll" v-if="showList.length">全部删除</el-tag>
            </template>
        </div>

        <div class="XTable-tool">
            <el-icon v-if="props.showRefresh" class="pointer XTable-icon" size="20px" @click="refreshHandle"><Refresh /></el-icon>
            <XPopover @confirm="confirm" @reset="reset" @hide="filterText = undefined" v-if="props?.toolId" :reset="true">
                <template #reference>
                    <el-icon class="pointer XTable-icon" size="20px"><Operation /></el-icon>
                </template>
                <div class="XTable-tool-box">
                    <el-input v-model.trim="filterText" placeholder="请输入列名称"/>

                    <div class="XTable-tool-list margin-top">
                        <el-checkbox
                            v-model="checkAll"
                            :indeterminate="isIndeterminate"
                            @change="handleCheckAllChange"
                            v-if="!filterText"
                        >全选</el-checkbox>
                    </div>
                    <el-checkbox-group v-model="defaultCheck" class="XTable-tool-list" @change="handleCheckedCitiesChange">
                        <template :key="item.title" v-for="(item, i) in toolList">
                            <el-checkbox
                                draggable="true"
                                @dragend="dragend"
                                :label="item.title"
                                @dragstart="dragstart(i)"
                                @dragover="dragover($event, i)"
                                @dragenter="dragenter($event, i)"
                                v-if="(filterText && item.title.includes(filterText)) || !filterText"
                            >{{ item.title }}</el-checkbox>
                        </template>
                    </el-checkbox-group>
                </div>
            </XPopover>
        </div>
    </div>
        <!-- :loading="crtLoading" -->
    <DataGrid loadMsg="加载中..." :columnResizing="!!props?.toolId" :="attrs" ref="eTableRef" showHeader
        :pageSize="crtPageSize" :pageNumber="page" :loading="loading"
        @rowClick="rowClick"
        @columnResize="resize"
        @sort-change="sortTable"
        @pageChange="onPageChange"
        @rowDblClick="rowDblClick"
        @rowContextMenu="rowContextMenu" v-if="makeFlag">
        <!-- @update="updateDom" -->
        <GridColumnGroup :frozen="true" :width="props.leftWidth" v-if="fixedLeftColumn?.length">
            <GridHeaderRow>
                <template v-for="item in fixedLeftColumn" :key="item.field">
                    <GridColumn
                        :field="item?.field"
                        :title="item?.title"
                        :width="item?.width"
                        :rowspan="item?.rowspan"
                        :colspan="item?.colspan"
                        :sortable="item?.sortable"
                        :sorter="item?.sorter"
                        :editable="item?.editable"
                        :order="item?.order"
                        :align="item?.align"
                        :halign="item?.halign"
                        :expander="item?.expander"
                        :headerCls="item?.headerCls"
                        :headerStyle="item?.headerStyle"
                        :cellCss="item?.cellCss"
                        :filterable="item?.filterable"
                        :filterOperators="item?.filterOperators"
                        v-if="item?.visible">
                        <!-- v-if="item?.visible" -->
                        <!-- :hidden="!item?.visible" -->
                        <template #header v-if="!slots[`header-${item.field}`]">
                            <EFilter
                                :title="item.title"
                                v-model="state[item.field]"
                                :filterType="item?.filterType"
                                :filterData="item?.filterData"
                                :filterParam="item?.filterParam"
                                :filterCustom="item?.filterCustom"
                                v-if="item.filterType && item.field"
                                @search="search"
                            ></EFilter>
                            <template v-else>{{ item.title }}</template>
                        </template>
                        <template v-if="slots[`header-${item.field}`]" #header="params">
                            <slot :name="`header-${item.field}`" :="params"/>
                        </template>
                        <template #body="{row,column,rowIndex}" v-if="item.field == 'index'">
                        {{ rowIndex + 1 }}
                        </template>
                        <template v-if="!slots[`default-${item.field}`] && item.showOverflow" #body="{row,column,rowIndex}">
                            <el-tooltip
                                effect="dark"
                                :content="row[column.field]"
                                placement="top">
                                {{row[column.field]}}
                            </el-tooltip>
                        </template>
                        <template v-if="slots[`default-${item.field}`]" #body="params">
                            <slot :name="`default-${item.field}`" :="params"/>
                        </template>
                        <!-- <template
                            :key="key"
                            v-slot:[key]="item"
                            v-for="(item, key) in slots"
                        >
                            <slot :name="key" v-bind="item"/>
                        </template> -->
                    </GridColumn>
                </template>
            </GridHeaderRow>
        </GridColumnGroup>
        <GridColumnGroup>
            <GridHeaderRow>
                <template v-for="item in centerColumn" :key="item.field">
                    <GridColumn
                        :field="item?.field"
                        :title="item?.title"
                        :width="item?.width"
                        :rowspan="item?.rowspan"
                        :colspan="item?.colspan"
                        :sortable="item?.sortable"
                        :sorter="item?.sorter"
                        :editable="item?.editable"
                        :order="item?.order"
                        :align="item?.align"
                        :halign="item?.halign"
                        :expander="item?.expander"
                        :headerCls="item?.headerCls"
                        :headerStyle="item?.headerStyle"
                        :cellCss="item?.cellCss"
                        :filterable="item?.filterable"
                        :filterOperators="item?.filterOperators"
                        v-if="item?.visible">
                        <!-- v-if="item?.visible" -->
                        <!-- :hidden="!item?.visible" -->
                        <template #header v-if="!slots[`header-${item.field}`]">
                            <EFilter
                                :title="item.title"
                                v-model="state[item.field]"
                                :filterType="item?.filterType"
                                :filterData="item?.filterData"
                                :filterParam="item?.filterParam"
                                :filterCustom="item?.filterCustom"
                                v-if="item.filterType && item.field"
                                @search="search"
                            ></EFilter>
                            <template v-else>{{ item.title }}</template>
                        </template>
                        <template v-if="slots[`header-${item.field}`]" #header="params">
                            <slot :name="`header-${item.field}`" :="params"/>
                        </template>
                        <template #body="{row,column,rowIndex}" v-if="item.field == 'index'">
                        {{ rowIndex + 1 }}
                        </template>
                        <template v-if="!slots[`default-${item.field}`] && item.showOverflow" #body="{row,column,rowIndex}">
                            <el-tooltip
                                effect="dark"
                                :content="row[column.field]"
                                placement="top">
                                {{row[column.field]}}
                            </el-tooltip>
                        </template>
                        <template v-if="slots[`default-${item.field}`]" #body="params">
                            <slot :name="`default-${item.field}`" :="params"/>
                        </template>
                        <!-- <template
                            :key="key"
                            v-slot:[key]="item"
                            v-for="(item, key) in slots"
                        >
                            <slot :name="key" v-bind="item"/>
                        </template> -->
                    </GridColumn>
                </template>
            </GridHeaderRow>
        </GridColumnGroup>
        <GridColumnGroup :frozen="true" :width="props.rightWidth" v-if="fixedRightColumn?.length">
            <GridHeaderRow>
                <template v-for="item in fixedRightColumn" :key="item.field">
                    <GridColumn
                        :field="item?.field"
                        :title="item?.title"
                        :width="item?.width"
                        :rowspan="item?.rowspan"
                        :colspan="item?.colspan"
                        :sortable="item?.sortable"
                        :sorter="item?.sorter"
                        :editable="item?.editable"
                        :order="item?.order"
                        :align="item?.align"
                        :halign="item?.halign"
                        :expander="item?.expander"
                        :headerCls="item?.headerCls"
                        :headerStyle="item?.headerStyle"
                        :cellCss="item?.cellCss"
                        :filterable="item?.filterable"
                        :filterOperators="item?.filterOperators"
                        v-if="item?.visible">
                        <!-- v-if="item?.visible" -->
                        <!-- :hidden="!item?.visible" -->
                        <template #header v-if="!slots[`header-${item.field}`]">
                            <EFilter
                                :title="item.title"
                                v-model="state[item.field]"
                                :filterType="item?.filterType"
                                :filterData="item?.filterData"
                                :filterParam="item?.filterParam"
                                :filterCustom="item?.filterCustom"
                                v-if="item.filterType && item.field"
                                @search="search"
                            ></EFilter>
                            <template v-else>{{ item.title }}</template>
                        </template>
                        <template v-if="slots[`header-${item.field}`]" #header="params">
                            <slot :name="`header-${item.field}`" :="params"/>
                        </template>
                        <template #body="{row,column,rowIndex}" v-if="item.field == 'index'">
                        {{ rowIndex + 1 }}
                        </template>
                        <template v-if="!slots[`default-${item.field}`] && item.showOverflow" #body="{row,column,rowIndex}">
                            <el-tooltip
                                effect="dark"
                                :content="row[column.field]"
                                placement="top">
                                {{row[column.field]}}
                            </el-tooltip>
                        </template>
                        <template v-if="slots[`default-${item.field}`]" #body="params">
                            <slot :name="`default-${item.field}`" :="params"/>
                        </template>
                        <!-- <template
                            :key="key"
                            v-slot:[key]="item"
                            v-for="(item, key) in slots"
                        >
                            <slot :name="key" v-bind="item"/>
                        </template> -->
                    </GridColumn>
                </template>
            </GridHeaderRow>
        </GridColumnGroup>
    </DataGrid>
</template>

<script setup lang="ts" name="ETable">
import { ref } from 'vue'
import { deepClone, debounce } from '@/utils'
import EFilter from './EFilter.vue'
import { DataGrid, GridColumnGroup, GridHeaderRow, GridColumn } from 'v3-easyui'
import XPopover from '@/components/XPopover/index.vue'
import { getTableConfig, saveTableConfig } from '@/api/system/tableConfig/index.ts'
import { tableConfig, tableConfigData, tableConfigList } from '@/api/system/tableConfig/types.ts'
interface filterElement {
    toolId?: string, // 开启列宽保存，所有列都需要title字段
    // loading?: boolean,
    pageSize?: number,
    loading?: boolean,
    leftWidth?: number,
    pageNumber?: number,
    rightWidth?: number,
    searchShow?: boolean,
    columnList?: any[],
    toolId?: string // 开启列宽保存，所有列都需要title字段
    showRefresh?: boolean
    isNeedEmitRefresh?: boolean
    // watchWidthId?: string,
    intervalCondition?: any[],
}

const attrs = useAttrs()
const slots = useSlots()
const emits = defineEmits(['searchChange','update:pageNumber','update:pageSize','rowClick','rowDblClick','rowContextMenu','refresh'])
const props = withDefaults(defineProps<filterElement>(), {
    pageSize: 20,
    leftWidth: 0,
    rightWidth: 0,
    pageNumber: 1,
    loading: false,
    showRefresh: false,
    isNeedEmitRefresh: false,
    searchShow: true,
    columnList: () => [],
    intervalCondition: () => []
})

const rowClick = (scope: any) => {
    emits('rowClick', scope)
}

const rowDblClick = (scope: any) => {
    emits('rowDblClick', scope)
}

const rowContextMenu = (scope: any) => {
    emits('rowContextMenu', scope)
}

const loading = computed({
    get() { return props.loading },
    set(val: number) { emits('update:loading', val) }
})
// const crtLoading = ref(props.loading)

const sorts = ref<any[]>([])
const showList = ref<any[]>([])
const centerColumn = ref<any[]>([])
const tempListField = ref<any[]>([])
const columnShowList = ref<any[]>([])
const fixedLeftColumn = ref<any[]>([])
const fixedRightColumn = ref<any[]>([])
const state = ref<any>({})

const page = ref(props.pageNumber)
const crtPageSize = ref(props.pageSize)

const makeFlag = ref(true)
const toolList = ref<any[]>([])
const filterText = ref(undefined)
const defaultCheck = ref<any[]>([])

const checkAll = ref(true)
const firstFlag = ref(true)
const localTool = ref<any[]>([])
const localWidth = ref<any[]>([])
const allCheckList = ref<any>([])
const isIndeterminate = ref(false)
// const columnShowList = ref<any[]>()

// 刷新按钮
const refreshHandle = () => {
    if (props.isNeedEmitRefresh) {
        emits('refresh')
    } else {
        showListHandle()
    }
}
const initData = (val: any) => {
    return new Promise(async (resolve, rejct) => {
        makeFlag.value = props?.toolId ? false : true
        // crtLoading.value = true
        // columnShowList.value = val
        if (!val?.length) return
        let tempColumnShowList = deepClone(val)
        tempColumnShowList = tempColumnShowList.filter((c: any) => c?.isPermi ? c?.isPermi() : true)
        allCheckList.value = deepClone(tempColumnShowList || []).filter((f: any) => f.title).map((m: any) => m.title)
        tempColumnShowList.map((v: any, index: number) => {
            state.value[v.field] = undefined
            v.visible = (v.visible != undefined) ? v.visible : true
            v.sortIndex = (v.sortIndex != undefined) ? v.sortIndex : index
        })
        tempListField.value = []

        if (props?.toolId) {
            // let data = {}
            const { data }: {data:tableConfigList} = await getTableConfig(props?.toolId)
            // // 宽度固定
            // let tempLocal: any = localStorage.getItem(props.toolId)
            // localWidth.value = tempLocal && JSON.parse(tempLocal) || []
            localWidth.value = data?.tableConfig?.widthList ? data?.tableConfig?.widthList: []
            // if (localWidth.value.length <= 0) return
            // if (localWidth.value) {
            //     tempColumnShowList.map((v: any) => {
            //         let crtWidth = localWidth.value.find((t: any) => t.field == v.field)?.width
            //         if (crtWidth) {
            //             v.width = crtWidth
            //         }
            //     })
            // }
            // }

            // // 排序，显隐功能
            // if (props?.toolId) {
            // let tempLocalTool: any = localStorage.getItem(props.toolId)
            // localTool.value = tempLocalTool && JSON.parse(tempLocalTool) || []
            localTool.value = data?.tableConfig?.toolList ? data?.tableConfig?.toolList: []
            // if (localTool.value.length) {
            tempColumnShowList.map((c: any, index: number) => {
                const crtTool = localTool.value.find((f: any) => f.title == c.title)
                if (crtTool) {
                    if (crtTool?.visible != undefined) {
                        c.visible = crtTool.visible
                    }
                    if (crtTool?.sortIndex) c.sortIndex = crtTool.sortIndex
                }

                let crtWidth = localWidth.value?.find((t: any) => t.field == c.field)?.width
                if (crtWidth) {
                    c.width = crtWidth
                }
            })
            // }
            tempColumnShowList = tempColumnShowList.sort((a: any,b: any) => a.sortIndex - b.sortIndex)
            toolList.value = tempColumnShowList.filter((f: any) => f.title)
            defaultCheck.value = tempColumnShowList.filter((f: any) => f.visible).map((m: any) => m.title)

            checkAll.value = defaultCheck.value.length === allCheckList.value.length
            isIndeterminate.value = defaultCheck.value.length > 0 && defaultCheck.value.length < allCheckList.value.length
            if (data == null) {
                saveTableConfigAPI(toolList.value)
            }
        }

        columnShowList.value = tempColumnShowList
        // 列表分为三块，左固定，中间，右固定
        fixedLeftColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'left')
        centerColumn.value = columnShowList.value?.filter((v: any) => !v?.fixed)
        fixedRightColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'right')
        columnShowList.value.forEach((v: any) => {
            if (v?.filterType || v?.sortable) {
                tempListField.value.push({
                    label: v.title,
                    title: v.title,
                    field: v.field,
                    filterData: v?.filterData,
                    filterCustom: v?.filterCustom,
                    sorts: v?.sortable && v?.order ? {prop: v.field, order:v.order} : undefined,
                    value: undefined,
                    visible: v?.visible,
                    sortIndex: v?.sortIndex,
                })
            }
        })
        makeFlag.value = true
        resolve(true)
    })
}
watch(() => props.columnList, (val: any) => {
    initData(val)
}, { deep: true, immediate: true })

const showListHandle = () => {
    if (!state.value) return
    tempListField.value.map((v: any) => {
        v.value = state.value[v.field]
    })
    let tempList: any[] = []
    tempListField.value.forEach((v: any) => {
        const datas = v.value
        if (datas == undefined || datas == null || datas == '') return
        // const crtFilterData = props.filterDatas.find(pro => pro.name == v.field)
        const crtFilterData = v?.filterData && v.filterData()
        const tempLabel = v?.filterCustom?.label || 'label'
        const tempValue = v?.filterCustom?.value || 'value'
        if (Array.isArray(datas) && datas.length > 1) {
            // 多选按钮
            if (props.intervalCondition.length && props.intervalCondition.includes(v.field)) {
                const datas0 = (datas[0] == undefined || datas[0] == null) ? '' : datas[0]
                const datas1 = (datas[1] == undefined || datas[1] == null) ? '' : datas[1]
                tempList.push({
                    value: `${datas0} - ${datas1}`,
                    label: `${v.title}: ${datas0} - ${datas1}`,
                    column: v.field
                })
                return
            }
            datas.forEach((element: number | string) => {
                const label = crtFilterData?.find((val: Record<string, any>) => val[tempValue] == element)[tempLabel]
                tempList.push({
                    value: element,
                    label: `${v.title}: ${label || element}`,
                    column: v.field
                })
            })
        } else if (Array.isArray(datas)) {
            // 单选、表单、开关
            const label = crtFilterData?.find((val: Record<string, any>) => val[tempValue] == datas)[tempLabel]
            tempList.push({
                value: datas,
                label: `${v.title}: ${label || datas}`,
                column: v.field
            })
        } else {
            // 单选、表单、开关
            const label = crtFilterData?.find((val: Record<string, any>) => val[tempValue] == datas)[tempLabel]
            tempList.push({
                value: datas,
                label: `${v.title}: ${label || datas}`,
                column: v.field
            })
        }
        if (v.sorts) {
            const num = sorts.value.findIndex((s: any) => s.prop = v.field)
            if (num != -1) {
                sorts.value[num] = v.sorts
            }
        }
    })
    showList.value = tempList
    const obj: any = {}
    showList.value.forEach(v => {
        if (props.intervalCondition.includes(v.column)) {
            // 处理区间搜索的数据
            const intervalList = (v.value as string).split(' - ')
            obj[v.column + 'Start'] = (intervalList[0] == undefined || intervalList[0] == null || intervalList[0] == '') ? undefined : intervalList[0]
            obj[v.column + 'End'] = (intervalList[1] == undefined || intervalList[1] == null || intervalList[1] == '') ? undefined : intervalList[1]
            return
        }
        if (obj[v.column]) {
            // 如果一个值出现多次，说明是数组，所以进行合并
            obj[v.column] = Array.isArray(obj[v.column]) ? obj[v.column].concat(v.value) : [obj[v.column], v.value]
        } else {
            obj[v.column] = v.value
        }
    })
    // if (props.pageShow) {
    obj.pageNum = props.pageNumber ? page.value : undefined
    obj.pageSize = props.pageSize ? crtPageSize.value : undefined
    // }
    obj.sorts = sorts.value?.length ? sorts.value : undefined
    for (let key in obj) {
        if (obj[key] && typeof obj[key] == 'string') {
            obj[key] = obj[key].trim()
        }
    }
    emits('searchChange', obj)
    // tempListField.value.forEach((v: any) => {
    //     showList.value.push({
    //         value: `${datas0} - ${datas1}`,
    //         label: `${v.column.title}: ${datas0} - ${datas1}`,
    //         column: v.field
    //     })
    // })
}

// watch(() => state.value, (val) => {
//     showListHandle()
// }, { deep: true })


const eTableRef = ref()

const search = () => {
    showListHandle()
}
// 清空所有搜索条件
const deleteAll = () => {
    // 清空所有搜索条件
    showList.value = []

    for (let key in state.value) {
        state.value[key] = undefined
    }
    tempListField.value.map((v: any) => {
        v.value = undefined
    })
    showListHandle()
}

// 删除单个搜索条件
const deleteShowList = (index: number) => {
    const crtTag = showList.value[index]
    showList.value.splice(index, 1)

    // console.log(crtTag, state.value, tempListField.value)
    if (Array.isArray(state.value[crtTag.column])) {
        const num = state.value[crtTag.column].findIndex((f: any) => f == crtTag.value)
        state.value[crtTag.column].splice(num, 1)
    } else {
        state.value[crtTag.column] = undefined
    }
    tempListField.value.map((v: any) => {
        if (crtTag.column == v.field) {
            v.value = undefined
        }
    })
    showListHandle()
}

// 排序改变时触发
const sortTable = (item: any) => {
    sorts.value = item.map((v: any) => {
        return {
            prop: v.field,
            order: v.order,
        }
    })
    showListHandle()
}

// 页码，每页数据量改变时触发
const onPageChange = (val: Record<string,any>) => {
    page.value = val.pageNumber
    crtPageSize.value = val.pageSize
    showListHandle()
}

// 保存 表格配置 到后端
const saveTableConfigAPI = (tools?: any[], widths?: any[]) => {
    return new Promise((resolve, reject) => {
        const param: tableConfigData = {
            tableName: props.toolId as string,
            tableConfig: {
                name: props.toolId as string,
                widthList: widths ? widths : localWidth.value,
                toolList: tools ? tools : localTool.value,
            }
        }
        // console.log(param)
        saveTableConfig(param).then((res: any) => {
            if (res.code != 200) {
                console.error(res.msg)
            } else {
                resolve(res)
            }
        }).catch((err: any) => {
            console.error(err.msg)
            reject(err)
        })
    })
}

// 简单防抖
let timer: any = null
function debounceHandle (fn: Function, delay: number) {
    clearTimeout(timer)
    timer = setTimeout(() => {
        fn && fn()
    }, delay)
}

// 每列宽度改变时，触发
const resize = (column: any) => {
    if (!props.toolId) return
    if (column.field) {
        let crtLocalWidth: any = localWidth.value.find((l: any) => l.field == column.field)
        if (crtLocalWidth) {
            crtLocalWidth.width = column.widthState.replace('px','')
        } else {
            localWidth.value.push({
                field: column.field,
                width: column.widthState.replace('px','')
            })
        }
    }
    debounceHandle(saveTableConfigAPI, 1000)
    // localStorage.setItem(props.toolId as string, JSON.stringify(localWidth.value))
}

const drageIndex = ref(1)
const drageEndIndex = ref(1)
// 源对象开始被拖动时触发
const dragstart = (index: number) => {
    drageIndex.value = index
    // console.log('拖拽开始', index)
}
// 源对象在目标对象范围内移动时触发 使用 pereventDefault 来阻止浏览器默认的拒绝拖拽
const dragover = (e: Event, index: number) => {
    e.preventDefault()
    // console.log('拖拽中', e, index)
}
// 源对象开始进入目标对象范围内触发 使用 pereventDefault 来阻止浏览器默认的拒绝拖拽
const dragenter = (e: Event, index: number) => {
    e.preventDefault()
    drageEndIndex.value = index
    // console.log('拖拽进入目标对象范围', e, index)
}
// 源对象拖动结束时触发
const dragend = () => {
    // drageIndex.value = index
    const tempTool = JSON.parse(JSON.stringify(toolList.value))
    const tempTool1 = JSON.parse(JSON.stringify(toolList.value))
    const currentSource = tempTool[drageIndex.value]

    currentSource.sortIndex = tempTool[drageEndIndex.value].sortIndex
    // tempTool[drageEndIndex.value].sortIndex = tempTool1[drageIndex.value].sortIndex
    tempTool.map((t: any) => {
        if (t.sortIndex > currentSource.sortIndex) {
            t.sortIndex = t.sortIndex + 1
        }
    })
    tempTool[drageEndIndex.value].sortIndex += 1

    tempTool.splice(drageIndex.value, 1)
    tempTool.splice(drageEndIndex.value, 0, currentSource)
    toolList.value = tempTool.sort((a: any,b: any) => a.sortIndex - b.sortIndex)
    // console.log('拖拽结束',toolList.value, drageIndex.value, currentSource, drageEndIndex.value)
}

// 全选
const handleCheckAllChange = (val: boolean) => {
    defaultCheck.value = val ? allCheckList.value : []
    isIndeterminate.value = false
}
const handleCheckedCitiesChange = (value: string[]) => {
    const checkedCount = value.length
    checkAll.value = checkedCount === allCheckList.value.length
    isIndeterminate.value = checkedCount > 0 && checkedCount < allCheckList.value.length
}

// 重置排序...
const reset = async () => {
    makeFlag.value = props?.toolId ? false : true
    // crtLoading.value = true
    // columnShowList.value = val
    if (!props.columnList?.length) return
    let tempColumnShowList = deepClone(props.columnList)
    allCheckList.value = tempColumnShowList.filter((f: any) => f.title).map((m: any) => m.title)
    tempColumnShowList.map((v: any, index: number) => {
        state.value[v.field] = undefined
        v.visible = (v.visible != undefined) ? v.visible : true
        v.sortIndex = (v.sortIndex != undefined) ? v.sortIndex : index
    })
    tempListField.value = []

    if (props?.toolId) {
        // let data = {}
        // // 宽度固定
        // let tempLocal: any = localStorage.getItem(props.toolId)
        // localWidth.value = tempLocal && JSON.parse(tempLocal) || []
        localWidth.value = []
        // if (localWidth.value.length <= 0) return
        // if (localWidth.value) {
        //     tempColumnShowList.map((v: any) => {
        //         let crtWidth = localWidth.value.find((t: any) => t.field == v.field)?.width
        //         if (crtWidth) {
        //             v.width = crtWidth
        //         }
        //     })
        // }
        // }

        // // 排序，显隐功能
        // if (props?.toolId) {
        // let tempLocalTool: any = localStorage.getItem(props.toolId)
        // localTool.value = tempLocalTool && JSON.parse(tempLocalTool) || []
        localTool.value = []
        // if (localTool.value.length) {
        tempColumnShowList.map((c: any, index: number) => {
            const crtTool = localTool.value.find((f: any) => f.title == c.title)
            if (crtTool) {
                if (crtTool?.visible != undefined) {
                    c.visible = crtTool.visible
                }
                if (crtTool?.sortIndex) c.sortIndex = crtTool.sortIndex
            }

            let crtWidth = localWidth.value?.find((t: any) => t.field == c.field)?.width
            if (crtWidth) {
                c.width = crtWidth
            }
        })
        // }
        tempColumnShowList = tempColumnShowList.sort((a: any,b: any) => a.sortIndex - b.sortIndex)
        toolList.value = tempColumnShowList.filter((f: any) => f.title)
        defaultCheck.value = tempColumnShowList.filter((f: any) => f.visible).map((m: any) => m.title)

        checkAll.value = defaultCheck.value.length === allCheckList.value.length
        isIndeterminate.value = defaultCheck.value.length > 0 && defaultCheck.value.length < allCheckList.value.length
        // if (data == null) {
        //     saveTableConfigAPI(toolList.value)
        // }
    }

    columnShowList.value = tempColumnShowList
    // 列表分为三块，左固定，中间，右固定
    fixedLeftColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'left')
    centerColumn.value = columnShowList.value?.filter((v: any) => !v?.fixed)
    fixedRightColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'right')
    columnShowList.value.forEach((v: any) => {
        if (v?.filterType || v?.sortable) {
            tempListField.value.push({
                label: v.title,
                title: v.title,
                field: v.field,
                filterData: v?.filterData,
                filterCustom: v?.filterCustom,
                sorts: v?.sortable && v?.order ? {prop: v.field, order:v.order} : undefined,
                value: undefined,
                visible: v?.visible,
                sortIndex: v?.sortIndex,
            })
        }
    })
    makeFlag.value = true
    confirm(false)
}

// 确认
const confirm = (flag: boolean = true) => {
    if (!flag) {
        loading.value = true
    }
    makeFlag.value = false
    toolList.value.map((t: any) => {
        // != -1 说明选中，需要显示
        t.visible = defaultCheck.value.findIndex((d: any) => d == t.title) != -1
    })
    columnShowList.value.map((v: any) => {
        const obj = toolList.value.find((t: any) => t.title == v.title)
        if (obj) {
            v.visible = obj.visible
            v.sortIndex = obj.sortIndex
        }

        let crtWidth: any = localWidth.value.find((l: any) => l.field == v.field)
        if (crtWidth) {
            v.width = crtWidth.width
        }
    })
    columnShowList.value = columnShowList.value.sort((a,b) => a.sortIndex - b.sortIndex)
    centerColumn.value = columnShowList.value?.filter((v: any) => !v?.fixed)
    fixedLeftColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'left')
    fixedRightColumn.value = columnShowList.value?.filter((v: any) => v?.fixed == 'right')
    localTool.value = columnShowList.value
    // localStorage.setItem(props.toolId as string, JSON.stringify(localTool.value))
    nextTick(async () => {
        makeFlag.value = true
        // saveTableConfigAPI()
        await saveTableConfigAPI(localTool.value, localWidth.value)
        if (!flag) {
            loading.value = true
        }
    })
}

// const reloadTable = () => {
//     setTimeout(() => {
//         console.log('----', eTableRef.value)
//         eTableRef.value.scrollTo(attrs['data'][0])
//     }, 1000)
// }
// onActivated(() => {
//     reloadTable()
// })
// onMounted(() => {
//     reloadTable()
// })

defineExpose({ eTableRef, state })
</script>

<style lang="scss" scoped>
.XTable-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    .showText {
        flex: 1;
        max-height: 60px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    .XTable-tool {
        flex: none;
        // width: 80px;
        height: 20px;
        padding: 0 5px 0;
        margin-left: 20px;

        // .XTable-tool-box {
        // }

        .XTable-icon {
            margin-left: 5px;
        }
    }
}
:deep(.XTable-tool-list) {
    display: flex;
    flex-direction: column;
    max-height: 350px;
    // margin-top: 10px;
    overflow-y: auto;

    .el-checkbox {
        flex: none;
    }

    &.margin-top {
        margin-top: 10px;
    }
}
// :deep(.datagrid-header-row) {
//     .datagrid-field-td {
//         display: flex;
//         justify-content: center;
//         align-items: center;
//     }
// }
/* /deep/ .el-table__fixed-header-wrapper .GridColumn--selection {
      text-indent: -999999px;
    }

    .datagrid-view .el-button--text {
      height: 18px;
    }

    /deep/ .verticalTop {
      vertical-align: unset;
      padding-top: 8px;
    } */
.data-grid-mask {
    // position: absolute;
    // top: 0;
    // left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba($color: #000000, $alpha: 0.7);
}

:deep(.datagrid-wrap) {
    .datagrid-cell {
        font-size: 12px;
        color: #606266;
    }
    .datagrid-htable {
        .datagrid-cell {
            font-weight: 700;
        }
    }
}
</style>
