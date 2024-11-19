<template>
    <div class="pcba-file">
        <nav-bar left-arrow title="PCBA"></nav-bar>
        <div class="pcba-name">
            <div class="main-width">
                <!-- <edit-name v-model:name="pcbaName" style="width: 500px;"></edit-name> -->
                <div class="pcba-tips">{{$t('pcbaPage.autoSave', { time: dayjs(autoTime).format('YYYY-MM-DD HH:mm') })}}</div>
            </div>
        </div>
        <van-tabs v-model:active="activeName" @change="changeTab" shrink>
            <van-tab title="PCB" name="0">
                <div class="pcba-file-pane pane-one">
                    <div class="pcb-change-order flex flex-start pointer" @click="navigateTo(pcbOrder?.pcbADetail?.id ? ('/online-count?id='+pcbOrder?.pcbADetail?.id) : '/online-count')">
                        <!-- ?fileNo=true -->
                        <!-- <el-icon><Back /></el-icon> -->
                        <van-icon name="arrow-left" />
                        <span style="margin-left: 5px;">{{$t('pcbaPage.changePCBSpecifications')}}</span>
                    </div>
                    <div class="pcb-silder flex">
                        <div class="side-list flex">
                            <div class="side-item pointer flex" :class="{'active': sideIndex == item.id}"
                                v-for="item in sideList" :key="item.id"
                                @click="sideIndex = item.id"
                            >{{ item.name }}</div>
                        </div>
                        <template v-if="sideIndex == 1">
                            <GUpload
                                class="side-upload"
                                v-model="fileList.assemblySideTopFiles"
                                v-if="!fileList.assemblySideTopImage"
                                list-type="text" model="download"
                                :upload-text="`${$t('pcbaPage.topPreviewImage')}`"
                                @fileChange="(fileList: any[]) => fileChange(fileList, 'assemblySideTop')"
                                accept="image/*" :limit="1">
                            </GUpload>
                            <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon> -->
                            <!-- <van-icon name="photo" />
                            <div class="el-upload__text">
                                {{$t('pcbaPage.topPreviewImage')}}
                            </div> -->
                            <template v-else>
                                <van-image
                                    style="max-width: 100%;"
                                    :src="fileList.assemblySideTopImage"
                                    fit="cover"
                                    @click="showImagePreview([fileList.assemblySideTopImage])"
                                />
                                <div class="side-close pointer flex">
                                    <van-icon name="cross" size="25px" color="#fff" @click="clearFile('assemblySideTop')"/>
                                    <!-- <van-icon size="36px" @click="clearFile('assemblySideTop')"><CircleCloseFilled /></van-icon> -->
                                </div>
                            </template>
                        </template>
                        <template v-else>
                            <GUpload
                                class="side-upload"
                                v-model="fileList.assemblySideBottomFiles"
                                v-if="!fileList.assemblySideBottomImage"
                                list-type="text" model="download"
                                :upload-text="`${$t('pcbaPage.bottomPreviewImage')}`"
                                @fileChange="(fileList: any[]) => fileChange(fileList, 'assemblySideBottom')"
                                accept="image/*" drag :limit="1">
                            </GUpload>
                            <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon> -->
                            <!-- <van-icon name="photo" />
                            <div class="el-upload__text">
                                {{$t('pcbaPage.bottomPreviewImage')}}
                            </div> -->
                            <template v-else>
                                <van-image
                                    style="max-width: 100%;"
                                    :src="fileList.assemblySideBottomImage"
                                    fit="cover"
                                    @click="showImagePreview([fileList.assemblySideBottomImage])"
                                />
                                <div class="side-close pointer flex">
                                    <van-icon name="cross" size="25px" color="#fff" @click="clearFile('assemblySideBottom')"/>
                                    <!-- <el-icon size="36px" @click="clearFile('assemblySideBottom')"><CircleCloseFilled /></el-icon> -->
                                </div>
                            </template>
                        </template>
                    </div>
                    <div class="pcb-info">
                        <div class="pcb-type-item">
                            <strong>{{$t('pcbaPage.PCBAType')}}:</strong> <span>{{pcbOrder?.configInfo?.pcbAType && $t(PCBATypeEnum[pcbOrder.configInfo.pcbAType as '1'|'2'])}}</span>
                        </div>
                        <div class="pcb-type-item">
                            <strong>{{$t('pcbaPage.assemblySide')}}:</strong> <span>{{pcbOrder?.configInfo?.assemblySide && $t(assemblySideEnum[pcbOrder.configInfo.assemblySide as '1'|'2'|'3'])}}</span>
                        </div>
                        <div class="pcb-type-item">
                            <strong>{{$t('pcbaPage.PCBAQty')}}:</strong> <span>{{pcbOrder?.configInfo?.pcbAQty}}</span>
                        </div>
                        <van-button round type="primary" class="pcb-info-btn" @click="nextHandle('0')">{{ $t('onlineInfo.next') }}</van-button>
                    </div>
                </div>
            </van-tab>
            <van-tab :title="$t('pcbaPage.billOfMaterials')" name="1">
                <div class="pcba-file-pane">
                    <!-- <XUpload v-model="fileList.pcbAMaterialFiles" list-type="text" model="download" :fileType="['zip','rar']" :fileSize="20" drag>
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            BOM
                            <div>{{$t('onlineInfo.pcbUploadFile')}}</div>
                            <div class="el-upload-drag-tips">{{$t('onlineInfo.pcbUploadFileLimit')}}</div>
                        </div>
                    </XUpload> -->
                    <div class="pcb-file-list flex flex-between">
                        <GUpload
                            class="upload-bom-cpl"
                            v-model="fileList.pcbAMaterialFiles"
                            list-type="text" model="download"
                            :fileType="['xls','xlsx','csv']"
                            :fileSize="20" :max-count="1">
                            <van-icon name="photo" size="26px" color="var(--van-uploader-icon-color)"/>
                            <div class="el-upload__text">
                                {{$t('pcbaPage.addFile', { name: 'BOM' })}}
                                <div class="el-upload-drag-tips">{{$t('pcbaPage.onlyaccept', { name: 'XLS,XLSX,CSV', size: 20 })}}</div>
                                <div class="download-tips unline pointer" @click.stop="downloadBomOrCpl('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/file/Sample-BOM_SMT.xlsx')">{{$t('pcbaPage.viewSample', { name: 'BOM' })}}</div>
                            </div>
                        </GUpload>
                        <GUpload
                            class="upload-bom-cpl"
                            v-model="fileList.pcbAMaterialCplFiles"
                            list-type="text" model="download"
                            :fileType="['xls','xlsx','csv']"
                            :fileSize="20" :max-count="1">
                            <van-icon name="photo" size="26px" color="var(--van-uploader-icon-color)"/>
                            <div class="el-upload__text">
                                {{$t('pcbaPage.addFile', { name: 'CPL' })}}
                                <div class="el-upload-drag-tips">{{$t('pcbaPage.pickPlaceFile')}}{{$t('pcbaPage.onlyaccept', { name: 'XLS,XLSX,CSV', size: 20 })}}</div>
                                <div class="download-tips unline pointer" @click.stop="downloadBomOrCpl('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/file/SMT_Sample_CPL.xlsx')">{{$t('pcbaPage.viewSample', { name: 'CPL' })}}</div>
                            </div>
                        </GUpload>
                    </div>
                    <div class="flex flex-end">
                        <van-button round type="primary" class="pcb-file-btn" :disabled="disabled4" @click="nextHandle('1')">{{$t('pcbaPage.processBom')}}</van-button>
                    </div>
                </div>
            </van-tab>
            <!-- <van-tab title="Component Placements" name="2" :disabled="disabled3">
                <div class="pcba-file-pane">Component Placements</div>
            </van-tab> -->
            <van-tab :title="$t('pcbaPage.quoteOrder')" name="3" :disabled="disabled4">
                <!-- <div class="pcba-file-pane">Quote & Order</div> -->
                <div class="pcba-file-flex">
                    <div class="pcba-file-price">
                        <div class="pcba-file-title">{{$t('onlineInfo.feeDetails')}}</div>
                        <van-collapse :border="false" v-model="collapseList">
                            <van-collapse-item name="1">
                                <template #title>
                                    <div class="collapse-title flex flex-between">
                                        <div class="collapse-title-name">{{$t('pcbaPage.PCBPrice')}}</div>
                                        <div class="collapse-title-value">{{useCurrencyInfo().value?.value}}{{ pcbOrder?.priceList?.pcbTotalCost }}</div>
                                    </div>
                                </template>
                                <div>
                                    <div class="collapse-flex flex flex-between"
                                        v-for="item in pcbOrder?.priceList?.costList" :key="item.key">
                                        <div class="collapse-flex-item">{{ item?.name }}</div>
                                        <div class="collapse-flex-item">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                                    </div>
                                </div>
                            </van-collapse-item>
                            <van-collapse-item name="2">
                                <template #title>
                                    <div class="collapse-title flex flex-between">
                                        <div class="collapse-title-name">{{$t('onlineInfo.economicPCBAPrice')}}</div>
                                        <div class="collapse-title-value">{{useCurrencyInfo().value?.value}}{{ pcbOrder?.priceList?.pcbATotalCost }}</div>
                                    </div>
                                </template>
                                <div>
                                    <div class="collapse-flex flex flex-between"
                                        v-for="item in pcbOrder?.priceList?.pcbACostList" :key="item.key">
                                        <div class="collapse-flex-item">{{ item?.name }}</div>
                                        <div class="collapse-flex-item">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                                    </div>
                                </div>
                            </van-collapse-item>
                            <van-collapse-item name="3">
                                <template #title>
                                    <div class="collapse-title flex flex-between">
                                        <div class="collapse-title-name">{{$t('onlineInfo.deliveryTimeExpressDelivery')}}</div>
                                        <div class="collapse-title-value"></div>
                                    </div>
                                </template>
                                <div>
                                    <div class="collapse-flex flex flex-between"
                                        v-for="item in pcbOrder?.priceList?.revealList" :key="item.key">
                                        <div class="collapse-flex-item">{{ item?.name }}</div>
                                        <div class="collapse-flex-item">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                                    </div>
                                    <div class="collapse-flex flex flex-between">
                                        <div class="collapse-flex-item">{{$t('onlineInfo.expressDelivery')}}</div>
                                        <div class="collapse-flex-item">{{$t('onlineInfo.crossBorderExpressTransportation')}}</div>
                                    </div>
                                    <div class="collapse-flex flex flex-between">
                                        <div class="collapse-flex-item">{{$t('onlineInfo.deliveryTime')}}</div>
                                        <div class="collapse-flex-item">{{$t('onlineInfo.basedOnTheReviewTime')}}</div>
                                    </div>
                                </div>
                            </van-collapse-item>
                        </van-collapse>
                    </div>

                    <div class="pcba-file-right">
                        <div class="right-total flex flex-between">
                            <div class="right-total-name">{{$t('onlineInfo.calculatePrice')}}:</div>
                            <div class="right-total-value">{{useCurrencyInfo().value?.value}}{{pcbOrder?.priceList?.totalCost}}</div>
                        </div>

                        <!-- <div class="pcba-description">{{ $t('pcbaPage.productDescription') }}</div> -->
                        <van-form ref="formRef">
                            <van-field @click="show = true" readonly v-model="showValue" :rules="[{ required: true, message: t('pcbaPage.productDescription') }]" label-align="top" >
                                <template #label>
                                    <div class="flex flex-start" style="display: inline-flex;">
                                        {{ $t('pcbaPage.productDescription') }}
                                        <CountTooltip @click.stop field="productDescriptionPcbAFile"></CountTooltip>
                                    </div>
                                </template>
                            </van-field>
                            <van-popup v-model:show="show" round position="bottom">
                                <van-cascader
                                    v-model="form.pcbADescribe"
                                    :title="$t('pcbaPage.productDescription')"
                                    :options="pcbADescribeList"
                                    :field-names="{
                                        text: 'label',
                                        value: 'id'
                                    }"
                                    @close="show = false"
                                    @finish="finishHandle"
                                />
                            </van-popup>
                            <van-button round type="primary" class="pcba-save-car" @click="saveCar">{{$t('onlineInfo.saveToShoppingCart')}}</van-button>
                        </van-form>
                    </div>
                </div>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script setup lang="ts" name="PcbaFile">
