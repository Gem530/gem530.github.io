<template>
  <div class="p-2 xtable-page">
      <div class="head-btn-flex between">
        <el-radio-group v-model="radioTable" size="small">
          <el-radio-button label="基价列表" @change="handlePagination" />
          <el-radio-button label="待处理列表" @change="handlePagination" />
          <el-radio-button label="待审核列表" @change="handlePagination" />
        </el-radio-group>
        <div class="global-flex flex-end">
          <el-button type="primary" plain  @click="handleAdd" >新增</el-button>
          <el-button v-if="radioTable=='待处理列表'" type="primary" plain  @click="handleBatchDelete" >批量删除</el-button>
          <el-button v-if="radioTable=='待处理列表'" type="primary" plain  @click="handleBatchSubmit" >批量提交</el-button>
          <el-button v-if="radioTable=='待审核列表'" type="primary" plain  @click="handleAduit" >批量审核</el-button>
          <el-button v-if="radioTable=='基价列表'" @click="exportExcel">导出</el-button>
          <el-button @click="handleImport">导入基价</el-button>
        </div>
      </div>

      <XTable height="100%" class="xtable-content" toolId="purchaseSupplierBasePrice"
        v-loading="loading"
        :pageShow="true"
        v-model:page-size="queryParams.pageSize"
        v-model:current-page="queryParams.pageNum"
        :page-params="{ perfect: true, total: total }"
        :data="tableList"
        :columnList="columnList"
        ref="borrowTableRef"
        border :showRefresh="true"
        @searchChange="searchChange"
        :checkbox-config="{ reserve: true }"
        :row-config="{ keyField: 'id' }"
        :scroll-y="{enabled: true,gt: 30}"
      >
        <template #default-categoryId="scope">
          <div>{{ scope.row.categoryName }}</div>
        </template>
        <!-- <template #default-units="scope">
          <dict-tag :options="unitsTypeList" :value="scope.row.units" />
        </template> -->
        <!-- <template #default-level="scope">
          <dict-tag :options="orderMaterialLevelList" :value="scope.row.level" />
        </template> -->
        <!-- <template #default-manufacturer="scope">
          <dict-tag :options="orderPlateBrandList" :value="scope.row.manufacturer" />
        </template> -->
        <!-- <template #default-status="scope">
          <div>{{ statusStrings[scope.row.status as keyof typeof statusStrings] }}</div>
        </template> -->
        <template #default-make="scope">
            <el-button type="primary" link @click="handleUpdate(scope.row)" v-if="checkTable" >基价回改</el-button>
            <el-button link type="primary" @click="handleDetails(scope.row)" v-if="checkTable"
            >详情</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status != SupplierBasicPriceStatusEnum.TO_BE_AUDITED"
            @click="handleNotCheckUpdate(scope.row)"

            v-if="!checkTable"
            >修改</el-button
          >
          <el-button
            link
            type="primary"
            v-show="scope.row.status != SupplierBasicPriceStatusEnum.TO_BE_AUDITED"
            @click="handleNotCheckDelete(scope.row)"
            v-if="!checkTable"

            >删除</el-button
          >

          <el-button
            link
            type="primary"
            @click="handleNotCheckDetails(scope.row)"
            v-if="!checkTable"

            >详情</el-button
          >
          <el-button
            v-show="scope.row.status == SupplierBasicPriceStatusEnum.TO_BE_AUDITED"
            link
            type="primary"
            @click="handleReview(scope.row)"
            v-if="!checkTable"
            >审核</el-button
          >
          <el-button
            v-show="scope.row.status != SupplierBasicPriceStatusEnum.TO_BE_AUDITED"
            link
            type="primary"
            @click="handleSubmit(scope.row)"
            v-if="!checkTable"

            >提交</el-button
          >
        </template>
      </XTable>

    <!-- 添加或修改供应商对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="65%" >
      <el-form
        ref="supplierBasicPriceFormRef"
        :disabled="dialog.title === '供应商基价详情' || dialog.title === '供应商基价审核'|| dialog.title === '供应商基价管理'"
        :model="form"
        :rules="rules"
        label-width="130px"
        label-position="right"
        v-loading="dialogTableLoading"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item size="small" label="物料编码:" prop="rawMaterialId">
              <el-select
                v-model="form.rawMaterialId"
                 filterable
                placeholder="请选择物料编码"
                :disabled="!dialog.title?.includes('添加')"
                clearable
                style="width: 500px"

                @change="setMaterialInfo"
              >
                <el-option v-for="dict in RawMaterialList" :key="dict.code" :label="dict.code" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物料名称:" >
              <el-input v-model="form.name" disabled  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="供应商编码:" prop="supplierCode">
              <el-select
                v-model="form.supplierCode"
                 filterable
                placeholder="请选择供应商编码"
                :disabled="!dialog.title?.includes('添加')"
                clearable
                style="width: 500px"
                @change="setSupplierInfo"
              >
                <el-option v-for="dict in SupplierList" :key="dict.supplierCode" :label="dict.supplierCode" :value="dict.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="供应商名称:">
              <el-input v-model="form.supplierName" disabled  />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="材质牌号:" prop="materialQuality">
              <el-input v-model="form.materialQuality" disabled  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物料类别:" >
              <el-input v-model="form.categoryName" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="品牌:" >
              <el-input v-model="form.manufacturer" disabled  />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="铜厚" >
              <el-input v-model="form.copperThickness" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="长" >
              <el-input v-model="form.length" disabled >
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="宽" >
              <el-input v-model="form.width" disabled >
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="板厚" >
              <el-input v-model="form.boardThickness" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="颜色" >
              <el-input v-model="form.color" disabled/>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="级别" >
              <el-input v-model="form.level" disabled/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="基价:" prop="price">
              <!-- <el-input type="number" v-model="form.price"  placeholder="请输入单价" /> -->
              <XInputNumber class="number-left" :controls="false" style="width: 100%"  :min="0" v-model="form.price" precision="4"  />
            </el-form-item>
          </el-col>
          <el-col :span="12">

            <el-form-item label="" prop="modificationPrice">
              <template #label>
                <div class="global-flex flex-end">
                  &nbsp;采购单价浮动值
                  <el-tooltip v-if="form.price&&form.modificationPrice&&Number(form.modificationPrice)>0"
                    effect="dark"
                    placement="bottom-start"
                    :content="'此商品在【采购受理】时的采购单价只能设置  '
                    +(form.modificationPrice?BigNumber(form.price).minus(BigNumber(form.modificationPrice))<BigNumber(0)?0:BigNumber(form.price).minus(BigNumber(form.modificationPrice)):BigNumber(form.price))
                    +'-'
                    +(form.modificationPrice?BigNumber(form.price).plus(BigNumber(form.modificationPrice)):BigNumber(form.price))+'  之间的数字（包含  '+
                    +(form.modificationPrice?BigNumber(form.price).minus(BigNumber(form.modificationPrice))<BigNumber(0)?0:BigNumber(form.price).minus(BigNumber(form.modificationPrice)):BigNumber(form.price))
                    +'  、'
                    +(form.modificationPrice?BigNumber(form.price).plus(BigNumber(form.modificationPrice)):BigNumber(form.price))
                    +'  ）'"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-tooltip v-if="form.price&&(!form.modificationPrice&&form.modificationPrice!=='0'&&form.modificationPrice!=='0.0000')"
                    effect="dark"
                    placement="bottom-start"
                    :content="'此商品在【采购受理】时的采购单价可随意设置'"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-tooltip v-if="form.price&&(!form.modificationPrice&&(form.modificationPrice==='0'||form.modificationPrice==='0.0000'))"
                    effect="dark"
                    placement="bottom-start"
                    :content="'此商品在【采购受理】时的采购单价只能设置为：'+form.price"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-tooltip v-if="form.price&&(form.modificationPrice&&(Number(form.modificationPrice)=='0'))"
                    effect="dark"
                    placement="bottom-start"
                    :content="'此商品在【采购受理】时的采购单价只能设置为：'+form.price"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                  <el-tooltip v-if="!form.price"
                    effect="dark"
                    placement="bottom-start"
                    :content="'请先设置此商品基价'"
                  >
                    <el-icon><QuestionFilled /></el-icon>
                  </el-tooltip>
                </div>
              </template>
              <!-- <el-input type="number" v-model="form.modificationPrice"  placeholder="请输入采购单价浮动值" /> -->
              <XInputNumber class="number-left" :controls="false" style="width: 100%" :min="0"  v-model="form.modificationPrice" precision="4"  />
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item size="small" label="备注:" prop="remark">
              <el-input maxLength="200" v-model="form.remark" placeholder="请输入基价备注" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <el-divider content-position="left"><div style="font-size: 21px;">历史记录</div></el-divider>
      <XTable height="150" :pageShow="false" :data="form.historyPriceList" :columnList="historyPriceColumnList" border> </XTable>
      <el-divider content-position="left"><div style="font-size: 21px;">其他供应商价格</div></el-divider>
      <XTable height="150" :pageShow="false" :data="form.otherSupplierPriceList" :columnList="otherSupplierPriceColumnList" border> </XTable>

      <template #footer>
          <el-button
            v-if="dialog.title == '供应商基价审核'"
            :loading="buttonLoading"
            type="danger"
            @click="reject(form)"

            >驳回</el-button
          >
          <el-button
            v-show="dialog.title == '供应商基价审核'"
            :loading="buttonLoading"
            type="primary"
            @click="review(form)"

            >通过</el-button
          >
          <el-button
            v-show="dialog.title == '供应商基价管理'"
            :loading="buttonLoading"
            type="primary"
            @click="submit(form)"

            >提交</el-button
          >
          <el-button
            v-show="dialog.title =='修改供应商基价' ||dialog.title =='添加供应商基价' || dialog.title == '基价回改'"
            :loading="buttonLoading"
            type="primary"
            @click="submitForm"
            >确 定</el-button
          >
          <el-button
            v-show="dialog.title == '基价回改'"
            :loading="buttonLoading"
            type="primary"
            @click="setStatus"

            >提交</el-button
          >
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
      </template>
    </el-drawer>

     <!-- 导入对话框 -->
     <el-dialog :title="upload.title" v-model="upload.open" width="500px">
      <el-upload
        ref="uploadRef"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <el-icon class="el-icon--upload">
          <i-ep-upload-filled />
        </el-icon>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="text-center el-upload__tip">
            <span>仅允许导入xls、xlsx格式文件。</span>
          </div>
        </template>
      </el-upload>
      <template #footer>
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </template>
    </el-dialog>

  </div>
