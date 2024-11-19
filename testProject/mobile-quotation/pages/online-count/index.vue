<template>
    <div class="bg">
        <div class="header-logo flex flex-between">
            <div class="flex flex-start">
                <img src="https://pcbsuper-prod.oss-cn-hongkong.aliyuncs.com/config/images/u1.png" alt="" class="img-logo">
                <span class="header-logo-text">PCB<span style="color: rgb(234, 102, 102);">SUPER</span>.COM</span>
            </div>

            <van-notice-bar class="header-notice" color="#666" background="transparent" scrollable :text="$t('home.yourPCB')" />
        </div>
        <div class="online-count main-width">
            <van-form class="form-box" ref="formRef" size="default" label-align="top" @submit="sumitHandle">
                <div class="upload-card">
                    <GUpload
                        :upload-text="`${$t('onlineInfo.pcbUploadFile')}，${$t('onlineInfo.pcbUploadFileLimit')}`"
                        v-model="pcbFile" :max-count="1" model="download" @delFile="callBackHandle({callFlag:'1'})" :fileType="['zip','rar']" :fileSize="20"
                    ></GUpload>
                </div>

                <div class="base-info" v-for="info in configList" :key="info.id">
                    <!-- <template #header>{{info.name}}</template> -->
                    <div class="base-info-title flex flex-between" v-if="info.key == 'pcbA'">
                        <div class="base-info-title-name">{{info.name}}</div>
                        <!-- <div class="pcb-assembly-free hover-unline pointer">{{ $t('onlineInfo.freeAssembly') }}</div> -->
                        <van-switch :model-value="pcbA" active-value="1" inactive-value="0" :active-color="heightBg?'#b29f5a':''"
                            @update:model-value="beforeChange" @change="callBackHandle({key:'pcbA',callFlag:'1'})" size="20px"
                        ></van-switch>
                    </div>
                    <div class="base-info-title flex flex-between" v-else-if="info.key == 'smt' && singleSmt != '1'">
                        <div class="base-info-title-name">{{info.name}}</div>
                        <!-- <div class="pcb-assembly-free hover-unline pointer">{{ $t('onlineInfo.freeAssembly') }}</div> -->
                        <div class="flex flex-end">
                            <div class="pcb-assembly-free">{{ $t('onlineInfo.ordertogetherwithPCB') }}</div>
                            <van-switch v-model="smt" active-value="1" inactive-value="0" :active-color="heightBg?'#b29f5a':''"
                                @change="callBackHandle({key:'smt',callFlag:'1'})" size="20px"
                            ></van-switch>
                        </div>
                    </div>
                    <div class="base-info-title" v-else>{{info.name}}</div>
                    <template :key="item.id" v-for="item in info.paramVos">
                        <van-divider content-position="left" v-if="item.type == 'title'">{{item.name}}</van-divider>
                        <van-field
                            v-else
                            :label="item.name"
                            :name="(['inputNumber','quantity'].includes(item.type) ? (item.requiredFlag == '1' && item.paramVos && item.paramVos?.length <= 1) : item.requiredFlag == '1') ? item.key : ''"
                            :required="item.requiredFlag == '1'"
                            :rules="((item.requiredFlag == '1' ?
                                        (item.type == 'number' ? [{ required: true, message: item.name },
                                            { validator: validateNumber }] :
                                        (['inputNumber','quantity','select'].includes(item.type) && item.paramVos?.length >= 1 ? [] : [{ required: true, message: item.name }])) :
                                    []) as any)"
                            >
                            <template #label>
                                <div class="base-form-lable flex flex-start">
                                    <span>{{ item.name }}</span>
                                    <CountTooltip
                                        :field="item.key"
                                        :data="{
                                            dimensions: configInfo.dimensions
                                        }"
                                        v-if="item.key && !['pcbRemarks','voltageValue','pcbARemark','attach','framework','stencilSide','stencilRemark'].includes(item.key)"
                                    ></CountTooltip>
                                </div>
                            </template>
                            <template #input>
                                <template v-if="item.type == 'radio'">
                                    <van-radio-group v-model="configInfo[item.key]" direction="horizontal">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <van-radio
                                                border
                                                :name="el.value"
                                                v-if="el.showFlag == '1'"
                                                :class="{'height-bg': heightBg, 'is-checked': el.value == configInfo[item.key]}"
                                                :disabled="el.disableFlag == '1'" @click="callBackHandle(el, true)">
                                                <template v-if="el.type == '1'">{{ el.name }}</template>
                                                <div class="radio-flex" v-if="el.type == '2'">
                                                    <div class="radio-color" :style="`background: ${el.label};`"></div>
                                                    {{ el.name }}
                                                </div>
                                                <div class="radio-flex-column" v-if="el.type == '3'">
                                                    <van-image width="60" height="25" :src="el.label" fit="contain"/>
                                                    {{ el.name }}
                                                </div>
                                            </van-radio>
                                            <span class="base-input-unit" v-if="el.unit">{{ el.unit }}</span>
                                        </template>
                                    </van-radio-group>
                                </template>
                                <template v-if="item.type == 'checkbox'">
                                    <!-- @click="callBackHandle(el, false, 'checkbox')" -->
                                    <!--  @change="(value: any) => checkboxChange(value, item)" -->
                                    <van-checkbox-group v-model="configInfo[item.key]" @click="checkboxChange(item)" direction="horizontal">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <van-checkbox
                                                border
                                                :name="el.value"
                                                v-if="el.showFlag == '1'"
                                                :disabled="el.disableFlag == '1'"
                                                :class="{'is-checked': configInfo[item.key].includes(el.value)}">
                                                <template v-if="el.type == '1'">{{ el.name }}</template>
                                                <div class="radio-flex" v-if="el.type == '2'">
                                                    <div class="radio-color" :style="`color: ${el.label};`"></div>
                                                    {{ el.name }}
                                                </div>
                                                <div class="radio-flex-column" v-if="el.type == '3'">
                                                    <van-image width="60" height="25" :src="el.label" fit="contain"/>
                                                    <div class="radio-flex-text">{{ el.name }}</div>
                                                </div>
                                            </van-checkbox>
                                            <span class="base-input-unit" v-if="el.unit">{{ el.unit }}</span>
                                        </template>
                                    </van-checkbox-group>
                                </template>
                                <template v-if="item.type == 'input'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <!-- <van-field :prop="item.requiredFlag == '1' ? el.key : ''"
                                                :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}"> -->
                                                <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                    <van-field
                                                        autocomplete="off"
                                                        v-model="configInfo[el.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                        class="error-tips" :name="item.requiredFlag == '1' ? el.key : ''"
                                                        :placeholder="el.name"
                                                        :rules="(item.requiredFlag == '1' ? [{ required: true, message: el.name },
                                                            { validator: (value: any, rule: any) => validateFloatMaxNumber(value, rule, el) }] :
                                                        [] as any)">
                                                        <template #right-icon v-if="el.unit">{{ el.unit }}</template>
                                                    </van-field>
                                                    <span class="base-input-to" v-if="el.label && el.label != '0'">{{ el.label }}</span>
                                                </div>
                                            <!-- </van-field> -->
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'inputNumber'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <template v-if="el.type == '1'">
                                                <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                    <van-field type="number"
                                                        autocomplete="off"
                                                        v-model="configInfo[el.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                        class="error-tips" :name="item.requiredFlag == '1' ? el.key : ''"
                                                        :placeholder="el.name"
                                                        :rules="(item.requiredFlag == '1' ? [{ required: true, message: el.name },
                                                            { validator: (value: any, rule: any) => validateFloatMaxNumber(value, rule, el) }] :
                                                        [] as any)">
                                                        <template #right-icon v-if="el.unit">{{ el.unit }}</template>
                                                    </van-field>
                                                    <span class="base-input-to" v-if="el.label && el.label != '0'">{{ el.label }}</span>
                                                    <template v-if="item.key == 'pcbAQty'">
                                                        <span style="white-space: nowrap;margin-left: 5px;">{{ $t('onlineInfo.qtyFrom', { min: el.minLimit, max: el.maxLimit }) }}</span>
                                                    </template>
                                                </div>
                                            </template>
                                            <g-picker v-if="el.type == '2'"  style="width: 80px;" v-model:model-value="configInfo[el.key]"
                                                :data="
                                                    [{ text: 'mm', value: 'mm' },
                                                    { text: 'inch', value: 'inch' }]"
                                                @change="callBackHandle(el)"
                                                >
                                            </g-picker>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'textarea'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <!-- <van-field :prop="item.requiredFlag == '1' ? el.key : ''"
                                                :rules="item.requiredFlag == '1' ? { required: true, message: el.name+' is required', trigger: 'change' } : {}"
                                                style="width: 100%;"> -->
                                                <div class="base-input-item flex flex-start input-max-width" v-if="el.showFlag == '1'">
                                                    <van-field
                                                        rows="4"
                                                        type="textarea"
                                                        class="base-input-content"
                                                        v-model="configInfo[item.key]"
                                                        :disabled="el.disableFlag == '1'"
                                                        @change="callBackHandle(el)"
                                                        :show-word-limit="item.key == 'pcbRemarks'"
                                                        :maxlength="item.key == 'pcbRemarks' ? '500' : '1000000000'"
                                                        :placeholder="item.name"
                                                        :rules="item.requiredFlag == '1' ? [{ required: true, message: item.name }] : []"
                                                    ><template #append v-if="el.unit">{{ el.unit }}</template></van-field>
                                                    <span class="base-input-to" v-if="el.label && el.label != '0'">{{ el.label }}</span>
                                                </div>
                                            <!-- </van-field> -->
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'number'">
                                    <div class="base-input flex flex-start">
                                        <template :key="el.id" v-for="el in item.paramVos">
                                            <div class="base-input-item flex flex-start" v-if="el.showFlag == '1'">
                                                <van-stepper
                                                    controls-position="right"
                                                    class="base-input-content"
                                                    v-model="configInfo[el.key]"
                                                    :disabled="el.disableFlag == '1'"
                                                    @change="callBackHandle(el)"
                                                    input-width="235px"
                                                ></van-stepper>
                                                <span class="base-input-unit" v-if="el.unit">{{ el.unit }}</span>
                                                <span class="base-input-to" v-if="el.label && el.label != '0'">{{ el.label }}</span>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="item.type == 'quantity'">
                                    <div class="base-input flex flex-start">
                                            <!-- {{ configInfo[item.key] }} -->
                                        <div class="base-input-item">
                                            <!-- <van-stepper
                                                v-show="false"
                                                disabled
                                                controls-position="right"
                                                class="base-input-content"
                                                v-model="configInfo[item.key]"
                                                input-width="235px"
                                            ></van-stepper> -->
                                            <van-field readonly v-model="configInfo[item.key]" @click="showQuaity = true" :placeholder="item.name"
                                                :rules="item.requiredFlag == '1' ? [{ required: true, message: item.name }] : []"
                                            ></van-field>
                                            <van-popup v-model:show="showQuaity" position="bottom" closeable>
                                                <div class="quantity-title flex flex-start">{{ item.name }}</div>
                                                <van-radio-group class="select-pop-radio flex flex-start" v-model="configInfo[item.key]" direction="horizontal">
                                                    <template :key="el.id" v-for="el in item.paramVos">
                                                        <van-radio
                                                            border
                                                            :name="el.value"
                                                            v-if="el.showFlag == '1'"
                                                            :disabled="el.disableFlag == '1'"
                                                            @click="callBackHandle(el, true, item.type)"
                                                            :class="{'height-bg': heightBg, 'is-checked': el.value == configInfo[item.key]}"
                                                        >{{ el.value }}</van-radio>
                                                    </template>
                                                </van-radio-group>
                                            </van-popup>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="item.type == 'select'">
                                    <div class="base-input flex flex-start">
                                        <div class="base-input-item">
                                            <!-- <el-select v-model="configInfo[item.key]" clearable class="base-input-content">
                                                <template :key="el.value" v-for="el in item.paramVos">
                                                    <el-option
                                                        :label="el.name"
                                                        :value="el.value"
                                                        v-if="el.showFlag == '1'"
                                                        :disabled="el.disableFlag == '1'"
                                                        @click="callBackHandle(el)"
                                                    />
                                                </template>
                                            </el-select> -->
                                            <g-select-count :placeholder="item.name" v-model="configInfo[item.key]" :data="item.paramVos" :dataFormat="{text: 'name', value: 'value'}"
                                                @confirm="(el: any) => callBackHandle(el)"
                                            ></g-select-count>
                                        </div>
                                    </div>
                                </template>
                                <template v-if="item.type == 'upload'">
                                    <div class="base-input flex flex-start">
                                        <div class="base-input-item">
                                            <GUpload v-model="configInfo[item.key]" model="download">
                                                <div class="flex flex-start">
                                                    <van-icon name="photograph" size="20px" color="var(--el-color-primary)" style="margin-right: 5px;"/>
                                                    {{ item.name }}
                                                </div>
                                            </GUpload>
                                        </div>
                                    </div>
                                </template>
                            </template>
                        </van-field>
                    </template>
                    <template v-if="info.key == 'pcbA' && pcbA == '1'">
                        <div>
                            <van-checkbox v-model="agreePcb" :label="true" shape="square"><span style="color: #999;">{{$t('onlineInfo.iAgreeTo')}}</span>
                                <span style="margin-left: 5px;font-size: 16px;color: var(--el-color-primary);" class="hover-unline pointer" @click.stop="navigateTo('/help-document?id=13', {open: {target:'_blank'}})">{{$t('onlineInfo.theTermsAnd')}}</span>
                            </van-checkbox>
                        </div>
                        <van-button round type="primary" style="margin-top: 20px;height: 35px;" @click="nextHandle">{{ $t('confirm') }}</van-button>
                    </template>
                </div>
            </van-form>

            <div class="price-bottom-mask"></div>
            <div class="price-bottom flex flex-between">
                <div class="price-text">{{$t('onlineInfo.calculatePrice')}}</div>
                <div class="price-right flex flex-end">
                    <div class="price-value">{{useCurrencyInfo().value.value}}{{priceList.totalCost}}</div>
                    <van-button v-if="pcbA == '0'" round type="primary" :color="heightBg ? '#494949' : ''" @click="saveToCar">{{$t('save')}}</van-button>
                    <van-button v-else round type="primary" :color="heightBg ? '#494949' : ''" @click="nextHandle">{{$t('onlineInfo.next')}}</van-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts" name="OnlineCount">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
