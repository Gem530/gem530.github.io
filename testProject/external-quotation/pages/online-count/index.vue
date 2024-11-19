<template>
    <div class="bg">
        <div class="online-count main-width">
            <el-form class="form-box" ref="formRef" label-width="210px" :model="configInfo" size="default">
                <div class="count-tab flex flex-between" v-if="!route.query?.id">
                    <div class="count-tab-item pointer flex flex-start"
                        :class="{'count-active': countIndex == 1, 'height-bg': heightBg}" @click="clickCountType(1)">
                        <img v-if="heightBg" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/pcb-black.png" alt="" class="count-tab-img">
                        <img v-else src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/pcb-white.png" alt="" class="count-tab-img">
                        <span class="count-tab-name">{{$t('onlineInfo.standardPCBPCBA')}}</span>
                    </div>
                    <div class="count-tab-item pointer flex flex-start"
                        :class="{'count-active': countIndex == 2, 'height-bg': heightBg}" @click="clickCountType(2)">
                        <img v-if="heightBg" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/advanced-black.png" alt="" class="count-tab-img">
                        <img v-else src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/advanced-white.png" alt="" class="count-tab-img">
                        <span class="count-tab-name">{{$t('onlineInfo.advancedPCBPCBA')}}</span>
                    </div>
                    <div class="count-tab-item pointer flex flex-start"
                        :class="{'count-active': countIndex == 3, 'height-bg': heightBg}" @click="clickCountType(3)">
                        <img v-if="heightBg" src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/smt-black.png" alt="" class="count-tab-img">
                        <img v-else src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/smt-white.png" alt="" class="count-tab-img">
                        <span class="count-tab-name">{{$t('onlineInfo.SMTStencil')}}</span>
                    </div>
                </div>

                <el-card class="upload-card">
                    <XUpload v-model:model-value="pcbFile" list-type="text" model="download" :fileType="['zip','rar']" :fileSize="20" drag :limit="1" @delFile="callBackHandle({callFlag:'1'})">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            <div>{{$t('onlineInfo.pcbUploadFile')}}</div>
                            <div class="el-upload-drag-tips">{{$t('onlineInfo.pcbUploadFileLimit')}}</div>
                        </div>
                    </XUpload>
                </el-card>

                <el-card class="base-info" v-for="info in configList" :key="info.id">
                    <template #header v-if="info.key == 'pcbA'">
                        <div class="flex flex-between">
                            <div>{{info.name}}</div>
                            <div class="flex flex-end">
                                <!-- <div class="pcb-assembly-free hover-unline pointer">{{ $t('onlineInfo.freeAssembly') }}</div> -->
                                <div v-click-outside="() => {visible = false}">
                                    <el-switch v-model="pcbA" active-value="1" inactive-value="0" :style="{'--el-switch-on-color': heightBg?'#b29f5a':''}"
                                        :before-change="beforeChange" @click="handleClickTooltip" @change="callBackHandle({key:'pcbA',callFlag:'1'})"
                                    ></el-switch>
                                </div>
                                <el-popover
                                    ref="tooltipRef"
                                    :visible="visible"
                                    :virtual-ref="buttonRef"
                                    virtual-triggering
                                    placement="top"
                                    width="250px"
                                >
                                    <p>{{ $t('onlineInfo.PCBAssemblyRequires') }}</p>
                                    <p>{{ $t('onlineInfo.PCBQtyCannot') }}</p>
                                    <p>{{ $t('onlineInfo.pcbUploadFile') }}</p>
                                </el-popover>
                            </div>
                        </div>
                    </template>
                    <template #header v-else-if="info.key == 'smt' && singleSmt != '1'">
                        <div class="flex flex-between">
                            <div>{{info.name}}</div>
                            <div class="flex flex-end">
                                <div class="pcb-assembly-free">{{ $t('onlineInfo.ordertogetherwithPCB') }}</div>
                                <el-switch v-model="smt" active-value="1" inactive-value="0" :style="{'--el-switch-on-color': heightBg?'#b29f5a':''}"
                                    @change="callBackHandle({key:'smt',callFlag:'1'})"
                                ></el-switch>
                            </div>
                        </div>
                    </template>
                    <template #header v-else>{{info.name}}</template>
                    <el-row>
                        <el-col :key="item.id" :span="item.col" v-for="item in info.paramVos">
                            <el-divider content-position="left" v-if="item.type == 'title'" style="margin-top: 10px;">{{item.name}}</el-divider>
                            <el-form-item
                                v-else
                                :label="item.name"
                                :prop="(item.type == 'inputNumber' ? (item.requiredFlag == '1' && item.paramVos?.length <= 1) : item.requiredFlag == '1') ? item.key : ''"
                                :rules="item.requiredFlag == '1' ?
                                    (item.type == 'number' ? [{ required: true, message: item.name, trigger: ['change','blur'] },
                                        { validator: validateNumber, trigger: ['change','blur'] }] :
                                    { required: true, message: item.name, trigger: 'change' }) :
                                    {}"
                                :label-width="item.col == 12 ? '260px' : '210px'"
                                >
                                <template #label>
                                    <div class="base-form-lable flex flex-between">
                                        <span class="base-form-line text-right">{{ item.name }}</span>
                                        <CountTooltip
                                            :field="item.key"
                                            :data="{
                                                dimensions: configInfo.dimensions
                                            }"
                                            v-if="item.key && !['pcbRemarks','voltageValue','pcbARemark','attach','framework','stencilSide','stencilRemark'].includes(item.key)"
                                        ></CountTooltip>
                                    </div>
                                </template>
                                <template v-if="item.type == 'radio'">
                                    <el-radio-group v-model="configInfo[item.key]">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <el-radio
                                                border
                                                :label="el.value"
                                                v-if="el.showFlag == '1'"
                                                :class="{'height-bg': heightBg}"
                                                :disabled="el.disableFlag == '1'" @click="callBackHandle(el, true)">
                                                <!-- :class="{'height-bg': item.key == 'boardLayers' && el.value == configInfo[item.key] && Number(configInfo[item.key]) > 4}" -->
                                                <template v-if="el.type == '1'">{{ el.name }}</template>
                                                <div class="radio-flex" v-if="el.type == '2'">
                                                    <div class="radio-color" :style="`background: ${el.label};`"></div>
                                                    {{ el.name }}
                                                </div>
                                                <div class="radio-flex-column" v-if="el.type == '3'">
                                                    <el-tooltip
                                                        effect="light"
                                                        placement="top">
                                                        <template #content>
                                                            <el-image style="width: 258px;" :src="el.label" fit="contain" />
                                                        </template>
                                                        <el-image style="width: 60px; height: 25px;" :src="el.label" fit="contain" />
                                                    </el-tooltip>
                                                    <div class="radio-flex-text">{{ el.name }}</div>
                                                </div>
                                            </el-radio>
                                            <span class="base-input-unit" v-if="el?.unit">{{ el.unit }}</span>
                                        </template>
                                    </el-radio-group>
                                </template>
                                <template v-if="item.type == 'checkbox'">
                                    <!-- @click="callBackHandle(el, false, 'checkbox')" -->
                                    <el-checkbox-group v-model="configInfo[item.key]" @change="(value: any) => checkboxChange(value, item)">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <el-checkbox
                                                border
                                                :label="el.value"
                                                v-if="el.showFlag == '1'"
                                                :disabled="el.disableFlag == '1'">
                                                <template v-if="el.type == '1'">{{ el.name }}</template>
                                                <div class="radio-flex" v-if="el.type == '2'">
                                                    <div class="radio-color" :style="`color: ${el.label};`"></div>
                                                    {{ el.name }}
                                                </div>
                                                <div class="radio-flex-column" v-if="el.type == '3'">
                                                    <el-tooltip
                                                        effect="light"
                                                        placement="top">
                                                        <template #content>
                                                            <el-image style="width: 258px;" :src="el.label" fit="contain" />
                                                        </template>
                                                        <el-image style="width: 60px; height: 25px;" :src="el.label" fit="contain" />
                                                    </el-tooltip>
                                                    <div class="radio-flex-text">{{ el.name }}</div>
                                                </div>
                                            </el-checkbox>
                                            <span class="base-input-unit" v-if="el?.unit">{{ el.unit }}</span>
                                        </template>
                                    </el-checkbox-group>
                                </template>
                                <template v-if="item.type == 'input'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <!-- <el-form-item :prop="item.requiredFlag == '1' ? el.key : ''"
                                                :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}"> -->
                                                <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                    <el-input
                                                        class="base-input-content"
                                                        v-model="configInfo[item.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                    ><template #append v-if="el?.unit">{{ el.unit }}</template></el-input>
                                                    <span class="base-input-to" v-if="el?.label && el?.label != '0'">{{ el?.label }}</span>
                                                </div>
                                            <!-- </el-form-item> -->
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'inputNumber'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <template v-if="el.type == '1'">
                                                <el-form-item class="error-tips" :prop="item.requiredFlag == '1' ? el?.key : ''"
                                                    :rules="item.requiredFlag == '1' ? [{ required: true, message: el.name, trigger: 'change' },
                                                        { validator: (rule: any, value: any, callback: any) => validateFloatMaxNumber(rule, value, callback, el), trigger: 'change' }] : {}">
                                                    <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                        <el-input
                                                            class="base-input-content"
                                                            type="number"
                                                            v-model="configInfo[el.key]"
                                                            :disabled="el.disableFlag == '1'"
                                                            @change="callBackHandle(el)"
                                                            :placeholder="el.name"
                                                        ><template #append v-if="el?.unit">{{ el.unit }}</template></el-input>
                                                        <span class="base-input-to" v-if="el?.label && el?.label != '0'">{{ el?.label }}</span>
                                                        <template v-if="item.key == 'pcbAQty'">
                                                            <span style="white-space: nowrap;margin-left: 5px;">{{ $t('onlineInfo.qtyFrom', { min: el.minLimit, max: el.maxLimit }) }}</span>
                                                        </template>
                                                    </div>
                                                </el-form-item>
                                            </template>
                                            <el-select v-if="el.type == '2'" v-model="configInfo[el.key]" style="width: 100px;">
                                                <!-- <template :key="el.value" v-for="el in item.paramVos"> -->
                                                    <!-- :label="el.name"
                                                    :value="el.value"
                                                    v-if="el.showFlag == '1'"
                                                    :disabled="el.disableFlag == '1'" -->
                                                    <el-option
                                                        label="mm"
                                                        value="mm"
                                                        @click="callBackHandle(el)"
                                                    />
                                                    <el-option
                                                        label="inch"
                                                        value="inch"
                                                        @click="callBackHandle(el)"
                                                    />
                                                <!-- </template> -->
                                            </el-select>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'textarea'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <!-- <el-form-item :prop="item.requiredFlag == '1' ? el.key : ''"
                                                :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}"
                                                style="width: 100%;"> -->
                                                <div class="base-input-item flex flex-start input-max-width" v-if="el.showFlag == '1'">
                                                    <el-input
                                                        rows="4"
                                                        type="textarea"
                                                        class="base-input-content"
                                                        v-model="configInfo[item.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                        :show-word-limit="item.key == 'pcbRemarks'"
                                                        :maxlength="item.key == 'pcbRemarks' ? '500' : ''"
                                                    ><template #append v-if="el?.unit">{{ el.unit }}</template></el-input>
                                                    <span class="base-input-to" v-if="el?.label && el?.label != '0'">{{ el?.label }}</span>
                                                </div>
                                            <!-- </el-form-item> -->
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'number'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <!-- <el-form-item :prop="item.requiredFlag == '1' ? el.key : ''"
                                                :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}"> -->
                                                <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                    <el-input-number
                                                        controls-position="right"
                                                        class="base-input-content"
                                                        v-model="configInfo[el.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                    ></el-input-number>
                                                    <span class="base-input-unit" v-if="el?.unit">{{ el.unit }}</span>
                                                    <span class="base-input-to" v-if="el?.label && el?.label != '0'">{{ el?.label }}</span>
                                                </div>
                                            <!-- </el-form-item> -->
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'quantity'">
                                    <div class="base-input flex flex-start">
                                        <div class="base-input-item">
                                            <el-select
                                                class="base-input-content"
                                                placeholder=" "
                                                v-model.trim="configInfo[item.key]"
                                                :ref="(el: any) => getRefs(el, item.key)">
                                                <!-- <template :key="el.value" v-for="el in item.paramVos">
                                                    <el-option :label="i+''" :value="i+''" v-for="i in fives().value" :key="i" @click="callBackHandle(el)"/>
                                                </template> -->
                                                <template #empty>
                                                    <el-radio-group class="select-pop-radio" v-model="configInfo[item.key]">
                                                        <template :key="el.id" v-for="el in item.paramVos">
                                                            <el-radio
                                                                border
                                                                :label="el.value"
                                                                v-if="el.showFlag == '1'"
                                                                :class="{'height-bg': heightBg}"
                                                                :disabled="el.disableFlag == '1'"
                                                                @click="callBackHandle(el, true, item.type)"
                                                            >{{ el.value }}</el-radio>
                                                        </template>
                                                    </el-radio-group>
                                                </template>
                                            </el-select>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="item.type == 'select'">
                                    <div class="base-input flex flex-start">
                                        <div class="base-input-item flex flex-start">
                                            <el-select v-model="configInfo[item.key]" placeholder=" " class="base-input-content">
                                                <template :key="el.value" v-for="el in item.paramVos">
                                                    <el-option
                                                        :label="el.name"
                                                        :value="el.value"
                                                        v-if="el.showFlag == '1'"
                                                        :disabled="el.disableFlag == '1'"
                                                        @click="callBackHandle(el)"
                                                    />
                                                </template>
                                            </el-select>
                                            <span class="base-input-unit" v-if="item?.paramVos?.length">{{ item?.paramVos[0]?.unit }}</span>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="item.type == 'upload'">
                                    <div class="base-input flex flex-start">
                                        <div class="base-input-item">
                                            <!-- {{ configInfo[item.key] }} -->
                                            <XUpload v-model="configInfo[item.key]" model="download">
                                                <el-icon style="margin-right: 5px;" size="20px" color="var(--el-color-primary)"><UploadFilled /></el-icon>
                                                {{ item.name }}
                                            </XUpload>
                                        </div>
                                    </div>
                                </template>
                            </el-form-item>
                        </el-col>
                        <template v-if="info.key == 'pcbA' && pcbA == '1'">
                            <el-col :span="24" class="flex flex-start">
                                <el-checkbox v-model="agreePcb" :value="true"><span style="color: #999;">{{$t('onlineInfo.iAgreeTo')}}</span></el-checkbox>
                                <span style="margin-left: 5px;font-size: 14px;color: var(--el-color-primary);" class="hover-unline pointer" @click.stop="navigateTo('/help-document', {open: {target:'_blank'}})">{{$t('onlineInfo.theTermsAnd')}}</span>
                            </el-col>
                            <el-col :span="24">
                                <el-button round type="primary" style="margin-top: 20px;" @click="nextHandle">{{ $t('confirm') }}</el-button>
                            </el-col>
                        </template>
                    </el-row>
                </el-card>
            </el-form>

            <div class="float-right">
                <el-card class="order-info" v-loading="priceLoading">
                    <div class="order-info-title">{{$t('onlineInfo.feeDetails')}}</div>
                    <div class="order-info-flex" v-for="item in priceList.costList" :key="item.key">
                        <div class="order-info-label">{{item?.name}}</div>
                        <div class="order-info-value">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                    </div>
                    <div class="order-info-flex" v-for="item in priceList.smtCostList" :key="item.key">
                        <div class="order-info-label">{{item?.name}}</div>
                        <div class="order-info-value">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                    </div>

                    <template v-if="pcbA == '1'">
                        <div class="order-info-title top-border">{{$t('onlineInfo.economicPCBAPrice')}}</div>
                        <div class="order-info-flex" v-for="item in priceList.pcbACostList" :key="item.key">
                            <div class="order-info-label">{{item?.name}}</div>
                            <div class="order-info-value">{{useCurrencyInfo().value?.value}}{{item?.cost}}</div>
                        </div>
                    </template>

                    <div class="order-info-title top-border">{{$t('onlineInfo.deliveryTimeExpressDelivery')}}</div>
                    <div class="order-info-flex" v-for="item in priceList.revealList" :key="item.key">
                        <div class="order-info-label">{{item?.name}}</div>
                        <div class="order-info-value">{{item?.cost}}</div>
                    </div>
                    <div class="order-info-flex">
                        <div class="order-info-label">{{$t('onlineInfo.expressDelivery')}}</div>
                        <div class="order-info-value">{{$t('onlineInfo.crossBorderExpressTransportation')}}</div>
                    </div>
                    <div class="order-info-flex">
                        <div class="order-info-label">{{$t('onlineInfo.deliveryTime')}}</div>
                        <div class="order-info-value">{{$t('onlineInfo.basedOnTheReviewTime')}}</div>
                    </div>

                    <div class="order-info-title top-border price">
                        <div>{{$t('onlineInfo.calculatePrice')}}</div>

                        <div class="order-info-price">
                            <!-- $118.25 -->
                            {{useCurrencyInfo().value?.value}}{{priceList?.totalCost}}
                            <!-- <span>$220.25</span> -->
                        </div>
                    </div>

                    <el-button v-if="pcbA == '0'" type="primary" :color="heightBg ? '#494949' : ''" class="order-info-btn" @click="saveToCar">{{$t('onlineInfo.saveToShoppingCart')}}</el-button>
                    <el-button v-else type="primary" :color="heightBg ? '#494949' : ''" class="order-info-btn" @click="nextHandle">{{$t('onlineInfo.next')}}</el-button>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="OnlineCount">
