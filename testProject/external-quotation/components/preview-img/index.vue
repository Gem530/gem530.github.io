<template>
    <div class="preview-list">
        <div class="preview-img" v-for="(item, i) in file" :key="item.key">
            <el-image
                fit="cover"
                :src="item.url"
                :max-scale="7"
                :zoom-rate="1.2"
                :min-scale="0.2"
                :initial-index="index"
                style="width: 100%;height: 100%;"
                :preview-src-list="file.map((m: any) => m.url)"
                @click="index = i"
            />
            <div class="preview-del flex pointer" @click="delHandle(item)">
                <el-icon size="24px"><CircleCloseFilled /></el-icon>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="PreviewImg">
const emits = defineEmits(['update:modelValue', 'delFile'])
const props = withDefaults(defineProps<{
    modelValue?: any[]
}>(), {
    modelValue: () => [],
})

const index = ref(0)

const file = computed({
    get () {
        return props.modelValue
    },
    set (val) {
        emits('update:modelValue', val)
    }
})

watch(() => file.value, (newVal, oldVal) => {
    if (newVal?.length) {
        newVal.map(async (m: any) => {
            if (!m.url) {
                m.url = await getUrlByKeys(m.key)
            }
        })
    }
}, { immediate: true, deep: true })

const delHandle = (val: any) => {
    file.value = file.value.filter((f: any) => f.key != val.key)
    emits('delFile', {
        file: file.value,
        delFile: val
    })
}
</script>

<style lang="scss" scoped>
.preview-list {
    width: 100%;

    .preview-img {
        position: relative;
        width: 100%;
        height: 100px;
        margin-top: 10px;

        .preview-del {
            position: absolute;
            top: 10px;
            right: 10px;
            width: 20px;
            height: 20px;
            background: #fff;
            border-radius: 50%;
        }
    }
}
</style>