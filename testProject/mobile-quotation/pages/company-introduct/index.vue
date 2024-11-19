<template>
    <div class="bg">
        <nav-bar left-arrow><template #title>{{ $t('companyIntroduction') }}</template></nav-bar>
        <div class="company-introduct">

            <div class="company-box flex flex-start">
                <div class="company-content">
                    <!-- <div class="glob-header-border">{{navList.find((v: any) => v.value == activeName)?.label()}}</div> -->
                    <!-- <template v-if="activeName == '0'"> -->
                        <div class="company-content-title text-center">{{$t('companyIntroductInfo.AMERICANOSTH')}}</div>
                        <div class="company-content-title text-center">{{$t('companyIntroductInfo.JIANGXINOSTH')}}</div>
                        <div class="company-content-title">{{$t('companyIntroductInfo.mainBusiness')}}</div>
                        <div class="company-content-title">{{$t('companyIntroductInfo.fastDelivery')}}</div>
                        <div class="company-content-title">market@pcbsuper.com</div>
                        <div class="company-content-title">www.pcbsuper.com</div>

                        <!-- <div class="company-content-tips text-center margin-bottom">{{$t('companyIntroductInfo.orderThrough')}}</div> -->

                        <!-- <div class="company-content-tips text-center margin-bottom">{{$t('companyIntroductInfo.forAnyInquiries')}}</div> -->

                        <!-- <div class="company-content-tips text-center">{{$t('companyIntroductInfo.tel')}}</div>
                        <div class="company-content-tips text-center margin-bottom">{{$t('companyIntroductInfo.WhatsApp')}}</div>

                        <div class="company-content-tips text-center margin-bottom">{{$t('companyIntroductInfo.factoryAddress')}}</div> -->

                        <div class="company-flex flex flex-column">
                            <div class="company-flex-left">
                                <div class="company-content-title">{{$t('companyIntroductInfo.factoryInformation')}}</div>
                                <div class="company-content-tips">{{$t('companyIntroductInfo.sntngedgeTeconology')}}</div>
                                <div class="company-content-tips margin-bottom">{{$t('companyIntroductInfo.visualized')}}</div>
                            </div>
                            <div class="company-flex-right">
                                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/our-tips.jpg" />
                            </div>
                        </div>
                        
                        <div class="company-flex flex flex-column">
                            <div class="company-flex-left">
                                <div class="company-content-title">{{$t('companyIntroductInfo.contactInformation')}}</div>

                                <div class="company-content-tips margin-bottom">{{$t('companyIntroductInfo.orderThrough')}}</div>

                                <div class="company-content-tips margin-bottom">{{$t('companyIntroductInfo.forAnyInquiries')}}</div>
                                <div class="company-content-tips">{{$t('companyIntroductInfo.tel')}}</div>
                                <div class="company-content-tips margin-bottom">{{$t('companyIntroductInfo.WhatsApp')}}</div>
                                <div class="company-content-tips margin-bottom">{{$t('companyIntroductInfo.factoryAddress')}}</div>
                            </div>
                            <div class="company-flex-right">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1548.2438568865634!2d114.92685847642711!3d25.42288691474275!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1szh-CN!2sus!4v1705048232504!5m2!1szh-CN!2sus" width="100%" height="350" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>

                        <!-- <p>{{$t('orderPage.NorthIndustrial')}}</p> -->
                        <!-- <p>{{$t('companyIntroductInfo.wasRegisteredAnd')}}</p>
                        <p>{{$t('companyIntroductInfo.basedOnYearsOf')}}</p> -->
                        <div class="company-flex flex flex-column">
                            <div class="company-flex-left">
                                <div class="company-content-title">{{$t('companyIntroductInfo.qualitySystem')}}</div>
                                <div class="company-content-tips margin-bottom">{{$t('certifiedPage.certifiedUnder')}}</div>
                            </div>
                            <div class="company-flex-right">
                                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/our-tips2.png"/>
                            </div>
                        </div>
                    <!-- </template>

                    <template v-if="activeName == '1'">
                        <div class="company-content-title">{{$t('companyIntroductInfo.organicNanoConductiveFilm')}}</div>
                        <p>{{$t('companyIntroductInfo.conductiveFilmReplaces')}}</p>
                        <div class="company-content-title">{{$t('companyIntroductInfo.organicNanoMetalPlating')}}</div>
                        <p>{{$t('companyIntroductInfo.theCompanyHasEstablished')}}</p>
                    </template>

                    <template v-if="activeName == '2'">
                        <div class="company-content-title">{{$t('companyIntroductInfo.corporatePhilosophy')}}</div>
                        <p>{{$t('companyIntroductInfo.businessPhilosophy')}}</p>
                        <p>{{$t('companyIntroductInfo.qualityConcept')}}</p>
                        <div class="company-content-title">{{$t('companyIntroductInfo.talentConcept')}}</div>
                        <p>{{$t('companyIntroductInfo.talentSelectionConcept')}}</p>
                        <p>{{$t('companyIntroductInfo.employingTalent')}}</p>
                        <p>{{$t('companyIntroductInfo.talentRetention')}}</p>
                        <div class="company-content-title">{{$t('companyIntroductInfo.values')}}</div>
                        <p>{{$t('companyIntroductInfo.dedication')}}</p>
                    </template>

                    <template v-if="activeName == '3'">
                        <p>{{$t('companyIntroductInfo.atPresentThe')}}</p>
                        <p>{{$t('companyIntroductInfo.theCompanyAlsoHas')}}</p>
                        <div class="company-content-title">{{$t('companyIntroductInfo.shajingElectroplatingFactory')}}</div>
                        <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/address/address1.png" alt="">
                        <div class="company-content-title">{{$t('companyIntroductInfo.huangtianElectroplatingFactory')}}</div>
                        <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/address/address2.png" alt="">
                        <div class="company-content-title">{{$t('companyIntroductInfo.zhongwuElectroplatingFactory')}}</div>
                        <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/address/address3.png" alt="">
                    </template> -->
                </div>
                <!-- <div class="company-nav flex flex-start">
                    <div
                        :key="item.value"
                        v-for="item in navList"
                        :class="{'company-nav-item flex flex-start pointer':true, 'nav-active': item.value == activeName}"
                        @click="activeName = item.value"
                    >{{item.label()}}</div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="CompanyIntroduct">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('companyIntroduction') })

