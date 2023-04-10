<template>
  <div>
    <el-popover placement="bottom-start" :width="600" trigger="click">
      <template #reference>
        <el-button style="margin-right: 16px">隐藏表格</el-button>
      </template>
      <el-transfer
        filterable
        v-model="transferArr"
        :props="props.transferProps"
        :titles="['显示列','隐藏列']"
        :filter-method="filterMethod"
        filter-placeholder="请输入标题"
        :data="columnArr.filter(v => v.label)"
        :right-default-checked="columnArr.filter(v => v.label && !v.visible)"
        @change="changeTransfer"
      />
    </el-popover>
    <el-table
      :="attrs"
      :data="props.data"
      style="width: 100%"
      @selection-change="selectionChange">
      <template v-for="(item, i) in columnArr" :key="i">
        <template v-if="item.slot && item.visible">
          <slot :name="`table-column-${item.slot}`"></slot>
        </template>
        <template v-else-if="item.visible">
          <el-table-column
            :key="i"
            :prop="item.type"
            :label="item.label"
            :="{...item.attrs}"
            v-if="!item.hide">
            <template #header v-if="item.attrs?.type != 'selection'">
              <slot :name="`header-${item.type}`">{{item.label}}</slot>
            </template>
            <template #default="scope" v-if="item.attrs?.type != 'selection'">
              <slot :name="`column-${item.type}`" :row="scope.row">{{scope.row[item.type]}}</slot>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <el-pagination
      :total="total"
      v-if="!hidePage"
      :layout="props.layout"
      style="margin-top: 10px;"
      v-model:currentPage="page"
      v-model:page-size="pageSize"
      :page-sizes="props.pageSizes"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts" setup name="g-table">
import {
  ref,
  computed,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
  defineExpose
} from 'vue'

const attrs = useAttrs()
const emits = defineEmits(['update:page', 'update:pageSize', 'pagination', 'selectionChange'])
const props = withDefaults(defineProps<{
  data: any[],
  page?: number,
  total?: number,
  columns: any[],
  layout?: string,
  pageSize?: number,
  hidePage?: boolean,
  pageSizes?: number[],
  transferProps?: {
    key?: string,
    label?: string,
    disabled?: string
  }
}>(), {
  data: () => [],
  page: 1,
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  columns: () => [],
  pageSize: 10,
  hidePage: false,
  pageSizes: () => [10, 20, 30, 40, 50],
  transferProps: () => {
    return {
      key: 'type',
      label: 'label',
      disabled: 'disabled'
    }
  }
})

let temp
const columnArr = ref<any[]>(JSON.parse(JSON.stringify(props.columns)))
// 两层for分别表示当前项与第二项
for(let i = 0; i < columnArr.value.length - 1; i++) {
  for(let j = 0; j < columnArr.value.length - 1; j++) {

    // 如果当前项大于第二项(后一项)则交换
    if(columnArr.value[j]['sort'] > columnArr.value[j+1]['sort']) {
      temp = columnArr.value[j]
      columnArr.value[j] = columnArr.value[j+1]
      columnArr.value[j+1] = temp
    }
  }
}

const transferArr = ref(columnArr.value.filter(v => v.label && !v.visible).map(v => v[props.transferProps?.key as string]))

const page = computed({
  get() {
    return props.page
  },
  set(value: number) {
    emits('update:page', value)
  }
})

const pageSize = computed({
  get() {
    return props.pageSize
  },
  set(value: number) {
    emits('update:pageSize', value)
  }
})

const filterMethod = (query: string, item: any) => {
  return item.label.includes(query)
}

const hideTable = (flag: boolean, arr: string|any[]) => {
  console.log(arr)
  arr = Array.isArray(arr) ? arr : [arr]
  columnArr.value.forEach(v => {
    if (arr.includes(v[props.transferProps?.key as string])) {
      v.visible = flag // right隐藏列
    }
  })
}

const changeTransfer = (curVal: any[], type: string, arr: any[]) => {
  hideTable(type === 'left', arr) // right隐藏列
}

const selectionChange = (val: any) => {
  emits('selectionChange', val)
}

const handleSizeChange = (val: number) => {
  emits('pagination', val)
}

const handleCurrentChange = (val: number) => {
  emits('pagination', val)
}

defineExpose({ hideTable })
</script>