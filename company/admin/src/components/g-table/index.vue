<template>
  <div>
    <el-table
      :="attrs"
      :data="props.data"
      style="width: 100%"
      @selection-change="selectionChange">
      <template v-for="(item, i) in columns" :key="i">
        <template v-if="item.slot">
          <slot :name="`table-column-${item.slot}`"></slot>
        </template>
        <template v-else>
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
  withDefaults
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
  pageSizes?: number[]
}>(), {
  data: () => [],
  page: 1,
  total: 0,
  layout: 'total, sizes, prev, pager, next, jumper',
  columns: () => [],
  pageSize: 10,
  hidePage: false,
  pageSizes: () => [10, 20, 30, 40, 50]
})

let temp
const columns = JSON.parse(JSON.stringify(props.columns))
// 两层for分别表示当前项与第二项
for(let i = 0; i < columns.length - 1; i++) {
  for(let j = 0; j < columns.length - 1; j++) {

    // 如果当前项大于第二项(后一项)则交换
    if(columns[j]['sort'] > columns[j+1]['sort']) {
      temp = columns[j]
      columns[j] = columns[j+1]
      columns[j+1] = temp
    }
  }
}
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

const selectionChange = (val: any) => {
  emits('selectionChange', val)
}

const handleSizeChange = (val: number) => {
  emits('pagination', val)
}

const handleCurrentChange = (val: number) => {
  emits('pagination', val)
}
</script>