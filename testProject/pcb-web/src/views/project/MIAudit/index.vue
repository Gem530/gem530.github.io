<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <el-tabs v-model="currentType" type="border-card" @tab-click="handleClick" class="xtable-tab">
        <el-tab-pane label="正常订单" :name="0">
          <div style="padding-bottom: 10px">
            <span>提交开始日期 </span>
            <el-date-picker size="small"
                            style="width: 150px"
                            v-model="queryParams.submitTimeStart"
                            type="datetime"
                            placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
            <span>提交结束日期 </span>
            <el-date-picker size="small"
                            style="width: 150px"
                            v-model="queryParams.submitTimeEnd"
                            type="datetime"
                            placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
            <el-button class="ml-2" type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          </div>
          <XTable :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
                  :loading="loading"
                  :intervalCondition="['createTime','dispatchTime','submitTime']"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="productionPlanList"
                  :columnList="columnList" toolId="MIAudit"
                  border :showRefresh="true"
                  @searchChange="searchChange"
                  :row-style="tableRowClassName"
                  :column-config="{ resizable: true }"
                  ref="xTableRef">

                  <template #header-eqHours="scope">
                    EQ时长(H)
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      raw-content
                      :content="`累计的EQ时长`"
                    >
                      <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </template>

            <template #default-planType="scope">
              <div v-for="item in mi_type">
                <span v-if="scope.row.planType == item.value">{{item.label}}</span>
              </div>
            </template>

            <template #default-orderType="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span v-for="info in resDictData.order_type">
            <span v-if="info.dictValue == item.orderType">{{ info.dictLabel }}</span>
          </span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="editMi(scope.row)">审核
              </el-button>
              <el-button link type="primary" @click="doMIPrint(scope.row,'noOutsideImages')">MI详情</el-button>
              <el-button link type="primary" @click="openFile(scope.row)">文件下载
              </el-button>
              <el-button v-if="scope.row.isHighLight=='0'" link type="primary"   @click="heightLightRow(scope.row)">高亮
              </el-button>
              <el-button v-else link type="primary"   @click="removeHeightLightRow(scope.row)">取消高亮
              </el-button>
              <el-button type="primary" link @click="EQPlanRecord(scope.row)">EQ记录</el-button>
            </template>

          </XTable>
        </el-tab-pane>
        <el-tab-pane label="其他订单" :name="1">
          <div style="padding-bottom: 10px">
            <span>提交开始日期 </span>
            <el-date-picker size="small"
                            style="width: 150px"
                            v-model="queryParamsOther.submitTimeStart"
                            type="datetime"
                            placeholder="选择开始时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
            <span>提交结束日期 </span>
            <el-date-picker size="small"
                            style="width: 150px"
                            v-model="queryParamsOther.submitTimeEnd"
                            type="datetime"
                            placeholder="选择结束时间" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss"/>
            <el-button class="ml-2" type="primary" icon="Search" @click="handleQueryOther">搜索</el-button>
          </div>
          <XTable :pageShow="true" v-model:page-size="queryParamsOther.pageSize" height="100%" class="xtable-content"
                  :loading="loading"
                  :intervalCondition="['createTime','dispatchTime','submitTime']"
                  v-model:current-page="queryParamsOther.pageNum"
                  :page-params="{ perfect: true, total: otherTotal }"
                  :data="productionPlanOtherList"
                  :columnList="columnOtherList" toolId="MIAuditOther"
                  border :showRefresh="true"
                  @searchChange="searchChangeOther"
                  :row-style="tableRowClassName"
                  :column-config="{ resizable: true }"
                  ref="xTableRef2">


                  <template #header-eqHours="scope">
                    EQ时长(H)
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      raw-content
                      :content="`累计的EQ时长`"
                    >
                      <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </template>

            <template #default-planType="scope">
              <div v-for="item in mi_type">
                <span v-if="scope.row.planType == item.value">{{item.label}}</span>
              </div>
            </template>

            <template #default-orderType="scope">
        <span v-for="(item, index) in scope.row.saleOrderVoList">
          <span v-for="info in resDictData.order_type">
            <span v-if="info.dictValue == item.orderType">{{ info.dictLabel }}</span>
          </span>
          <span v-if="index != scope.row.saleOrderVoList.length - 1">-</span>
        </span>
            </template>

            <template #default-make="scope">
              <el-button link type="primary" @click="editMi(scope.row)">审核
              </el-button>
              <el-button link type="primary" @click="doMIPrint(scope.row,'noOutsideImages')">MI详情</el-button>
              <el-button link type="primary" @click="openFile(scope.row)">文件下载
              </el-button>
              <el-button v-if="scope.row.isHighLight=='0'" link type="primary"   @click="heightLightRow(scope.row)">高亮
              </el-button>
              <el-button v-else link type="primary"   @click="removeHeightLightRow(scope.row)">取消高亮
              </el-button>
              <el-button size="small" type="primary" :text="true" @click="EQPlanRecord(scope.row)">EQ记录</el-button>
            </template>

          </XTable>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- mi工艺单编辑对话框 -->
    <ProductionPlanDrawer v-model:open="miEditDrawer" :crtMiInfo="crtMiInfo" type="examine"
                          @saveFinish="refreshList"></ProductionPlanDrawer>
    <MIPrint ref="MIAuditMIPrintRef"  ></MIPrint>

    <el-drawer :title="fileDialog.title" v-model="fileDialog.visible" size="60%" visible.sync="false" draggable :destroy-on-close="true">
      <el-tabs type="border-card"  v-model="fileTab" class="xtable-tab"  >
        <el-tab-pane label="TGZ文件" name="TGZ文件">
          <XTable  :pageShow="false"
                   class="xtable-content" :loading="loading" :data="filesDataObj.tgzFileList" :show-footer="false"
                   :columnList="fileColumnList" ref="fileleteTableRef1" border :column-config="{ resizable: true }"
                   :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
            <template #default-fileName="scope">
              <XUpload v-model:model-value="scope.row.sysFileVo" model="download" :limit="1" readOnly></XUpload>
            </template>
            <template #default-src="scope">
              <ImagePreview
                v-if="scope.row.sysFileVo?.length"
                :width="100"
                :height="100"
                :src="scope.row.sysFileVo[0].url"
                :type="scope.row.sysFileVo[0].type"
                :preview-src-list="[scope.row.sysFileVo[0].url]"
              />
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="downLoadHandle(scope.row.key)">下载</el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="MI文件" name="MI文件">
          <XTable  :pageShow="false"
                   class="xtable-content" :loading="loading" :data="filesDataObj.miFileList" :show-footer="false"
                   :columnList="fileColumnList" ref="fileleteTableRef1" border :column-config="{ resizable: true }"
                   :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
                   <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="开料方案" name="开料方案">
          <XTable :pageShow="false"   class="xtable-content" :loading="loading" :data="filesDataObj.schemeFileVos" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef2" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true  }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="工序文件" name="工序文件">
          <XTable :pageShow="false"   class="xtable-content" :loading="loading" :data="filesDataObj.craftFileVos" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef3" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true  }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="工模治具" name="工模治具">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.modelFileVos" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef4" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="层压结构" name="层压结构">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.laminatedFileVos" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef5" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,   }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="外形图" name="外形图">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.outSideFileList" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef6" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,   }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>

        <el-tab-pane label="产品文件" name="产品文件">
          <XTable :pageShow="false"  class="xtable-content" :loading="loading" :data="filesDataObj.saleOrderFileVos" :show-footer="false"
                  :columnList="fileColumnList" ref="fileleteTableRef7" border :column-config="{ resizable: true }"
                  :row-config="{ keyField: 'id' }" :page-params="{ perfect: true,  }">
                  <template #default-fileName="scope">
                    {{ scope.row.sysFileVo[0].name }}
                  </template>
                  <template #default-src="scope">
                    <ImagePreview
                      v-if="scope.row.sysFileVo?.length"
                      :width="100"
                      :height="100"
                      :src="scope.row.sysFileVo[0].url"
                      :type="scope.row.sysFileVo[0].type"
                      :preview-src-list="[scope.row.sysFileVo[0].url]"
                    />
                  </template>
                  <template #default-make="scope">
                    <el-button link type="primary" @click="downLoadHandle(scope.row.sysFileVo[0].key)">下载</el-button>
                  </template>
          </XTable>
        </el-tab-pane>

      </el-tabs>

      <template #footer>
        <div class="dialog-footer" style="text-align: center">
          <el-button @click="cacelFile">取 消</el-button>
          <!-- <el-button type="primary" >下载全部</el-button> -->
        </div>
      </template>
    </el-drawer>


      <!-- EQ记录 -->
      <el-dialog :title="eqdialog.title" v-model="eqdialog.visible" destroy-on-close width="60%" @close="eqdialog.visible=false">
      <XTable toolId="planAuditEqReored" v-model:page-size="eqQueryParams.pageSize"
            v-model:current-page="eqQueryParams.pageNum" height="500" class="xtable-content"
            :page-params="{ perfect: true, total: eqtotal }" :data="eqList" :columnList="eqColumnList"
            :loading="eqloading" :showRefresh="true"
            :intervalCondition="['eqStartTime','eqEndTime']"
            border @searchChange="eqSearchChange" :column-config="{ resizable: true }"
            :row-config="{ keyField: 'id' }">

            <template #default-isAutoClose="scope">
              {{ scope.row.eqEndTime?(scope.row.isAutoClose=='0'?'否':'是'):'' }}
            </template>
            <template #header-isAutoClose="scope">
              是否自动关闭
              <el-tooltip
                class="box-item"
                effect="dark"
                raw-content
                :content="`MI审核通过时会触发自动关闭EQ，同时EQ结束人为MI审核人`"
              >
                <el-icon class="tooltip-width-auto" ><QuestionFilled /></el-icon>
              </el-tooltip>
            </template>
      </XTable>
  </el-dialog>

  </div>
