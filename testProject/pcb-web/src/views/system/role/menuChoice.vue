<template>
    <div class="menu-box global-flex flex-start">
        <div class="menu-nav">
            <div :class="`menu-nav-item font-weight`">菜单项</div>
            <template v-for="item in data" :key="item?.id">
                <a :href="`#${item?.label}`" :class="`menu-nav-item pointer ${activeNav?.id == item?.id && 'active'}`" @click="chooseNav(item)">
                    <span style="color: var(--el-color-primary);margin-right: 3px;">{{(item?.flag || item.indeterminate) ? '*' : (!parentFlag && item?.parentChoose ? '*' : '')}}</span> {{item?.label}}
                    <!-- <el-badge :is-dot="item?.flag || item.indeterminate" class="item">{{item?.label}}</el-badge> -->
                </a>
            </template>
        </div>
        <div class="menu-content">
            <el-checkbox v-model="checkAll" size="default" @change="(value) => allChoose(value, data, 'one')">全选/全不选</el-checkbox>
            <el-checkbox v-model="parentFlag" size="default" @change="getChoice">父子联动</el-checkbox>
            <div class="menu-content-height">
                <template v-for="item in data">
                    <div :id="item?.label" class="menu-content-title global-flex flex-between">
                        <div>{{item?.label}}</div>
                        <el-checkbox v-model="item.flag" @change="(value) => allChoose(value, item?.children, 'two')">全选/全不选</el-checkbox>
                    </div>
                    <XTable :data="item?.children || []" :columnList="item?.columnList || []" :pageShow="false" :show-header="false" :span-method="spanMethod">
                        <template v-for="(slot, slotIndex) in item?.columnList" :key="" v-slot:[`default-${slotIndex}`]="scope">
                            <template v-if="showRowColumn(scope, item)?.length && scope.columnIndex != 0">
                                <!-- <div v-for="el in showRowColumn(scope, item)" :key="el.id">{{el.label}}</div> -->
                                <el-checkbox v-model="el.flag" v-for="el in showRowColumn(scope, item)" :key="el.id"
                                :indeterminate="parentFlag ? (el.flag ? false : (el?.indeterminate || false)) : false"
                                @change="(value) => singleChoose(value, el, scope)">{{el.label}}</el-checkbox>
                            </template>
                            <!-- <template v-if="showRowColumn(scope, item)">
                                {{showRowColumn(scope, item)}}
                            </template> -->
                            <template v-if="scope.columnIndex == 0">
                                <el-checkbox v-model="item.children[scope.rowIndex].flag"
                                :indeterminate="parentFlag ? (item.children[scope.rowIndex]?.flag ? false : (item.children[scope.rowIndex]?.indeterminate || false)) : false"
                                @change="(value) => singleChoose(value, item.children[scope.rowIndex], scope)">{{item.children[scope.rowIndex].label}}</el-checkbox>
                            </template>
                        </template>
                    </XTable>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup name="MenuChoice" lang="ts">
const emits = defineEmits(['update:modelValue','getChoiceList'])
const props = withDefaults(defineProps<{
    list: any[],
    checks: any[],
    menuIdList: any[],
    modelValue: boolean,
}>(), {
    list: () => [],
    checks: () => [],
    modelValue: true,
    menuIdList: () => [],
})

const data = ref([])
const level = ref(0)
const activeNav = ref()
const checkAll = ref(false)

const parentFlag = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emits('update:modelValue', val)
    }
})

// 判断有多少层
const recursion = (val: any, lev: number) => {
    let resLev = lev

    // --------------------
    let newVal = JSON.parse(JSON.stringify(val.children))
    for (let i = 0; i < val.children?.length; i++) {
        let m = val.children[i]
        const isMenuChildren = m?.children?.filter((f: any) => (props.menuIdList || []).includes(f.id))
        // const isMenuChildren = m?.children?.filter((f: any) => ['付款单','收款单','操作日志','日志管理','测试'].includes(f.label+''))
        // const isMenuChildren = m?.children?.filter((f: any) => f.id)
        let tempVal = []
        if (isMenuChildren?.length) {
            m?.children.map((el: any) => {
                tempVal.push({
                    ...m,
                    children: [el]
                })
            })
            const newValIndex = newVal.findIndex((f: any) => f.id == tempVal[0].id)
            newVal.splice(newValIndex, 1, ...tempVal)
            // console.log('-----', JSON.parse(JSON.stringify(tempVal)), newVal)
        }
    }

    val.children = [...newVal]
    val.children.map((m: any) => {
        m.flag = (props.checks||[]).includes(m.id)
        m.level = lev + 1
        // resLev = m.level
        if (m.level >= resLev) {
            resLev = m.level
        }
        if (m.children?.length) {
            resLev = recursion(m, m.level)
            if (parentFlag.value) {
                m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
            }
        }
    })
    return resLev
}

