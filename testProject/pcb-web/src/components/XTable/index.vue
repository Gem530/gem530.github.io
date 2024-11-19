<template>
    <div class="newVxeTable">
        <!-- <el-button @click="deleteShowList(0)">删除</el-button> -->
        <div class="XTable-header" v-if="props.showHead">
            <div class="showText global-flex flex-start flex-wrap">
                <template v-if="props.searchShow && showList.length">
                    <div class="show-text-title">筛选条件</div>
                    <el-tag class="show-text-item" v-for="(item, index) in showList" :key="index" closable :disable-transitions="false"
                        @close="deleteShowList(index)">
                        {{ item.label }}
                    </el-tag>
                    <el-button class="show-text-item" link type="primary" @click="deleteAll">清空筛选</el-button>
                </template>
            </div>

            <div class="XTable-tool global-flex flex-end">
                <!-- v-if="props.showRefresh || props.toolId" -->
                <slot name="header-tool"></slot>
                <el-button type="primary" plain v-if="props.showRefresh" class="pointer XTable-item primary-color" @click="refreshHandle">刷新</el-button>
                <XPopover :width="250" @confirm="confirm" @reset="reset" @hide="filterText = undefined" v-if="props.toolId" :reset="true">
                    <template #reference>
                        <el-button type="primary" plain>
                            表格配置
                            <el-icon style="margin-left: 2px;" size="14px"><ArrowDown /></el-icon>
                        </el-button>
                    </template>
                    <div class="XTable-tool-box">
                        <el-input v-model.trim="filterText" placeholder="请输入列名称"/>

                        <div class="XTable-tool-list margin-top border-bottom" v-if="!filterText">
                            <el-checkbox
                                v-model="checkAll"
                                :indeterminate="isIndeterminate"
                                @change="handleCheckAllChange"
                            >全选</el-checkbox>
                        </div>
                        <el-checkbox-group v-model="defaultCheck" class="XTable-tool-list" @change="handleCheckedCitiesChange">
                            <template :key="item.title" v-for="(item, i) in toolList">
                                <div class="XTable-tool-item global-flex flex-between width-100" v-if="(filterText && item.title.includes(filterText)) || !filterText">
                                    <div class="XTable-tool-checkbox"><el-checkbox
                                        draggable="true"
                                        @dragend="dragend"
                                        :label="item.title"
                                        @dragstart="dragstart(i)"
                                        @dragover="dragover($event, i)"
                                        @dragenter="dragenter($event, i)"
                                    >{{ item.title }}</el-checkbox></div>
                                    <div class="XTable-tool-fixed global-flex flex-end">
                                        <div class="XTable-tool-fixed-icon global-flex flex-center pointer"><el-icon size="20" :color="item?.fixed == 'left' ? 'var(--el-color-primary)' : 'rgb(192, 196, 204)'" @click="chooseFixed(item, 'left')"><Back /></el-icon></div>
                                        <div class="XTable-tool-fixed-icon global-flex flex-center pointer"><el-icon size="20" :color="item?.fixed == 'right' ? 'var(--el-color-primary)' : 'rgb(192, 196, 204)'" @click="chooseFixed(item, 'right')"><Right /></el-icon></div>
                                    </div>
                                </div>
                            </template>
                        </el-checkbox-group>
                    </div>
                </XPopover>
            </div>
        </div>

        <!-- :height="props.isAutoHeight ? tableAutoHeight : (attrs['height'] as number|string)"
        :max-height="props.isAutoHeight ? '' : (attrs['max-height'] as number|string)" -->
        <div ref="XTableDomRef" :class="`x-table-dom ${attrs?.data?.length && 'has-data'}`">
        <vxe-table
            :size="tableSize"
            min-height="0px"
            :header-cell-class-name="headerCellClassName"
            :seq-config="seqConfig"
            :="attrs"
            :loading="loading"
            ref="xTableRef"
            :column-config="{
                resizable: true,
                // resizable: !!props.toolId,
                ...(attrs['column-config'] as Record<string, any>),
            }"
            :filter-config="{
                remote:true,
                ...(attrs['filter-config'] as Record<string, any>)
            }"
            :row-config="{
                // isHover: true,
                isCurrent:true,
                ...(attrs['row-config'] as Record<string, any>)
            }"
            :sort-config="{
                remote: true,
                trigger: 'cell',
                ...(attrs['sort-config'] as Record<string, any>)
            }"
            :tooltip-config="{
                contentMethod: contentMethod,
                ...(attrs['tooltip-config'] as Record<string, any>)
            }"
            @sort-change="sortChange"
            @filter-change="filterChange"
            @filter-visible="filterVisible"
            @header-cell-click="openFilterEvent"
            @resizable-change="resizableChange" v-if="makeFlag" v-resize="resizeHandle">
            <!-- v-resize="initData(props.columnList)" -->
                <!-- iconAsc: 'ArrowUp',
                iconDesc: 'ArrowDown', -->
            <template v-for="(item, i) in columnShowList" :key="item.field">
                <vxe-colgroup :="{...item}" v-if="props.toolId ? (item?.children?.length && item?.visible) : item?.children?.length">
                    <XColumn v-for="(el, i) in item.children" :key="el.field" :="{...el}"
                        :params="{filterData:el?.filterData && el.filterData(), filterCustom:el?.filterCustom}">
                        <template v-if="slots[`default-${el.field}`]" #default="params">
                            <slot :name="`default-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`header-${el.field}`]" #header="params">
                            <slot :name="`header-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`edit-${el.field}`]" #edit="params">
                            <slot :name="`edit-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`filter-${el.field}`]" #filter="params">
                            <slot :name="`filter-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`footer-${el.field}`]" #footer="params">
                            <slot :name="`footer-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`title-${el.field}`]" #title="params">
                            <slot :name="`title-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`checkbox-${el.field}`]" #checkbox="params">
                            <slot :name="`checkbox-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`radio-${el.field}`]" #radio="params">
                            <slot :name="`radio-${el.field}`" :="params"/>
                        </template>

                        <template v-if="slots[`content-${el.field}`]" #content="params">
                            <slot :name="`content-${el.field}`" :="params"/>
                        </template>
                    </XColumn>
                </vxe-colgroup>
                <XColumn v-else :="{...item}"
                    :params="{filterData:item?.filterData && item.filterData(), filterCustom:item?.filterCustom}">
                    <template v-if="slots[`default-${item.field}`]" #default="params">
                        <slot :name="`default-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`header-${item.field}`]" #header="params">
                        <slot :name="`header-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`edit-${item.field}`]" #edit="params">
                        <slot :name="`edit-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`filter-${item.field}`]" #filter="params">
                        <slot :name="`filter-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`footer-${item.field}`]" #footer="params">
                        <slot :name="`footer-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`title-${item.field}`]" #title="params">
                        <slot :name="`title-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`checkbox-${item.field}`]" #checkbox="params">
                        <slot :name="`checkbox-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`radio-${item.field}`]" #radio="params">
                        <slot :name="`radio-${item.field}`" :="params"/>
                    </template>

                    <template v-if="slots[`content-${item.field}`]" #content="params">
                        <slot :name="`content-${item.field}`" :="params"/>
                    </template>
                </XColumn>
            </template>

            <slot name="default"></slot>
            <template #empty v-if="slots?.empty"><slot name="empty"/></template>
            <template #loading v-if="slots?.loading"><slot name="loading"/></template>
        </vxe-table>
        </div>

        <div class="x-page-dom" ref="pageRef">
        <vxe-pager
            v-if="props.pageShow"
            size="small"
            :layouts="['PrevJump', 'PrevPage', 'JumpNumber', 'NextPage', 'NextJump', 'Sizes', 'FullJump', 'Total']"
            :="{...props.pageParams}"
            v-model:current-page="page"
            v-model:page-size="crtPageSize"
            @page-change="pageChange">
            <template #left><slot name="page-left"/></template>
            <template #right><slot name="page-right"/></template>
        </vxe-pager>
        </div>
    </div>