const activeName = ref('0')
const navList = ref([
    { label: () => t('companyIntroductInfo.companyIntroduction'), value: '0' },
    { label: () => t('companyIntroductInfo.companyBusiness'), value: '1' },
    { label: () => t('companyIntroductInfo.corporateCulture'), value: '2' },
    { label: () => t('companyIntroductInfo.groupBase'), value: '3' },
])
</script>

<style lang="scss" scoped>
.bg {
    background: #f1f3f6;
}
.company-introduct {
    padding: 10px;

    .company-box {
        align-items: stretch;
        min-height: calc(100vh - 227px - 180px);

        .company-content {
            flex: 1;
            background: #ffffff;
            margin-right: 10px;
            padding: 20px;
            box-sizing: border-box;

            .company-content-title {
                margin-bottom: 10px;
                font-size: 16px;
                font-weight: 600;
            }

            p {
                text-indent: 32px;
            }

            .company-content-tips {
                &.margin-bottom {
                    margin-bottom: 10px;
                }
            }

            .company-flex {
                margin-top: 20px;
                align-items: flex-start;
                .company-flex-right {
                    flex: none;
                    max-width: 100%;
                    // margin-left: 10px;
                    // img {
                    //     width: 100%;
                    // }
                }
            }
        }

        .company-nav {
            flex: none;
            flex-direction: column;
            width: 240px;
            background: #ffffff;

            .company-nav-item {
                width: 100%;
                height: 45px;
                padding-left: 30px;
                transition: all 0.3s;
                box-sizing: border-box;

                &:not(:last-child) {
                    border-bottom: 1px solid #e4e4e4;
                }

                &:hover,
                &.nav-active {
                    background: var(--el-color-primary);
                    color: #fff;
                }
            }
        }

        img {
            max-width: 100% !important;
        }
    }
    // .company-title {
    //     padding: 30px 0 10px;
    //     font-size: 24px;
    //     font-weight: 600;
    //     text-align: center;
    // }
    // .company-banner {
    //     width: 100%;
    //     height: 520px;
    // }
    // .company-business {
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    //     align-items: center;
    //     background: #fbfcfe;
    //     margin: 20px 0;

    //     .company-business-tips {
    //         margin-bottom: 20px;
    //         font-size: 14px;
    //         color: #999999;
    //         text-align: center;
    //     }

    //     .company-business-list {
    //         display: flex;
    //         justify-content: space-between;
    //         align-items: center;
    //         padding: 20px 100px;

    //         .company-business-item {
    //             display: flex;
    //             justify-content: center;
    //             align-items: center;
    //             height: 45px;
    //             padding: 0 20px;
    //             background: #ffffff;
    //             border: 1px solid #f2f2f2;
    //             border-radius: 45px;
    //             margin-right: 50px;
    //             &:last-child {
    //                 margin-right: 0;
    //             }

    //             .company-business-item-img {
    //                 width: 18px;
    //                 height: 18px;
    //                 margin-right: 10px;
    //             }
    //             .company-business-item-text {
    //                 font-size: 18px;
    //             }
    //         }
    //     }
    // }

    // .company-content {
    //     display: flex;
    //     justify-content: flex-start;
    //     align-items: flex-start;
    //     border: 1px solid #ebeef5;
    //     border-radius: 10px;
    //     margin: 20px 0;
    //     padding: 20px;
    //     .company-content-img {
    //         flex: none;
    //         width: 350px;
    //     }
    //     .company-content-collapse {
    //         width: 100%;
    //         margin-left: 30px;
    //     }
    // }
}
</style>