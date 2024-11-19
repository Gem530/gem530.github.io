<template>
    <div class="enterprise-dynamics main-width">
        <div class="enterprise-dynamics-title text-center">{{$t('enterpriseDynamics')}}</div>
        <el-timeline>
            <el-timeline-item
            v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
                :color="activity.color"
            >
            {{ activity.content() }}
            </el-timeline-item>
        </el-timeline>
    </div>
</template>

<script setup lang="ts" name="EnterpriseDynamics">
const { t } = useI18n()
useHead({ title: () => t('enterpriseDynamics') })
const activities = [
  {
    content: () => t('enterpriseDynamicsInfo.obtainedTheGuangdong'),
    timestamp: '2022',
    color: '#409EFF',
  },
  {
    content: () => t('enterpriseDynamicsInfo.wereSuccessfullySelected'),
    timestamp: '2021',
    color: '',
  },
  {
    content: () => t('enterpriseDynamicsInfo.onDecember'),
    timestamp: '2020',
    color: '',
  },
  {
    content: () => t('enterpriseDynamicsInfo.companyIsCommittedTo'),
    timestamp: '2012',
    color: '',
  },
]
</script>

<style lang="scss" scoped>
.enterprise-dynamics {
    padding: 60px 0;
    width: 1000px !important;
    min-height: calc(100vh - 60px - 227px);
    .enterprise-dynamics-title {
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