</template>

<script setup name="XTable" lang="ts">
import escapeHtml from 'escape-html'
import { deepClone } from '@/utils'
import useAppStore from '@/store/modules/app';
import XPopover from '@/components/XPopover/index.vue'
import { computed, nextTick, defineProps, ref, useAttrs, useSlots } from 'vue'
import { getTableConfig, saveTableConfig } from '@/api/system/tableConfig/index.ts'
import { tableConfig, tableConfigData, tableConfigList } from '@/api/system/tableConfig/types.ts'
import { type VxeTableEvents, type VxeColumnPropTypes, type VxePagerEvents } from 'vxe-table'

interface columnFilterData {
    name: string // name需要与field一样，例：radio/input/sex
    filterData: any[]
    custom: {
        label: string,
        value: string
    }
}

interface tempData {
    label: string
    value: string | number
}

interface tagRow extends tempData {
    column: string
}

const pageRef = ref()
const xTableRef = ref()
const attrs = useAttrs()
const slots = useSlots()
const XTableDomRef = ref()
const emits = defineEmits(['update:currentPage','update:pageSize','update:pageLoading','update:loading','pageChange','delSearchAll','delSearch','searchChange','refresh','finishSort'])
const tableSize = computed(() => useAppStore().size== 'small' ? 'mini' : useAppStore().size == 'large' ? 'medium' : 'small')
// const slotsList = ref<string[]>([])
// for (let key in slots) {
//     slotsList.value.push(key)
// }
watch(() => tableSize.value, () => {
    if (xTableRef.value) {
        xTableRef.value.recalculate(true)
    }
})

const props = withDefaults(defineProps<{
    showHead?: boolean
    searchShow?: boolean
    filterDatas?: columnFilterData[]
    intervalCondition?: string[] // 字段名(field)数组，主要用于日期和时间 例:['school']

    // isAutoHeight?: boolean
    // watchWidthId?: string, // 开启列宽保存，所有列都需要field字段
    toolId?: string // 开启列宽保存，所有列都需要title字段
    loading?: boolean
    showRefresh?: boolean
    isNeedEmitRefresh?: boolean
    columnList: any[] // columnList[0].autoExpend 唯一，columnlist只能有一个有这个字段 自动扩展，未超出表格宽度时自动撑满，超出时按照拖动的宽度展示

    // pager---
    pageShow?: boolean
    pageSize?: number
    pageParams?: any
    currentPage?: number
}>(), {
    showHead: true,
    searchShow: true,
    filterDatas: () => [],
    intervalCondition: () => [],

    // isAutoHeight: false,
    loading: false,
    showRefresh: false,
    isNeedEmitRefresh: false,
    columnList: () => [],

    // pager---
    pageShow: true,
    pageSize: 20,
    currentPage: 1,
    pageParams: () => {}
})

