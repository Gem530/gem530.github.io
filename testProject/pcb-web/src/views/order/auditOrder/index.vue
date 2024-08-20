<template>
  <div class="p-2 xtable-page">
    <el-card shadow="never" class="xtable-card">
      <div class="p-2" style="text-align: right; width: 100%">
        <el-button type="primary" @click="handleAdd">新增订单预审单
        </el-button>
      </div>
      <XTable toolId="auditOrder" :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
              v-model:current-page="queryParams.pageNum"
              :page-params="{ perfect: true, total: total }"
              :data="auditOrderList"
              :intervalCondition="['createTime']"
              :columnList="columnList" :loading="loading"
              ref="newVxeTableRef" border :showRefresh="true"
              @searchChange="searchChange"
              :column-config="{ resizable: true }">
        <template #default-status="scope">
<!--          <dict-tag :options="dictList.order_status" :value="scope.row.status"/>-->
          {{dictList.order_status.find((v: any) => v.value == scope.row.status)?.label}}
        </template>
        <template #default-commodityType="scope">
<!--          <dict-tag :options="dictList.sys_commodity_type" :value="scope.row.commodityType"/>-->
          {{dictList.sys_commodity_type.find((v: any) => v.value == scope.row.commodityType)?.label}}
        </template>
        <template #default-make="scope">
            <el-button v-if="scope.row.status ==='1' || scope.row.status ==='4'" link type="primary"
                       @click="handleSubmit(scope.row)"
                       >提交
            </el-button>
            <el-button v-if="scope.row.status === '1'|| scope.row.status ==='4'" link type="primary"
                       @click="handleUpdate(scope.row)"
                       >编辑
            </el-button>
            <el-button v-if="scope.row.status === '1'|| scope.row.status ==='4'" link type="primary"
                       @click="handleDelete(scope.row)"
                       >删除
            </el-button>
            <el-button v-if="scope.row.status !== '1' && scope.row.status !== '4' " link type="primary"
                       @click="handleSelect(scope.row)"
                       >详情
            </el-button>
            <el-button link type="primary"

                       @click="saleAuditorderUReportHandle(scope.row)"
            >预览
            </el-button>
        </template>
      </XTable>
    </el-card>

    <!--工程预审预览 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="60%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
    <!-- 添加或修改预审单对话框 -->
    <el-drawer :title="dialog.title" v-model="dialog.visible" size="70%">
      <el-form ref="auditOrderFormRef" :model="form" :rules="rules" :disabled="dialog.title === '查看工程预审详情'" v-loading="dialogTableLoading"
               label-width="80px">
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="客户" prop="customerId">
              <el-select v-model="form.customerId"
                         style="width: calc(100% - 63px)"
                         placeholder="" filterable
              >
                <el-option
                    v-for="item in customerCodes"
                    :key="item.id"
                    :label="item.customerCode"
                    :value="item.id"
                >
                  <span style="float: left">{{ item.customerCode }}</span>
                </el-option>
              </el-select>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="产品名称" prop="commodityName">
              <el-input v-model="form.commodityName" placeholder="" :maxlength="333"
                        :error="'输入长度不能超过333个字符'"/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="创建时间" prop="createTime">
              <el-input v-model="form.createTime" :disabled="true" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="产品类型" prop="commodityType">
              <el-select
                  v-model="form.commodityType"
                  placeholder=""
                  @change="saveDict(form.commodityType,'sys_commodity_type')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.sys_commodity_type" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
