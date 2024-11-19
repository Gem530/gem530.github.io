<template>
    <div class="notification-announcement main-width">
        <!-- <div class="notification-announcement-title text-center">通知公告</div>
        <el-card class="notification-card" v-for="i in 6">
            <div class="notification-card-left flex pointer">
                <img class="notification-card-img hover-scale" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/test.jpg"/>
            </div>
            <div class="notification-card-content">
                <div class="notification-card-title pointer hover-blue-unline" @click="openDiaLog(1)">通知公告</div>
                <div class="notification-card-tips">通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要</div>
                <div class="notification-card-time">2023-10-10 12:12:12</div>
            </div>
        </el-card>

        <el-dialog v-model="state.dialogVisible" :title="state.dialogTitle" width="900px">
                <template v-if="[1].includes(state.dialogType)">通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要通知公告摘要</template>
                <template v-if="[2].includes(state.dialogType)">内容-下单指引</template>
                <template v-if="[3].includes(state.dialogType)">内容-财务相关事项</template>
                <template v-if="[4].includes(state.dialogType)">内容-货运政策</template>
        </el-dialog> -->
    </div>
</template>

<script setup lang="ts" name="NotificationAnnouncement">
// const state = reactive<Record<string, any>>({
//     lookEmail: false,
//     dialogType: 1, // 1PCB相关事项  2下单指引  3财务相关事项  4货运政策
//     dialogTitle: 'PCB相关事项',
//     dialogVisible: false,
// })
// const openDiaLog = (type: number, row?: any) => {
//     state.dialogType = type
//     if (state.dialogType == 1) {
//         state.dialogTitle = '通知公告'
//     }
//     state.dialogVisible = true
// }
</script>

<style lang="scss" scoped>
.notification-announcement {
    padding: 60px 0;
    .notification-announcement-title {
        margin-bottom: 40px;
        font-size: 36px;
        font-weight: 600;
    }

    :deep(.notification-card) {
        margin-bottom: 30px;

        .el-card__body {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border-radius: 10px;

            .notification-card-left {
                width: 200px;
                height: 100px;
                overflow: hidden;
                .notification-card-img {
                    flex: none;
                    width: 100%;
                }
            }
            .notification-card-content {
                width: 100%;
                margin-left: 30px;
                overflow: hidden;

                .notification-card-title {
                    margin-bottom: 10px;
                    font-size: 18px;
                    font-weight: 600;
                }

                .notification-card-tips {
                    font-size: 14px;
                    margin-bottom: 5px;
                    color: #303133;
                }

                .notification-card-time {
                    font-size: 14px;
                    color: #999;
                }
            }
        }
    }
}
</style>