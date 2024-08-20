<template>
    <el-dialog ref="formDialogRef"  :title="dialog.title" v-model="dialog.visible" width="600px"  @close="closeDialog">
        <el-tabs v-model="activeName" class="invite-tab" @tab-change="changeTab">
            <el-tab-pane label="默认链接" :name="0" v-loading="loading">
                <el-card class="link-card">
                    <div :class="`link-box global-flex flex-start ${status == '2' && 'finish'}`">
                        <div class="link-text">
                            <div class="text-overflow">{{showCurrentHostName}}</div>
                        </div>
                        <div class="link-copy pointer" v-if="status == '2'">链接已失效</div>
                        <div class="link-copy pointer" v-clipboard="() => showCurrentHostName" v-clipboard:success="copySuccess" v-else>复制链接</div>

                        <div class="link-code pointer" v-if="status == '2'"></div>
                        <el-popover
                            v-else
                            trigger="click"
                            placement="bottom"
                            popper-class="link-no-padding">
                            <img :src="codeImg" style="width: 200px;height: 200px;"/>
                            <template #reference><div class="link-code pointer"></div></template>
                        </el-popover>
                    </div>
                </el-card>
                <div class="link-finish-tip" v-if="status == '2'">*当前链接已失效，请重置链接</div>
                <el-form label-width="90px">
                    <div class="expiration-date global-flex flex-between">
                        <el-form-item label="设置有效期:">
                            <el-radio-group :disabled="status == '2'" v-model="effectiveDays" @change="handleEffectiveDaysChange">
                                <el-radio :label="1">1天</el-radio>
                                <el-radio :label="3">3天</el-radio>
                                <el-radio :label="7">7天</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div class="primary-color global-flex flex-end pointer">
                          <el-button type="primary" link size="large" :loading="loading" @click="reset()">重置链接</el-button>
                            <el-icon><RefreshRight /></el-icon>
                        </div>
                    </div>
                    <el-form-item label="生效时间:">{{createTime}}</el-form-item>
                    <el-form-item label="失效时间:">{{expireTime}}</el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="历史记录" :name="1">
                <XTable
                    border
                    height="395px"
                    :data="userList"
                    :pageShow="false"
                    ref="inviteUserTableRef"
                    :columnList="columnList"
                    :row-config="{ keyField: 'id' }">
                  <template #default-status="scope">
                    <div v-for="item in orderStatus">
                      <el-tag :type="item.type" size="small" v-if="item.value === scope.row.status">{{ item.label }}</el-tag>
                    </div>
                  </template>
                </XTable>
            </el-tab-pane>
        </el-tabs>
        <template #footer>
            <div class="dialog-footer" style="text-align: center;">
                <el-button :loading="loading" @click="cancel()">关闭</el-button>
<!--                <el-button :loading="loading" type="primary" @click="submitForm">确认修改</el-button>-->
            </div>
        </template>
    </el-dialog>
</template>

<script setup name="AuthRoleDialog" lang="ts">
import * as QRCode from "qrcode";
import { getShareUrl, resetLink, setExpireTime, shareRecordList } from "@/api/system/user";
import { ElMessageBox } from "element-plus";


const formDialogRef = ref()
const router = useRouter();
const { proxy } = getCurrentInstance()
const dialog = reactive({
    visible: false,
    title: '邀请员工'
});

const userId = ref('')
const codeImg = ref('')
const activeName = ref(0)
const effectiveDays = ref(1)
const currentHostName = ref('')
const showCurrentHostName = ref('')
const id = ref(0);
const createTime = ref('')
const expireTime = ref('')
const loading = ref(false)
const oldValue = ref(1)
const chooseRoleList = ref([])
const userList = ref([]);
const status = ref('0');
// 状态,0:生效中,2:已失效
// 单据状态
const orderStatus = ref([
  { type: "primary", label: "生效中", value: "0" },
  { type: "warning", label: "已失效", value: "2" },
]);

/** 处理有效期改变 */
const handleEffectiveDaysChange = async (newValue : any) => {
  loading.value = true;

  // 将createTime从字符串转换为Date对象
  const createTimeDate = new Date(createTime.value);

  // 创建一个新的Date对象，表示新的有效期
  const newExpireTime = new Date(createTimeDate.getTime());
  newExpireTime.setDate(createTimeDate.getDate() + newValue);

  // console.log('createTimeDate ',createTimeDate)
  // console.log('newExpireTime ',newExpireTime)
  // console.log('new ',new Date())
  // console.log('newValue ',newValue)
  // console.log('oldValue ',oldValue.value)

  // 如果新的有效期已经过去，显示一个提示
  if (newExpireTime < new Date()) {
    ElMessageBox.confirm(
      "选择该有效期会使当前链接提前失效，是否确认修改？",
      "修改确认",
      {
        confirmButtonText: "确认修改",
        cancelButtonText: "我再想想",
        type: "warning"
      }).then(() => {
        // 如果用户点击了确认修改按钮，执行下面的代码
        // 在这里调用 setExpireTime 接口
        setExpireTime(id.value, newValue).then(async (res) => {
          if (res.code == 200) {
            await dealRes(res);
            proxy?.$modal.msgSuccess('修改有效期成功')
          }
        }).finally(() => {
          loading.value = false;
        });
      },
      () => {
        // 如果用户点击了我再想想按钮，执行下面的代码
        effectiveDays.value = oldValue.value;
        loading.value = false;
      }
    );
  }else{
    // 如果新的有效期还没过去，直接调用 setExpireTime 接口
    const res = await setExpireTime(id.value, newValue).finally(() => {
      loading.value = false;
    });
    if (res.code == 200) {
      proxy?.$modal.msgSuccess('修改有效期成功')
    }
    await dealRes(res);
  }
}