const page = computed({
    get() { return props.currentPage },
    set(val: number) { emits('update:currentPage', val) }
})

const crtPageSize = computed({
    get() { return props.pageSize },
    set(val: number) { emits('update:pageSize', val)}
})

const loading = computed<any>({
    get() { return props.loading },
    set(val: number) { emits('update:loading', val) }
})

const { proxy } = getCurrentInstance() as any;

const sorts = ref([])
const makeFlag = ref(true)
const toolList = ref<any[]>([])
const filterText = ref(undefined)
const showList = ref<tagRow[]>([])
const defaultCheck = ref<any[]>([])
// const addSearchTag = (params: tagRow) => {
//   const i = showList.value.findIndex((v: tagRow) => v.value == params.value && v.label == params.label && v.column == params.column)
//   if (i !== -1) return
//   showList.value.push({value: params.value, label: params.label, column: params.column})
// }

// const topToScroll = ref(false)
// const oldBottomScroll = ref('')
// const tableAutoHeight = ref<number>(0)
// const oldTableMargin = ref<Record<string, any>|undefined>(undefined)
// const observer = new MutationObserver((mutationsList, observer) => {
//     if (!props.isAutoHeight || !XTableDomRef?.value) return
//     let xTableMargin = XTableDomRef.value.getBoundingClientRect()
//     xTableMargin = xTableMargin && JSON.parse(JSON.stringify(xTableMargin))
//     if (xTableMargin && Object.values(xTableMargin).every(v => v == 0)) return
//     const appMain = document.querySelector('.app-main>.p-2') as Element
//     const bodyHeight = document.body.clientHeight;
//     const pageHeight = pageRef.value.clientHeight
//     const pageMargin = pageRef.value.getBoundingClientRect()
//     const pageBottomScroll = (bodyHeight - pageMargin.bottom)
//     const currentBottomScroll = (appMain.scrollHeight - appMain.clientHeight)

//     // console.log(pageBottomScroll, currentBottomScroll, appMain.scrollHeight, appMain.clientHeight)
//     if (oldTableMargin.value?.top != xTableMargin.top) {
//         // xtable的上方元素改变，触发
//         oldTableMargin.value = xTableMargin
//         const height = bodyHeight - xTableMargin.top - pageHeight
//         tableAutoHeight.value = height
//         topToScroll.value = true
//         // console.log('top---', pageHeight, tableAutoHeight.value)
//     }
//     if (appMain.scrollHeight > appMain.clientHeight) {
//         // 页面出现滚动条，触发
//         let height = tableAutoHeight.value;
//         height = height - currentBottomScroll
//         const bottomScroll = JSON.stringify({pageBottomScroll, currentBottomScroll})
//         // console.log('----', bottomScroll, oldBottomScroll.value, height, currentBottomScroll)
//         if (bottomScroll == oldBottomScroll.value) {
//             height = height + currentBottomScroll
//             if (pageBottomScroll < 0) {
//                 // 表格高度超出屏幕
//                 height = height + currentBottomScroll
//             }
//             oldBottomScroll.value = ''
//         } else {
//             oldBottomScroll.value = bottomScroll
//             if (pageBottomScroll < 0 && currentBottomScroll > 0 && topToScroll.value) {
//                 // 表格高度超出屏幕
//                 height = height + currentBottomScroll
//             }
//         }
//         tableAutoHeight.value = height
//         topToScroll.value = false
//         // console.log('scroll---', pageHeight, tableAutoHeight.value, pageBottomScroll, currentBottomScroll)
//     }
// });

// const initObserve = () => {
//     if (props.isAutoHeight) {
//         const appMain = document.querySelector('.app-main>.p-2') as Element
//         observer.observe(appMain, { attributes: true, childList: true, subtree: true });
//     }
// }
// const closeObserve = () => {
//     oldTableMargin.value = undefined
//     observer.disconnect()
// }

// onMounted(() => { initObserve() });
// onActivated(() => { initObserve() })

// onUnmounted(() => { closeObserve() })
// onDeactivated(() => { closeObserve() })