</template>
<script setup name="SupplierBasePrice" lang="ts">
import { listSupplierBasicPrice,
  listNotCheckSupplierBasicPrice,
  getSupplierBasicPrice,
  getBasicPriceRecord,
  delSupplierBasicPrice,
  delBasicPriceRecord,
  addSupplierBasicPrice,
  updateSupplierBasicPrice,
  updateBasicPriceRecord,
  getRawMaterialVoList,
  submitCheck,
  reviewCheck,
  rejectCheck,
  listCheckSupplierBasicPrice,
  batchAudit,
  listSupplier } from '@/api/purchase/supplierBasicPrice';
import { SupplierBasicPriceVO, SupplierBasicPriceQuery, SupplierBasicPriceForm,SupplierBasicPriceStatusEnum,statusStrings } from '@/api/purchase/supplierBasicPrice/types';
import { SupplierVO } from '@/api/basedata/supplier/types';
import { RawMaterialVO } from '@/api/basedata/rawMaterial/types';
import { listRawMaterialCategoryNoPage } from '@/api/basedata/rawMaterialCategory';
import { roleMenuTreeselect } from '@/api/system/menu';
import { parseTime } from "@/utils/ruoyi";
import { globalHeaders } from "@/utils/request";
import { BigNumber } from 'bignumber.js';

