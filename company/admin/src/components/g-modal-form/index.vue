<template>
  <el-dialog
    :="attrs"
    :title="titleR"
    :model-value="props.show"
    @closed="close"
  >
    <slot name="dialog-content">
      <g-form
        ref="GFormRef"
        v-if="props.show"
        label-width="100px"
        :rules="props.rules"
        :formList="props.formList"
        @search="search">
        <template v-slot:[el.prop]="item" v-for="(el, i) in slotList" :key="i">
          <slot :name="el.prop" :="{...item}"></slot>
        </template>
      </g-form>
    </slot>
    <template #footer>
      <slot name="dialog-footer">
        <span class="dialog-footer">
          <el-button @click="close">{{props.cancelName}}</el-button>
          <el-button type="primary" @click="confirmHandle">{{props.confirmName}}</el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup name="g-modal-form">
import {
  ref,
  watch,
  useAttrs,
  nextTick,
  defineEmits,
  defineProps,
  withDefaults,
  defineExpose
} from 'vue'

const GFormRef = ref()
const attrs = useAttrs()
const emits = defineEmits(['update:show', 'confirm'])
const props = withDefaults(defineProps<{
  rules?: any,
  show: boolean,
  title?: string,
  formList?: any[],
  cancelName?: string,
  confirmName?: string
}>(), {
  rules: {},
  show: false,
  title: '新增',
  formList: () => [],
  cancelName: '取消',
  confirmName: '确认'
})

const titleR = ref(props.title)
const slotList = ref<any[]>(props.formList.filter((v: any) => ['slot', 'form-slot'].indexOf(v.type) !== -1))

watch(() => props.show, (val) => {
  nextTick(() => {
    val && GFormRef.value.clearValidte()
  })
})

const close = () => {
  emits('update:show', false)
}

const confirmHandle = () => {
  GFormRef.value.searchHandle()
}

const search = (item: any) => {
  emits('confirm', item)
}

const initModalData = (item: any, title: string = '新增') => {
  setTimeout(()=> {
    // 使用nextTick获取到的GFormRef.value为undfined
    titleR.value = title
    GFormRef.value.initData(item)
  }, 0)
}

defineExpose({ close, initModalData })
</script>
