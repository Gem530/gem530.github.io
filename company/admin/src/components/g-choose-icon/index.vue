<template>
  <el-popover
    :width="props.width"
    :trigger="props.trigger"
    v-model:visible="visible"
    :placement="props.position">
    
    <template #reference>
      <el-input
        readonly
        v-model="iconCur"
        :placeholder="props.placeholder">
        <template #prepend>
          <g-icon :icon="iconCur" :size="20" v-if="iconCur"></g-icon>
        </template>
        <template #append>
          <g-icon icon="DocumentCopy" v-copy="iconCur" v-copy:callback="copySuccess" @click.stop=""></g-icon>
        </template>
      </el-input>
    </template>

    <el-input
      v-model="searchValue"
      placeholder="请输入图标名称，不区分大小写"
      @keyup.enter="searchIcon"
    />
    <div class="icon-flex">
      <div
        :key="item"
        class="icon-item"
        v-for="item in iconArr"
        @click="chooseIcon(item)">
        <g-icon :icon="item" :size="20"></g-icon>
        <span>{{item}}</span>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup name="g-choose-icon">
import { iconList } from './config'
import * as Icons from '@element-plus/icons-vue'
import {
  ref,
  watch,
  defineEmits,
  defineProps,
  withDefaults,
  getCurrentInstance,
  ComponentInternalInstance
} from 'vue'

const emits = defineEmits(['update:modelValue'])
const { proxy } = getCurrentInstance() as ComponentInternalInstance as any
const props = withDefaults(defineProps<{
  width?: number,
  modelValue?: string,
  placeholder?: string,
  trigger?: 'click'|'hover'|'focus'|'contextmenu',
  position?: 'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'left'|'left-start'|'left-end'|'right'|'right-start'|'right-end'
}>(), {
  width: 650,
  trigger: 'click',
  position: 'bottom-start',
  placeholder: '请选择icon图标'
})

for (let k in Icons) {
  iconList.push(k)
}

const iconCur = ref('')
const visible = ref(false)
const searchValue = ref('')
const iconArr = ref(iconList)

watch(() => props.modelValue, (value: string|undefined) => {
  if (value === undefined || value === '' || value === '#') return
  iconCur.value = value ?? iconArr.value[0]
})

const searchIcon = () => {
  visible.value = true
  iconArr.value = !searchValue.value ? iconList :
    iconList.filter(v => v.toLowerCase().indexOf(searchValue.value.toLowerCase()) !== -1)
}

const chooseIcon = (value: string) => {
  iconCur.value = value
  visible.value = false
  searchValue.value = ''
  emits('update:modelValue', value)
}

const copySuccess = () => {
  proxy.$modal.message('复制成功')
}
</script>

<style lang="scss" scoped>
.icon-flex {
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  @include flex(flex-start, flex-start);

  .icon-item {
    width: 120px;
    padding: 5px 0;
    margin-bottom: 10px;
    border-radius: 5px;
    cursor: pointer;
    @include flex(center, center, column);
    &:hover {
      background: #dddddd;
    }
    span {
      text-align: center;
      word-break: break-all;
    }
  }
}
</style>