watch([() => props.list, () => parentFlag.value], (val: any) => {
    let tempData = val[0] || []
    data.value = JSON.parse(JSON.stringify(tempData))
    activeNav.value = data.value?.length ? data.value[0] : undefined
    if (data.value?.length) {
        data.value.map((m: any) => {
            let valM = m
            // console.log(valM)
            const num = recursion(valM, 1)
            // console.log(m.label, num, valM)
            let tempList = []
            for (let i = 0; i < (num - 1); i++) {
                let params = { title: `第${i}列`, field: `${i}`, align: 'left', showOverflow: false }
                if (i == 0) {
                    params.width = '30%'
                }
                tempList.push(params)
            }
            m = valM
            m.level = 1
            m.columnList = tempList
            if (parentFlag.value) {
                m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
            }
        })
        // console.log(data.value)
        checkAll.value = data.value.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false

        // 初始化时，返回选中的菜单
        getChoice()
    }
}, { deep: true, immediate: true })

// 根据当前行 展示具体数据 目前只支持三级菜单及第四级的按钮
const showRowColumn = (scope: any, item: any) => {
    const { row, column, rowIndex, columnIndex, } = scope
    if (columnIndex == 0) return ''
    let str = 'item'
    if (Number(column.field) <= 1) {
        for (let i = 0; i < Number(column.field); i++) {
            str += `?.children[${rowIndex}]`
        }
    } else {
        for (let i = 0; i < 1; i++) {
            str += `?.children[${rowIndex}]`
        }
        str += `?.children`
        if (eval(str)) {
            str += `[0]`
        }
    }
    str += `?.children`
    return eval(str)
    // return str
}

// 合并单元格，目前只能合并第一列，第二列暂时不支持，目前只考虑三级菜单(即第一列合并，第二轮展示三级菜单)
const spanMethod = (scope: any) => {
    const {row, items, seq, rowIndex, $rowIndex, _rowIndex, column, visibleData, data} = scope
    // 合并参考字段,根据此字段进行合并行
    const referenceField = "id";
    if (['0'].includes(column.property)) {
      if (rowIndex > 0) {
        if (row[referenceField] === items[rowIndex - 1][referenceField]) {
          row.seq = items[rowIndex - 1].seq;
        } else {
          row.seq = items[rowIndex - 1].seq + 1;
        }
      } else if (rowIndex === 0) {
        row.seq = seq;
      }
      let prevRow = data[$rowIndex - 1];
      let nextRow = data[$rowIndex + 1];
      if (prevRow && prevRow[referenceField] === row[referenceField]) {
        return {rowspan: 0, colspan: 0};
      } else {
        let countRowspan = 1;
        while (nextRow && nextRow[referenceField] === row[referenceField]) {
          nextRow = data[++countRowspan + $rowIndex];
        }
        if (countRowspan > 1) {
          return {rowspan: countRowspan, colspan: 1};
        }
      }
    }
}

// 设置菜单中的权限都选中
const recursionChoose = (val: any, flag: boolean) => {
    val.map((m: any) => {
        m.flag = flag
        if (m.children?.length) {
            recursionChoose(m.children, flag)
        }
    })
}

// 全选/全不选 按钮
const allChoose = (val: any, arr: any, type: string) => {
    // console.log(val, arr, type)
    recursionChoose(arr, val)
    if (type == 'two') {
        // 第二层的全选
        data.value.map((m: any) => {
            m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
        })
        // console.log(data.value)
        checkAll.value = data.value.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
    }

    // 更新选中的菜单及按钮
    getChoice()
}