import dayjs from 'dayjs'
const { t } = useI18n()
const formRef = ref()
const activeName = ref('0')
const pcbaName = ref('pcb')
const collapseList = ref(['1','2','3'])
// const disabled3 = ref(true)
// const disabled4 = ref(true)
const showValue = ref('')
const show = ref<boolean>(false)
const form = ref<any>({
    pcbADescribe: undefined
})
const rules = ref({
    pcbADescribe: [{ required: true, message: t('pcbaPage.productDescription'), trigger: 'change' }]
})
// const pcbADescribe = ref()
const pcbADescribeList = ref<any>([])
const fileList = reactive<any>({
    assemblySideTopFiles: [],
    assemblySideTopImage: undefined,
    assemblySideBottomFiles: [],
    assemblySideBottomImage: undefined,
    pcbAMaterialFiles: [],
    // pcbAMaterialImage: undefined,
    pcbAMaterialCplFiles: [],
    // pcbAMaterialCplImage: undefined,
})
const sideIndex = ref(1)
const autoTime = ref(new Date())
const sideList = ref([
    { id: 1, name: 'Top' },
    { id: 2, name: 'Bottom' },
])
const pcbOrder = ref<any>(undefined)

// watch(() => [fileList.pcbAMaterialFiles, fileList.pcbAMaterialCplFiles], ([newVal1, newVal2]) => {
//     if (newVal1?.length && newVal2?.length) {
//         disabled4.value = false
//     } else {
//         disabled4.value = true
//     }
// })
const disabled4 = computed(() => {
    let sideFlag = false
    if (pcbOrder.value?.configInfo.assemblySide == '1') {
        // sideList.value = [{ id: 1, name: 'Top' }]
        sideFlag = fileList.assemblySideTopFiles?.length
    } else if (pcbOrder.value?.configInfo.assemblySide == '2') {
        // sideList.value = [{ id: 2, name: 'Bottom' }]
        sideFlag = fileList.assemblySideBottomFiles?.length
    } else {
        // sideList.value = [
        //     { id: 1, name: 'Top' },
        //     { id: 2, name: 'Bottom' },
        // ]
        sideFlag = fileList.assemblySideTopFiles?.length && fileList.assemblySideBottomFiles?.length
    }
    return !(fileList.pcbAMaterialFiles?.length && fileList.pcbAMaterialCplFiles?.length && sideFlag)
})

