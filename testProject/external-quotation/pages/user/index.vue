<template>
    <div class="user table-page">
        <el-card class="user-card table-card">
            <template #header>
                <div class="card-header-title">{{$t('basicUserInformation')}}</div>
            </template>

            <div class="user-list">
                <div class="user-item">
                    <el-icon class="user-item-admin"><User /></el-icon>
                    <div class="user-item-info">
                        <!-- <div class="user-item-name">{{ userInfo().value?.userName }}</div> -->
                        <div class="user-item-name">{{$t('userPage.account')}}: {{ userInfo().value?.userName }}</div>
                    </div>
                    <div class="user-item-edit pointer" @click="openDiaLog(1)">{{$t('userPage.editPersonalInformation')}}</div>
                </div>
                <div class="user-item">
                    <div class="user-item-label">{{$t('userPage.accountEmail')}}</div>
                    <div class="user-item-content pointer">
                        <span class="email-primary">{{$t('userPage.main')}}:</span>
                        <span class="email-text">{{state.showEmail}}</span>
                        <el-icon class="email-icon" v-if="state.lookEmail" @click="emailShow(false)"><View /></el-icon>
                        <el-icon class="email-icon" v-else @click="emailShow(true)"><Hide /></el-icon>
                        <span class="email-status"><el-icon color="var(--el-color-success)"><SuccessFilled /></el-icon>{{$t('userPage.hasBeenVerified')}}</span>
                    </div>
                </div>
                <div class="user-item">
                    <div class="user-item-label">{{$t('login.password')}}</div>
                    <div class="user-item-content">******</div>
                    <div class="user-item-btn pointer" @click="openDiaLog(2)">{{$t('orderPage.edit')}}</div>
                </div>
                <div class="user-item">
                    <div class="user-item-label">{{$t('orderPage.shippingAddress')}}</div>
                    <div class="user-item-content">{{$t('userPage.addressToYour')}}</div>
                    <div class="user-item-btn pointer" @click="navigateTo('/address-manage')">{{$t('orderPage.edit')}}</div>
                </div>
                <div class="user-item">
                    <div class="user-item-label">{{$t('userPage.salesTaxCertificate')}}</div>
                    <div class="user-item-content">{{$t('userPage.manageYourSales')}}</div>
                    <div class="user-item-btn pointer" @click="openDiaLog(3)">{{$t('userPage.setting')}}</div>
                </div>
                <!-- <div class="user-item">
                    <div class="user-item-label">通知</div>
                    <div class="user-item-content">选择您希望从PCB收到的通知以及如何收到通知</div>
                    <div class="user-item-btn pointer" @click="openDiaLog(4)">设置</div>
                </div> -->
            </div>
        </el-card>

        <el-dialog v-model="state.dialogVisible" :title="state.dialogTitle" :width="[1,2].includes(state.dialogType) ? '600px' : '900px'">
            <el-form ref="formRef" :model="state.form" :rules="state.rules" label-width="140px">
                <template v-if="[1].includes(state.dialogType)">
                    <div class="user-edit-tips">{{$t('userPage.orderToProvide')}}</div>
                    <el-form-item :label="$t('userPage.accountType')" prop="accountType">
                        <el-select class="width-fill" v-model="state.form.accountType" :placeholder="$t('userPage.accountType')">
                            <el-option :label="$t('addressPage.company')" value="1"></el-option>
                            <el-option :label="$t('addressPage.individualCustomer')" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :label="$t('userPage.companyName')" prop="companyName" v-if="state.form.accountType == '1'">
                        <el-input v-model="state.form.companyName" :placeholder="$t('userPage.companyName')" maxlength="100" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('userPage.industry')" prop="industry">
                        <el-input v-model="state.form.industry" :placeholder="$t('userPage.industry')" show-word-limit maxlength="50"></el-input>
                        <!-- <el-select class="width-fill" v-model="state.form.industry" placeholder="Industry">
                            <el-option label="Industry" value="Industry"></el-option>
                            <el-option label="Industry1" value="Industry1"></el-option>
                        </el-select> -->
                    </el-form-item>
                    <el-form-item :label="$t('userPage.jobTitle')" prop="jobTitle">
                        <el-input v-model="state.form.jobTitle" :placeholder="$t('userPage.jobTitle')" show-word-limit maxlength="50"></el-input>
                        <!-- <el-select class="width-fill" v-model="state.form.jobTitle" placeholder="Job Title">
                            <el-option label="Job Title" value="Job Title"></el-option>
                            <el-option label="Job Title1" value="Job Title1"></el-option>
                        </el-select> -->
                    </el-form-item>
                </template>
                <template v-if="[2].includes(state.dialogType)">
                    <div class="user-edit-tips">{{$t('userPage.moreCharacters')}}</div>
                    <el-form-item :label="$t('login.oldPassword')" prop="oldPassword">
                        <el-input type="password" v-model="state.form.oldPassword" :placeholder="$t('login.oldPassword')" show-password></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('login.newPassword')" prop="newPassword">
                        <el-input type="password" v-model="state.form.newPassword" :placeholder="$t('login.newPassword')" show-password></el-input>
                    </el-form-item>
                    <el-form-item :label="$t('login.confirmPassword')" prop="confirmPassword">
                        <el-input type="password" v-model="state.form.confirmPassword" :placeholder="$t('login.confirmPassword')" show-password></el-input>
                    </el-form-item>
                    <div class="flex flex-end">
                        <div class="pointer hover-blue-unline" @click="navigateTo('/forgot')">{{$t('login.forgotPassword')}}</div>
                    </div>
                </template>
                <template v-if="[3].includes(state.dialogType)">
                    <div class="user-edit-tips">{{$t('userPage.areExemptFrom')}}</div>
                    <div class="user-edit-tips">
                        <el-button round type="primary" @click="voucher.open = true">{{$t('userPage.submitTax')}}</el-button>
                    </div>
                    <el-table scrollbar-always-on :data="state.dutyFreeTable">
                        <el-table-column :label="$t('userPage.sumittedDate')" prop="submitTime" width="130">
                            <template #="{ row }">
                                <span v-if="row.submitTime">{{ row.submitTime.split(' ')[0] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('userPage.exemptionCertificate')" prop="fileName">
                            <template #="{row}">
                                <span class="unline-blue" @click="previewFileHandle(row)">{{ row.fileName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('userPage.exposureZone')" prop="exposureZone"></el-table-column>
                        <el-table-column :label="$t('userPage.expirationDate')" prop="expirationTime" width="130">
                            <template #="{ row }">
                                <span v-if="row.expirationTime">{{ row.expirationTime.split(' ')[0] }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('userPage.status')" prop="state" width="90" align="center">
                            <template #="{row}">{{ row.state && $t(saleTaxStatusText[row.state]) }}</template>
                        </el-table-column>
                        <el-table-column :label="$t('orderPage.operation')" prop="make" width="85" align="center">
                            <template #="{row}">
                                <el-button v-if="!['1'].includes(row.state)" type="primary" @click="delVoucher(row)">{{$t('orderPage.delete')}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <!-- <template v-if="[4].includes(state.dialogType)">
                    <div class="user-edit-tips">选择您希望接收的电子邮件、系统消息或Chrome推送通知</div>
                    <el-table scrollbar-always-on :data="state.notifyTable">
                        <el-table-column label="在以下情况下通知我..." prop="name"></el-table-column>
                        <el-table-column label="电子邮件" prop="email">
                            <template #header>
                                <div class="user-notify-table-header">
                                    <el-checkbox v-model="state.emailFlag" @change="(value: any) => changeNotify(value, 'email')"></el-checkbox>电子邮件
                                </div>
                            </template>
                            <template #="{row}">
                                <el-checkbox v-model="row.email" :disabled="row.emailDisabled"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="短信" prop="msg">
                            <template #header>
                                <div class="user-notify-table-header">
                                    <el-checkbox v-model="state.msgFlag" @change="(value: any) => changeNotify(value, 'msg')"></el-checkbox>短信
                                    <el-tooltip content="提示">
                                        <el-icon style="margin: 0 20px 0 10px;" color="#999999"><QuestionFilled /></el-icon>
                                    </el-tooltip>
                                </div>
                            </template>
                            <template #="{row}">
                                <el-checkbox v-model="row.msg" :disabled="row.msgDisabled"></el-checkbox>
                            </template>
                        </el-table-column>
                        <el-table-column label="系统消息" prop="sys">
                            <template #header>
                                <div class="user-notify-table-header">
                                    <el-checkbox v-model="state.sysFlag" @change="(value: any) => changeNotify(value, 'sys')"></el-checkbox>系统消息
                                </div>
                            </template>
                            <template #="{row}">
                                <el-checkbox v-model="row.sys" :disabled="row.sysDisabled"></el-checkbox>
                            </template>
                        </el-table-column>
                    </el-table>
                </template> -->
            </el-form>
            <template #footer v-if="![3].includes(state.dialogType)">
                <span class="dialog-footer">
                    <el-button @click="cancelHandle">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="confirmHandle">{{$t('confirm')}}</el-button>
                </span>
            </template>
        </el-dialog>

        <el-dialog v-model="voucher.open" :title="voucher.title" width="650px">
            <el-form ref="voucherFormRef" :model="voucher.form" :rules="voucher.rules" label-width="140px">
                <el-form-item :label="$t('userPage.uploadCertificate')" prop="uploadCertificate">
                    <XUpload v-model:model-value="voucher.form.uploadCertificate" model="download" :fileType="['pdf','jpg']" :fileSize="10" :limit="1">
                        <template #tip><span style="margin-left: 10px;">{{$t('userPage.onlyaccpet')}}</span></template>
                    </XUpload>
                </el-form-item>
                <el-form-item :label="$t('userPage.exposureReason')" prop="exemptionReason">
                    <el-input v-model="voucher.form.exemptionReason" :placeholder="$t('userPage.exposureReason')" show-word-limit maxlength="50"></el-input>
                    <!-- <el-select v-model="voucher.form.exemptionReason" style="width: 100%;">
                        <el-option label="AGRICULTURE" value="AGRICULTURE"></el-option>
                        <el-option label="BANKING ONLY" value="BANKING ONLY"></el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item :label="$t('userPage.exposureZone')" prop="exposureZone">
                    <el-input v-model="voucher.form.exposureZone" :placeholder="$t('userPage.exposureZone')" show-word-limit maxlength="50"></el-input>
                    <!-- <el-select v-model="voucher.form.exposureZone" style="width: 100%;">
                        <el-option label="Alabama" value="Alabama"></el-option>
                        <el-option label="Alaska" value="Alaska"></el-option>
                    </el-select> -->
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('userPage.signedDate')" prop="signedDate">
                            <el-date-picker v-model="voucher.form.signedDate" value-format="YYYY-MM-DD" placeholder="YYYY-MM-DD"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('userPage.expirationDate')" prop="expirationTime">
                            <el-date-picker v-model="voucher.form.expirationTime" value-format="YYYY-MM-DD" placeholder="YYYY-MM-DD"/>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancelVoucherHandle">{{$t('cancel')}}</el-button>
                    <el-button type="primary" @click="confirmVoucherHandle">{{$t('confirm')}}</el-button>
                </span>
            </template>
        </el-dialog>
        
        <FilePreview ref="filePreviewRef"></FilePreview>
    </div>
</template>

<script setup lang="ts" name="User">
const { t } = useI18n()
definePageMeta({ layout: 'custom' })
useHead({ title: () => t('basicUserInformation') })

const filePreviewRef = ref()
const validatePass2 = (rule: any, value: any, callback: any) => {
    if (value !== state.form.newPassword) {
        callback(new Error(t('login.passNotMatch')))
    } else {
        callback()
    }
}
const validateExpriatTime = (rule: any, value: any, callback: any) => {
    let time1 = new Date(voucher.form.signedDate).getTime()
    let crtTime = new Date(value).getTime()
    if (crtTime <= time1) {
        callback(new Error(t('userPage.cannotbeearlier')))
    } else {
        callback()
    }
}

const formRef = ref()
const voucherFormRef = ref()
const state = reactive<Record<string, any>>({
    lookEmail: false,
    showEmail: '',
    dialogType: 1, // 1编辑个人资料  2修改密码  3证书管理  4选择接收通知的时间和方式
    dialogTitle: '',
    dialogVisible: false,
    form: {
        // 编辑个人资料
        accountType: undefined,
        companyName: undefined,
        industry: undefined,
        jobTitle: undefined,

        // 修改密码
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined,
    },
    rules: {
        accountType: [{ required: true, message: () => t('userPage.accountType'), trigger: 'change' }],
        companyName: [{ required: true, message: () => t('userPage.companyName'), trigger: 'blur' }],
        industry: [{ required: true, message: () => t('userPage.industry'), trigger: 'change' }],
        jobTitle: [{ required: true, message: () => t('userPage.jobTitle'), trigger: 'change' }],

        oldPassword: [
            { required: true, message: () => t('login.oldPassword'), trigger: 'blur' },
            { min: 8, max: 25, message: () => t('login.passLength'), trigger: 'blur' }
        ],
        newPassword: [
            { required: true, message: () => t('login.newPassword'), trigger: 'blur' },
            { min: 8, max: 25, message: () => t('login.passLength'), trigger: 'blur' }
        ],
        confirmPassword: [
            { required: true, message: () => t('login.confirmPassword'), trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur' }
        ],
    },
    dutyFreeTable: [],
    emailFlag: false,
    msgFlag: false,
    sysFlag: false,
    notifyTable: [
        // { name: '订单状态更新', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '文件审核结果', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '订单需要确认生产文件', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '订单已发货', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '订单数量不足的订单', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '订单异常', email: true, emailDisabled: false, msg: true, msgDisabled: false, sys: true, sysDisabled: false },
        // { name: '订单收取额外费用', email: true, emailDisabled: false, msg: true, msgDisabled: true, sys: true, sysDisabled: true },
        // { name: '订单待处理', email: true, emailDisabled: true, msg: true, msgDisabled: true, sys: true, sysDisabled: true },
        // { name: '订单被取消', email: true, emailDisabled: true, msg: true, msgDisabled: false, sys: true, sysDisabled: true },
    ]
})
const voucher = reactive<Record<string, any>>({
    open: false,
    title: 'Apply Tax Exempt',
    form: {
        uploadCertificate: [
            // {
            //     key: '1735917984114057217/00e35b53604648bf972e4eea7151082a_200319120534-7-1200.jpg',
            //     name: '200319120534-7-1200.jpg',
            //     size: 120,
            //     type: 'jpg'
            // }
        ],
        exemptionReason: undefined,
        exposureZone: undefined,
        signedDate: undefined,
        expirationTime: undefined,
    },
    rules: {
        uploadCertificate: [{ required: true, message: () => t('userPage.uploadCertificate'), trigger: 'change' }],
        exemptionReason: [{ required: true, message: () => t('userPage.exposureReason'), trigger: 'change' }],
        exposureZone: [{ required: true, message: () => t('userPage.exposureZone'), trigger: 'change' }],
        signedDate: [{ required: true, message: () => t('userPage.signedDate'), trigger: 'change' }],
        expirationTime: [
            { required: true, message: () => t('userPage.expirationDate'), trigger: 'change' },
            { validator: validateExpriatTime, trigger: 'change' }
        ],
    }
})

// 邮箱加密与否
const emailShow = (flag: boolean) => {
    state.lookEmail = flag
    if (state.lookEmail) {
        state.showEmail = userInfo().value.email
    } else {
        const end = userInfo().value.email.lastIndexOf('@')
        state.showEmail = textEncrypt(userInfo().value.email, 3, end != -1 ? end : 6)
    }
}

// 编辑用户信息
const editUser = (body: Record<string, any>) => {
    $http('/user/updateInfo', {
        method: 'post',
        loading: true,
        body
    }).then((res: any) => {
        // console.log(res.data)
        getInfo()
        cancelHandle()
    })
}

// 修改密码
const editPass = (body: Record<string, any>) => {
    $http('/user/updatePwd', {
        method: 'put',
        loading: true,
        body
    }).then((res: any) => {
        // console.log(res.data)
        // getInfo()
        logOut()
        cancelHandle()
    })
}

// 获取销售税
const getSaleProve = () => {
    $http('/purchase/saleProve/list', {
        method: 'get',
        loading: true,
    }).then((res: any) => {
        state.dutyFreeTable = res.data || []
    })
}

// 新增销售税
const addSaleProve = (body: Record<string, any>) => {
    $http('/purchase/saleProve/add', {
        method: 'post',
        loading: true,
        body
    }).then((res: any) => {
        voucher.open = false
        // state.dutyFreeTable = res.data || []
        getSaleProve()
    })
}


const confirmDel = (name: string) => {
    return new Promise((resolve, reject) => {
        ElMessageBox.confirm(
            // `确定删除${name}？`,
            t('userPage.sureToDelete', { name }),
            t('systemPrompt'),
            {
                cancelButtonText: t('cancel'),
                confirmButtonText: t('confirm'),
            }
        ).then(() => {
            resolve(true)
        }).catch(() => {
            reject(false)
        })
    })
}
// 删除销售税
const delVoucher = async (row: Record<string, any>) => {
    const flag = await confirmDel(row.fileName)
    if (!flag) return;
    const ids = [row.id]
    $http(`/purchase/saleProve/${ids}`, {
        method: 'delete',
        loading: true,
    }).then((res: any) => {
        // state.dutyFreeTable = res.data || []
        getSaleProve()
    })
}

const openDiaLog = (type: number, row?: any) => {
    state.dialogType = type
    if (state.dialogType == 1) {
        state.dialogTitle = t('userPage.editPersonalInformation')
        state.form.accountType = userInfo().value.accountType
        state.form.companyName = userInfo().value.companyName
        state.form.industry = userInfo().value.industry
        state.form.jobTitle = userInfo().value.jobTitle
    } else if (state.dialogType == 2) {
        state.dialogTitle = t('userPage.changePassword')
        if (userInfo().value?.grantType == 'email') {
            navigateTo('/forgot')
            return
        }
    } else if (state.dialogType == 3) {
        state.dialogTitle = t('userPage.certificateManagement')
        getSaleProve()
    }
    //  else if (state.dialogType == 4) {
    //     state.dialogTitle = '选择接收通知的时间和方式'
    // }
    state.dialogVisible = true
    nextTick(() => {
        if ([1,2].includes(state.dialogType)) {
            formRef.value.clearValidate()
        }
    })
}

// 关闭弹框
const cancelHandle = () => {
    state.dialogVisible = false
    for (let key in state.form) {
        state.form[key] = undefined
    }
}
// 确认弹框
const confirmHandle = () => {
    formRef.value.validate((val: boolean) => {
        if (val) {
            const params = deepClone(state.form)
            // console.log(params)
            // 1编辑个人资料  2修改密码  3证书管理  4选择接收通知的时间和方式
            if (state.dialogType == 1) {
                // params.id = state.tableData.length
                // state.tableData.push(params)
                editUser(params)
            } else if (state.dialogType == 2) {
                // const i = state.tableData.findIndex((v: any) => v.id == params.id)
                // state.tableData[i] = params
                editPass(params)
            }
            // cancelHandle()
        }
    })
}

// 销售税 弹框关闭
const cancelVoucherHandle = () => {
    voucher.open = false
    for (let key in voucher.form) {
        voucher.form[key] = undefined
    }
    voucher.form.uploadCertificate = []
}
// 销售税 弹框确定
const confirmVoucherHandle = () => {
    voucherFormRef.value.validate((val: boolean) => {
        if (val) {
            const {
                fileKey,
                fileName,
                fileSize,
                fileSuffix,
            } = fileDeal(voucher.form.uploadCertificate, 'object')
            const body = {
                signedDate: voucher.form.signedDate,
                expirationTime: voucher.form.expirationTime,
                fileKey,
                fileName,
                fileSize,
                fileSuffix,
                exemptionReason: voucher.form.exemptionReason,
                exposureZone: voucher.form.exposureZone,
            }
            // console.log(body)
            addSaleProve(body)
        }
    })
}

const previewFileHandle = (row: Record<string, any>) => {
    // console.log(row)
    getUrlByKeys(row.fileKey).then((data: string) => {
        // console.log(data)
        filePreviewRef.value.openViewer({
            url: data,
            name: row.fileName,
            index: 0,
            type: returnFileFormat(row.fileName),
            urlList: [data]
        })
    })
}

const changeNotify = (value: boolean, type: string) => {
    state.notifyTable = state.notifyTable.map((v: any) => {
        if (!v[type+'Disabled']) {
            v[type] = value
        }
        return v
    })
}

onMounted(() => {
    emailShow(false)
    // console.log((window as any).LC_API)
})
</script>

<style lang="scss" scoped>
.user {
    .user-card {
        .user-list {
            width: 100%;
            .user-item {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                min-height: 60px;
                padding: 30px 0;
                border-bottom: 1px solid #f5f5f5;

                .user-item-admin {
                    margin-right: 10px;
                    font-size: 50px;
                }

                .user-item-label {
                    flex: none;
                    width: 260px;
                    font-size: 16px;
                    font-weight: 600;
                }
                .user-item-content {
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;
                    flex: 1;

                    .email-primary {
                        margin-right: 10px;
                    }
                    .email-text {
                        min-width: 200px;
                        margin-right: 20px;
                    }
                    .email-icon {
                        margin-right: 20px;
                    }
                    .email-status {
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        .el-icon {
                            margin-right: 5px;
                        }
                    }
                }
                .user-item-edit,
                .user-item-btn {
                    min-width: 80px;
                    padding: 0 10px;
                    color: var(--el-color-primary);
                    text-align: center;
                }
                .user-item-edit {
                    margin-left: 10px;
                }
            }
        }
    }

    .user-edit-tips {
        margin-bottom: 20px;
    }

    .user-notify-table-header {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .el-checkbox {
            margin-right: 5px;
        }
    }
}
</style>