<!--              <el-select v-model="form.commodityType" placeholder="请选择产品类型" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in sys_commodity_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="表面处理" prop="surfaceTreatment">
              <el-select v-model="form.surfaceTreatment" placeholder="" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in dictList.order_surface_treatment" :key="dict.value" :label="dict.label"
                           :value="dict.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="层数" prop="materialLayer">
              <el-input v-model="form.materialLayer" placeholder="" @input="(val) => mustNumberPoint(val, 'materialLayer')" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="包装要求" prop="packRequirement">
              <el-select v-model="form.packRequirement" placeholder="" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in dictList.order_packaging_requirements" :key="dict.value" :label="dict.label"
                           :value="dict.label"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="板材" prop="materialQuality">
              <el-select
                  v-model="form.materialQuality"
                  placeholder=""
                  @change="saveDict(form.materialQuality,'order_material_quality')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_material_quality" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialQuality" placeholder="请选择板材" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_quality" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="板材品牌" prop="materialBrand">
              <el-select
                  v-model="form.materialBrand"
                  placeholder=""
                  @change="saveDict(form.materialBrand,'order_plate_brand')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_plate_brand" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialBrand" placeholder="请选择板材品牌" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_plate_brand" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="板材级别" prop="materialLevel">
              <el-select
                  v-model="form.materialLevel"
                  placeholder=""
                  @change="saveDict(form.materialLevel,'order_material_level')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_material_level" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialLevel" placeholder="请选择板材级别" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_level" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="成品板厚" prop="finishedPlateThickness">
              <el-select
                  v-model="form.finishedPlateThickness"
                  placeholder=""
                  @change="saveDict(form.finishedPlateThickness,'finish_plate_thickness')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in finish_plate_thickness" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--
              <el-select v-model="form.finishedPlateThickness" placeholder="请选择成品板厚" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in finish_plate_thickness" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="外层铜厚" prop="outerCopperThickness">
              <el-select
                  v-model="form.materialCopperOutside"
                  placeholder=""
                  @change="saveDict(form.materialCopperOutside,'order_material_copperoutside')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_material_copperoutside" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialCopperOutside" placeholder="请选择外层铜厚" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_copperoutside" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="内层铜厚" prop="materialCopperInside">
              <el-select
                  v-model="form.materialCopperInside"
                  placeholder=""
                  @change="saveDict(form.materialCopperInside,'order_material_copperinside')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_material_copperinside" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialCopperInside" placeholder="请选择内层铜厚" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_copperinside" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item size="small" label="预审备注" prop="remark">
              <el-input v-model="form.remark" placeholder="" :maxlength="333"
                        :error="'输入备注不能超过333个字符'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">规格型号</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="单片尺寸" prop="singleLength">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="singleLength">
                    <el-input type="number" v-model.number="form.singleLength">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="12">
                  <el-form-item prop="singleWidth">
                    <el-input type="number" v-model.number="form.singleWidth">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="联片尺寸" prop="unitedLength">
              <el-row>
                <el-col :span="10">
                  <el-form-item prop="unitedLength">
                    <el-input type="number" v-model.number="form.unitedLength" :min="0" @blur="holeCountnumber">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="10">
                  <el-form-item prop="unitedWidth">
                    <el-input type="number" v-model.number="form.unitedWidth" :min="0" @blur="holeCountnumber">
                      <template #append>mm</template>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="连片方式" prop="unitedWayLength">
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="unitedWayLength">
                    <el-input type="number" v-model.number="form.unitedWayLength" @change="unitedWayNumber()" @input="(val) => mustNumber(val, 'unitedWayLength')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">X</el-col>
                <el-col :span="11">
                  <el-form-item prop="unitedWayWidth">
                    <el-input type="number" v-model.number="form.unitedWayWidth" @change="unitedWayNumber()" @input="(val) => mustNumber(val, 'unitedWayWidth')"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="联片数量" prop="unitedNumber" label-width="80px">
                <el-col>
                  <el-input v-model="form.unitedNumber" :disabled="true" placeholder="联片数量">
                    <template #append>pcs</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
        </el-row>
        <el-divider content-position="left">工艺参数</el-divider>
        <el-row>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊颜色" prop="commoditySolder">
              <el-select
                  v-model="form.commoditySolder"
                  placeholder=""
                  @change="saveDict(form.commoditySolder,'order_commodity_solder')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_commodity_solder" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--
              <el-select v-model="form.commoditySolder" placeholder="请选择阻焊颜色" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_solder" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊面数" prop="commoditySolderCount">
              <el-select
                  v-model="form.commoditySolderCount"
                  placeholder=""
                  @change="saveDict(form.commoditySolderCount,'order_commodity_solder_count')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_commodity_solder_count" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commoditySolderCount" placeholder="请选择阻焊面数" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_solder_count" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="金厚" prop="goldenThickness">
              <el-input v-model="form.goldenThickness" placeholder="" :maxlength="10" >u''
                <template #append>u''</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊光泽" prop="commoditySolderGloss">
              <el-select
                  v-model="form.commoditySolderGloss"
                  placeholder=""
                  @change="saveDict(form.commoditySolderGloss,'order_commodity_solder_gloss')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_commodity_solder_gloss" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commoditySolderGloss" placeholder="请选择阻焊光泽" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_solder_gloss" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊要求" prop="commoditySolderRequirement">
              <el-input v-model="form.commoditySolderRequirement" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="孔铜厚" prop="poreCopper">
              <el-input v-model="form.poreCopper" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="字符" prop="characterColor">
              <el-select
                  v-model="form.characterColor"
                  placeholder=""
                  @change="saveDict(form.characterColor,'order_character')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_character" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--
            <el-select v-model="form.characterColor" placeholder="请选择" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_character" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="字符面数" prop="characterCount">
              <el-select
                  v-model="form.characterCount"
                  placeholder=""
                  @change="saveDict(form.characterCount,'order_character_count')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_character_count" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.characterCount" placeholder="请选择字符面数" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_character_count" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item size="small" label="成形方式" prop="commodityForm">
              <el-select
                  v-model="form.commodityForm"
                  placeholder=""
                  @change="saveDict(form.commodityForm,'order_commodity_form')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_commodity_form" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commodityForm" placeholder="请选择成形方式" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_form" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item size="small" label="字符要求" prop="characterRequirement">
              <el-input v-model="form.characterRequirement" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="SET打叉" prop="setCross">
              <el-input v-model="form.setCross" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="板翘曲度" prop="warpagePlate">
              <el-input v-model="form.warpagePlate" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试方式" prop="commodityTestWay">
              <el-select
                  v-model="form.commodityTestWay"
                  placeholder=""
                  @change="saveDict(form.commodityTestWay,'order_commodity_testway')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_commodity_testway" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commodityTestWay" placeholder="请选择测试方式" clearable
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_testway" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试架" prop="testFrame">
              <el-select
                  v-model="form.testFrame"
                  placeholder=""
                  @change="saveDict(form.testFrame,'order_test_stand')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_test_stand" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
              <!--              <el-select v-model="form.commodityTestWay" placeholder="请选择测试方式" clearable
                                       @keyup.enter="handleQuery">
                              <el-option v-for="dict in order_commodity_testway" :key="dict.value" :label="dict.label"
                                         :value="dict.value"/>
                            </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试点" prop="testPoint">
              <el-input v-model="form.testPoint" placeholder="" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="备品数量" prop="spareQuantity">
              <el-input v-model="form.spareQuantity" placeholder="" type="number"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="铜箔" prop="copperFoil">
              <el-input v-model="form.copperFoil" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="V-CUT" prop="vCut">
              <el-input v-model="form.vcut" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="过孔要求" prop="holeRequirement">
              <el-select
                  v-model="form.holeRequirement"
                  placeholder=""
                  @change="saveDict(form.holeRequirement,'order_hole_requirement')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_hole_requirement" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.holeRequirement" placeholder="过孔要求" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_hole_requirement" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="检验标准" prop="inspectionStandard">
              <el-select
                  v-model="form.inspectionStandard"
                  placeholder=""
                  @change="saveDict(form.inspectionStandard,'order_inspection_standard')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  clearable
                  style="width: 440px"
              >
                <el-option v-for="dict in order_inspection_standard" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.inspectionStandard" placeholder="检验标准" clearable @keyup.enter="handleQuery">
                <el-option v-for="dict in order_inspection_standard" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="金面积" prop="goldArea">
              <el-input v-model="form.goldArea" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="外形要求" prop="appearanceRequirements">
              <el-input v-model="form.appearanceRequirements" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="PP" prop="pp">
              <el-input v-model="form.pp" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="镍厚" prop="nickelThickness">
              <el-input v-model="form.nickelThickness" placeholder=""/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="锡厚" prop="tinThickness">
              <el-input v-model="form.tinThickness" placeholder=""/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">线宽线距</el-divider>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="最小线宽" prop="minLineWidth">
              <el-input v-model="form.minLineWidth" placeholder="" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="最小线距" prop="minLineSpace">
              <el-input v-model="form.minLineSpace" placeholder="" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="最小孔径" prop="minAperture">
              <el-input v-model="form.minAperture" placeholder="" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="总孔数" prop="holeCount">
              <el-input-number v-model="form.holeCount" placeholder="" :precision="0" :controls="false" :min="0"  @blur="holeCountnumber()">
              </el-input-number>/连板(SLOT)
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="孔密度" prop="holeDensity">
              <el-input-number v-model="form.holeDensity" placeholder=""  :max="9999999999" :precision="6" :min="0">
              </el-input-number> 万/m²
            </el-form-item>
          </el-col>

          <!-- <el-col :span="18">
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasAcknowledgment=='1'" style="margin-left:10px" v-model="form.hasAcknowledgment" label="承认书/出货报告" />
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasImpedanceReport=='1'" v-model="form.hasImpedanceReport" label="阻抗报告" />
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasSection=='1'" v-model="form.hasSection" label="切片" />
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasImpedanceBar=='1'" v-model="form.hasImpedanceBar" label="阻抗条" />
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasSealedSample=='1'" v-model="form.hasSealedSample" label="封样" />
            <el-checkbox false-label="0" true-label="1" value="1" :checked="form.hasFilm=='1'" v-model="form.hasFilm" label="菲林" />
          </el-col> -->

        </el-row>
      </el-form>
      <template #footer>
        <div class="text-center">
          <el-button :loading="buttonLoading" type="primary" :style="{ display: dialog.title === '查看工程预审详情'?'none':'' }" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="AuditOrder" lang="ts">