// 有id就开启监听表格列宽度变化的记录
const checkAll = ref(true)
const localTool = ref<any>([])
const localWidth = ref<any>([])
const hasAutoExpend = ref(false)
const allCheckList = ref<any>([])
const isIndeterminate = ref(false)
const columnShowList = ref<any>()
const initData = async (val: any, widthAutoFlag: boolean = false) => {
    val = deepClone(val)
    let tempColumnShowList = val.filter((c: any) => c?.isPermi ? c?.isPermi() : true)
    allCheckList.value = deepClone(tempColumnShowList || []).filter((f: any) => f.title).map((m: any) => m.title)
    // 列宽改变
    if (props?.toolId) {
        const { data }: {data:tableConfigList} = await getTableConfig(props?.toolId)
        let initTableConfigData = JSON.parse(JSON.stringify(data))
        // console.log('data-----', JSON.parse(JSON.stringify(data)), props.toolId)
        // let tempLocal: any = localStorage.getItem(props.toolId)
        // localWidth.value = tempLocal && JSON.parse(tempLocal) || []
        localWidth.value = data?.tableConfig?.widthList ? data?.tableConfig?.widthList||[] : []
        // console.log(localWidth.value)
        if (localWidth.value) {
            tempColumnShowList.map((v: any) => {
                const crtWidth = localWidth.value.find((t: any) => t.field == v.field)?.width
                if (crtWidth) {
                    v.width = crtWidth
                }
            })
        }
        // }
        // // 排序，显隐，固定列功能
        // if (props?.toolId) {
        // let tempLocalTool: any = localStorage.getItem(props.toolId)
        // localTool.value = tempLocalTool && JSON.parse(tempLocalTool) || []
        localTool.value = data?.tableConfig?.toolList ? data?.tableConfig?.toolList: []
        // console.log(localTool.value)
        tempColumnShowList.map((c: any, index: number) => {
            const crtTool = localTool.value.find((t: any) => t.title == c.title)
            // console.log('crtTool-----', crtTool)
            if (crtTool && (crtTool?.visible != undefined || crtTool?.visible != '' || crtTool?.visible != null)) {
                c.visible = crtTool.visible
            } else {
                c.visible = (c.visible != undefined) ? c.visible : true
            }

            if (crtTool?.sortIndex) {
                c.sortIndex = crtTool.sortIndex
            } else {
                c.sortIndex = c.sortIndex || index
            }

            // if (crtTool?.fixed) {
            if (initTableConfigData) {
                // 说明该表格已存在，从crtTool中取值
                c.fixed = crtTool?.fixed || undefined
            } else {
                // 不存在，说明需要从代码中取值
                c.fixed = c?.fixed || undefined
            }
            // } else {
            //     c.fixed = c?.fixed || undefined
            // }
        })
        tempColumnShowList = tempColumnShowList.sort((a: any,b: any) => a.sortIndex - b.sortIndex)
        toolList.value = tempColumnShowList.filter((f: any) => f.title)
        defaultCheck.value = tempColumnShowList.filter((f: any) => f.visible && f.title).map((m: any) => m.title)

        checkAll.value = defaultCheck.value.length === allCheckList.value.length
        isIndeterminate.value = defaultCheck.value.length > 0 && defaultCheck.value.length < allCheckList.value.length
        if (data == null) {
            saveTableConfigAPI(toolList.value)
        }
    }

    const initAutoExpendInfo = deepClone(tempColumnShowList).find((f: any) => f?.autoExpend)
    const tempCrtColumn = tempColumnShowList.find((f: any) => f?.autoExpend)
    if (widthAutoFlag) {
        tempCrtColumn.width = 'auto'
    }
    columnShowList.value = deepClone(tempColumnShowList)
    columnShowList.value.map((m: any, mI: number) => {
        m.initWidth = initAutoExpendInfo?.width == 'auto' ? 40 : (initAutoExpendInfo?.width || 40)
        if (m.type == 'checkbox') {
            m.fixed = 'left'
        }
    })

    // 修改配置后，更新 可扩展列 的宽度为自适应
    let expendColumn = columnShowList.value.find((f: any) => f?.autoExpend)
    if (expendColumn) {
        hasAutoExpend.value = true
        const { isOverWidth }: any = await isOverTableWidth()
        // console.log('isOverWidth1', isOverWidth)
        if (!isOverWidth) {
            // console.log('扩展列 宽度 自适应1', expendColumn)
            expendColumn.width = 'auto'
        }
    } else {
        hasAutoExpend.value = false
    }
}
// 用于tab页，或者 从隐藏到显示的情况，重新计算一次，否则会出现宽度自适应不生效的情况
const initResizeWidth = ref<number>()
const resizeHandle = (dom: any) => {
    // console.log('dom', props.toolId, dom)
    // const hasAutoExpendColumn = props.columnList?.length && props.columnList?.find((f: any) => f?.autoExpend)
    // 只有有 扩展列 的才需要重新计算，并且与表格的宽度不一致时才计算   不加上宽度判断时，会出现拖动以及改顺序与固定列时多次触发宽度计算
    if (hasAutoExpend.value && (initResizeWidth.value != dom?.width)) {
        // console.log(1111, (initResizeWidth.value != dom?.width), initResizeWidth.value, dom?.width)
        initData(props.columnList)
        initResizeWidth.value = dom?.width
    }
}
// 获取xtable每列总宽
const getXtableColumnWidth = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // const columnWidth = xTableRef.value.getColumnWidth(field)
                // const tableColumn = xTableRef.value.getTableColumn()
                // console.log(columnWidth, tableColumn, columns)
                let tableWidth = xTableRef.value?.$el?.clientWidth // 表格总宽度
                const columns = xTableRef.value.getColumns()
                let columnsWidth = 0 // 每列宽度相加
                columns.map((item: any) => {
                    let expendColumn = columnShowList.value.find((f: any) => f?.autoExpend)
                    if ((expendColumn?.field == item?.field)) {
                        // 扩展列 取接口保存的宽度或者初始化的宽度，不取实时的渲染宽度
                        // console.log(expendColumn)
                        columnsWidth = columnsWidth + Number(expendColumn?.initWidth || 0)
                    } else {
                        columnsWidth = columnsWidth + (item?.renderWidth || 0)
                    }
                    // console.log(columnsWidth, item.width, item.initWidth)
                })
                // console.log(columns, tableWidth, columnsWidth)
                resolve({columns, tableWidth, columnsWidth})
            } catch(err) {
                console.log(err)
                resolve({columns: [], tableWidth: 0, columnsWidth: 0})
            }
        }, 0)
    })
}
// 判断 所有列的宽度是否超出表格的 总宽度
const isOverTableWidth = () => {
    return new Promise(async (resolve, reject) => {
        const {columns, tableWidth, columnsWidth}: any = await getXtableColumnWidth()
        resolve({isOverWidth: columnsWidth > tableWidth, columns})
    })
}
watch(() => props.columnList, (val: any) => {
    initData(val)
}, { deep: true, immediate: true })

