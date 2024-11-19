<template>
    <div class="notify table-page">
        <!-- <el-card class="notify-card table-card">
            <template #header>
                <div class="notify-header">
                    <el-icon class="notify-header-icon"><Message /></el-icon>
                    <div class="notify-header-title card-header-title">消息通知</div>
                    <div class="notify-header-tips">(2条未读)</div>
                    <div class="notify-header-grow"></div>
                    <div class="notify-header-btn pointer">全部标记为已读</div>
                </div>
            </template>
            <div class="notify-list">
                <div :class="{'notify-item': true, 'read': item.status == 1, 'pointer': true}" v-for="item in notifyList" :key="item.id"
                    @click="navigateTo(`/notify/${item.id}`)">
                    <div class="notify-item-title">{{ item.title }}</div>
                    <div class="notify-item-time">{{ item.time }}</div>
                </div>
            </div>
        </el-card> -->
    </div>
</template>

<script setup lang="ts" name="Notify">
// definePageMeta({ layout: 'custom', title: '消息通知' })

// const notifyList = ref([
//     { id: 1, title: '这是一封未读邮件', time: '2023-12-01 12:12:12', status: 0 },
//     { id: 2, title: '送货单通知：您的订单PCB-231111 已发货啦！', time: '2023-12-01 12:12:12', status: 0 },
//     { id: 3, title: '这是一封已读邮件', time: '2023-12-01 12:12:12', status: 1 },
// ])
</script>

<style lang="scss" scoped>
.notify {
    .notify-card {

        .notify-header {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .notify-header-icon {
                font-size: 30px;
            }

            .notify-header-title {
                margin: 0 5px 0 10px;
            }
            .notify-header-grow {
                flex-grow: 1;
            }

            .notify-header-btn {
                color: var(--el-color-primary);
            }
        }

        .notify-list {
            width: 100%;
            height: 100%;
            overflow-y: auto;

            .notify-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 60px;
                padding: 0 20px;
                border: 1px solid #f0f0f0;
                border-bottom: none;
                background: #f5f7fa;
                font-size: 14px;
                box-sizing: border-box;

                &:last-child {
                    border-bottom: 1px solid #f0f0f0;
                }

                &.read {
                    background: #fff;
                }

                &:hover {
                    background: #f5f7fa;

                    .notify-item-title {
                        color: var(--el-color-primary);
                    }
                }
            }
        }
    }
}
</style>