// 单个选择框 切换 递归
const recursionSingle = (val: any) => {
    val.children.map((m: any) => {
        if (m.children?.length) {
            recursionSingle(m)
            m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
        }
    })
}
const recursionSingleChoose = (item: any, val: boolean) => {
    item.children.map((m: any) => {
        m.flag = val
        m.indeterminate = false
        if (m.children?.length) {
            recursionSingleChoose(m, val)
        }
    })
}
// 单个选择的切换
const singleChoose = (val: boolean, item: any, scope: any) => {
    // console.log(val, item, scope)
    if (!parentFlag.value) {
        item.flag = val
        // 更新选中的菜单及按钮
        getChoice()
        return
    }
    if (item?.children?.length) {
        item.indeterminate = false
        if (item.level == 2) {
            const currentParent = data.value.find((f) => f.id == item.parentId)
            if (currentParent?.id) {
                // console.log(currentParent)
                const arr = currentParent.children.filter((f) => f.id == item.id)
                arr.map((m) => {
                    recursionSingleChoose(m, val)
                })
            }
            // const items = data.value.
        } else {
            // console.log(item)
            recursionSingleChoose(item, val)
        }
    }
    data.value.map((m: any) => {
        recursionSingle(m, 1)
        m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
    })
    // console.log(data.value)
    checkAll.value = data.value.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false

    // 更新选中的菜单及按钮
    getChoice()
}

// 选择左侧菜单
const chooseNav = (item: any) => {
    activeNav.value = item
    // console.log(item)
}

// 递归 获取返回选中的值
const recursionChoice = (val: any, choices: any[]) => {
    let tempList = choices || []
    let resList: any[] = []
    val.map((m: any) => {
        if (m?.flag) {
        // if (m?.flag && !m?.children?.length) {
            tempList.push(m.id)
            // console.log(m.id, m.label)
        }
        if (m.children?.length) {
            // const hasChild = m.children.findIndex((f: any) => f.flag)
            // if (hasChild != -1) {
            //     tempList.push(m.id)
            // }
            resList = recursionChoice(m.children, tempList)
            if (parentFlag.value) {
                m.parentChoose = false
                const hasChild = m.children.findIndex((f: any) => (resList||[]).includes(f.id))
                if (hasChild != -1) {
                    m.indeterminate = true
                    resList.push(m.id)
                } else {
                    m.indeterminate = false
                }
                m.flag = m.children.every((s: any) => s.flag) // 都满足条件就返回true，否则返回false
            } else if (!parentFlag.value && m.level == 1) {
                // m.flag = m.children.some((s: any) => s.flag) // 有一个满足条件就返回true，否则返回false
                let isChoose = m.children.some((s: any) => s.flag)
                if (isChoose) {
                    m.parentChoose = true
                    resList.push(m.id)
                }
                // console.log(m.level, m.label, m.flag, m.children)
            }
        }
    })
    return (resList?.length ? resList : tempList)
}
// 返回选中的值
function getChoice () {
    // data.value
    let res = recursionChoice(data.value, [])
    res = Array.from(new Set(res))

    // 三级菜单有多个时，拆分为多个，所以该其中一个时，需要同步其他数据
    data.value.map((val) => {
        let newVal = JSON.parse(JSON.stringify(val))
        let temps = ''
        val?.children?.map((vm) => {
            const twoInfo = val?.children?.filter((f) => f.id == vm.id)
            if (twoInfo?.length >= 2) {
                // temps = vm
                if (vm.flag || vm.indeterminate) {
                    temps = vm
                }
                // console.log(vm, twoInfo, temps)
            }
        })
        if (temps && parentFlag.value) {
            let isAllChoose = false
            // console.log(val?.children)
            isAllChoose = val?.children?.filter((f) => f.id == temps.id)?.every((e) => {
                // console.log('11', e.children.every((ce) => ce.flag))
                return e.children.every((ce) => ce.flag)
            })
            // console.log(isAllChoose)
            newVal?.children?.filter((f) => f.id == temps.id).map((m) => {
                m.flag = isAllChoose // temps.flag
                m.indeterminate = temps.indeterminate
            })
            val.children = newVal.children
        }
    })
    // console.log(res)
    emits('getChoiceList', res)
}
</script>

<style lang="scss" scoped>
.menu-box {
    flex: 1;
    width: 100%;
    overflow: hidden;

    .menu-nav {
        flex: none;
        width: 200px;
        height: 100%;
        margin-right: 10px;
        background: #ffffff;
        overflow-y: auto;
        
        .menu-nav-item {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 45px;
            &.font-weight {
                font-weight: 600;
            }
            &.active {
                color: var(--el-color-primary);
                background: rgba(242, 246, 252, 1);
            }
        }
    }

    .menu-content {
        flex: 1;
        height: 100%;
        overflow-x: auto;

        .menu-content-title {
            margin-top: 10px;
        }

        .menu-content-height {
            height: calc(100% - 32px);
            padding-right: 10px;
            overflow-y: auto;
        }
    }

    :deep(.newVxeTable) {
        .XTable-header {
            display: none;
        }

        .x-table-dom {
            .vxe-cell {
                padding-left: 10px !important;
                padding-right: 10px !important;
            }
        }
    }
}
</style>