// 刷新按钮
const refreshHandle = () => {
    if (props.isNeedEmitRefresh) {
        emits('refresh')
    } else {
        showListHandle()
    }
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

// 宽度变化时，触发
const resizableChange = async ({$rowIndex, column, columnIndex, $columnIndex, $event}: any) => {
    if (!props.toolId) return
    const $table = xTableRef.value
    let currentColumnWidth = $table.getColumnWidth(column.field)
    if (column.field) {
        let crtLocalWidth: any = localWidth.value.find((l: any) => l.field == column.field)
        if (crtLocalWidth) {
            crtLocalWidth.width = currentColumnWidth
        } else {
            localWidth.value.push({
                field: column.field,
                width: currentColumnWidth
            })
        }
    }
    // console.log('isOverWidth', isOverWidth, columns)
    // let expendColumn = columnShowList.value.find((f: any) => f?.autoExpend)

    // if (expendColumn?.field == column.field) {
    //     if (isOverWidth) {
    //         await saveTableConfigAPI()
    //     }
    // } else {
    await saveTableConfigAPI()
    // }

    if (hasAutoExpend.value) {
        // 修改配置后，更新最后一列的宽度为自适应
        const { isOverWidth, columns }: any = await isOverTableWidth()
        await initData(props.columnList, !isOverWidth) // !isOverWidth: 总列没有超过表格，就设置扩展列为自适应
        makeFlag.value = false
        // expendColumn.width = currentColumnWidth
        nextTick(async () => {
            makeFlag.value = true
        })
    }
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
    // const tempTool1 = JSON.parse(JSON.stringify(toolList.value))
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
    // console.log(defaultCheck.value, toolList.value)
    // console.log('拖拽结束',toolList.value, drageIndex.value, currentSource, drageEndIndex.value)
}

// 切换当前列，左右固定
const chooseFixed = (item: any, type: string) => {
    if (item.fixed && (item.fixed == type)) {
        item.fixed = undefined
    } else {
        item.fixed = type
    }
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
const reset = () => {
    let tempColumnShowList = deepClone(props.columnList)
    localWidth.value = []
    // console.log(localWidth.value)
    if (localWidth.value) {
        tempColumnShowList.map((v: any) => {
            const crtWidth = localWidth.value.find((t: any) => t.field == v.field)?.width
            if (crtWidth) {
                v.width = crtWidth
            }
        })
    }
    // }
    // // 排序，显隐功能
    // if (props?.toolId) {
    // let tempLocalTool: any = localStorage.getItem(props.toolId)
    // localTool.value = tempLocalTool && JSON.parse(tempLocalTool) || []
    localTool.value = []
    // console.log(localTool.value)
    tempColumnShowList.map((c: any, index: number) => {
        const crtTool = localTool.value.find((t: any) => t.title == c.title)
        if (crtTool && (crtTool?.visible != undefined || crtTool?.visible != '' || crtTool?.visible != null)) {
            c.visible = crtTool.visible
        } else {
            c.visible = (c.visible != undefined) ? c.visible : true
        }

        if (crtTool?.sortIndex) {
            c.sortIndex = crtTool.sortIndex
        } else {
            c.sortIndex = c.sortIndex || index
        }

        if (crtTool?.fixed) {
            c.fixed = crtTool?.fixed || undefined
        } else {
            c.fixed = c?.fixed || undefined
        }
    })
    tempColumnShowList = tempColumnShowList.sort((a: any,b: any) => a.sortIndex - b.sortIndex)
    toolList.value = tempColumnShowList.filter((f: any) => f.title)
    defaultCheck.value = tempColumnShowList.filter((f: any) => f.visible && f.title).map((m: any) => m.title)

    checkAll.value = defaultCheck.value.length === allCheckList.value.length
    isIndeterminate.value = defaultCheck.value.length > 0 && defaultCheck.value.length < allCheckList.value.length
    // console.log(localWidth.value)
    confirm(false)
    // const $table = xTableRef.value
    // if ($table) {
    //     columnShowList.value = columnShowList.value.sort((a,b) => a.sortIndex - b.sortIndex)
    //     localTool.value = toolList.value
    //     // localStorage.setItem(props.toolId as string, JSON.stringify(localTool.value))
    //     $table.refreshColumn()
    //     $table.reloadData(attrs['data'])
    //     nextTick(async () => {
    //         await saveTableConfigAPI(localTool.value, localWidth.value)
    //         initData(props.columnList)
    //     })
    // }
}

// 确认
const confirm = (flag: boolean = true) => {
    if (!flag) {
        loading.value = true
    }
    makeFlag.value = false
    // console.log(defaultCheck.value, toolList.value)
    toolList.value.map((t: any) => {
        // != -1 说明选中，需要显示
        t.visible = defaultCheck.value.findIndex((d: any) => d == t.title) != -1
    })
    columnShowList.value.map((v: any) => {
        const obj = deepClone(toolList.value).find((t: any) => t.title == v.title)
        if (obj) {
            v.fixed = obj?.fixed
            v.visible = obj.visible
            v.sortIndex = obj.sortIndex
        }

        let crtWidth: any = localWidth.value.find((l: any) => l.field == v.field)
        if (crtWidth) {
            v.width = crtWidth.width
        }
    })
    const $table = xTableRef.value
    if ($table) {
        columnShowList.value = columnShowList.value.sort((a,b) => a.sortIndex - b.sortIndex)
        localTool.value = toolList.value
        // localStorage.setItem(props.toolId as string, JSON.stringify(localTool.value))
        nextTick(async () => {
            makeFlag.value = true
            await saveTableConfigAPI(localTool.value, localWidth.value)
            if (!flag || hasAutoExpend.value) {
                // 修改配置后，更新最后一列的宽度为自适应
                const { isOverWidth, columns }: any = await isOverTableWidth()
                await initData(props.columnList, !isOverWidth)
            }
            $table.refreshColumn()
            $table.reloadData(attrs['data'])
            if (!flag) {
                loading.value = true
            }
            emits('finishSort')
        })
    }
}

// 清空所有搜索条件
const deleteAll = () => {
    showList.value = []
    // 清空所有搜索条件
    const $table = xTableRef.value
    if ($table) {
        $table.clearFilter()
    }
    page.value = 1
    showListHandle()
    emits('delSearchAll')
}

// 删除单个搜索条件
const deleteShowList = (index: number) => {
    const crtTag = showList.value[index]
    // 修改搜索条件
    const $table = xTableRef.value
    if (!$table) return
    const column = $table.getColumnByField(crtTag.column)
    if (column) {
        // 修改第二个选项为勾选状态
        const option = column.filters[0]
        const intervalConditionFlag = props.intervalCondition.length && props.intervalCondition.includes(crtTag.column)
        if (Array.isArray(option.data) && option.data.length > 1 && !intervalConditionFlag) {
            const index = option.data.findIndex((v: number) => v == crtTag.value)
            if (index === -1) return
            option.data.splice(index, 1)
        } else {
            $table.clearFilter(column)
        }
        showList.value.splice(index, 1)
        // 如果是直接修复筛选条件，则需要手动调用 updateData 处理表格数据
        $table.updateData()
    }
    page.value = 1
    showListHandle()
    emits('delSearch', crtTag)
}

// 序号页码增加
const seqConfig = reactive<any>({
    seqMethod ({ rowIndex }: any) {
        let crtPage = page.value || 0
        return rowIndex + ((crtPage - 1) * (crtPageSize.value || 0)) + 1
    }
})

// 排序变化
const sortChange: VxeTableEvents.SortChange = ({ column, property, order, sortBy, sortList, $event }) => {
    let sortsTemp: any[] = []
    sortList.forEach((v) => {
        const tempSort = {
            prop: v.field,
            order: v.order
        }
        sortsTemp.push(tempSort)
    })
    sorts.value = sortsTemp
    if (attrs['sort-config']?.remote == false) return
    showListHandle()
}

// 搜索重置
const filterResetmethod: VxeColumnPropTypes.FilterResetMethod = ({ options, column }) => {
    const crtShowListTag = showList.value.find(v => v.column == column.field)
    page.value = 1
    showListHandle()
    emits('delSearch', crtShowListTag)

    const tempList = showList.value.filter((v: tagRow) => v.column != column.field)
    showList.value = tempList
    options.forEach((option) => {
        option.data = undefined
    })
}

// 处理搜索头部数据
const showListHandle = () => {
    const filterList = xTableRef.value.getCheckedFilters()
    nextTick(() => {
        const $table = xTableRef.value
        if ($table) {
            let tempList: tagRow[] = []
            filterList.forEach((v: any) => {
                const datas = v.datas[0]
                if (datas == undefined || datas == null || datas == '') return
                // const crtFilterData = props.filterDatas.find(pro => pro.name == v.field)
                const crtFilterData = v.column?.params?.filterData
                const tempLabel = v.column?.params?.filterCustom?.label || 'label'
                const tempValue = v.column?.params?.filterCustom?.value || 'value'
                if (Array.isArray(datas) && datas.length > 1) {
                    // 多选按钮
                    if (props.intervalCondition.length && props.intervalCondition.includes(v.field)) {
                        const datas0 = (datas[0] == undefined || datas[0] == null) ? '' : datas[0]
                        const datas1 = (datas[1] == undefined || datas[1] == null) ? '' : datas[1]
                        tempList.push({
                            value: `${datas0} - ${datas1}`,
                            label: `${v.column.title}: ${datas0} - ${datas1}`,
                            column: v.field
                        })
                        return
                    }
                    datas.forEach((element: number | string) => {
                        const label = crtFilterData?.find((val: Record<string, any>) => val[tempValue] == element)[tempLabel]
                        tempList.push({
                            value: element,
                            label: `${v.column.title}: ${label || element}`,
                            column: v.field
                        })
                    })
                } else if (Array.isArray(v.datas)) {
                    // 单选、表单、开关
                    const label = crtFilterData?.find((val: Record<string, any>) => val[tempValue] == datas)[tempLabel]
                    tempList.push({
                        value: datas,
                        label: `${v.column.title}: ${label || datas}`,
                        column: v.field
                    })
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
            if (props.pageShow) {
                obj.pageNum = page.value
                obj.pageSize = crtPageSize.value
            }
            if (sorts.value) obj.sorts = sorts.value
            for (let key in obj) {
                if (obj[key] && typeof obj[key] == 'string') {
                    obj[key] = obj[key].trim()
                }
            }
            emits('searchChange', obj)
        }
    })
}
// 头部搜素项的显示
const filterChange: VxeTableEvents.FilterChange = ({ column, property, values, datas, filterList, $event }) => {
    if (datas.length == 0 && filterList.length == 0) {
        filterResetmethod({ options: column.filters as any, column })
        return;
    }
    page.value = 1
    showListHandle()
}

// 筛选弹框的显隐
const filterVisible: VxeTableEvents.FilterVisible = ({ column, property, visible, filterList, $event }) => {
    const $table = xTableRef.value
    if ($table && column.filters?.length && visible) {
        if (Array.isArray(column.filters[0].data) && column.filters[0].data?.length) {
            column.filters[0].checked = true
            $table.setFilter(property, column.filters)
        } else if (!Array.isArray(column.filters[0].data) && column.filters[0].data) {
            column.filters[0].checked = true
            $table.setFilter(property, column.filters)
        } else {
            column.filters[0].checked = false
        }
    }
    function keyUpHandle (val: any) {
        if (val.keyCode == '13') {
            const $table = xTableRef.value
            if ($table) {
                const column = $table.getColumnByField(property)
                if (column) {
                    // 修改第一个选项为勾选状态
                    const option = column.filters[0]

                    // 区间选择器，两个都为空时，也需要重置条件
                    let noEmpty = false
                    if (Array.isArray(option.data)) {
                        noEmpty = option.data.every((v: number|string) => (v == undefined || v == null || v == ''))
                    }
                    if (option.data == undefined || option.data == null || option.data == '' || noEmpty) {
                        // 该项没有值时，重置并关闭筛选弹框
                        $table.clearFilter(column)
                        $table.closeFilter()
                    } else {
                        // 该项有值时，筛选
                        option.checked = true
                        $table.setFilter(property, column.filters)
                        // 如果是直接修复筛选条件，则需要手动调用 updateData 处理表格数据
                        $table.updateData()
                        $table.closeFilter()
                    }

                    // 筛选操作后，进行头部筛选条件的处理
                    page.value = 1
                    showListHandle()
                }
            }
        }
    }

    if (visible) {
        // 在筛选弹框显示时，进行enter的操作
        window.onkeyup = (val) => keyUpHandle(val)
    } else {
        window.onkeyup = () => {}
    }
}

// 重写tooltip展示，如果是div等元素，取出字符串，并把换行符改为空格
const contentMethod = ({ cell }: any): string => {
    const cellText = escapeHtml(cell.innerText || cell.textContent).replace(/\n/g, " ")
    return cellText
}

// 分页改变
const pageChange: VxePagerEvents.PageChange = ({ type, currentPage, pageSize, $event }) => {
    showListHandle()
    emits('pageChange', { type, currentPage, pageSize, $event })
}

// 表头打开筛选弹框
const openFilterEvent = ({ $rowIndex, column, columnIndex, $columnIndex, triggerResizable, triggerSort, triggerFilter, $event }) => {
    const $table = xTableRef.value
    if ($table && $event.target.classList.value.includes('vxe-cell--title')) {
        $table.openFilter(column.field)
    }
}

const headerCellClassName = ({ $rowIndex, column, columnIndex, $columnIndex }) => {
    // console.log($rowIndex, column, columnIndex, $columnIndex)
    if (column.filters?.length && column.filters[0].data) {
        return 'filter-active'
    } else {
        return 'filter-inactive'
    }
}

// 设置筛选条件
const filterFieldEvent = (list: {field: string, defaultValue: any}[]) => {
    const $table = xTableRef.value
    if ($table) {
        list.forEach((item: any) => {
            const column = $table.getColumnByField(item.field)
            if (column) {
                $table.setFilter(column, [{data:item.defaultValue, checked: true}])
            }
        })
        showListHandle()
        $table.updateData()
    }
}
// 删除筛选条件
const delFilterField = (list: {field: string}[]) => {
    const $table = xTableRef.value
    if ($table) {
        list.forEach((item: any) => {
            const column = $table.getColumnByField(item)
            if (column) {
                $table.clearFilter(column)
                // const index = showList.value.findIndex((v: any) => v.column == item)
                // if (index > -1) {
                //     deleteShowList(index)
                // }
            }
        })
        showListHandle()
        $table.updateData()
        // $table.updateData()
    }
}

defineExpose({ xTableRef, toolList, deleteAll, filterChange, deleteShowList, filterResetmethod, filterFieldEvent, delFilterField })
</script>

<style lang="scss" scoped>
// .newVxeTable {
//     background: #ffffff;
// }
.XTable-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    .showText {
        flex: 1;
        max-height: 60px;
        overflow-y: auto;
        overflow-x: hidden;

        .show-text-title {
            display: inline-block;
            font-size: 14px;
            line-height: 14px;
            color: #919191;
        }
        .show-text-item {
            margin-left: 8px;
        }
    }

    .XTable-tool {
        flex: none;
        // width: 80px;
        min-height: 28px;
        padding: 4px 0;
        margin-left: 20px;
        font-size: 14px;
        line-height: 20px;

        // .XTable-tool-box {
        // }

        .XTable-item {
            margin-left: 8px;
        }

        .filter-box {
            min-height: 20px;
        }
    }
}
:deep(.XTable-tool-list) {
    display: flex;
    flex-direction: column;
    max-height: 350px;
    // margin-top: 10px;
    overflow-y: auto;

    // &.border-bottom {
    //     border-bottom: 1px solid rgb(192, 196, 204);
    //     margin-bottom: 5px;
    // }

    .el-checkbox {
        flex: none;
    }

    &.margin-top {
        margin-top: 4px;
    }

    .XTable-tool-item {
        height: 32px;
        .XTable-tool-checkbox {
            flex: 1;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .el-checkbox {
                max-height: 32px;
            }
        }
        .XTable-tool-fixed {
            flex: none;
            width: 60px;
            height: 100%;
            font-size: 12px;

            .XTable-tool-fixed-icon {
                position: relative;
                flex: none;
                width: 50%;
                height: 100%;
                text-align: center;
                &:not(:last-child) {
                    &::after {
                        content: '';
                        position: absolute;
                        top: 50%;
                        right: 0;
                        width: 0;
                        height: 60%;
                        border-right: 1px solid #dedede;
                        transform: translate(0, -50%);
                    }
                }
            }
        }
    }
}
:deep(.vxe-header--column.col--ellipsis>.vxe-cell .vxe-cell--title) {
    text-overflow: clip !important;
}
// :deep(.vxe-cell--label) {
//     display: inline-block !important;
// }
:deep(.vxe-table--render-default .vxe-body--column.col--ellipsis:not(.col--actived)>.vxe-cell) {
    // overflow: visible;
    text-overflow: clip !important;

    // .vxe-cell--label {
    //     display: inline-block;
    //     width: 100%;
    //     overflow: hidden;
    //     text-overflow: clip !important;
    //     white-space: nowrap;
    // }
}
:deep(.vxe-cell) {
    padding-left: 2px !important;
    padding-right: 2px !important;
}
:deep(.col--edit) {
    .vxe-cell {
        max-height: 95% !important;
    }
}
// 解决最后为固定列时，并且没有数据时头部的border不见了，手动在after加个border，在有数据/滚动时隐藏after
:deep(.has-data) {
    .vxe-table--render-default {
        .vxe-table--fixed-right-wrapper {
            // .is--scroll-x .vxe-header--column,
            .vxe-header--column {
                &.col--fixed {
                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        border-left: 1px solid transparent;
                    }
                }
            }
        }
    }
}
:deep(.vxe-table) {
    // 解决最后为固定列时，并且没有数据时头部的border不见了，手动在after加个border，在有数据/滚动时隐藏after
    .vxe-table--fixed-right-wrapper {
        &.scrolling--middle {
            .vxe-header--column {
                &.col--fixed {
                    &::after {
                        content: '';
                        position: absolute;
                        top: 0;
                        left: 0;
                        height: 100%;
                        border-left: 1px solid transparent;
                    }
                }
            }
        }
    }
    &.is--scroll-x {
        .vxe-header--column {
            &.col--fixed {
            // 解决最后为固定列时，并且没有数据时头部的border不见了，手动在after加个border，在有数据/滚动时隐藏after
                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    border-left: 1px solid #E9E9E9;
                }
            }
        }
    }
}
:deep(.vxe-header--column) {
    .vxe-cell {
        width: 100%;
        // overflow: hidden;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .el-tooltip__trigger {
            display: inline-block;
            width: 100%;
        }
        .tooltip-width-auto {
            width: auto;
        }

        .vxe-cell--sort {
            width: 14px;
            height: 14px;
            .vxe-icon-caret-up {
                // width: 14px;
                // height: 8px;
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('@/assets/icons/svg/sort-top.svg') no-repeat;
                    background-size: 14px 14px;
                    background-position: center center;
                }
                &.sort--active {
                    &::before {
                        background: url('@/assets/icons/svg/sort-top-active.svg') no-repeat;
                        background-size: 14px 14px;
                        background-position: center center;
                    }
                }
            }
            .vxe-icon-caret-down {
                // width: 14px;
                // height: 8px;
                &::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('@/assets/icons/svg/sort-bottom.svg') no-repeat;
                    background-size: 14px 14px;
                    background-position: center center;
                }
                &.sort--active {
                    &::before {
                        background: url('@/assets/icons/svg/sort-bottom-active.svg') no-repeat;
                        background-size: 14px 14px;
                        background-position: center center;
                    }
                }
            }
        }
    }
    &.col--center {
        .vxe-cell {
            justify-content: center;
        }
    }
    &.col--left {
        .vxe-cell {
            justify-content: flex-start;
        }
    }
    &.col--right {
        .vxe-cell {
            justify-content: flex-end;
        }
    }

}

:deep(.filter-inactive) {
    .vxe-cell--filter {
        .vxe-filter--btn {
            position: relative;
            display: inline-block;
            width: 14px;
            height: 14px;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('@/assets/icons/svg/filter-init.svg') no-repeat;
                background-size: 14px 14px;
            }
        }
    }
}
:deep(.filter-active) {
    .vxe-cell--filter {
        .vxe-filter--btn {
            // color: var(--vxe-primary-color);
            position: relative;
            display: inline-block;
            width: 14px;
            height: 14px;
            &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: url('@/assets/icons/svg/filter-active.svg') no-repeat;
                background-size: 14px 14px;
            }
        }
    }
}
// .vxe-table .vxe-header--sort-wrapper .vxe-sort-icon {
//   display: none;
// }
</style>
<style lang="scss">
.vxe-table--tooltip-wrapper {
    z-index: 9999 !important;
}
</style>
