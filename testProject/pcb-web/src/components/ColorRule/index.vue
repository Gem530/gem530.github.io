<template>
    <div class="color-rule-components" :="attrs">
        <template v-for="(item, index) in props.list" :key="index">
            <div :class="`color-item ${item?.type}`" :style="`background: ${item?.color};`">
                <!-- <div :class="`color-cricle ${item?.type}`" :style="`background: ${item?.color};`"></div> -->
                <slot :name="`left-${item?.slotName || ''}`"></slot>
                <span>{{ item.title }}</span>
                <slot :name="`right-${item?.slotName || ''}`"></slot>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts" name="ColorRule">
interface list {
    title: string
    hide?: boolean // 是否隐藏
    color?: string // 颜色
    slotName?: string // slot Name，用于插槽
    type?: 'success'|'warning'|'danger'|''
}
const attrs = useAttrs()
// const slots = useSlots()
const emits = defineEmits([''])
const props = withDefaults(defineProps<{
    list: list[]
}>(), {
    list: () => [],
})
</script>

<style lang="scss">
.color-rule-components {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    height: 24px;
    flex-wrap: wrap;

    .color-item {
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        padding: 0 4px;
        font-size: 12px;
        color: #6C6C6C;
        // line-height: 12px;

        // &:not(:last-child) {
        //     margin-right: 8px;
        // }

        span {
            padding-top: 1px;
        }

        // .color-cricle {
        //     width: 14px;
        //     height: 14px;
        //     margin-right: 4px;
        //     border-radius: 50%;

        //     &.success {
        //         background: #B3EAE6;
        //     }
        //     &.warning {
        //         background: #F8E3C5;
        //     }
        //     &.danger {
        //         background: #FCD3D3;
        //     }
        // }
        &.success {
            background: #B3EAE6;
        }
        &.warning {
            background: #F8E3C5;
        }
        &.danger {
            background: #FCD3D3;
        }
    }
}
body.small {
    .color-rule-components {
        height: 20px;
    }
}
body.large {
    .color-rule-components {
        height: 28px;
        .color-item {
            font-size: 14px;
            color: #6C6C6C;
            // line-height: 14px;
        }
    }
}
</style>