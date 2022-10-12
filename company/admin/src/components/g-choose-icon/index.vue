<template>
  <el-popover
    :width="props.width"
    :trigger="props.trigger"
    v-model:visible="visible"
    :placement="props.position">
    <template #reference>
      <el-input v-model="searchValue" :style="{width: props.width+'px'}" @keyup.enter="searchIcon">
        <template #prepend>
          <g-icon :icon="iconCur" :size="20"></g-icon>
        </template>
      </el-input>
    </template>
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
  defineEmits,
  defineProps,
  withDefaults
} from 'vue'

const emits = defineEmits(['update:icon'])
const props = withDefaults(defineProps<{
  icon?: string,
  width?: number,
  trigger?: 'click'|'hover'|'focus'|'contextmenu',
  position?: 'top'|'top-start'|'top-end'|'bottom'|'bottom-start'|'bottom-end'|'left'|'left-start'|'left-end'|'right'|'right-start'|'right-end'
}>(), {
  width: 650,
  trigger: 'click',
  position: 'bottom-start'
})

for (let k in Icons) {
  iconList.push(k)
}

const iconCur = ref('')
const visible = ref(false)
const searchValue = ref('')
const iconArr = ref(iconList)
iconCur.value = props.icon ?? iconArr.value[0]
searchValue.value = iconCur.value

const searchIcon = () => {
  visible.value = true
  iconArr.value = iconList.filter(v => v.toLowerCase().indexOf(searchValue.value.toLowerCase()) !== -1)
}

const chooseIcon = (value: string) => {
  iconCur.value = value
  visible.value = false
  searchValue.value = iconCur.value
  emits('update:icon', value)
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