const changeTab = (name: any) => {
    autoTime.value = new Date()
}

const nextHandle = (index: string) => {
    autoTime.value = new Date()
    if (index == '0') {
        activeName.value = '1'
    }
    if (index == '1') {
        // disabled4.value = false
        activeName.value = '3'
    }
}

// 文件改变
const fileChange = async (list: any[], name: string) => {
    fileList[name+'Image'] = await getUrlByKeys(list[0].key)
}

// 文件删除
const clearFile = (name: string) => {
    fileList[name+'Files'] = []
    fileList[name+'Image'] = undefined
}

// 获取描述
const getCategoryList = () => {
    $http('/purchase/pcbaCategory/categoryList', {
        method: 'get',
    }).then((res: any) => {
        // priceLoading.value = false
        // console.log(res.data)
        pcbADescribeList.value = res.data || []
        if (form.value.pcbADescribe?.length) {
            form.value.pcbADescribe.map((m: any, index: any) => {
                let one,two,thr,four
                one = pcbADescribeList.value.find((f: any) => f.id == form.value.pcbADescribe[0])
                showValue.value += one?.label
                if (one) {
                    two = one.children.find((f: any) => f.id == form.value.pcbADescribe[1])
                    showValue.value += '/'+ two?.label
                }
                if (two) {
                    thr = two.children.find((f: any) => f.id == form.value.pcbADescribe[2])
                    showValue.value += '/'+ thr?.label
                }
                if (thr) {
                    four = thr.children.find((f: any) => f.id == form.value.pcbADescribe[3])
                    showValue.value += '/'+ four?.label
                }
            })
        }
    }).catch(() => {
        // priceLoading.value = false
    })
}