/*** 导入参数 */
const upload = reactive<ImportOption>({
  // 是否显示弹出层 
  open: false,
  // 弹出层标题 
  title: "",
  // 是否禁用上传
  isUploading: false,
  // 是否更新已经存在的用户数据
  updateSupport: 0,
  // 设置上传的请求头部
  headers: globalHeaders(),
  // 上传的地址
  url: import.meta.env.VITE_APP_BASE_API + "/purchase/basicPriceRecord/importData"
});
const uploadRef = ref<ElUploadInstance>();


const borrowTableRef = ref();
const radioTable = ref('基价列表')
const { proxy } = getCurrentInstance() as ComponentInternalInstance;
//table数据
const tableList = ref<SupplierBasicPriceVO[]>([]);
//审核通过的供应商基价列表
const supplierBasicPriceList = ref<SupplierBasicPriceVO[]>([]);
//未审核通过的供应商基价列表
const notBasicPriceList = ref<SupplierBasicPriceVO[]>([]);
//以审核通过的供应商基价列表
const checkBasicPriceList = ref<SupplierBasicPriceVO[]>([]);
//正式数据
const checkTable = ref(true);
const buttonLoading = ref(false);
const loading = ref(true);
const dialogTableLoading = ref(false)

const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
//是否是未审核的基价
const NotCheck = ref(true);
const total = ref(0);
const queryFormRef = ref<ElFormInstance>();
const supplierBasicPriceFormRef = ref<ElFormInstance>();
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});


