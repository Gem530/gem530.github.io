<template>
    <el-input ref="editInputRef" v-model="crtName" v-if="showEdit" @blur="showEdit = false" clearable></el-input>
    <div class="edit-name-flex" v-else @click="startEdit">
        {{ crtName }}
        <el-icon style="margin-left: 5px;"><EditPen /></el-icon>
    </div>
</template>

<script setup lang="ts" name="EditName">
const editInputRef = ref()
const emits = defineEmits(['update:name'])
const props = withDefaults(defineProps<{
    name: any,
    disabled: boolean
}>(), {
    name: undefined,
    disabled: false
})
const showEdit = ref(false)
const crtName = computed({
    get () {
        return props.name
    },
    set (val: any) {
        emits('update:name', val)
    }
})

const startEdit = () => {
    if (props.disabled) {
        return
    }
    showEdit.value = true
    nextTick(() => {
        editInputRef.value.focus()
    })
}
</script>

<style lang="scss" scoped>
.edit-name-flex {
    display: flex;
    justify-content: flex-start;
    align-items: center;
}
</style>