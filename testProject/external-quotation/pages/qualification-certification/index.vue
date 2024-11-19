<template>
    <div class="qualification-certification">
        <div class="flex flex-between main-width">
            <div class="preview-box">
                <div class="preview-img" :class="`img${activeIndex}`"></div>
            </div>
            <div class="right-box">
                <div class="qualification-title text-center">{{$t('qualificationCertification')}}</div>
                <div class="qualification-list flex flex-start">
                    <div
                        :key="index"
                        class="qualification-item flex pointer"
                        :class="{'qualification-item-active': item.value == activeIndex}"
                        v-for="(item, index) in list"
                        @mouseenter="activeIndex = item.value"
                    >{{ item.label }}</div>
                </div>

                <!-- <div class="qualification-tips">{{ $t('certifiedPage.certifiedUnder') }}</div>
                <el-image class="qualification-image" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/our-tips2.png"></el-image> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="QualificationCertification">
const { t } = useI18n()
definePageMeta({ layout: 'default' })
useHead({ title: () => t('qualificationCertification') })
const activeIndex = ref(1)
const list = ref([
    { label: 'NQA', value: 1 },
    { label: 'UL', value: 2 },
    { label: 'NOA', value: 3 },
    // { label: '高新技术企业证书', value: 4 },
    // { label: '公示证书', value: 5 },
    // { label: '发明专利证书', value: 6 },
])
</script>

<style lang="scss" scoped>
.qualification-certification {
    padding: 60px 0;

    .flex-between {
        justify-content: space-between;
        align-items: flex-start;

        .preview-box {
            position: relative;
            flex: none;
            width: 480px;
            height: 680px;
            padding: 20px;
            margin-right: 60px;
            background: #666;
            box-sizing: border-box;

            &::after {
                content: "";
                position: absolute;
                top: 17%;
                right: -10px;
                width: 20px;
                height: 20px;
                transform: rotate(45deg);
                background: #666;
            }

            .preview-img {
                width: 100%;
                height: 100%;

                @for $i from 1 through 6 {
                    &.img#{$i} {
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/qualification/qualification#{$i}.png') no-repeat;
                        background-size: contain;
                        background-position: center center;
                    }
                }
            }
        }

        .right-box {
            flex: 1;

            .qualification-title {
                margin-bottom: 40px;
                font-size: 36px;
                font-weight: 600;
            }

            .qualification-list {
                flex-wrap: wrap;
                align-items: stretch;
                overflow-y: auto;

                .qualification-item {
                    flex: none;
                    width: 20%;
                    margin: 0 45px 20px 0;
                    padding: 20px 0;
                    background: #666;
                    color: #fff;
                    border: 3px solid transparent;

                    &.qualification-item-active {
                        // background: skyblue;
                        border: 3px solid var(--el-color-primary);
                    }
                }
            }

            .qualification-tips {
                margin-bottom: 20px;
            }

            .qualification-image {
                width: 630px;
            }
        }
    }
}
</style>