<template>
    <div class="notify-detail">
        <!-- <el-card>
            <div class="notify-detail-header">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/login-logo1.svg" class="notify-detail-header-img" alt="">
                <div class="notify-detail-header-title">NOST江西诺斯特新材料股份有限公司</div>
                <div class="notify-detail-header-grow"></div>
                <div class="notify-detail-header-time">11月30日 09:00</div>
            </div>
            <div class="notify-detail-come">来自：Tom(业务员)</div>
            <div class="notify-detail-content" v-html="htmlValue"></div>
        </el-card> -->
    </div>
</template>

<script setup lang="ts" name="NotifyDetail">
definePageMeta({ layout: 'custom' })
const route = useRoute()
// console.log(route)

// const htmlValue = ref('撒旦发射点发<p>是的法案</p><img src="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png" alt="">撒旦发射点发<p>是的法案</p><img src="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png" alt="">撒旦发射点发<p>是的法案</p><img src="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png" alt="">撒旦发射点发<p>是的法案</p><img src="https://d1.faiusr.com/4/AAEIABAEGAAgtZ-56QUoufyr5gQw9gE4kwM.png" alt="">')
</script>

<style lang="scss" scoped>
.notify-detail {
    font-size: 14px;

    .notify-detail-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 10px;

        .notify-detail-header-img {
            height: 20px;
            margin-right: 10px;
        }

        .notify-detail-header-grow {
            flex-grow: 1;
        }

        .notify-detail-header-time {
            color: #999999;
        }
    }

    .notify-detail-come {
        margin-bottom: 10px;
    }

    :deep(.notify-detail-content) {
        width: 100%;

        video,
        img {
            max-width: 100%;
        }
    }
}
</style>