/** 重置操作表单 */
const reset = async () => {
  loading.value = true;
  const res = await resetLink(id.value ,effectiveDays.value).finally(() => {
    loading.value = false;
  });
  if (res.code == 200) {
    proxy?.$modal.msgSuccess('重置链接成功')
  }
  await dealRes(res);
}

/** 处理响应数据 */
const dealRes = async (res:any) => {
  currentHostName.value = `${window.location.origin}/xcxEnter/` + res.data.id;
  showCurrentHostName.value = res.data.companyName + `${currentHostName.value}`;
  createTime.value = res.data.createTime;
  expireTime.value = res.data.expireTime;
  effectiveDays.value = res.data.effectiveDays;
  id.value = res.data.id;
  status.value = res.data.status;
  // 保存当前选择的值
  oldValue.value = res.data.effectiveDays;
  QRCode.toDataURL(currentHostName.value, { errorCorrectionLevel: 'H' }, (err: any, url: string) => {
    if (err) {
      console.log('Error: ' + err);
    } else {
      codeImg.value = url;
      console.log(url)
    }
  });

}


/** 取消按钮 */
const cancel = () => {
  dialog.visible = false;
  close();
}
/**
 * 关闭用户弹窗
 */
const closeDialog = () => {
  dialog.visible = false;
  close();
}

// 打开弹框
const open = (row?: any) => {
  dialog.visible = true;
  getShareUrlHandle()
}

// 获取默认链接
const getShareUrlHandle = async () => {
  loading.value = true;
  const res = await getShareUrl().finally(() => {
    loading.value = false;
  });
  await dealRes(res);
}

const columnList = ref([
  { title: '生成时间',width: "130", field: 'createTime', align: 'center' },
  { title: '链接',width: "300", field: 'linkStr', align: 'center' },
  { title: '状态',width: "68", field: 'status', align: 'center' },
  { title: '注册人数',width: "70", field: 'registeredUserNumber', align: 'center' },
])

const getList = async () => {
    loading.value = true;
    shareRecordList({}).then((res) => {
        // console.log(res)
        if (res.code == 200) {
          userList.value = res.rows
          userList.value.forEach((item: any) => {
            item.linkStr = item.companyName + `${window.location.origin}/xcxEnter/` + item.id;
            item.registeredUserNumber = item.registeredUserNumber ? item.registeredUserNumber : 0
          })
        }
    }).finally(() => {
        loading.value = false;
    })
};

/**
 * 标签页变更时触发刷新接口
 */
const changeTab = (name : any) => {
  // console.log('进入标签页变更方法')
  // console.log(name)
  if (name === 0) {
    getShareUrlHandle();
  } else if (name === 1) {
    getList();
  }
};

// 复制成功
const copySuccess = () => {
    proxy?.$modal.msgSuccess('复制成功')
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.invite-tab {
    height: 450px;

    .expiration-date {
        margin-top: 10px;
    }
    .el-form .el-form-item {
        margin-bottom: 0px;
    }

    :deep(.newVxeTable) {
        .XTable-header {
            display: none;
        }
    }
}
:deep(.link-card) {
    .el-card__body {
        padding: 15px !important;

        .link-box {
          &.finish {
            .link-text {
              color: #999;
              text-decoration: line-through;
            }
            .link-copy,
            .link-code {
              opacity: 0.5;
            }
          }

          .link-text {
              flex: 1;
              overflow: hidden;

              .text-overflow {
                  width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
              }
          }

          .link-copy {
              flex: none;
              height: 40px;
              padding: 0 10px;
              margin-left: 10px;
              background: var(--el-color-primary);
              color: #fff;
              line-height: 40px;
              border-radius: 5px;
              box-sizing: border-box;
          }

          .link-code {
              width: 40px;
              height: 40px;
              margin-left: 10px;
              background: url('@/assets/images/qrcode.png') no-repeat, var(--el-color-primary);
              background-size: 30px 30px;
              background-position: center center;
              border-radius: 5px;
          }
        }
    }
}

.link-finish-tip {
  margin: 5px 0 10px;
  font-size: 12px;
  color: rgba(246, 154, 35, 1);
}
</style>

<style>
.link-no-padding {
    width: 202px !important;
    height: 202px !important;
    padding: 0 !important;
    overflow: hidden;
}
</style>