// 下载模板
const downloadBomOrCpl = (url: string) => {
    window.open(url)
}

// 级联选择完成
const finishHandle = ({ selectedOptions }: any) => {
    console.log(selectedOptions)
    showValue.value = selectedOptions.map((m: any) => m.label).join('/')
    form.value.pcbADescribe = selectedOptions.map((m: any) => m.id)
    show.value = false
}

// 保存
const saveCar = () => {
    formRef.value.validate().then(() => {
        // console.log(pcbOrder.value, fileList, form.value.pcbADescribe)
        const body = deepClone(pcbOrder.value.configInfo)
            for (let key in body) {
                body[key] = isType(body[key]) == 'array' ? body[key].join(',') : body[key]
            }
            const {
                fileKey,
                fileName,
                fileSize,
                fileSuffix,
            } = fileDeal(pcbOrder.value.pcbFile, 'object')
            body.fileKey = fileKey
            body.fileName = fileName
            body.fileSize = fileSize
            body.fileSuffix = fileSuffix
            body.pcbA = pcbOrder.value.pcbA
            body.attachFiles = pcbOrder.value.configInfo?.attach
            body.assemblySideTopFiles = fileList.assemblySideTopFiles
            body.assemblySideBottomFiles = fileList.assemblySideBottomFiles
            body.pcbAMaterialFiles = fileList.pcbAMaterialFiles
            body.pcbAMaterialCplFiles = fileList.pcbAMaterialCplFiles
            console.log(form.value.pcbADescribe)
            body.pcbADescribe = form.value.pcbADescribe ? (form.value.pcbADescribe as any).join(',') : undefined
            // body.pcbADescribe = (form.value.pcbADescribe as any).map((m: any) => m.id).join(',')
            if (pcbOrder.value.pcbADetail?.id) {
                body.id = pcbOrder.value.pcbADetail.id
            }
            delete body?.attach
            // console.log(body)
            $http('/purchase/sale/add', {
                method: 'post', 
                loading: true,
                body
            }).then((res: any) => {
                navigateTo('/order/9')
            })
    })
}

