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
      :left-text="props.cancelText || $t('cancel')"
      :right-text="props.confirmText || $t('confirm')"
      @click-left="showSelect = false"
      @click-right="onConfirm"
    ></van-nav-bar>
    <van-radio-group v-model="checked" ref="checkboxGroupRef">
      <van-cell-group>
        <van-cell
          clickable
          :key="item"
          :title="item[dataFormat.text]"
          @click="toggle(item)"
          v-for="(item, index) in props.data"
        >
          <template #title><slot name="title" :row="item"></slot></template>
          <template #right-icon>
            <van-radio
              :name="item[dataFormat.value]"
              @click.stop
            ></van-radio>
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
  </van-popup>
</template>

<script lang="ts" setup name="GSelect">
const { t } = useI18n()
// import {
//   ref,
//   watch,
//   useAttrs,
//   defineEmits,
//   defineProps,
//   withDefaults,
// } from 'vue'
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
  dataFormat?: dataFormat,
}>(), {
  title: '',
  data: () => [],
  dataFormat: () => {
    return {
      text: 'text',
      value: 'value'
    }
  }
})

const dataFormat = ref(props.dataFormat as dataFormat)

const checked = ref<any>(undefined)
const showSelect = ref(false)
const value = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (!val) value.value = undefined
})

props.modelValue && (checked.value = props.modelValue)
const initValue = () => {
  value.value = props.data.filter((v: any) => checked.value.includes(v[dataFormat.value.value]))
      .map((v: any) => v[dataFormat.value.text]).join(',')
  // console.log(value.value)
}
initValue()

const toggle = (item: any) => {
  checked.value = item[dataFormat.value.value]
  // checkboxRefs.value[index].toggle()
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

.van-radio-group {
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