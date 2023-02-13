<template>
  <van-field
    readonly
    :="attrs"
    :model-value="value"
    @click="showSelect = true"
  />
  <van-popup v-model:show="showSelect" round position="bottom">
    <van-nav-bar
      class="pop-nav-bar"
      :title="props.title"
      :left-text="props.cancelText"
      :right-text="props.confirmText"
      @click-left="showSelect = false"
      @click-right="onConfirm"
    ></van-nav-bar>
    <div class="all-choose" v-if="props.showAllChoose">
      <van-button size="small" @click="toggleAll">反选</van-button>
      <van-button size="small" type="primary" @click="checkAll">全选</van-button>
    </div>
    <van-checkbox-group v-model="checked" ref="checkboxGroupRef">
      <van-cell-group>
        <van-cell
          clickable
          :key="item"
          :title="item[dataFormat.text]"
          v-for="(item, index) in props.data"
          @click="toggle(index)"
        >
          <template #right-icon>
            <van-checkbox
              :name="item.value"
              :ref="el => checkboxRefs[index] = el"
              @click.stop
            ></van-checkbox>
          </template>
        </van-cell>
      </van-cell-group>
    </van-checkbox-group>
  </van-popup>
</template>

<script lang="ts" setup name="GSelect">
import {
  ref,
  watch,
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults,
} from 'vue'
interface dataFormat {
  text: string,
  value: string
}

const attrs = useAttrs()
const checkboxGroupRef = ref()
const checkboxRefs = ref<any>([])
const emits = defineEmits(['update:modelValue'])
const props = withDefaults(defineProps<{
  data: any[],
  title?: string,
  modelValue?: any,
  cancelText?: string,
  confirmText?: string,
  showAllChoose?: boolean,
  dataFormat?: dataFormat,
}>(), {
  title: '',
  data: () => [],
  cancelText: '取消',
  confirmText: '确认',
  showAllChoose: false,
  dataFormat: () => {
    return {
      text: 'text',
      value: 'value'
    }
  }
})

const dataFormat = ref(props.dataFormat as dataFormat)

const checked = ref<any>([])
const showSelect = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

props.modelValue && (checked.value = props.modelValue)
const initValue = () => {
  value.value = props.data.filter((v: any) => checked.value.includes(v[dataFormat.value.value]))
      .map((v: any) => v[dataFormat.value.text]).join(',')
  console.log(value.value)
}
initValue()

const toggle = (index: number) => {
  checkboxRefs.value[index].toggle()
};

const checkAll = () => {
  checkboxGroupRef.value.toggleAll(true)
}

const toggleAll = () => {
  checkboxGroupRef.value.toggleAll()
}

const onConfirm = () => {
  initValue()
  emits('update:modelValue', checked.value)
  showSelect.value = false
}
</script>

<style lang="scss" scoped>
.pop-nav-bar {
  &.van-nav-bar {
    // background:var(--body-color-white) !important;
    :deep(.van-nav-bar__text) {
      color:var(--body-txet-nav-color) !important;
    }
    .van-nav-bar__title {
      font-family: SFCompactDisplay-Bold;
      font-size:16px;
      color:var(--body-color-nav-darkblue) !important;
    }
  }
}

.van-checkbox-group {
  max-height: 350px;
  overflow-y: auto;
}

.all-choose {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;
}
</style>