useHead({ title: () => t('onlinePricing') })
const formRef = ref()
const route = useRoute()
const pcbADetail = ref<any>()
const smt = ref<'0'|'1'>('0')
const pcbA = ref<'0'|'1'>('0')
const pcbFile = ref<any[]>([])
const singleSmt =  ref<'0'|'1'>('0')
const visible = ref<boolean>(false)
const agreePcb = ref<boolean>(true)
const heightBg = ref<boolean>(false)
const priceLoading = ref<boolean>(false)
const showQuaity = ref(false)
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
    // formSelectRef[type].blur()
    showQuaity.value = false
    // const crtObj = row.paramVos.find((v: any) => v.key == type)
    // if (crtObj) {
    //     callBackHandle(crtObj)
    // }
}

// 大于0的整数
const validateNumber = (value: any, rule: any) => {
    if (value < 0 || !validNumber(value)) {
        return t('onlineInfo.onlyIntegers')
    } else {
        return true
    }
}
// 大于0的整数、小数，并且不能大于xx
const validateFloatMaxNumber = (value: any, rule: any, item: any) => {
    if (value < 0) {
        return t('onlineInfo.onlyIntegersDecimals')
    } else if (item?.maxLimit && (Number(value) > Number(item.maxLimit))) {
        return t('onlineInfo.cannotGreater', { name: item.name || '', value: item.maxLimit + (['length', 'width'].includes(item.key) ? (configInfo.value['unit'] || '') : '') })
    } else if (item?.minLimit && (Number(value) < Number(item.minLimit))) {
        return t('onlineInfo.cannotLess', { name: item.name || '', value: item.minLimit + (['length', 'width'].includes(item.key) ? (configInfo.value['unit'] || '') : '') })
    } else {
        return true
    }
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
            // console.log(res.data)
            configInfo.value = res.data
            pcbFile.value = [{
                url: res.data.fileKey,
                key: res.data.fileKey,
                name: res.data.fileName,
                size: res.data.fileSize,
                type: res.data.fileSuffix,
            }]
            // nextTick(() => {
            if (configInfo.value.attachFiles) {
                configInfo.value.attach = res.data.attachFiles
            }
            configInfo.value = initConfig(configInfo.value)
            smt.value = configInfo.value.smt || '0'
            pcbA.value = configInfo.value.pcbA || '0'
            singleSmt.value = configInfo.value.singleSmt || '0'
            // })
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
        delete body.attachFiles
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
        delete body.attachFiles
    }
    $http('/purchase/count/params', {
        method: 'post',
        body
    }).then((res: any) => {
        configList.value = res.data

        // let param: any = deepClone(configInfo.value)
        const keyArr = Object.keys(deepClone(configInfo.value))
        const paramKeyArr: any[] = []
        configList.value.map((info: any) => {
            info?.paramVos?.length && info.paramVos.map((item: any) => {
                paramKeyArr.push(item.key)
                if (['radio','select','quantity','textarea','checkbox','number'].includes(item.type)) {
                    if (['checkbox'].includes(item.type) && item.defaultValue != undefined) {
                        configInfo.value[item.key] = item.defaultValue.includes(',') ? item.defaultValue.split(',') : [item.defaultValue]
                        // param[item.key] = deepClone(configInfo.value)[item.key].join(',')
                        // console.log(item.defaultValue, deepClone(configInfo.value))
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

const checkboxChange = (item: any) => {
    // 使用change方法，有checkbox组件时，会出现死循环，因为绑定的值发生变化时就会触发这个方法
    // const checkboxChange = (temp: any, item?: any) => {
    let val = deepClone(configInfo.value[item.key])
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
            heightBg.value = true
            // document.body.style = '--online-count-bg: #494949;';
            document.body.setAttribute('style', '--online-count-bg: #494949;')
        } else {
            heightBg.value = false
            // document.body.style = '--online-count-bg: #f1f3f6;';
            document.body.setAttribute('style', '--online-count-bg: #f1f3f6;')
        }
    }
})

const switchFlag = computed(() => (configInfo.value.width && Number(configInfo.value.width) >= 10) && (configInfo.value?.length && Number(configInfo.value?.length) >= 10) && configInfo.value.boardQuantity && pcbFile.value?.length)
watch(() => switchFlag.value, (newVal, oldVal) => {
    if (!newVal) {
        pcbA.value = '0'
    }
})

// 开关控制
const beforeChange = (newValue: any) => {
    return new Promise((resolve, reject) => {
        if (switchFlag.value) {
            // return resolve(true)
            pcbA.value = newValue
        } else {
            // return reject(new Error('false'))
            showDialog({
                message: `${t('onlineInfo.PCBAssemblyRequires')}\n${t('onlineInfo.PCBQtyCannot')}\n${t('onlineInfo.pcbUploadFile')}`,
            }).then(() => {
                // on close
            })
        }
    })
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
    if (el.disableFlag == '1') return;
    if (flag) configInfo.value[el.key] = el.value;
    if (type == 'quantity') {
        changeSelect(el.key)
    }
    const body = initConfig(deepClone(configInfo.value))
    if (el.callFlag == '1') {
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
        showToast(t('onlineInfo.byPlacingYour'))
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

const sumitHandle = () => {
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
    if (!useAccessToken().value) {
        // 未登录，保存下数据
        useOnlineData().value = body
        // console.log(useOnlineData().value)
    }
    if (route.query.id) {
        body.id = route.query.id
    }
    body.smt = singleSmt.value == '1' ? '1' : smt.value
    body.singleSmt = singleSmt.value
    // console.log(body)
    $http('/purchase/sale/add', {
        method: 'post', 
        loading: true,
        body
    }).then((res: any) => {
        navigateTo('/order/9')
        // navigateTo('/orders')
    })
}

// 保存到购物车
const saveToCar = () => {
    if (!pcbFile.value?.length && useAccessToken().value) {
        showToast(t('onlineInfo.pcbUploadFile'))
        return
    }
    formRef.value.submit()
}

onMounted(async () => {
    let isFirst = JSON.stringify(route.query) == '{}'
    // 首页带过来的数据
    if (!isFirst) {
        for (let key in route.query) {
            configInfo.value[key] = route.query[key] || undefined
        }
    }

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
.online-count {
    // display: flex;
    // justify-content: space-between;
    // align-items: flex-start;
    padding: 20px 0;

    .form-box {
        // max-width: 1000px;
        // flex: 1;
        // margin-right: 20px;

        .form-flex {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            :deep(.van-field__content) {
                // display: flex;
                flex-wrap: nowrap;
            }
        }

        .upload-card,
        .craft-info,
        .base-info {
            margin-bottom: 20px;
            background: #ffffff;
            border-radius: 10px;
            padding: 10px;

            > .van-cell::after {
                display: none;
            }

            .base-info-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                padding-bottom: 10px;
                border-bottom: 1px solid #f1f3f6;

                .pcb-assembly-free {
                    margin-right: 10px;
                    font-size: 12px;
                    font-weight: 400;
                }
            }

            :deep(.van-field__label--top) {
                flex: none;
                width: 100% !important;

                &.van-cell__title {
                    flex: none;
                    width: 100% !important;
                }

                .base-form-lable {
                    width: 100%;
                }
            }

            .base-input {
                width: 100%;

                .base-input-item {
                    flex: 1;
                    max-width: 300px;
                    padding-right: 3px;

                    > .van-field {
                        &::after {
                            display: block;
                        }
                    }
                    &.input-max-width {
                        max-width: 100%;
                    }

                    .base-field {
                        padding: 10px 16px;
                        border-bottom: 1px solid #ebedf0;
                        color: #323233;

                        &.place {
                            color: #cacacd;
                        }
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

                    .error-tips {
                        &::after {
                            content: "";
                            display: block;
                            position: absolute;
                            left: 0;
                            width: 100%;
                            border-bottom: 1px solid #000000;
                        }
                    }
                }
            }
        }
    }

    // .float-right {
    //     position: sticky;
    //     top: 0;
    //     width: 400px;

    //     .order-info {
    //         margin-bottom: 20px;

    //         .order-info-btn {
    //             display: block;
    //             width: 320px;
    //             height: 50px;
    //             margin: 0 auto;
    //             font-size: 18px;
    //             border-radius: 50px;
    //         }

    //         .order-info-title {
    //             display: flex;
    //             justify-content: space-between;
    //             align-items: center;
    //             margin-bottom: 20px;
    //             font-weight: 600;

    //             &.top-border {
    //                 margin-top: 10px;
    //                 padding-top: 20px;
    //                 border-top: 1px solid #f1f3f6;
    //             }

    //             &.price {
    //                 justify-content: flex-start;
    //                 &>div {
    //                     flex: 1;
    //                 }
    //             }
                
    //             .order-info-price {
    //                 color: red;
    //                 span {
    //                     text-decoration: line-through;
    //                     color: #999;
    //                 }
    //             }
    //         }

    //         .order-info-flex {
    //             display: flex;
    //             justify-content: flex-start;
    //             align-items: center;
    //             margin-bottom: 10px;
    //             font-size: 14px;

    //             .order-info-value,
    //             .order-info-label {
    //                 width: 50%;

    //                 .choose-address {
    //                     color: var(--el-color-primary);
    //                 }
    //             }
    //         }
    //     }
    // }

    .price-bottom-mask {
        height: 60px;
    }
    .price-bottom {
        position: fixed;
        bottom: 50px;
        left: 0;
        width: 100%;
        height: 60px;
        background: #ffffff;
        padding: 0 15px;
        font-size: 16px;
        box-shadow: 0 -1px 6px #AAAAAA;

        .price-right {
            .price-value {
                color: #ee0a24;
            }
            .van-button {
                height: 35px;
                margin-left: 10px;
            }
        }
    }

    .quantity-title {
        height: 50px;
        padding: 0 16px;
        border-bottom: 1px solid #f1f3f6;
        font-size: 18px;
        font-weight: 600;
    }

    .upload-card {
        :deep(.van-uploader),
        :deep(.van-uploader__upload) {
            width: 100%;

            .van-uploader__upload {
                margin-right: 0;
            }
        }
    }
}
</style>