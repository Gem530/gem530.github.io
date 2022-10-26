<template>
  <QrcodeVue
    ref="QrcodeVueRef"
    :size="props.size"
    :value="props.value"
    :level="props.level"
  ></QrcodeVue>
</template>

<script lang="ts" setup name="Qrcode">
import QrcodeVue from 'qrcode.vue'
import {
  ref,
  onMounted,
  defineEmits,
  defineProps,
  withDefaults
} from 'vue'

const QrcodeVueRef = ref()
const emits = defineEmits(['resultBase'])
const props = withDefaults(defineProps<{
  size?: number,
  value: string,
  level?: 'L' | 'M' | 'Q' | 'H'
}>(), {
  size: 60,
  level: 'H'
})

onMounted(() => {
  const canvas = QrcodeVueRef.value.$el
  const base = canvas.toDataURL('img/png')
  emits('resultBase')
})
</script>