/**
 * 物料类别下拉列表
 */
const rawMaterialCategory=ref([]);

const getListRawMaterialCategorys = async () => {
  const res: any = await listRawMaterialCategoryNoPage();

  rawMaterialCategory.value = res;
}

const { order_material_level:orderMaterialLevelList, units_type:unitsTypeList, order_plate_brand: orderPlateBrandList } = toRefs<any>(proxy?.useDict("order_material_level","units_type","order_plate_brand"));

const columnList = ref([
  { type: 'checkbox',field: 'checkbox', width: '60', align: "center",visible:false,fixed:'left'},
  { title: '序号', field: 'index',width: '55', align: 'center', type: 'seq' },
  { title: '物料编码 ', width:'120',field: 'materialCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料编码 ' } },
  { title: '物料名称 ', width: '120', field: 'name', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料名称 ' } },
  { title: '供应商编码 ', width: '120', field: 'supplierCode', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商编码 ' } },
  { title: '供应商名称 ', width: '120', field: 'supplierName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入供应商名称 ' } },
  { title: '物料类别', width: '80', field: 'categoryName', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入物料类别' } ,  },
  { title: '单位名称', width: '80', field: 'units', align: 'center',filterType: 'input', filterParam: { placeholder: '请输入单位名称' } ,  },
  { title: '材质牌号', field: 'materialQuality', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入材质牌号' } },
  { title: '基价 ', width: '80', field: 'price', align: 'center',  },
  { title: '采购单价浮动值 ', width: '100', field: 'modificationPrice', align: 'center',  },
  
  { title: '品牌', width: '80', field: 'manufacturer', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入品牌' } },
  { title: '厚度', field: 'thickness', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入厚度' } },
  { title: '规格型号', field: 'specification', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入规格型号' } },
  { title: '铜厚', width: '80', field: 'copperThickness', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入铜厚' } },
  { title: '板厚', width: '80', field: 'boardThickness', align: 'center' ,  filterType: 'input', filterParam: { placeholder: '请输入板厚' } },
  { title: '直径', field: 'diameter', width: '80', align: 'center', filterType: 'input', filterParam: { placeholder: '请输入直径' } },
  { title: '长', width: '80', field: 'length', align: 'center',  filterType: 'input', filterParam: { placeholder: '' } },
  { title: '宽', width: '80', field: 'width', align: 'center' , filterType: 'input', filterParam: { placeholder: '' } },
  { title: '颜色', width: '80', field: 'color', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入颜色' } },
  { title: '级别', width: '80', field: 'level', align: 'center' , filterType: 'input', filterParam: { placeholder: '请输入级别' }, },
  { title: '状态 ', width: '80', field: 'status', visible: false, align: 'center' },
  { title: '备注', field: 'remark', align: 'center',width: '80', },
  { title: '操作', width: '200', align: 'center',  fixed:"right", field:'make' , showOverflow: false  },
]);


const historyPriceColumnList = ref([
  {title: '序号', field: 'sort',type:'seq', align: 'center', width: 55, sortable: true},
  { title: '变更时间 ', field: 'auditTime', width: '200', align: 'center'},
  { title: '基价 ', field: 'price', align: 'center' },
  { title: '采购单价浮动值 ', field: 'modificationPrice', align: 'center' },
  { title: '供应商编码 ', field: 'supplierCode', align: 'center' },
  { title: '变更人 ', field: 'updateByName', align: 'center' },
  { title: '生效日期', field: 'auditTime', width: '200', align: 'center' },
  { title: '备注', field: 'remark', align: 'center' },
]);

const otherSupplierPriceColumnList = ref([
  {title: '序号', field: 'sort',type:'seq', align: 'center', width: 55, sortable: true},
  { title: '供应商编码', field: 'supplierCode', align: 'center', },
  { title: '供应商名称', field: 'supplierName', align: 'center', },
  { title: '生效日期', field: 'auditTime', width: '260', align: 'center',},
  { title: '基价 ', field: 'price', align: 'center', },
  { title: '采购单价浮动值 ', field: 'modificationPrice', align: 'center', },
  { title: '变更人 ', field: 'updateByName', width: '100', align: 'center',  },
  { title: '备注', field: 'remark', align: 'center',},
]);

// 获取 搜索条件
const searchChange = (params: any) => {
  queryParams.value = params
  //物料类别
  if(queryParams.value.categoryId){
    if(Array.isArray(queryParams.value.categoryId)){
      queryParams.value.categoryId = queryParams.value.categoryId.join(",");
    }
  }
  //品牌 拼接
  if(queryParams.value.manufacturer){
       if (Array.isArray(queryParams.value.manufacturer)) {
      queryParams.value.manufacturer = queryParams.value.manufacturer.join(",");
    }
  }
  //级别 拼接
  if(queryParams.value.level){
    if (Array.isArray(queryParams.value.level)) {
      queryParams.value.level = queryParams.value.level.join(",");
    }
  }

  //暂时区分
  if (radioTable.value == "基价列表") {
    checkTable.value = true;
    //多选
    columnList.value[0].visible = false
    //厚度
    columnList.value[11].visible = false
    getList().then(() => { tableList.value = supplierBasicPriceList.value });
    
  } else if (radioTable.value == "待处理列表") {
    checkTable.value = false;
    columnList.value[0].visible = true
    columnList.value[11].visible = true
   getNotCheckList().then(() => { tableList.value = notBasicPriceList.value });
  } else if (radioTable.value == "待审核列表") {
    checkTable.value = false;
    columnList.value[0].visible = true
    columnList.value[11].visible = true
    getCheckList().then(()=>{ tableList.value = checkBasicPriceList.value });
  }

}


const initFormData: SupplierBasicPriceForm = {
  id: undefined,
  code: undefined,
  name: undefined,
  supplierCode: undefined,
  supplierName: undefined,
  specification: undefined,
  materialQuality: undefined,
  categoryId: undefined,
  manufacturer: undefined,
  price: undefined,
  color: undefined,
  level: undefined,
  copperThickness: undefined,
  length: undefined,
  width: undefined,
  boardThickness: undefined,
  remark: undefined,
  status: undefined,
  historyPriceList: [],
  otherSupplierPriceList: [],
}
const data = reactive<PageData<SupplierBasicPriceForm, SupplierBasicPriceQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    name: undefined,
    supplierCode: undefined,
    supplierName: undefined,
    categoryId: undefined,
    specification: undefined,
    color: undefined,
    level: undefined,
    copperThickness: undefined,
    length: undefined,
    width: undefined,
    boardThickness: undefined,
    number: undefined,
    materialType: undefined,
    manufacturer: undefined,
    price: undefined,
    comment: undefined,
    params: {
    }
  },
  rules: {

    supplierCode: [
      { required: true, message: "供应商编码不能为空", trigger: "change" }
    ],
    rawMaterialId: [
      { required: true, message: "物料编码不能为空", trigger: "change" }
    ],
    supplierId: [
      { required: true, message: "供应商编码不能为空", trigger: "change" }
    ],
    supplierName: [
      { required: true, message: "供应商名称不能为空", trigger: "blur" }
    ],
    materialId: [
      { required: true, message: "物料类别不能为空", trigger: "change" }
    ],
    price: [
      { required: true, message: "单价不能为空", trigger: "blur" },
      //大于0
      { validator: (rule: any, value: any, callback: any) => {
        if (value <= 0) {
          callback(new Error("单价必须大于0"));
        }else if (!/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(Number(value).toString())) {
          callback(new Error("最多4位小数"));
        } else {
          callback();
        }
      }, trigger: "blur" },

    ],
  }
});

const { queryParams, form, rules } = toRefs(data);



/** 分页方法 */
const handlePagination = async () => {
 
  queryParams.value.pageNum = 1;
  if (radioTable.value == "基价列表") {
    checkTable.value = true;
    //多选
    columnList.value[0].visible = false
    //厚度
    columnList.value[11].visible = false
    getList().then(() => { 
      tableList.value = supplierBasicPriceList.value 
    });
    
  } else if (radioTable.value == "待处理列表") {
    checkTable.value = false;
    columnList.value[0].visible = true
    columnList.value[11].visible = true
   getNotCheckList().then(() => { 
      tableList.value = notBasicPriceList.value;
      const _tabRef=borrowTableRef.value.xTableRef;
      if(_tabRef){
        borrowTableRef.value.xTableRef.clearCheckboxRow();
        borrowTableRef.value.xTableRef.clearCheckboxReserve();
      }
    });
  } else if (radioTable.value == "待审核列表") {
    checkTable.value = false;
    columnList.value[0].visible = true
    columnList.value[11].visible = true
    getCheckList().then(()=>{ 
      tableList.value = checkBasicPriceList.value;
      const _tabRef=borrowTableRef.value.xTableRef;
      if(_tabRef){
        borrowTableRef.value.xTableRef.clearCheckboxRow();
        borrowTableRef.value.xTableRef.clearCheckboxReserve();
      }
    });
  }

  const _tabRef=borrowTableRef.value.xTableRef;
  if(_tabRef){
    const filterData=borrowTableRef.value.xTableRef.getCheckedFilters();
    const filterList=filterData.map(item=>item.field);
    console.log("filterList",filterList);
    borrowTableRef.value.delFilterField(filterList);
  }
}



/** 查询供应商基价列表 */
const getList = async () => {
  loading.value = true;

  const res = await listSupplierBasicPrice(queryParams.value);
  supplierBasicPriceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  tableList.value = supplierBasicPriceList.value
}
/** 查询未审核通过的供应商基价列表 */
const getNotCheckList = async () => {
  loading.value = true;
  const res = await listNotCheckSupplierBasicPrice(queryParams.value);
  notBasicPriceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  tableList.value = notBasicPriceList.value ;
}
/** 查询已审核通过的供应商基价列表 */
const getCheckList = async () => {
  loading.value = true;
  const res = await listCheckSupplierBasicPrice(queryParams.value);
  checkBasicPriceList.value = res.rows;
  total.value = res.total;
  loading.value = false;
  tableList.value = checkBasicPriceList.value;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  supplierBasicPriceFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加供应商基价";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: SupplierBasicPriceVO) => {
  reset();
  console.log(row);

  dialog.visible = true;
  dialog.title = "基价回改";
  dialogTableLoading.value = true
  NotCheck.value = false;
  const _id = row?.id || ids.value[0]
  const res = await getSupplierBasicPrice(_id);
  Object.assign(form.value, res.data);
  dialogTableLoading.value = false
}

/** 未审核的基价的 修改按钮操作 */
const handleNotCheckUpdate = async (row?: SupplierBasicPriceVO) => {
  reset();
  NotCheck.value = true;
  const _id = row?.id || ids.value[0]
  const res = await getBasicPriceRecord(_id);
  Object.assign(form.value, res.data);

  dialog.visible = true;
  dialog.title = "修改供应商基价";
}

/** 详情按钮操作 */
const handleDetails = async (row?: SupplierBasicPriceVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "供应商基价详情";
  dialogTableLoading.value = true
  const _id = row?.id || ids.value[0]
  const res = await getSupplierBasicPrice(_id);
  Object.assign(form.value, res.data);


  dialogTableLoading.value = false
}

/** 未审核的基价 详情按钮操作 */
const handleNotCheckDetails = async (row?: SupplierBasicPriceVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getBasicPriceRecord(_id);
  Object.assign(form.value, res.data);
  console.log("123",form.value);
  dialog.visible = true;
  dialog.title = "供应商基价详情";
}

/** 提交弹窗按钮操作 */
const handleSubmit = async (row?: SupplierBasicPriceForm) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getBasicPriceRecord(_id);
  Object.assign(form.value, res.data);

  dialog.visible = true;
  dialog.title = "供应商基价管理";
}

/** 审核弹窗按钮操作 */
const handleReview = async (row?: SupplierBasicPriceForm) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getBasicPriceRecord(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "供应商基价审核";
}
/** 驳回按钮操作 */
const reject = async (row?: SupplierBasicPriceForm) => {

  const _id = row?.id || ids.value[0]
  buttonLoading.value = true;
  const res = await rejectCheck(_id).finally(() => { buttonLoading.value = false; });
    if (res.data) {
    proxy?.$modal.msgSuccess("驳回成功");
  } else {
    proxy?.$modal.msgError("驳回失败");
  }
  await getCheckList();
  reset();
  dialog.visible = false;
}
/** 提交按钮操作 */
const submit = async (row?: SupplierBasicPriceForm) => {

  const _id = row?.id || ids.value[0]
  buttonLoading.value = true;
  const res = await submitCheck(_id).finally(() => { buttonLoading.value = false; });
  if(res.data){
    proxy?.$modal.msgSuccess("提交成功");
  }else{
    proxy?.$modal.msgError("提交失败");
  }
    await getNotCheckList();
     reset();
    dialog.visible = false;

}

/** 通过按钮操作 */
const review = async (row?: SupplierBasicPriceForm) => {

  const _id = row?.id || ids.value[0]
  buttonLoading.value = true;
  const res = await reviewCheck(_id).finally(() => { buttonLoading.value = false; });

  if (res.data) {
    proxy?.$modal.msgSuccess("通过成功");
  } else {
    proxy?.$modal.msgError("通过失败");
  }
  await getCheckList();
  reset();
  dialog.visible = false;

}
const setStatus=() =>{
  form.value.status = SupplierBasicPriceStatusEnum.TO_BE_AUDITED;
  submitForm();
}
/** 提交按钮 */
const submitForm = () => {
  supplierBasicPriceFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        if(NotCheck.value){
          await updateBasicPriceRecord(form.value).finally(() => buttonLoading.value = false);

        }else{
          await updateSupplierBasicPrice(form.value).finally(() => buttonLoading.value = false);

        }
        proxy?.$modal.msgSuccess("修改成功");
      } else {
        await addSupplierBasicPrice(form.value).finally(() => buttonLoading.value = false);

        proxy?.$modal.msgSuccess("新增成功");
      }
       handlePagination();
      dialog.visible = false;


    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: SupplierBasicPriceVO) => {
  const _ids = row?.id || ids.value;

  // 物料编码
  const _code = row?.code || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商基价 物料编码为"' + _code + '"的数据项？').finally(() => loading.value = false);
  await delSupplierBasicPrice(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}
/** 未审核的基价删除按钮操作 */
const handleNotCheckDelete = async (row?: SupplierBasicPriceVO) => {
  const _ids = row?.id || ids.value;

  // 物料编码
  const _code = row?.materialCode || ids.value;
  await proxy?.$modal.confirm('是否确认删除供应商基价 物料编码为"' + _code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...');
  await delBasicPriceRecord(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getNotCheckList();
}


//物料列表
let RawMaterialList: RawMaterialVO[] = [];
//供应商列表
let SupplierList: SupplierVO[] = [];

/**
 * 获取物料列表
 */
const getRawMaterial = async () => {
  const MaterialResponse: any = await getRawMaterialVoList();
   RawMaterialList = MaterialResponse.rows;

}
/**
 * 获取供应商列表
 */
const getSupplierList = async () => {

  const SupplierResponse: any = await listSupplier();
   SupplierList = SupplierResponse.data;

}

//设置表单信息
const setMaterialInfo = (value: string) => {

  if (value == undefined || value == null || value == "") {

    form.value.name = undefined;
    form.value.specification = undefined;
    form.value.materialQuality = undefined;
    form.value.categoryId = undefined;
    form.value.manufacturer = undefined;

    return;
  }

  //根据value 筛选出RawMaterialList中对应的数据,并赋值给form
  const res = RawMaterialList.filter(item => item.id === value);
  form.value.name = res[0].name;
  form.value.specification = res[0].specification;
  form.value.materialQuality = res[0].materialQuality;
  form.value.categoryId = res[0].categoryId;
  form.value.manufacturer = res[0].manufacturer;
  form.value.categoryName = res[0].categoryName;
  form.value.color = res[0].color;
  form.value.level = res[0].level;
  form.value.copperThickness = res[0].copperThickness;
  form.value.length = res[0].length;
  form.value.width = res[0].width;
  form.value.boardThickness = res[0].boardThickness;


  form.value.remark = res[0].remark;
};

//设置表单信息
const setSupplierInfo = (value: string) => {

  if (value == undefined || value == null || value == "") {
    form.value.supplierName = undefined;
    return;
  }

  //根据value 筛选出RawMaterialList中对应的数据,并赋值给form
  const res = SupplierList.filter(item => item.id === value);
  form.value.supplierName = res[0].supplierName;
  form.value.supplierId = res[0].id;
};

/** 批量提交 */
const handleBatchSubmit = async () => {
  const tableRef = borrowTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    if (selectRecords.length === 0) {
      proxy?.$modal.msgWarning("请选择数据");
      return;
    }
    if(radioTable.value!='待处理列表'){
      proxy?.$modal.msgWarning("请选择待处理列表的数据");
      return;
    }
    const batchIds = selectRecords.map((item: any) => item.id);
    let updateObj={
      ids:batchIds
    }
    await proxy?.$modal.confirm('是否批量提交？');
    updateObj.status=SupplierBasicPriceStatusEnum.TO_BE_AUDITED
    proxy?.$modal.loading('加载中...');
    batchAudit(updateObj).then(() => {
      proxy?.$modal.msgSuccess("批量提交成功");
      handlePagination();
    }).finally(() => proxy?.$modal.closeLoading());

  }
}

/** 批量删除 */
const handleBatchDelete = async () => {
  const tableRef = borrowTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    if (selectRecords.length === 0) {
      proxy?.$modal.msgWarning("请选择数据");
      return;
    }
    if(radioTable.value!='待处理列表'){
      proxy?.$modal.msgWarning("请选择待处理列表的数据");
      return;
    }
    const batchIds = selectRecords.map((item: any) => item.id);
    await proxy?.$modal.confirm('是否批量删除？');
    proxy?.$modal.loading('加载中...');
    await delBasicPriceRecord(batchIds).finally(() => proxy?.$modal.closeLoading());
    proxy?.$modal.msgSuccess("批量删除成功");
    getNotCheckList();
  }
}

/** 批量审核 */
const handleAduit = async () => {
  const tableRef = borrowTableRef.value.xTableRef
  if (tableRef) {
    const selectRecords = tableRef.getCheckboxReserveRecords().concat(tableRef.getCheckboxRecords());
    if (selectRecords.length === 0) {
      proxy?.$modal.msgWarning("请选择需要审核的数据");
      return;
    }
    if(radioTable.value!='待审核列表'){
      proxy?.$modal.msgWarning("请选择待审核列表的数据");
      return;
    }
    const batchIds = selectRecords.map((item: any) => item.id);
    let updateObj={
      ids:batchIds
    }
    ElMessageBox.confirm(
      '确认批量审核选中的记录?',
      '批量审核',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: '通过',
        cancelButtonText: '驳回',
      }
    ).then(() => {
        //通过
        updateObj.status=SupplierBasicPriceStatusEnum.AUDITED
        proxy?.$modal.loading('加载中...');
        batchAudit(updateObj).then(() => {
          proxy?.$modal.msgSuccess("批量通过成功");
          getCheckList();
          reset();
        }).finally(() => proxy?.$modal.closeLoading());
    })
    .catch((action: Action) => {
      //驳回
      if (action === 'cancel') {
        updateObj.status=SupplierBasicPriceStatusEnum.REJECTED
        proxy?.$modal.loading('加载中...');
        batchAudit(updateObj).then(() => {
          proxy?.$modal.msgWarning("批量驳回成功");
          getCheckList();
          reset();
        }).finally(() => proxy?.$modal.closeLoading());
      }
    })
  }
}

/** 导出 */
const exportExcel = async () => {

  proxy?.download('purchase/supplierBasicPrice/export', {
    ...queryParams.value, tableName: 'purchaseSupplierBasePrice'
  }, `供应商基价_${parseTime(new Date())}.xlsx`)

}
/** 导入按钮操作 */
const handleImport = () => {
  upload.title = "导入供应商基价";
  upload.open = true;
  uploadRef.value?.clearFiles();
};
/**文件上传中处理 */
const handleFileUploadProgress = () => {
  upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response: any, file: UploadFile) => {
  upload.open = false;
  upload.isUploading = false;
  uploadRef.value?.handleRemove(file);
  ElMessageBox.alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
  handlePagination();
};

/** 提交上传文件 */
function submitFileForm() {
  uploadRef.value?.submit();
}


onMounted(() => {
  getList();
  getRawMaterial();
  getSupplierList();
  getListRawMaterialCategorys();
});
</script>

<style scoped lang="scss">

:deep(.number-left) {
  .el-input__wrapper {
    padding-left: 11px;
    padding-right: 7px;
  }
  .el-input__inner {
    text-align: left;
  }
}

</style>