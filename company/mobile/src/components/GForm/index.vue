<template>
  <van-form @submit="onSubmit" :="attrs">
    <van-cell-group>
      <template :key="item.prop" v-for="item in props.formList">
        <van-field
          :="{...item as any}"
          v-if="item.type == 'input'"
          v-model="state.data[item.prop]"
        />

        <van-field
          :="{...item as any}"
          v-if="item.type == 'switch'">
          <template #input>
            <van-switch v-model="state.data[item.prop]" :="{...item.attrs}" />
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'checkbox'">
          <template #input>
            <van-checkbox-group v-model="state.data[item.prop]" :="{...item.attrs}">
              <van-checkbox
                :key="el.value"
                :name="el.value"
                v-for="el in item.data"
              >{{el.lable}}</van-checkbox>
            </van-checkbox-group>
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'radio'">
          <template #input>
            <van-radio-group v-model="state.data[item.prop]" :="{...item.attrs}">
              <van-radio
                :key="el.value"
                :name="el.value"
                v-for="el in item.data"
              >{{el.lable}}</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'stepper'">
          <template #input>
            <van-stepper v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'rate'">
          <template #input>
            <van-rate v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'slider'">
          <template #input>
            <van-slider v-model="state.data[item.prop]" :="{...item.attrs}"/>
          </template>
        </van-field>

        <van-field
          :="{...item as any}"
          v-if="item.type == 'upload'">
          <template #input>
            <GUpload v-model="state.data[item.prop]" :="{...item.attrs}"></GUpload>
          </template>
        </van-field>
        
        <GPicker
          :="{...item}"
          :valueKey="item.valueKey"
          v-if="item.type == 'picker'"
          v-model="state.data[item.prop]"
          :columnsFieldNames="item.columnsFieldNames"
        ></GPicker>
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
  useAttrs,
  defineEmits,
  defineProps,
  withDefaults
} from 'vue'
interface formItem {
  style?: any,
  attrs?: any,
  value?: any,
  type: string,
  prop: string,
  name?: string,
  label: string,
  rules?: any[],
  [key: string]: any,
  data?: {
    lable: string,
    value: any,
    [key: string]: string
  }[]
}

const attrs = useAttrs()
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
:deep(.custom-button) {
  width: 26px;
  color: #fff;
  font-size: 10px;
  line-height: 18px;
  text-align: center;
  background-color: #ee0a24;
  border-radius: 100px;
}
</style>