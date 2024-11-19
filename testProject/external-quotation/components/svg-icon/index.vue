<template>
    <svg class="svgclass" aria-hidden="true">
        <use :xlink:href="symbolId" :fill="color" />
    </svg>
</template>

<script setup>
  import { defineProps, computed } from 'vue'
const props = defineProps({
    prefix: {
        type: String,
        default: 'icon',
    },
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
    },
})
const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<style scoped lang='scss' >
.svgclass {
    width: 1em;
    height: 1em;
    overflow: hidden;
    vertical-align: top;
    color: #fff !important;
    outline: none;
}
</style>