import {
  addAuditOrder,
  delAuditOrder,
  getAuditOrder,
  getCustomerCodeList,
  listAuditOrder,
  submitAuditOrder,
  updateAuditOrder
} from '@/api/order/auditOrder';
import {AuditOrderForm, AuditOrderQuery, AuditOrderVO} from '@/api/order/auditOrder/types';
import {RawMaterialVO} from "@/api/basedata/rawMaterial/types";
import {CustomerVO} from "@/api/basedata/customer/types";
import dayjs from "dayjs";
import {getDicts, saveDictData} from "@/api/system/dict/data";
import {sortBy} from "@/utils/dict";
import {getReportUrl} from "@/utils/report";
import {getListCustomer} from "@/api/basedata/customer";


const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const auditOrderList = ref<AuditOrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const newVxeTableRef = ref();

//const {sys_commodity_type} = toRefs<any>(proxy?.useDict("sys_commodity_type"));
//const {order_status,sys_commodity_type} = toRefs<any>(proxy?.useDict("order_status","sys_commodity_type"));
//const {order_surface_treatment} = toRefs<any>(proxy?.useDict("order_surface_treatment"));
//const {order_packaging_requirements} = toRefs<any>(proxy?.useDict("order_packaging_requirements"));
const {order_plate_brand} = toRefs<any>(proxy?.useDict("order_plate_brand"));
const {order_material_quality} = toRefs<any>(proxy?.useDict("order_material_quality"));
const {order_material_level} = toRefs<any>(proxy?.useDict("order_material_level"));
const {order_material_copperoutside} = toRefs<any>(proxy?.useDict("order_material_copperoutside"));
const {finish_plate_thickness} = toRefs<any>(proxy?.useDict("finish_plate_thickness"));
const {order_material_copperinside} = toRefs<any>(proxy?.useDict("order_material_copperinside"));
const {order_commodity_solder} = toRefs<any>(proxy?.useDict("order_commodity_solder"));
const {order_commodity_solder_count} = toRefs<any>(proxy?.useDict("order_commodity_solder_count"));
const {order_commodity_solder_gloss} = toRefs<any>(proxy?.useDict("order_commodity_solder_gloss"));
const {order_character} = toRefs<any>(proxy?.useDict("order_character"));
const {order_character_count} = toRefs<any>(proxy?.useDict("order_character_count"));
const {order_commodity_form} = toRefs<any>(proxy?.useDict("order_commodity_form"));
const {order_commodity_testway} = toRefs<any>(proxy?.useDict("order_commodity_testway"));
const {order_hole_requirement} = toRefs<any>(proxy?.useDict("order_hole_requirement"));
const {order_inspection_standard} = toRefs<any>(proxy?.useDict("order_inspection_standard"));
const {order_test_stand} = toRefs<any>(proxy?.useDict("order_test_stand"));
const {order_test_frame} = toRefs<any>(proxy?.useDict("order_test_frame"));

