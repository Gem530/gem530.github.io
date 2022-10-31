<template>
  <van-form ref="vanFormRef" @submit="onSubmit" :="attrs">
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
            <van-stepper
              allow-empty
              :="{...item.attrs}"
              v-model="state.data[item.prop]"
            />
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
        ></GPicker>

        <GTime
          :="{...item}"
          v-if="item.type == 'timePicker'"
          v-model="state.data[item.prop]"
        ></GTime>
        
        <GArea
          :="{...item}"
          :data="item.data"
          :valueKey="item.valueKey"
          v-if="item.type == 'areaPicker'"
          v-model="state.data[item.prop]"
        ></GArea>
        
        <GDate
          :="{...item}"
          v-if="item.type == 'datePicker'"
          v-model="state.data[item.prop]"
        ></GDate>
        
        <GCascader
          :="{...item}"
          :data="item.data"
          v-if="item.type == 'cascader'"
          v-model="state.data[item.prop]"
        ></GCascader>
        
        <GSelect
          :="{...item}"
          :data="item.data"
          v-if="item.type == 'select'"
          v-model="state.data[item.prop]"
        ></GSelect>

        <div style="margin: 16px;" v-if="item.type == 'submit'">
          <van-button
            block
            round
            text="提交"
            type="primary"
            :="{...item.attrs}"
            @click="Submithandle"
          />
        </div>

        <div style="margin: 16px;" v-if="item.type == 'reset'">
          <van-button
            block
            round
            text="重置"
            :="{...item.attrs}"
            @click="Resethandle"
          />
        </div>
      </template>
    </van-cell-group>
  </van-form>
</template>

<script lang="ts" setup name="GForm">
import {
  ref,
  reactive,
  useAttrs,
  defineEmits,
  defineProps,
  defineExpose,
  withDefaults
} from 'vue'
interface formItem {
  style?: any,
  attrs?: any,
  values?: any, // 不使用value，是传字符串或数字类型之外的类型，会报警告，因为会渲染到input标签上
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

const vanFormRef = ref()
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
    state.data[item.prop] = item.values ?? (['slot', 'stepper'].indexOf(item.type) != -1 ? '' : undefined)
  }
})

const initData = (item: any) => {
  state.data = item
}

const username = ref('')
const onSubmit = () => {
  emits('submit', state.data)
}

const Resethandle = () => {
  state.temp.forEach((item: formItem) => {
    if (item.prop) {
      state.data[item.prop] = item.values ?? (item.type === 'slot' ? '' : undefined)
      console.log(state.data)
    }
  })
  vanFormRef.value.resetValidation()
}

const Submithandle = () => {
  vanFormRef.value.submit()
}

defineExpose({ onSubmit, initData, Resethandle, Submithandle })
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