import { ClickOutside as vClickOutside } from 'element-plus'
const { t } = useI18n()
useHead({ title: () => t('onlinePricing') })
const formRef = ref()
const buttonRef = ref()
const route = useRoute()
const countIndex = ref(1)
const pcbADetail = ref<any>()
const smt = ref<'0'|'1'>('0')
const pcbA = ref<'0'|'1'>('0')
const pcbFile = ref<any[]>([])
const singleSmt =  ref<'0'|'1'>('0')
const visible = ref<boolean>(false)
const agreePcb = ref<boolean>(true)
const heightBg = ref<boolean>(false)
const priceLoading = ref<boolean>(false)
// 配置表单的值
const configInfo = ref<Record<string, any>>({})
// 配置表单列表
const configList = ref<Record<string, any>[]>([])
// 价格明细等
const priceList = ref<Record<string, any>>({})

const formSelectRef = reactive<Record<string, any>>({})
const getRefs = (e: any, id: string) => {
    formSelectRef[id] = e
}
const changeSelect = (type: string, row?: Record<string, any>) => {
    formSelectRef[type].blur()
    // const crtObj = row.paramVos.find((v: any) => v.key == type)
    // if (crtObj) {
    //     callBackHandle(crtObj)
    // }
}

// 大于0的整数
const validateNumber = (rule: any, value: any, callback: any) => {
    if (value < 0 || !validNumber(value)) {
        callback(new Error(t('onlineInfo.onlyIntegers')))
    } else {
        callback()
    }
}
// 大于0的整数、小数，并且不能大于xx
const validateFloatMaxNumber = (rule: any, value: any, callback: any, item: any) => {
    if (value < 0) {
        callback(new Error(t('onlineInfo.onlyIntegersDecimals')))
    } else if (item?.maxLimit && (Number(value) > Number(item.maxLimit))) {
        // callback(new Error(`${item.name}不能大于${item.max}${configInfo.value['unit']}`))
        callback(new Error(t('onlineInfo.cannotGreater', { name: item.name || '', value: item.maxLimit + (['length', 'width'].includes(item.key) ? (configInfo.value['unit'] || '') : '') })))
    } else if (item?.minLimit && (Number(value) < Number(item.minLimit))) {
        // callback(new Error(`${item.name}不能大于${item.max}${configInfo.value['unit']}`))
        callback(new Error(t('onlineInfo.cannotLess', { name: item.name || '', value: item.minLimit + (['length', 'width'].includes(item.key) ? (configInfo.value['unit'] || '') : '') })))
    } else {
        callback()
    }
}