</template>

<script setup name="MIAudit" lang="ts">
  import {
    getProductionPlan,
    addProductionPlan,
    updateProductionPlan,
    listAudit,
    doHeightLightRow,
    doRemoveHeightLightRow
  } from '@/api/project/productionPlan';
  import {ProductionPlanVO, ProductionPlanQuery, ProductionPlanForm} from '@/api/project/productionPlan/types';
  import {ref} from "vue";
  import dayjs from "dayjs";
  import {getProjectFile} from "@/api/report/inProgressOrder";
import { deepClone } from '@/utils';
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {listEQList} from "@/api/project/assignTask";
  import { decryptBase64ByStr } from '@/utils/crypto'

  const MIAuditMIPrintRef = ref();
  const {proxy} = getCurrentInstance() as ComponentInternalInstance;

  const productionPlanList = ref<ProductionPlanVO[]>([]);
  const productionPlanOtherList = ref<ProductionPlanVO[]>([]);
  const buttonLoading = ref(false);
  const loading = ref(true);
  const showSearch = ref(true);
  const ids = ref<Array<string | number>>([]);
  const single = ref(true);
  const multiple = ref(true);
  const total = ref(0);
  const otherTotal = ref(0);
  const queryFormRef = ref<ElFormInstance>();
  const productionPlanFormRef = ref<ElFormInstance>();
  let currentType = ref(0);

  const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const drawer = reactive<DrawerOption>({
    visible: false,
    title: '',
    direction: "rtl",
  });

  let resDictData = ref({
    // //工艺单状态
    // mi_status: [],
    //订单类型
    order_type: [],
    // //MI类型
    // mi_type: [],
    // //批量/样品
    // order_model: [],
    // //加急
    // order_urgent: [],
    // //产品类型
    // sys_commodity_type: [],
    // //表面处理
    // order_surface_treatment: [],
    // //板材
    // order_material_quality: [],
    // //品牌
    // order_plate_brand: [],
    // //级别
    // order_material_level: [],
    // //板厚
    // finish_plate_thickness: [],
    // //外层铜厚
    // order_material_copperoutside: [],
    // //内层铜厚
    // order_material_copperinside: [],
    // //阻焊颜色
    // order_commodity_solder: [],
    // //字符
    // order_character: [],
    // //过孔要求
    // order_hole_requirement: [],

  })
  const xTableRef = ref();
  const xTableRef2 = ref();
  const route = useRoute();
  /**
   * 进入页面次数
   */
  const isFirst = ref(0)
  /**
   * 待办跳转参数
   */
  const pendingParams = ref()
  /*获取字典数据*/
  const getDictData = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "order_type";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData.value).forEach(dictItem => {
            if (item == dictItem) {
              resDictData.value[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
  }

  //MI类型
  const {mi_type} = toRefs<any>(proxy?.useDict('mi_type'));

  const initFormData: ProductionPlanForm = {
    id: undefined,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    name: undefined,
    remark: undefined,
    auditUserId: undefined,
    auditUserName: undefined,
    auditTime: undefined,
    code: undefined,
    planType: undefined,
    status: undefined,
    submitTime: undefined,
    preFeedTime: undefined,
    preFeedUserId: undefined,
    preFeedUserName: undefined,
    preFeedAuditUserId: undefined,
    preFeedAuditUserName: undefined
  }

  let initQueryParams = {
    pageNum: 1,
    pageSize: 20,
    submitTimeStart: dayjs(new Date()).subtract(1, "month").format("YYYY-MM-DD 00:00:00"),
    submitTimeEnd: dayjs(new Date()).format("YYYY-MM-DD 23:59:59"),
    orderType : undefined,
  }
  const data = reactive<PageData<ProductionPlanForm, any>>({
    form: {...initFormData},
    queryParams: {
      ...initQueryParams,
      isNormal: '1'
    },
    rules: {
      id: [
        {required: true, message: "$comment不能为空", trigger: "blur"}
      ],
      createDeptName: [
        {required: true, message: "创建部门名称不能为空", trigger: "blur"}
      ],
      createByName: [
        {required: true, message: "创建者名称不能为空", trigger: "blur"}
      ],
      updateByName: [
        {required: true, message: "更新者名称不能为空", trigger: "blur"}
      ],
      name: [
        {required: true, message: "工艺名称不能为空", trigger: "blur"}
      ],
      remark: [
        {required: true, message: "工程备注不能为空", trigger: "blur"}
      ],
      auditUserId: [
        {required: true, message: "审核人id不能为空", trigger: "blur"}
      ],
      auditUserName: [
        {required: true, message: "审核人名字不能为空", trigger: "blur"}
      ],
      auditTime: [
        {required: true, message: "审核时间不能为空", trigger: "blur"}
      ],
      code: [
        {required: true, message: "MI编码不能为空", trigger: "blur"}
      ],
      planType: [
        {required: true, message: "MI类型不能为空", trigger: "change"}
      ],
      status: [
        {required: true, message: "状态不能为空", trigger: "change"}
      ],
      submitTime: [
        {required: true, message: "提交时间不能为空", trigger: "blur"}
      ],
      preFeedTime: [
        {required: true, message: "预投时间不能为空", trigger: "blur"}
      ],
      preFeedUserId: [
        {required: true, message: "预投人ID不能为空", trigger: "blur"}
      ],
      preFeedUserName: [
        {required: true, message: "预投人名字不能为空", trigger: "blur"}
      ],
      preFeedAuditUserId: [
        {required: true, message: "预投审核人ID不能为空", trigger: "blur"}
      ],
      preFeedAuditUserName: [
        {required: true, message: "预投审核人名字不能为空", trigger: "blur"}
      ]
    }
  });

  const intervalDateParam = ref({clearable: true, type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'})

  const planTypeOptions = ref([
    { value: "1", label: "单品" },
    { value: "2", label: "拼板" },
  ])

  const columnList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '制单人', field: 'miUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入制单人'}},
    {title: '客户编码', field: 'customerCode', align: 'center'},
    {
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      title: '新/返', field: 'orderType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },    {
      title: 'MI类型',
      field: 'planType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择MI类型'},
      filterData: () => [{label: "全部", value: "",}, ...planTypeOptions.value],
    },
    {
      title: '工厂交期', field: 'dispatchTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {title: 'EQ时长(H)', width: '90', field: 'eqHours', showHeaderOverflow: false, align: 'center'},
    {title: '提交人', field: 'updateByName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入提交人'}},
    {
      title: '提交时间', field: 'submitTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {
      title: '创建时间', field: 'createTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {title: '备注', field: 'remark', align: 'center'},
    {title: '操作', field: 'make', align: 'center', fixed: 'right', width: 300},
  ]);

  const columnOtherList = ref([
    {title: "序号", type: 'seq', align: 'center', width: '60'},
    {title: '制单人', field: 'miUserName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入制单人'}},
    {title: '客户编码', field: 'customerCode', align: 'center'},
    {
      title: '产品编码',
      field: 'commodityCode',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品编码'}
    },
    {
      title: '产品名称',
      field: 'commodityName',
      align: 'center',
      filterType: 'input',
      filterParam: {placeholder: '请输入产品名称'}
    },
    {
      title: '新/返', field: 'orderType', align: 'center', filterType: 'radioButton',
      filterParam: {placeholder: '请输入新/返'},
      filterData: () => [{dictLabel: "全部", dictValue: "",}, ...resDictData.value.order_type],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
    },
    {
      title: 'MI类型',
      field: 'planType',
      align: 'center',
      filterType: 'radioButton',
      filterParam: {placeholder: '请选择MI类型'},
      filterData: () => [{label: "全部", value: "",}, ...planTypeOptions.value],
    },
    {
      title: '工厂交期', field: 'dispatchTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },

    {title: 'EQ时长(H)', width: '90', field: 'eqHours', showHeaderOverflow: false, align: 'center'},
    {
      title: '提交时间', field: 'submitTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {
      title: '创建时间', field: 'createTime', align: 'center', filterType: 'intervalDate',
      filterParam: {
        startParams: {placeholder: '请输入开始时间', ...intervalDateParam.value},
        endParams: {placeholder: '请输入结束时间', ...intervalDateParam.value},
      }
    },
    {title: '备注', field: 'remark', align: 'center'},
    {title: '操作', field: 'make', align: 'center', fixed: 'right', width: '300'},
  ]);


  const {queryParams, form, rules} = toRefs(data);

  const queryParamsOther = ref({
    ...initQueryParams,
    isNormal: '0'
  })

  // 获取 搜索条件
  const searchChange = (params: any) => {
    const { submitTimeEnd, submitTimeStart } = deepClone(queryParams.value)
    queryParams.value = params;
    queryParams.value.submitTimeEnd = submitTimeEnd
    queryParams.value.submitTimeStart = submitTimeStart
    getList();
  }

  // 获取 搜索条件
  const searchChangeOther = (params: any) => {
    const { submitTimeEnd, submitTimeStart } = deepClone(queryParamsOther.value)
    queryParamsOther.value = params;
    queryParamsOther.value.submitTimeEnd = submitTimeEnd
    queryParamsOther.value.submitTimeStart = submitTimeStart
    getOtherList();
  }

  const handleClick = (pane: any, ev: any) => {
    if (pane.index == 0) {
      currentType.value = 0;
      getList();
    } else {
      currentType.value = 1;
      getOtherList();
    }
  }

  const refreshList = ()=>{
    if(currentType.value == 0){
      getList();
    } else {
      getOtherList();
    }
  }

  /** 查询工程-mi审核列表 */
  const getList = async () => {
    loading.value = true;
    queryParams.value.isNormal = '1';
    const res = await listAudit(queryParams.value);
    productionPlanList.value = res.rows;
    total.value = res.total;
    loading.value = false;
  }

  /** 查询工程-其他mi审核列表 */
  const getOtherList = async () => {
    loading.value = true;
    queryParamsOther.value.isNormal = '0';
    const res = await listAudit(queryParamsOther.value);
    productionPlanOtherList.value = res.rows;
    otherTotal.value = res.total;
    loading.value = false;
  }

  const miEditDrawer = ref(false);
  const crtMiInfo = ref();

  /** 审核按钮操作 */
  const editMi = async (row?: any) => {
    miEditDrawer.value = true
    crtMiInfo.value = row
  }

  const openFileList = (row: any) => {
    drawer.visible = true;
  }

  /** 取消按钮 */
  const cancel = () => {
    reset();
    dialog.visible = false;
  }

  /** 表单重置 */
  const reset = () => {
    form.value = {...initFormData};
    productionPlanFormRef.value?.resetFields();
  }

  /** 搜索按钮操作 */
  const handleQuery = () => {
    queryParams.value.pageNum = 1;
    getList();
  }

  const handleQueryOther = () => {
    queryParamsOther.value.pageNum = 1;
    getOtherList();
  }

  /** 多选框选中数据 */
  const handleSelectionChange = (selection: ProductionPlanVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
  }

  /** 新增按钮操作 */
  const handleAdd = () => {
    reset();
    dialog.visible = true;
    dialog.title = "添加工程-mi制作单";
  }

  /** 修改按钮操作 */
  const handleUpdate = async (row?: ProductionPlanVO) => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getProductionPlan(_id);
    Object.assign(form.value, res.data);
    dialog.visible = true;
    dialog.title = "修改工程-mi制作单";
  }

  /** 提交按钮 */
  const submitForm = () => {
    productionPlanFormRef.value?.validate(async (valid: boolean) => {
      if (valid) {
        buttonLoading.value = true;
        if (form.value.id) {
          await updateProductionPlan(form.value).finally(() => buttonLoading.value = false);
        } else {
          await addProductionPlan(form.value).finally(() => buttonLoading.value = false);
        }
        proxy?.$modal.msgSuccess("修改成功");
        dialog.visible = false;
        await refreshList();
      }
    });
  }

  /** 导出按钮操作 */
  const handleExport = () => {
    proxy?.download('project/productionPlan/export', {
      ...queryParams.value
    }, `productionPlan_${new Date().getTime()}.xlsx`)
  }
  const doMIPrint = async (data: any, type: string) => {
    await MIAuditMIPrintRef.value.doPrint(data.id, type);
  }

  /** 文件 */
  const fileDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });
  const cacelFile = () => {
    filesDataObj.value = [];
    fileDialog.visible = false;
  }
  const filesDataObj = ref<any>([]);
  const fileTab = ref('TGZ文件');
  const fileColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '工序名称', width: '120', field: 'craftName', align: 'center', visible: false},
    {title: '开料方案', width: '120', field: 'schemeName', align: 'center', visible: false},
    {title: '物料编码', width: '120', field: 'materialNumber', align: 'center', visible: false},
    {title: '物料名称', width: '120', field: 'materialName', align: 'center', visible: false},
    {title: '产品名称', width: '120', field: 'commodityCode', align: 'center', visible: false},
    {title: '文件名称', field: 'fileName', align: 'center'},
    {title: '缩略图', field: 'src', align: 'center', showOverflow: false},
    {title: '文件大小', width: '80', field: 'size', align: 'center'},
    {title: '上传人', width: '80', field: 'createByName', align: 'center'},
    {title: '上传时间', width: '140', field: 'createTime', align: 'center'},
    {title: '操作', width: '80', field: 'make', align: 'center'},
  ]);


  const openFile = async (row: any) => {
    fileDialog.title = "工程文件";
    fileDialog.visible = true;

    let query={
      planId: row.id
    }
    filesDataObj.value=await getProjectFile(query);
    if(filesDataObj.value.miFileList){
      filesDataObj.value.miFileList.forEach((item:any)=>{
        item.sysFileVo=[item];
      })
    }
    if(filesDataObj.value.outSideFileList){
      filesDataObj.value.outSideFileList.forEach((item:any)=>{
        item.sysFileVo=[item];
      })
    }
    if(filesDataObj.value.tgzFileList){
      filesDataObj.value.tgzFileList.forEach((item:any)=>{
        item.sysFileVo=[item];
      })
    }
  }

  const tableRowClassName = (scope: any) => {
    if (scope.row.isHighLight=='1') {
      return {
        //backgroundColor: '#FFB6C1'
        backgroundColor: 'rgb(250, 236, 216)'
      }
    }
    return ''
  }

  const heightLightRow = async (row: any) => {
    await doHeightLightRow(row.id);
    await refreshList();
  }

  const removeHeightLightRow = async (row: any) => {
    await doRemoveHeightLightRow(row.id);
    await refreshList();
  }

  import useUserStore from "@/store/modules/user";
  import {updateOrder} from "@/api/order/directOrder";
  import {ElMessage} from "element-plus";
  import {updateEq} from "@/api/project/assignTask";
  import {addFile, deleteFile, getFileList} from "@/api/upload";
  import fileSaver from "file-saver";
  import {downloadUrl} from '@/api/upload/index';

      // 文件下载
  const downLoadHandle = (key: string) => {
    let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
    console.log(key)
    downloadUrl(key).then(res => {
      loadingBox.close()
      if (res.code == 200) {
        const { data } = res
        // window.open(data[key])
        fileSaver.saveAs(data[key])
      }
    }).catch((err) => {
      loadingBox.close()
    })
  }


  const eqPlanId = ref();
  const eqList = ref<any>([]);
  const eqtotal = ref(0);
  const eeqloading = ref(false);
  const eqdialog = reactive<DialogOption>({
    visible: false,
    title: 'EQ记录'
  });
  const initEQQueryParams = {
    pageNum: 1,
    pageSize: 20,
    params: {}
  }
  const eqdata = reactive<PageData<any, any>>({
    form: {},
    queryParams: {
      ...initEQQueryParams
    },
    rules: {
    }
  });
  const eqColumnList = ref([
    {title: "序号", type: 'seq', field: 'index', align: 'center', width: '60'},
    {title: '产品编码', field: 'commodityCode', align: 'center'},
    {title: 'EQ开始时间', field: 'eqStartTime', align: 'center'},
    {title: 'EQ开启人', width: '90',field: 'eqStartUserName', align: 'center', showOverflow: false},
    {title: 'EQ结束时间',field:'eqEndTime',align: 'center'},
    {title: 'EQ结束人', width: '90', field: 'eqEndUserName', align: 'center'},
    {title: 'EQ时长(H)', width: '70', field: 'eqHours', showHeaderOverflow: false,align: 'center'},
    {title: '是否自动关闭', width: '120', field: 'isAutoClose', align: 'center'},
  ]);

  const {queryParams:eqQueryParams} = toRefs(eqdata);


  const EQPlanRecord = async (row: any) => {
    eqPlanId.value = undefined;
    eqQueryParams.value.planId = row.id;
    eqPlanId.value = row.id;
    const res = await listEQList(eqQueryParams.value);
    eqList.value = res.rows;
    eqtotal.value = res.total;
    eqdialog.visible=true;
  };

     // 获取 搜索条件
  const eqSearchChange = async(params: any) => {
    eeqloading.value = true;
    eqQueryParams.value = params;
    if(eqPlanId.value){
      eqQueryParams.value.planId = eqPlanId.value;
    }
    await getEQList().finally(()=> eeqloading.value = false);

  }

  const getEQList = async ()=>{
    const res = await listEQList(eqQueryParams.value);
    eqList.value = res.rows;
    eqtotal.value = res.total;
  }
/**
 * 监听路由变化
 */
watch(() => route.query?.pendingParams, (newVal) => {
  if (newVal) {
    let decryptStr = decryptBase64ByStr(newVal)
    if (decryptStr && decryptStr != '{}' && (decryptStr == pendingParams.value)) return;
    pendingParams.value = decryptStr
    if (decryptStr && decryptStr != '{}') {
      const params = JSON.parse(decryptStr);
      let tab = !isNaN(Number(params.tab)) ? Number(params.tab) : 0;
      currentType.value = tab
      let tempColumnList = [{field: 'commodityCode', defaultValue: params.bizNo}]
      queryParams.value.commodityCode = params.bizNo
      if (tab === 0) {
        setTimeout(() => {
          xTableRef.value.filterFieldEvent(tempColumnList)
        }, 100)
      } else if (tab === 1) {
        setTimeout(() => {
          xTableRef2.value.filterFieldEvent(tempColumnList)
        }, 100)
      }
    }
  }
}, {deep: true, immediate: true})
/**
 * 重新进入页面时
 */
onActivated(() => {
})
onMounted(() => {
    getDictData();
    getList();
});
</script>
