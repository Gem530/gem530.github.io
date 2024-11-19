<template>
    <div class="user">
        <div class="user-card table-card">
            <div class="user-info flex flex-between" @click="toAccount">
                <div class="user-info-left flex flex-start">
                    <van-icon name="user-circle-o" />
                    <div class="user-info-text" v-if="userInfo().value?.userName">{{ userInfo().value?.userName }}</div>
                    <template v-else>
                        <div class="user-info-text" @click.stop="navigateTo('/login')">{{ $t('login.signIn') }}</div>
                        <div class="user-info-text" @click.stop="navigateTo('/register')">{{ $t('login.signUp') }}</div>
                    </template>
                </div>
                <van-icon name="arrow" />
            </div>

            <van-cell :title="$t('orderPage.myOrder')" is-link to="/order/0" />
            <van-cell :title="$t('aboutUs')" is-link to="/company-introduct" />
            <van-cell :title="$t('helpPage.tip441')" is-link to="/help-document?id=11" />
            <van-cell :title="$t('directPage.title')" is-link to="/direct-ceo" />
            <van-cell :title="$t('languageSwitching')" is-link to="/language-switching" />
            <van-cell :title="$t('contactUs')" value="market@pcbsuper.com" />
        </div>

        <FilePreview ref="filePreviewRef"></FilePreview>
    </div>
</template>

<script setup lang="ts" name="User">
const { t } = useI18n()
definePageMeta({ layout: 'empty' })
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

const checked = ref(false)

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
    if (!userInfo().value?.email) return
    state.lookEmail = flag
    if (state.lookEmail) {
        state.showEmail = userInfo().value?.email
    } else {
        const end = userInfo().value?.email.lastIndexOf('@')
        state.showEmail = textEncrypt(userInfo().value?.email, 3, end != -1 ? end : 6)
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
        showConfirmDialog({
            // `确定删除 ${row.code} 订单吗？`,
            message: t('userPage.sureToDelete', { name }),
            title: t('systemPrompt'),
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: t('confirm'),
            cancelButtonText: t('cancel'),
        }).then(() => {
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

// 跳转我的信息
const toAccount = () => {
    if (userInfo().value?.userName) {
        navigateTo('/user-info')
    }
}

// 跳转pc文章链接
const toUrl = (path: string) => {
    window.open(path)
}
// 打开pc端窗口
const changeDesktop = (value: any) => {
    if (value) {
        location.href = 'https://www.pcbsuper.com/'
    }
}

onMounted(() => {
    emailShow(false)
})
</script>

<style lang="scss" scoped>
.user {
    background: #f1f3f6;
    .user-card {

        .user-info {
            height: 144px;
            background: #ffffff;
            padding: 0 16px;
            margin-bottom: 20px;
            font-size: 22px;
            .user-info-left {
                .van-icon {
                    font-size: 50px;
                }

                .user-info-text {
                    margin-left: 10px;

                    &:not(:last-child) {
                        padding-right: 10px;
                        border-right: 1px solid #333;
                    }
                }
            }
        }

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

    .desktop-box {
        .van-icon {
            margin-left: 10px;
            font-size: 20px;
        }
    }
}
</style>