let dictList = ref<any>({
  order_status: [],
  sys_commodity_type: [],
  order_surface_treatment:[],
  order_packaging_requirements:[],
})
const getDict = () => {
 // dictList.value = toRefs<any>(proxy?.useDict("order_status","sys_commodity_type","order_surface_treatment","order_packaging_requirements"));
  const rules = [['dictSort', 'asc']];
  const string = "order_status,sys_commodity_type,sys_commodity_type,order_surface_treatment,order_packaging_requirements";
  getDicts(string)
      .then(res => {
        const dictData = res.data;
        dictData.map((v: any) => {
          v.label = v.dictLabel
          v.value = v.dictValue
        })
        string.split(",").forEach(item => {
          Object.keys(dictList.value).forEach(dictItem => {
            if (item == dictItem) {
              dictList.value[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
}

const queryFormRef = ref<ElFormInstance>();
const auditOrderFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: AuditOrderForm = {
  id: undefined,
  code: undefined,
  customerId: undefined,
  commodityName: undefined,
  commodityType: undefined,
  surfaceTreatment: undefined,
  materialLayer: undefined,
  packRequirement: undefined,
  materialQuality: undefined,
  materialBrand: undefined,
  materialLevel: undefined,
  materialCopperOutside: undefined,
  materialCopperInside: undefined,
  remark: undefined,
  singleWidth: undefined,
  singleLength: undefined,
  unitedWidth: undefined,
  unitedLength: undefined,
  unitedNumber: undefined,
  unitedWayLength: undefined,
  unitedWayWidth: undefined,
  commoditySolder: undefined,
  commoditySolderCount: undefined,
  goldenThickness: undefined,
  commoditySolderGloss: undefined,
  commoditySolderRequirement: undefined,
  poreCopper: undefined,
  characterColor: undefined,
  characterCount: undefined,
  commodityForm: undefined,
  characterRequirement: undefined,
  setCross: undefined,
  warpagePlate: undefined,
  commodityTestWay: undefined,
  testPoint: undefined,
  spareQuantity: undefined,
  copperFoil: undefined,
  vCut: undefined,
  holeRequirement: undefined,
  inspectionStandard: undefined,
  goldArea: undefined,
  pp: undefined,
  nickelThickness: undefined,
  tinThickness: undefined,
  minLineWidth: undefined,
  minLineSpace: undefined,
  minAperture: undefined,
  holeCount: undefined,
  holeDensity: undefined,
  submitUserId: undefined,
  auditUserId: undefined,
  auditTime: undefined,
  createTime:dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  auditComment: undefined
}
const data = reactive<PageData<AuditOrderForm, AuditOrderQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    code: undefined,
    customerId: undefined,
    commodityName: undefined,
    commodityType: undefined,
    surfaceTreatment: undefined,
    materialLayer: undefined,
    packRequirement: undefined,
    materialQuality: undefined,
    materialBrand: undefined,
    materialLevel: undefined,
    materialCopperOutside: undefined,
    materialCopperInside: undefined,
    singleWidth: undefined,
    singleLength: undefined,
    unitedWidth: undefined,
    unitedLength: undefined,
    unitedNumber: undefined,
    unitedWayLength: undefined,
    unitedWayWidth: undefined,
    commoditySolder: undefined,
    commoditySolderCount: undefined,
    goldenThickness: undefined,
    commoditySolderGloss: undefined,
    commoditySolderRequirement: undefined,
    poreCopper: undefined,
    characterColor: undefined,
    characterCount: undefined,
    commodityForm: undefined,
    characterRequirement: undefined,
    setCross: undefined,
    warpagePlate: undefined,
    commodityTestWay: undefined,
    testPoint: undefined,
    spareQuantity: undefined,
    copperFoil: undefined,
    vCut: undefined,
    holeRequirement: undefined,
    inspectionStandard: undefined,
    goldArea: undefined,
    pp: undefined,
    nickelThickness: undefined,
    tinThickness: undefined,
    minLineWidth: undefined,
    minLineSpace: undefined,
    minAperture: undefined,
    holeCount: undefined,
    holeDensity: undefined,
    submitUserId: undefined,
    auditUserId: undefined,
    auditTime: undefined,
    auditComment: undefined,
    params: {}
  },
  rules: {
    id: [
      {required: true, message: "$comment不能为空", trigger: "blur"}
    ],
    code: [
      {required: true, message: "预审单编号不能为空", trigger: "change"}
    ],
    customerId: [
      {required: true, message: "客户ID不能为空", trigger: "change"}
    ],
    commodityName: [
      {required: true, message: "产品名称不能为空", trigger: "change"}
    ],
    commodityType: [
      {required: true, message: "产品类型不能为空", trigger: "change"}
    ],
    surfaceTreatment: [
      {required: true, message: "表面处理不能为空", trigger: "change"}
    ],
    materialLayer: [
      {required: true, message: "层数不能为空", trigger: "blur"}
    ],
    materialQuality: [
      {required: true, message: "板材不能为空", trigger: "change"}
    ],
    singleWidth: [
      {required: true, message: "单片宽不能为空", trigger: "blur"}
    ],
    singleLength: [
      {required: true, message: "单片长不能为空", trigger: "blur"}
    ],
    unitedWidth: [
      {required: true, message: "联片宽不能为空", trigger: "blur"}
    ],
    unitedLength: [
      {required: true, message: "连片长不能为空", trigger: "blur"}
    ],
    unitedWayLength: [
      {required: true, message: "连片方式长不能为空", trigger: "blur"}
    ],
    unitedWayWidth: [
      {required: true, message: "连片方式宽不能为空", trigger: "blur"}
    ],
    commoditySolder: [
      {required: true, message: "阻焊颜色不能为空", trigger: "change"}
    ],
    characterColor: [
      {required: true, message: "字符颜色不能为空", trigger: "change"}
    ],
    commodityForm: [
      {required: true, message: "成形方式不能为空", trigger: "change"}
    ],
    commodityTestWay: [
      {required: true, message: "测试方式不能为空", trigger: "change"}
    ],
    auditComment: [
      {required: true, message: "审核意见不能为空", trigger: "blur"}
    ]
  }
});

const {queryParams, form, rules} = toRefs(data);

/**
 *输入整数和小数点
 * @param val
 * @param field
 */
const mustNumberPoint = (val: any, field: string) => {
  const temp = val
  console.log(temp)
  form.value[field] = temp.replace(/[^\d.]/g,'')
}

/**
 *只能输入整数
 * @param val
 * @param field
 */

const mustNumber = (val: any, field: string) => {
  const temp = val
  console.log(temp)
  // e = e.replace(/\D/g,'')
  // console.log(e.target)
  form.value[field] = temp.replace(/\D/g,'')
}
/** 查询预审单列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAuditOrder(queryParams.value);
  //Object.assign(auditOrderList.value, res.data);
  auditOrderList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/**
 * 预审单查询
 * @param params
 */
const searchChange = (params: any) => {
  queryParams.value = params;
  getList();
}

/**
 * 查询所有的客户编码
 */
let customerCodes: CustomerVO[] = [];
const getCustomerCodeLists = async () => {
  const res = await getListCustomer();
  console.log(res)
  let customerList =  res.data;
  //过滤禁用的客户编码
  customerCodes = customerList.filter(item => item.isDisabled !='1');
  customerList.forEach(item => {
    item.customerCode = String(item.customerCode)
  })
  console.log(customerCodes);
}


/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  auditOrderFormRef.value?.resetFields();
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

/** 多选框选中数据 */
const handleSelectionChange = (selection: AuditOrderVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

const selectableFun = (row: any) => {
  console.log(row.disabled);
  return row.status != '2';
}

const dialogTableLoading = ref(false)
/**
 * 查看工程预审详情
 * @param row
 */
const handleSelect = async (row?: RawMaterialVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "查看工程预审详情";
  dialogTableLoading.value = true
  const _id = row?.id || ids.value[0]
  const res = await getAuditOrder(_id);
  Object.assign(form.value, res.data);
  dialogTableLoading.value = false
}

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '预审单'
});

let reportUrl = ref("");
const saleAuditorderUReportHandle = async(row:RawMaterialVO) => {
  reportDrawer.title = "工程预审单预览";
  reportDrawer.visible = true;
  reportUrl.value = getReportUrl()+`&_n=预审单&_u=file:saleAuditOrder.ureport.xml&url=system/auditOrder/report/${row.id}`;
  console.log(reportUrl.value);
}


/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  form.value.createTime = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
  dialog.visible = true;
  dialog.title = "添加预审单";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: AuditOrderVO) => {
  reset();
  dialog.visible = true;
  dialog.title = "修改预审单";
  dialogTableLoading.value = true
  const _id = row?.id || ids.value[0]
  const res = await getAuditOrder(_id);
  Object.assign(form.value, res.data);
  dialogTableLoading.value = false
}


/** 提交按钮 */
const submitForm = () => {
  console.log('sdd----',form.value.holeDensity)
  auditOrderFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        form.value.holeDensity = isNaN(form.value.holeDensity) || form.value.holeDensity === undefined ? 0 : form.value.holeDensity;
        await updateAuditOrder(form.value).finally(() => buttonLoading.value = false);
      } else {
        form.value.holeDensity = isNaN(form.value.holeDensity) || form.value.holeDensity === undefined ? 0 : form.value.holeDensity;
        await addAuditOrder(form.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      getDict();
      await getList();

    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: AuditOrderVO) => {
  const _ids = row?.id || ids.value;
  const code = row?.code;
  await proxy?.$modal.confirm('是否确认删除预审单编号为"' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delAuditOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}


/** 操作提交按钮操作 */
const handleSubmit = async (row?: AuditOrderVO) => {
  const _ids = row?.id || ids.value;
  const code = row?.code;
  await proxy?.$modal.confirm('是否确认提交预审单编号为"' + code + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await submitAuditOrder(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("提交成功");
  await getList();
}

/**
 * 列名
 */
const columnList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '状态', field: 'status', align: 'center', filterType: 'radioButton',
    filterParam: {placeholder: '请输入状态'},
    filterData: () => [...dictList.value.order_status],
    filterCustom: {label: 'dictLabel', value: 'dictValue'}
  },
  {title: '预审单编号', field: 'code', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入预审单编码'}},
  {title: '客户编码', field: 'customerCode', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  {title: '产品名称', field: 'commodityName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {title: '产品类型', field: 'commodityType', align: 'center', filterType: 'select', filterParam: {placeholder: '请输入产品类型'}, filterData: () => dictList.value.sys_commodity_type},
  {title: '制单人', field: 'createByName', align: 'center', filterType: 'input', filterParam: {placeholder: '请输入制单人'}},
  {
    title: '创建时间',
    field: 'createTime',
    align: 'center',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }

  },
  {title: '操作', align: 'center', field: 'make' ,showOverflow: false},
]);

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/auditOrder/export', {
    ...queryParams.value
  }, `预审单清单_${new Date().getTime()}.xlsx`)
}

/**
 * 新增数据字典
 * @param row
 */
const saveDict= async (dictLabel : string,dictType:string) => {
  if ( dictLabel!="" && dictType!=null){
    await saveDictData(dictLabel,dictType);
  }
}

onMounted(() => {
  getList();
  getDict();
  getCustomerCodeLists();
  //unitedWayNumber();
});

/**
 * 计算孔密度
 */
const holeCountnumber = async () => {
  form.value.holeDensity = Number(parseFloat(form.value.holeCount) / parseFloat(form.value.unitedLength) / parseFloat(form.value.unitedWidth) * 100).toFixed(6);
  return (isNaN(form.value.holeDensity) || form.value.holeDensity === undefined? 0 : form.value.holeDensity);
}

const unitedWayNumber = async () => {
  if (form.value.unitedWayLength && form.value.unitedWayWidth) {
    return form.value.unitedNumber = parseFloat(Number(form.value.unitedWayLength || 0)) * parseFloat(Number(form.value.unitedWayWidth || 0));
  }
}

</script>

<style>
.el-form-item--small {
  margin-bottom: 18px !important;
}
</style>