const clickCountType = (num: number) => {
    countIndex.value = num
    if (countIndex.value == 1) {
        configInfo.value.boardLayers = '2'
        singleSmt.value = '0'
        configInfo.value.unit = configInfo.value.unit ? configInfo.value.unit : 'mm'
    } else if (countIndex.value == 2) {
        configInfo.value.boardLayers = '6'
        singleSmt.value = '0'
        configInfo.value.boardCategory = '1'
        configInfo.value.unit = configInfo.value.unit ? configInfo.value.unit : 'mm'
    } else if (countIndex.value == 3) {
        singleSmt.value = '1'
        pcbA.value = '0'
    }
    callBackHandle({callFlag:'1'})
}

const initConfig = (obj: any) => {
    let res: any = {}
    for (let key in obj) {
        if (!['attach', 'attachFiles'].includes(key)) {
            res[key] = obj[key] ? (obj[key]+'') : undefined
        } else {
            res[key] = obj[key]
        }
    }
    return res
}
// 获取详情
const getParamDetail = () => {
    return new Promise((resolve, reject) => {
        $http(`/purchase/sale/${configInfo.value?.id}`, {
            method: 'get',
        }).then((res: any) => {
            pcbADetail.value = res.data && deepClone(res.data)
            // console.log(res.data, pcbADetail.value)
            configInfo.value = res.data
            pcbFile.value = [{
                key: configInfo.value.fileKey,
                name: configInfo.value.fileName,
                size: configInfo.value.fileSize,
                type: configInfo.value.fileSuffix,
            }]
            if (configInfo.value.attachFiles) {
                configInfo.value.attach = res.data.attachFiles
            }
            configInfo.value = initConfig(configInfo.value)
            // console.log(configInfo.value, configInfo.value.attach, configInfo.value.attachFiles)
            smt.value = configInfo.value.smt || '0'
            pcbA.value = configInfo.value.pcbA || '0'
            singleSmt.value = configInfo.value.singleSmt || '0'
            // priceList.value = res.data
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })
}

// 获取计算价格
const getCountPrice = (body: any) => {
    body = deepClone(body)
    // priceLoading.value = true
    body.smt = singleSmt.value == '1' ? '1' : smt.value
    body.pcbA = pcbA.value
    body.singleSmt = singleSmt.value
    if (pcbFile.value?.length && body.pcbA == '1') {
        const { fileKey } = fileDeal(pcbFile.value, 'object')
        body.fileKey = fileKey
    }
    if (body?.attach) {
        // body.attach = JSON.stringify(body.attach)
        delete body.attach
        delete body?.attachFiles
    }
    body = initConfig(body)
    $http('/purchase/count/countPrice', {
        method: 'post',
        body
    }).then((res: any) => {
        // priceLoading.value = false
        priceList.value = res.data
    }).catch(() => {
        // priceLoading.value = false
    })
}

// 获取页面的值
const getParamList = (body: any, first: boolean = false) => {
    body = deepClone(body)
    body.smt = singleSmt.value == '1' ? '1' : smt.value
    body.pcbA = pcbA.value
    body.singleSmt = singleSmt.value
    if (pcbFile.value?.length && body.pcbA == '1') {
        const { fileKey } = fileDeal(pcbFile.value, 'object')
        body.fileKey = fileKey
    }
    if (body?.attach) {
        // body.attach = JSON.stringify(body.attach)
        delete body.attach
        delete body?.attachFiles
    }
    $http('/purchase/count/params', {
        method: 'post',
        body
    }).then((res: any) => {
        configList.value = res.data

        // let param: any = {}
        // console.log(deepClone(param))
        const keyArr = Object.keys(deepClone(configInfo.value))
        const paramKeyArr: any[] = []
        configList.value.map((info: any) => {
            info?.paramVos?.length && info.paramVos.map((item: any) => {
                paramKeyArr.push(item.key)
                if (['radio','select','quantity','textarea','checkbox','number'].includes(item.type)) {
                    if (['checkbox'].includes(item.type) && item.defaultValue != undefined) {
                        configInfo.value[item.key] = item.defaultValue.includes(',') ? item.defaultValue.split(',') : [item.defaultValue]
                        // param[item.key] = deepClone(configInfo.value)[item.key].join(',')
                        // console.log(1111)
                    } else {
                        configInfo.value[item.key] = (item.defaultValue == undefined || item.defaultValue == null || item.defaultValue == '') ? undefined : item.defaultValue
                        // param[item.key] = configInfo.value[item.key]
                    }
                } else if (['inputNumber'].includes(item.type) && item.paramVos?.length == 1) {
                    configInfo.value[item.key] = (item.defaultValue == undefined || item.defaultValue == null || item.defaultValue == '') ? undefined : item.defaultValue
                } else {
                    item?.paramVos?.length && item.paramVos.map((el: any) => {
                        paramKeyArr.push(el.key)
                        if (first) {
                            configInfo.value[el.key] = (el.value == undefined || el.value == null || el.value == '') ? undefined : el.value
                            configInfo.value.unit = 'mm'
                            // param[item.key] = configInfo.value[item.key]
                            // param.unit = 'mm'
                        }
                    })
                }
            })
        })
        keyArr.map((v: any) => {
            if (!first && !paramKeyArr.includes(v)) {
                configInfo.value[v] = undefined
            }
        })
        // console.log(configInfo.value)
        let param = deepClone(configInfo.value)
        for (let key in param) {
            param[key] = isType(param[key]) == 'array' ? param[key].join(',') : param[key]
        }
        getCountPrice(param)
    })
}

const checkboxChange = (temp: any, item: any) => {
    let val = temp
    if (item.key == 'reinforcementMethod') {
        let num1 = 'a'
        if (val?.length && val[val.length - 1] == num1) {
            val = ['a']
        } else {
            const i = val.findIndex((v: any) => v == 'a')
            if (i != -1) {
                val.splice(i, 1)
            }
        }
    }
    const body = deepClone(configInfo.value)
    body[item.key] = val ? val.join(',') : undefined
    callBackHandle(body, false, 'checkbox')
}

watch(() => configInfo.value.boardLayers, (newVal, oldVal) => {
    if (newVal) {
        if (Number(newVal) >= 6) {
            countIndex.value = 2
            heightBg.value = true
            // document.body.style = '--online-count-bg: #494949;';
            document.body.setAttribute('style', '--online-count-bg: #252527;')
            // --online-tab-bg: #494949;--online-tab-active-bg: linear-gradient(90deg,#9e9365,#cbbb76);
        } else {
            countIndex.value = 1
            heightBg.value = false
            // document.body.style = '--online-count-bg: #f1f3f6;';
            document.body.setAttribute('style', '--online-count-bg: #f1f3f6;')
            // --online-tab-bg: #fff;--online-tab-active-bg: #f7fbff;
        }
    } else {
        heightBg.value = false
        document.body.setAttribute('style', '--online-count-bg: #f1f3f6;')
    }
})

const switchFlag = computed(() => (configInfo.value.width && Number(configInfo.value.width) >= 10) && (configInfo.value.length && Number(configInfo.value.length) >= 10) && configInfo.value.boardQuantity && pcbFile.value?.length)
watch(() => switchFlag.value, (newVal, oldVal) => {
    if (!newVal) {
        pcbA.value = '0'
    }
})

// 开关控制
const beforeChange = (): any => {
    return new Promise((resolve, reject) => {
        if (switchFlag.value) {
            return resolve('1')
        } else {
            return reject(new Error('0'))
        }
    })
}
const handleClickTooltip = (e: any) => {
    if (!switchFlag.value) {
        visible.value = !visible.value
        buttonRef.value = e.currentTarget
    } else {
        visible.value = false
    }
}

const callBackHandle = (el: Record<string, any>, flag: boolean = false, type?: string) => {
    // configInfo.value.changeKey = el.key
    if (el?.key == 'smt' && smt.value == '1') {
        pcbA.value = '0'
    }
    if (el?.key == 'pcbA' && pcbA.value == '1') {
        smt.value = '0'
    }
    if (type == 'checkbox') {
        getParamList(deepClone(el))
        return;
    }
    if (el?.disableFlag == '1') return;
    if (flag) configInfo.value[el?.key] = el?.value;
    // console.log(deepClone(configInfo.value))
    if (type == 'quantity') {
        changeSelect(el?.key)
    }
    const body = initConfig(configInfo.value)
    if (el?.callFlag == '1') {
        // 1再次调用接口，刷新页面
        // if (el.key == 'boardQuantity' && configInfo.value['boardQuantity']) {
        //     configInfo.value['boardQuantity'] = configInfo.value['boardQuantity']+''
        // }
        getParamList(body)
    } else {
        getCountPrice(body)
    }
}

// const layerysChange = () => {
//     if (state.form.layers == 1) {
//         // 飞针测试
//         state.form.flyTest = '不测试'
//     }
//     if (state.form.layers > 1) {
//         // 飞针测试
//         state.form.flyTest = 'AOI全测+飞针全测'
//     }
// }
// layerysChange()

// 下一步，pcbA开启时
const nextHandle = () => {
    // console.log(agreePcb.value)
    if (!agreePcb.value) {
        ElMessage.error(t('onlineInfo.byPlacingYour'))
        return
    }
    usePcbAOrder().value = {
        pcbA: pcbA.value,
        pcbFile: pcbFile.value,
        priceList: priceList.value,
        configInfo: configInfo.value,
        pcbADetail: pcbADetail.value
    }
    setLocal('usePcbAOrder')
    navigateTo('/pcba-file')
}

// 保存到购物车
const saveToCar = () => {
    if (!pcbFile.value?.length && useAccessToken().value) {
        ElMessage.error(t('onlineInfo.pcbUploadFile'))
        return
    }
    formRef.value.validate((value: boolean) => {
        // console.log(value, configInfo.value)
        if (value) {
            const body = deepClone(configInfo.value)
            for (let key in body) {
                body[key] = isType(body[key]) == 'array' ? body[key].join(',') : body[key]
            }
            const {
                fileKey,
                fileName,
                fileSize,
                fileSuffix,
            } = fileDeal(pcbFile.value, 'object')
            body.fileKey = fileKey
            body.fileName = fileName
            body.fileSize = fileSize
            body.fileSuffix = fileSuffix
            if (route.query.id) {
                body.id = route.query.id
            }
            body.smt = singleSmt.value == '1' ? '1' : smt.value
            body.singleSmt = singleSmt.value
            if (!useAccessToken().value) {
                // 未登录，保存下数据
                useOnlineData().value = body
                useOnlineData().value.pcbA = pcbA.value
                // console.log(useOnlineData().value)
            }
            $http('/purchase/sale/add', {
                method: 'post', 
                loading: true,
                body
            }).then((res: any) => {
                navigateTo('/order/9')
            })
        }
    })
}

onMounted(async () => {
    let isFirst = JSON.stringify(route.query) == '{}'
    // 首页带过来的数据
    if (!isFirst) {
        for (let key in route.query) {
            configInfo.value[key] = route.query[key] || undefined
        }
    }

    // if (route.query?.fileNo && usePcbAOrder().value) {
    if (usePcbAOrder().value) {
        // console.log(usePcbAOrder().value)
        pcbA.value = usePcbAOrder().value.pcbA
        pcbFile.value = usePcbAOrder().value.pcbFile
        priceList.value = usePcbAOrder().value.priceList
        configInfo.value = usePcbAOrder().value.configInfo
        isFirst = false
    }

    // 游客模式，点击保存登录后保留之前选择的数据
    if (useAccessToken().value && useOnlineData().value) {
        // 登录才取数据
        configInfo.value = deepClone(useOnlineData().value || {})
        smt.value = configInfo.value.smt
        pcbA.value = configInfo.value.pcbA
        singleSmt.value = configInfo.value.singleSmt
        isFirst = false
    } else {
        useOnlineData().value = undefined
    }

    // 订单编辑
    if (route.query?.id) {
        configInfo.value.id = route.query.id
        await getParamDetail()
    }
    getParamList(deepClone(configInfo.value), isFirst)

    // console.log(useCurrencyInfo().value)
// const testEval = `
// function aatestHandle (rule, value, callback, item) {
//     if (value < 0) {
//         callback(new Error(t('onlineInfo.onlyIntegersDecimals')))
//     } else if (item?.max && (Number(value) > (item?.max || 100))) {
//         callback(new Error(item.name+'不能大于'+(item.max||100)+configInfo.value['unit']))
//     } else {
//         callback()
//     }
// }
// `

// console.log(window, eval(testEval))
// const func = "(val) => console.log('----',val)"
// eval(func)(5555)
// const validateFloatMaxNumber = testHandle
})
</script>

<style lang="scss" scoped>
.bg {
    background: var(--online-count-bg);
}
.el-card {
    border-radius: 8px;
    box-shadow: none;
}
.online-count {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 0;

    .count-tab {
        margin-bottom: 20px;
        .count-tab-item {
            flex: 1;
            height: 68px;
            background: #fff;
            padding: 8px;
            border: 1px solid transparent;
            border-radius: 4px;
            overflow: hidden;
            &:not(:last-child) {
                margin-right: 10px;
            }

            &.height-bg {
                background: #494949;
                color: #ccc;
            }

            &.count-active {
                position: relative;
                color: #2b8ced;
                border: 1px solid #2d8ded;
                // box-shadow: 0 2px 3px 0 rgba(198,206,221,.3);
                background: #f7fbff;
                &::after {
                    content: "";
                    position: absolute;
                    bottom: 0px;
                    right: 0px;
                    width: 19px;
                    height: 20px;
                    background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/gou-blue.svg') no-repeat;
                    background-size: 100% 100%;
                }

                &.height-bg {
                    background: linear-gradient(90deg,#9e9365,#cbbb76);
                    border: none;
                    color: #fff9de;
                    &::after {
                        bottom: -3px;
                        right: -4px;
                        width: 25px;
                        height: 25px;
                        background: url('https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/gou-black.svg') no-repeat;
                        background-size: 100% 100%;
                    }
                }
            }

            .count-tab-img {
                width: 52px;
                height: 54px;
                margin-right: 5px;
            }
            .count-tab-name {
                font-size: 16px;
                font-weight: 600;
            }
        }
    }

    .el-upload-drag-tips {
        margin-top: 7px;
        font-size: 12px;
        color: #606266;
    }

    .form-box {
        // max-width: 1000px;
        flex: 1;
        margin-right: 20px;

        .form-flex {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            :deep(.el-form-item__content) {
                // display: flex;
                flex-wrap: nowrap;
            }
        }

        :deep(.el-radio) {
            // max-width: 750px;
            white-space: wrap;
            line-height: 26px;
        }

        .upload-card,
        .craft-info,
        .base-info {
            margin-bottom: 20px;

            .base-form-lable {
                height: 100%;
                .base-form-line {
                    line-height: 16px;
                }
            }
            
            .pcb-assembly-free {
                margin-right: 20px;
                font-size: 14px;
            }

            .base-input {
                width: 100%;

                .base-input-item {
                    flex: 1;
                    max-width: 380px;
                    padding-right: 3px;
                    &.input-max-width {
                        max-width: 100%;
                    }

                    .base-input-content {
                        width: 100%;
                    }

                    .base-input-unit {
                        margin-left: 3px;
                    }
                    .base-input-to {
                        margin: 0 3px;
                    }
                }
            }
        }
    }

    .float-right {
        position: sticky;
        top: 0;
        width: 400px;

        .order-info {
            margin-bottom: 20px;

            .order-info-btn {
                display: block;
                width: 320px;
                height: 50px;
                margin: 0 auto;
                font-size: 18px;
                border-radius: 50px;
            }

            .order-info-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
                font-weight: 600;

                &.top-border {
                    margin-top: 10px;
                    padding-top: 20px;
                    border-top: 1px solid #f1f3f6;
                }

                &.price {
                    justify-content: flex-start;
                    &>div {
                        flex: 1;
                    }
                }
                
                .order-info-price {
                    color: red;
                    span {
                        text-decoration: line-through;
                        color: #999;
                    }
                }
            }

            .order-info-flex {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                margin-bottom: 10px;
                font-size: 14px;

                .order-info-value,
                .order-info-label {
                    width: 50%;

                    .choose-address {
                        color: var(--el-color-primary);
                    }
                }
            }
        }
    }
}
</style>