onMounted(() => {
    getCategoryList()
    if (usePcbAOrder().value) {
        pcbOrder.value = usePcbAOrder().value
        console.log(pcbOrder.value)
        if (pcbOrder.value.pcbADetail) {
            const { pcbADetail } = pcbOrder.value
            fileList.assemblySideTopFiles = pcbADetail.assemblySideTopFiles
            if (fileList.assemblySideTopFiles?.length) {
                fileList.assemblySideTopImage = fileList.assemblySideTopFiles[0].url
            }
            fileList.assemblySideBottomFiles = pcbADetail.assemblySideBottomFiles
            if (fileList.assemblySideBottomFiles?.length) {
                fileList.assemblySideBottomImage = fileList.assemblySideBottomFiles[0].url
            }
            fileList.pcbAMaterialFiles = pcbADetail.pcbAMaterialFiles
            fileList.pcbAMaterialCplFiles = pcbADetail.pcbAMaterialCplFiles
            form.value.pcbADescribe = pcbADetail.pcbADescribe ? pcbADetail.pcbADescribe.split(',') : undefined
            if (form.value.pcbADescribe) {
                form.value.pcbADescribe = (form.value.pcbADescribe as any).map((m: any) => Number(m))
                // console.log(form.value.pcbADescribe)
            }
        }
        // 根据类型，展示对应的文件上传
        if (pcbOrder.value?.configInfo.assemblySide == '1') {
            sideList.value = [{ id: 1, name: 'Top' }]
            sideIndex.value = 1
        } else if (pcbOrder.value?.configInfo.assemblySide == '2') {
            sideList.value = [{ id: 2, name: 'Bottom' }]
            sideIndex.value = 2
        } else {
            sideList.value = [
                { id: 1, name: 'Top' },
                { id: 2, name: 'Bottom' },
            ]
        }
    }
})
</script>

