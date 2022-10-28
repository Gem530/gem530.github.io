<template>
  <van-form @submit="onSubmit">
    <van-cell-group>
      <template :key="item.prop" v-for="item in props.formList">
        <van-field
          v-if="item.type == 'input'"
          v-model="state.data[item.prop]"
          :="{...item as any}"
        />
      </template>
    </van-cell-group>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script lang="ts" setup name="GForm">
import {
  ref,
  reactive,
  defineEmits,
  defineProps,
  withDefaults
} from 'vue'
interface formItem {
  attrs?: any,
  value?: any,
  type: string,
  prop: string,
  name?: string,
  label: string,
  rules?: any[]
}

const emits = defineEmits(['submit'])
const props = withDefaults(defineProps<{
  formList: formItem[]
}>(), {
  formList: () => []
})


const state: {
  data: Record<string, any>,
  temp: formItem[]
} = reactive({
  data: {},
  temp: []
})
state.temp = JSON.parse(JSON.stringify(props.formList))
state.temp.forEach((item: formItem) => {
  if (item.prop) {
    state.data[item.prop] = item.value ?? (item.type === 'slot' ? '' : undefined)
  }
})

const username = ref('')
const onSubmit = () => {
  console.log('onSubmit')
  emits('submit', state.data)
}
</script>

<style lang="scss" scoped>

</style>