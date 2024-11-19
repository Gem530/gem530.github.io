<template>
    <div :class="`total-components ${props?.start && 'total-start'} ${props.firstBorder && 'is-fisrt-border'} ${props.bottomBorder && 'is-bottom-border'}`" :="attrs">
        <template v-for="(item, index) in props.list" :key="index">
            <div class="total-item" v-if="!(item?.hide == true)">
                <slot :name="`left-${item?.slotName || ''}`"></slot>
                <span>{{ item.title }}</span>
                <slot :name="`right-${item?.slotName || ''}`"></slot>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts" name="TotalTitle">
interface list {
    title: string
    hide?: boolean // 是否隐藏
    slotName?: string // slot Name，用于插槽
}
const attrs = useAttrs()
// const slots = useSlots()
const emits = defineEmits([''])
const props = withDefaults(defineProps<{
    list: list[]
    start?: boolean // 靠左边
    firstBorder?: boolean // 是否第一个也展示竖线
    bottomBorder?: boolean // 是否显示底部边框
}>(), {
    start: false,
    list: () => [],
    firstBorder: false,
    bottomBorder: false,
})
</script>

<style lang="scss">
.total-components {
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;

    &.total-start {
        justify-content: flex-start;
    }

    &.is-fisrt-border {
        .total-item {
            &:first-child {
                margin-left: 4px;
                padding-left: 5px;

                &::before {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translate(0, -50%);
                    width: 1px;
                    height: 12px;
                    background: #C0C0C0;
                }
            }
        }
    }

    &.is-bottom-border {
        min-height: 28px;
        padding: 0 16px;
        border-bottom: 1px solid #E9E9E9;
    }

    .total-item {
        position: relative;
        display: inline-flex;
        justify-content: flex-start;
        align-items: center;
        min-height: 28px;
        line-height: 28px;
        color: var(--el-color-primary);

        span {
            font-size: 14px;
        }

        [class*="el-icon"] + span {
            margin-left: 4px;
        }
        span + [class*="el-icon"] {
            margin-left: 4px;
        }

        &:not(:last-child) {
            margin-right: 4px;
        }
        &:not(:first-child) {
            padding-left: 5px;

            &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                transform: translate(0, -50%);
                width: 1px;
                height: 12px;
                background: #C0C0C0;
            }
        }
    }
}
body.small {
    .total-components {
        .total-item {
            min-height: 26px;
            line-height: 26px;
        }
        &.is-bottom-border {
            min-height: 26px;
            padding: 0 8px;
        }
    }
}
body.large {
    .total-components {
        &.is-fisrt-border {
            .total-item {
                &:first-child {
                    &::before {
                        content: '';
                        height: 14px;
                    }
                }
            }
        }
        &.is-bottom-border {
            min-height: 32px;
        }
        .total-item {
            min-height: 32px;
            line-height: 32px;
            span {
                font-size: 16px;
            }
            &:not(:first-child) {
                &::before {
                    content: '';
                    height: 14px;
                }
            }
        }
    }
}
</style>