<style lang="scss" scoped>
.pcba-file {
    background: #f1f3f6;
    min-height: 100vh;
    
    .pcba-name {
        background: #ffffff;

        .pcba-tips {
            // position: absolute;
            // bottom: -30px;
            // right: 15px;
            padding: 15px 15px 0;
            font-size: 14px;
            color: #999;
            z-index: 10;
        }
    }

    // :deep(.van-tabs) {
    //     .van-tabs__header {
    //         background: #ffffff;
    //         margin-bottom: 0px;

    //         .el-tabs__item {
    //             font-size: 16px;
    //         }
    //     }
    //     .el-tabs__content,
    //     .el-tabs__nav-wrap {
    //         min-width: var(--min-width) !important;
    //         max-width: var(--max-width) !important;
    //         padding: 0 15px;
    //         margin-left: auto !important;
    //         margin-right: auto !important;
    //         &::after {
    //             display: none;
    //         }
    //     }
    //     .el-tab-pane {
    //         margin: 25px auto 80px;
    //     }
    // }

    .pcba-file-pane {
        background-color: #fff;
        // box-shadow: 2px 2px 6px 1px rgba(198,206,221,.3);
        padding: 20px;
        overflow: hidden;

        .pcb-change-order {
            margin-bottom: 15px;
            font-size: 14px;
            color: var(--el-color-primary);
        }

        &.pane-one {
            align-items: stretch;
        }
        
        .pcb-silder {
            position: relative;
            flex: 1;
            background-color: #e7e9ec;
            border-radius: 4px;
            
            .side-close {
                position: absolute;
                top: 20px;
                right: 20px;
                width: 30px;
                height: 30px;
                background: #000;
                border-radius: 50%;
                overflow: hidden;
            }

            :deep(.side-upload) {
                width: 100%;
                .van-uploader,
                .van-uploader__wrapper,
                .van-uploader__upload {
                    width: 100%;
                }
                .van-uploader__upload {
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    width: 100%;
                    min-height: 200px;
                    margin: 0 !important;
                }
            }

            .side-list {
                position: absolute;
                top: 20px;
                left: 20px;
                width: 130px;
                border-radius: 4px;
                border: 1px solid #999;
                overflow: hidden;
                z-index: 10;

                .side-item {
                    flex: 1;
                    // width: 50%;
                    background: #fff;
                    padding: 8px 0;
                    font-size: 12px;
                    color: #999;
                    &.active {
                        background: #000;
                        color: #fff;
                    }
                }
            }
        }
        .pcb-info {
            flex: none;
            // width: 200px;
            height: 100%;
            margin-top: 20px;
            font-size: 14px;
            .pcb-type-item {
                margin-bottom: 15px;
            }
            .pcb-info-btn {
                width: 100%;
                height: 40px;
                margin-top: 15px;
                font-size: 16px;
            }
        }

        .pcb-file-list {
            .upload-bom-cpl {
                width: 48%;
                background: var(--van-uploader-upload-background);
                padding: 10px;
                color: var(--van-uploader-text-color);
                border-radius: 4px;

                :deep(.van-uploader__input-wrapper) {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    .el-upload__text {
                        font-size: 12px;
                        text-align: center;
                    }
                }

                .download-tips {
                    position: relative;
                    z-index: 1;
                }
            }
        }
        .pcb-file-btn {
            height: 40px;
            margin-top: 15px;
        }
    }

    .pcba-file-flex {
        .pcba-file-price {
            // flex: 1;
            background-color: #fff;
            // box-shadow: 2px 2px 6px 1px rgba(198,206,221,.3);
            padding: 15px;
            overflow: hidden;
            :deep(.van-cell) {
                padding-left: 0 !important;
                padding-right: 0 !important;
                &::after {
                    left: 0;
                    right: 0;
                }
            }

            .pcba-file-title {
                margin-bottom: 15px;
                font-size: 18px;
                font-weight: 600;
            }

            .van-collapse {
                border-top: none;
                border-bottom: none;

                .collapse-title {
                    flex: 1;
                    text-align: left;
                    margin-right: 20px;

                    .collapse-title-name {
                        // flex: 1;
                        font-size: 14px;
                        font-weight: 600;
                    }

                    .collapse-title-value {
                        // flex: 1;
                        padding-left: 40px;
                    }
                }

                .van-collapse-item--border::after {
                    left: 0;
                    right: 0;
                }

                .collapse-flex {
                    .collapse-flex-item {
                        // flex: 1;
                        padding-right: 40px;
                    }
                }

                // .el-collapse-item {
                //     &:last-child {
                //         .el-collapse-item__wrap {
                //             border-bottom: none;
                //         }
                //     }
                // }
            }
        }
        .pcba-file-right {
            // flex: none;
            // width: 300px;
            // margin-left: 20px;
            background-color: #fff;
            // box-shadow: 2px 2px 6px 1px rgba(198,206,221,.3);
            padding: 0 15px 15px;
            overflow: hidden;
            .van-cell {
                padding-left: 0;
                padding-right: 0;
                // &::after {
                //     left: 0;
                //     right: 0;
                // }
            }

            .right-total {
                margin-bottom: 15px;

                .right-total-name {
                    font-size: 16px;
                    font-weight: 600;
                }
                .right-total-value {
                    font-size: 14px;
                    font-weight: 600;
                    color: #E6A23C;
                }
            }

            .pcba-description {
                margin-bottom: 15px;
                font-size: 14px;
            }

            .pcba-cascader {
                width: 100%;
            }

            .pcba-save-car {
                width: 100%;
                height: 40px;
                // font-size: 16px;
                margin-top: 25px;
            }
        }
    }
}
</style>