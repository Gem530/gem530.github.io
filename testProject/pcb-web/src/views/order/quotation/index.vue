<template>
  <div class="p-2 xtable-page">
    <!-- <el-card shadow="never" class="xtable-card"> -->
      <el-tabs v-model="editableTabsValue" @tab-change="getVoidedList()" class="xtable-tab">
        <el-tab-pane label="待报价" name="1">
          <div class="head-btn-flex">
            <el-button :loading="buttonLoading" type="primary" @click="handleGenerate()">生成报价单</el-button>
          </div>

          <XTable toolId="quotationWait" :pageShow="true" v-model:page-size="queryParams.pageSize" height="100%" class="xtable-content"
                  v-model:current-page="queryParams.pageNum"
                  :page-params="{ perfect: true, total: total }"
                  :data="quotationList" :loading="loading"
                  :columnList="columnList"
                  :intervalCondition="['quotationTime','submitTime']"
                  :footer-method="footerMethod"
                  :show-footer="true"
                  ref="xTable" border :showRefresh="true"
                  @searchChange="searchChange"
                  @selection-change="handleSelectionChange"
                  :column-config="{ resizable: true }">
<!--            <template #default-materialQuality="scope">
&lt;!&ndash;              <dict-tag :options="dictList.order_material_quality" :value="scope.row.materialQuality"/>&ndash;&gt;
              {{dictList.order_material_quality.find((v: any) => v.value == scope.row.materialQuality)?.label}}
            </template>
            <template #default-materialBrand="scope">
&lt;!&ndash;              <dict-tag :options="order_plate_brand" :value="scope.row.materialBrand"/>&ndash;&gt;
              {{dictList.order_plate_brand.find((v: any) => v.value == scope.row.materialBrand)?.label}}
            </template>
            <template #default-materialLevel="scope">
&lt;!&ndash;              <dict-tag :options="order_material_level" :value="scope.row.materialLevel"/>&ndash;&gt;
              {{dictList.order_material_level.find((v: any) => v.value == scope.row.materialLevel)?.label}}
            </template>
            <template #default-commodityThickness="scope">
&lt;!&ndash;              <dict-tag :options="finish_plate_thickness" :value="scope.row.commodityThickness"/>&ndash;&gt;
              {{dictList.finish_plate_thickness.find((v: any) => v.value == scope.row.commodityThickness)?.label}}
            </template>
            <template #default-commoditySolder="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_solder" :value="scope.row.commoditySolder"/>&ndash;&gt;
              {{dictList.order_commodity_solder.find((v: any) => v.value == scope.row.commoditySolder)?.label}}
            </template>
            <template #default-commoditySolderCount="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_solder_count" :value="scope.row.commoditySolderCount"/>&ndash;&gt;
              {{dictList.order_commodity_solder_count.find((v: any) => v.value == scope.row.commoditySolderCount)?.label}}
            </template>
&lt;!&ndash;            <template #default-characterColor="scope">
&lt;!&ndash;              <dict-tag :options="order_character" :value="scope.row.characterColor"/>&ndash;&gt;
              {{dictList.order_character.find((v: any) => v.value == scope.row.characterColor)?.label}}
            </template>&ndash;&gt;
            <template #default-characterCount="scope">
&lt;!&ndash;              <dict-tag :options="order_character_count" :value="scope.row.characterCount"/>&ndash;&gt;
              {{dictList.order_character_count.find((v: any) => v.value == scope.row.characterCount)?.label}}
            </template>
            <template #default-commodityForm="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_form" :value="scope.row.commodityForm"/>&ndash;&gt;
              {{dictList.order_commodity_form.find((v: any) => v.value == scope.row.commodityForm)?.label}}
            </template>
            <template #default-commodityTestWay="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_testway" :value="scope.row.commodityTestWay"/>&ndash;&gt;
              {{dictList.order_commodity_testway.find((v: any) => v.value == scope.row.commodityTestWay)?.label}}
            </template>
            <template #default-holeRequirement="scope">
&lt;!&ndash;              <dict-tag :options="order_hole_requirement" :value="scope.row.holeRequirement"/>&ndash;&gt;
              {{dictList.order_hole_requirement.find((v: any) => v.value == scope.row.holeRequirement)?.label}}
            </template>
            <template #default-inspectionStandard="scope">
&lt;!&ndash;              <dict-tag :options="order_inspection_standard" :value="scope.row.inspectionStandard"/>&ndash;&gt;
              {{dictList.order_inspection_standard.find((v: any) => v.value == scope.row.inspectionStandard)?.label}}
            </template>
            <template #default-packRequirement="scope">
&lt;!&ndash;              <dict-tag :options="order_packaging_requirements" :value="scope.row.packRequirement"/>&ndash;&gt;
              {{dictList.order_packaging_requirements.find((v: any) => v.value == scope.row.packRequirement)?.label}}
            </template>
            <template #default-model="scope">
&lt;!&ndash;              <dict-tag :options="order_model" :value="scope.row.model"/>&ndash;&gt;
              {{dictList.order_model.find((v: any) => v.value == scope.row.model)?.label}}
            </template>
            <template #default-urgent="scope">
&lt;!&ndash;              <dict-tag :options="order_urgent" :value="scope.row.urgent"/>&ndash;&gt;
              {{dictList.order_urgent.find((v: any) => v.value == scope.row.urgent)?.label}}
            </template>-->

            <template #default-model="scope">
              {{ dictList.order_model.find((v: any) => v.value == scope.row.model)?.label }}
            </template>
            <template #default-file="scope">
              <el-popover placement="bottom" :width="680" trigger="click" persistent>
                <template #reference>
                  <el-button link type="primary" >查看</el-button>
                </template>
                <XTable :data="scope.row.quotationFileList" border :columnList="quotionFileList" :pageShow="false">
                  <template #default-make="{row}">
<!--                    <el-button link type="primar" @click="delFile">删除</el-button>-->
                    <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
                  </template>
                </XTable>
              </el-popover>
            </template>
            <template #default-make="scope">
              <el-button link type="primary" @click="handleUpdate(scope.row)"
                          >编辑
              </el-button>
              <el-button link type="primary" @click="handleSubmit(scope.row)"
                          >作废
              </el-button>
              <el-button link type="primary" @click="handleDelete(scope.row)"
                          >驳回
              </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已报价" name="2">
          <div class="head-btn-flex">
            <el-button :loading="buttonLoading" type="primary" @click="handleSalesContract()">生成销售合同</el-button>
          </div>
          <XTable toolId="quotationFinish" :pageShow="true" v-model:page-size="queryParams2.pageSize" height="100%" class="xtable-content"
                  v-model:current-page="queryParams2.pageNum"
                  :page-params="{ perfect: true, total: total2 }"
                  :data="quotationQuotedList" :loading="loading"
                  :columnList="columnOrderList"
                  :footer-method="footerMethod"
                  :show-footer="true"
                  ref="xTableAlready" border
                  @searchChange="searchChange"
                  :intervalCondition="['submitTime']"
                  :showRefresh="true"
                  @selection-change="handleSelectionChange"
                  :column-config="{ resizable: true }">
<!--            <template #default-materialQuality="scope">
&lt;!&ndash;              <dict-tag :options="order_material_quality" :value="scope.row.materialQuality"/>&ndash;&gt;
              {{dictList.order_material_quality.find((v: any) => v.value == scope.row.materialQuality)?.label}}
            </template>
            <template #default-materialBrand="scope">
&lt;!&ndash;              <dict-tag :options="order_plate_brand" :value="scope.row.materialBrand"/>&ndash;&gt;
              {{dictList.order_plate_brand.find((v: any) => v.value == scope.row.materialBrand)?.label}}
            </template>
            <template #default-materialLevel="scope">
&lt;!&ndash;              <dict-tag :options="order_material_level" :value="scope.row.materialLevel"/>&ndash;&gt;
              {{dictList.order_material_level.find((v: any) => v.value == scope.row.materialLevel)?.label}}
            </template>
            <template #default-commodityThickness="scope">
&lt;!&ndash;              <dict-tag :options="finish_plate_thickness" :value="scope.row.commodityThickness"/>&ndash;&gt;
              {{dictList.finish_plate_thickness.find((v: any) => v.value == scope.row.commodityThickness)?.label}}
            </template>
            <template #default-commoditySolder="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_solder" :value="scope.row.commoditySolder"/>&ndash;&gt;
              {{dictList.order_commodity_solder.find((v: any) => v.value == scope.row.commoditySolder)?.label}}
            </template>
            <template #default-commoditySolderCount="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_solder_count" :value="scope.row.commoditySolderCount"/>&ndash;&gt;
              {{dictList.order_commodity_solder_count.find((v: any) => v.value == scope.row.commoditySolderCount)?.label}}
            </template>
&lt;!&ndash;            <template #default-characterColor="scope">
&lt;!&ndash;              <dict-tag :options="order_character" :value="scope.row.characterColor"/>&ndash;&gt;
              {{dictList.order_character.find((v: any) => v.value == scope.row.characterColor)?.label}}
            </template>&ndash;&gt;
            <template #default-characterCount="scope">
&lt;!&ndash;              <dict-tag :options="order_character_count" :value="scope.row.characterCount"/>&ndash;&gt;
              {{dictList.order_character_count.find((v: any) => v.value == scope.row.characterCount)?.label}}
            </template>
            <template #default-commodityForm="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_form" :value="scope.row.commodityForm"/>&ndash;&gt;
              {{dictList.order_commodity_form.find((v: any) => v.value == scope.row.commodityForm)?.label}}
            </template>
            <template #default-commodityTestWay="scope">
&lt;!&ndash;              <dict-tag :options="order_commodity_testway" :value="scope.row.commodityTestWay"/>&ndash;&gt;
              {{dictList.order_commodity_testway.find((v: any) => v.value == scope.row.commodityTestWay)?.label}}
            </template>
            <template #default-holeRequirement="scope">
&lt;!&ndash;              <dict-tag :options="order_hole_requirement" :value="scope.row.holeRequirement"/>&ndash;&gt;
              {{dictList.order_hole_requirement.find((v: any) => v.value == scope.row.holeRequirement)?.label}}
            </template>
            <template #default-inspectionStandard="scope">
&lt;!&ndash;              <dict-tag :options="order_inspection_standard" :value="scope.row.inspectionStandard"/>&ndash;&gt;
              {{dictList.order_inspection_standard.find((v: any) => v.value == scope.row.inspectionStandard)?.label}}
            </template>
            <template #default-packRequirement="scope">
&lt;!&ndash;              <dict-tag :options="order_packaging_requirements" :value="scope.row.packRequirement"/>&ndash;&gt;
              {{dictList.order_packaging_requirements.find((v: any) => v.value == scope.row.packRequirement)?.label}}
            </template>
            <template #default-model="scope">
&lt;!&ndash;              <dict-tag :options="order_model" :value="scope.row.model"/>&ndash;&gt;
              {{dictList.order_model.find((v: any) => v.value == scope.row.model)?.label}}
            </template>
            <template #default-urgent="scope">
&lt;!&ndash;              <dict-tag :options="order_urgent" :value="scope.row.urgent"/>&ndash;&gt;
              {{dictList.order_urgent.find((v: any) => v.value == scope.row.urgent)?.label}}
            </template>-->

            <template #default-model="scope">
              {{ dictList.order_model.find((v: any) => v.value == scope.row.model)?.label }}
            </template>
            <template #default-file="scope">
              <el-popover placement="bottom" :width="680" trigger="click" persistent>
                <template #reference>
                  <el-button link type="primary" >查看</el-button>
                </template>
                <XTable :data="scope.row.quotationFileList" border :columnList="quotionFileList" :pageShow="false">
                  <template #default-make="{row}">
                    <!--                    <el-button link type="primar" @click="delFile">删除</el-button>-->
                    <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
                  </template>
                </XTable>
              </el-popover>
            </template>
            <template #default-make="scope">
                <el-button link type="primary" @click="handleSelect(scope.row)"
                           >详情
                </el-button>
              <el-button link type="primary" @click="handleUpdate(scope.row)"
              >编辑
              </el-button>
                <el-button link type="primary"

                           @click="saleQuotationUReportHandle(scope.row)"
                >预览
                </el-button>
            </template>
          </XTable>
        </el-tab-pane>
        <el-tab-pane label="已作废" name="3">
          <XTable toolId="quotationCancel" :pageShow="true" v-model:page-size="queryParams3.pageSize"  height="100%" class="xtable-content"
                  v-model:current-page="queryParams3.pageNum"
                  :page-params="{ perfect: true, total: total3 }"
                  :data="quotationVoidedList" :loading="loading"
                  :columnList="columnVoidedList"
                  :footer-method="footerMethod"
                  :show-footer="true"
                  ref="xTableAlreadyOld" border
                  @searchChange="searchChange"
                  :intervalCondition="['submitTime']"
                  :showRefresh="true"
                  @selection-change="handleSelectionChange"
                  :column-config="{ resizable: true }">
<!--          <template #default-commodityType="scope">
              {{dictList.sys_commodity_type.find((v: any) => v.value == scope.row.commodityType)?.label}}
            </template>
            <template #default-urgent="scope">
              {{dictList.order_urgent.find((v: any) => v.value == scope.row.urgent)?.label}}
            </template>
            <template #default-materialQuality="scope">
              {{dictList.order_material_quality.find((v: any) => v.value == scope.row.materialQuality)?.label}}
            </template>
            <template #default-materialBrand="scope">
              {{dictList.order_plate_brand.find((v: any) => v.value == scope.row.materialBrand)?.label}}
            </template>
            <template #default-materialLevel="scope">
              {{dictList.order_material_level.find((v: any) => v.value == scope.row.materialLevel)?.label}}
            </template>
            <template #default-commodityThickness="scope">
              {{dictList.finish_plate_thickness.find((v: any) => v.value == scope.row.commodityThickness)?.label}}
            </template>
            <template #default-commoditySolder="scope">
              {{dictList.order_commodity_solder.find((v: any) => v.value == scope.row.commoditySolder)?.label}}
            </template>
            <template #default-commoditySolderCount="scope">
              {{dictList.order_commodity_solder_count.find((v: any) => v.value == scope.row.commoditySolderCount)?.label}}
            </template>
           <template #default-characterColor="scope">
              {{dictList.order_character.find((v: any) => v.value == scope.row.characterColor)?.label}}
            </template>
            <template #default-characterCount="scope">
              {{dictList.order_character_count.find((v: any) => v.value == scope.row.characterCount)?.label}}
            </template>
            <template #default-commodityForm="scope">
              {{dictList.order_commodity_form.find((v: any) => v.value == scope.row.commodityForm)?.label}}
            </template>
            <template #default-commodityTestWay="scope">
              {{dictList.order_commodity_testway.find((v: any) => v.value == scope.row.commodityTestWay)?.label}}
            </template>
            <template #default-holeRequirement="scope">
              {{dictList.order_hole_requirement.find((v: any) => v.value == scope.row.holeRequirement)?.label}}
            </template>
            <template #default-inspectionStandard="scope">
              {{dictList.order_inspection_standard.find((v: any) => v.value == scope.row.inspectionStandard)?.label}}
            </template>
            <template #default-packRequirement="scope">
              {{dictList.order_packaging_requirements.find((v: any) => v.value == scope.row.packRequirement)?.label}}
            </template>-->
            <template #default-model="scope">
              {{ dictList.order_model.find((v: any) => v.value == scope.row.model)?.label }}
            </template>
            <template #default-file="scope">
              <el-popover placement="bottom" :width="680" trigger="click" persistent>
                <template #reference>
                  <el-button link type="primary" >查看</el-button>
                </template>
                <XTable :data="scope.row.quotationFileList" border :columnList="quotionFileList" :pageShow="false">
                  <template #default-make="{row}">
                    <!--                    <el-button link type="primar" @click="delFile">删除</el-button>-->
                    <el-button link type="primary" @click="downLoadHandle(row.key)">下载</el-button>
                  </template>
                </XTable>
              </el-popover>
            </template>
            <template #default-make="scope">
                <el-button link type="primary" @click="handleRestore(scope.row)"
                           >恢复
                </el-button>
                <el-button link type="primary" @click="handleSelect(scope.row)"
                           >详情
                </el-button>
            </template>
          </XTable>
        </el-tab-pane>
      </el-tabs>
    <!-- </el-card> -->
    <!--报价下单预览 -->
    <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="65%" visible.sync="false" draggable>
      <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
    </el-drawer>
    <!-- 添加或修改报价单对话框 -->
    <el-drawer :close-on-click-modal="false" :title="dialog.title" v-model="dialog.visible"
      size="45%"
      :modal-class="`add-prod-drawder ${ownerId == '101' && 'normal-prod-drawder'}`">
      <template #header>
        <span class="el-drawer__title no-wrap">{{dialog.title}}</span>
        <TotalTitle :start="true" :firstBorder="true" :list="[
          { title: `总价：${ form.totalOrderPrice }元` },
          { title: `税金：${ form.tax }元` },
          { title: `总金额：${ form.totalPrice }元` },
        ]"></TotalTitle>
      </template>
      <el-form ref="quotationFormRef" :model="form" :rules="rules"
               :disabled="dialog.title === '查看详情'"
               label-width="65px">
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="客户" prop="cusId">
              <el-select v-model="form.cusId" suffix-icon=""
                         style="width: calc(100%)"
                         placeholder=" " filterable
              >
                <el-option
                    v-for="item in customerList"
                    :key="item.id"
                    :label="item.customerCode +'-'+ item.customerName"
                    :value="item.id"
                >
                  <span style="float: left">{{ item.customerCode }}</span>
                  <span
                      style="
                          float: right;
                          padding-left: 60px;
                        "
                  >{{ item.customerName }}</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="表面处理" prop="surfaceTreatment">
              <el-select v-model="form.surfaceTreatment" placeholder=" "  suffix-icon="" class="height-light"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in dictList.order_surface_treatment" :key="dict.value" :label="dict.label"
                           :value="dict.label"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="批量/样品" prop="model">
              <el-select v-model="form.model" placeholder=" "  suffix-icon="">
                <el-option v-for="item in dictList.order_model" :key="item.value" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--层数就是板层 -->
            <el-form-item size="small" label="层数" prop="materialLayer">
              <el-input v-model="form.materialLayer" placeholder=" " class="height-light font-14"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <!--从[预审管理]数据中带出，，默认是A0 可修改 -->
            <el-form-item size="small" label="版本号" prop="version">
              <el-input v-model="form.version" placeholder=" "/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item size="small" label="产品名称" prop="commodityName">
              <el-input v-model="form.commodityName" placeholder=" "/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="产品类型" prop="commodityType">
              <el-select suffix-icon=""
                  v-model="form.commodityType"
                  placeholder=" "
                  @change="saveDict(form.commodityType,'sys_commodity_type')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.sys_commodity_type" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--
              <el-select v-model="form.commodityType" placeholder="请选择产品类型"  @keyup.enter="handleQuery">
                <el-option v-for="dict in sys_commodity_type" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" label="包装要求" prop="packRequirement">
              <el-select v-model="form.packRequirement" placeholder=" "  suffix-icon=""
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in dictList.order_packaging_requirements" :key="dict.value" :label="dict.label"
                           :value="dict.label"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item size="small" label="物料编码" prop="materialNumber">
              <el-input v-model="form.materialNumber" placeholder=" " :maxlength="33"
                        :error="'输入长度不能超过33个字符'"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="small" label="物料名称" prop="materialName">
              <el-input v-model="form.materialName" placeholder=" " :maxlength="33"
                        :error="'输入长度不能超过33个字符'" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item size="small" label="订单特殊要求" prop="specialRequirement" label-width="75px">
              <el-input type="textarea" rows="1" v-model="form.specialRequirement" placeholder=" "  :maxlength="666"
                        :error="'输入长度不能超过666个字符'"/>
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item size="small" label="板材" prop="materialQuality">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.materialQuality"
                  placeholder=" "
                  @change="saveDict(form.materialQuality,'order_material_quality')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_material_quality" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialQuality" placeholder="请选择板材"  @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_quality" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="板材品牌" prop="materialBrand">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.materialBrand"
                  placeholder=" "
                  @change="saveDict(form.materialBrand,'order_plate_brand')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_plate_brand" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialBrand" placeholder="请选择板材品牌"  @keyup.enter="handleQuery">
                <el-option v-for="dict in order_plate_brand" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="板材级别" prop="materialLevel">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.materialLevel"
                  placeholder=" "
                  @change="saveDict(form.materialLevel,'order_material_level')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_material_level" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.materialLevel" placeholder="请选择板材级别"  @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_level" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="成品板厚" prop="commodityThickness">
              <el-select suffix-icon="" class="height-light font-14"
                  v-model="form.commodityThickness"
                  placeholder=" "
                  @change="saveDict(form.commodityThickness,'finish_plate_thickness')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.finish_plate_thickness" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--
              <el-select v-model="form.commodityThickness" placeholder="请选择成品板厚"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in finish_plate_thickness" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="外层铜厚" prop="materialCopperOutside">
              <el-select suffix-icon="" class="height-light font-14"
                  v-model="form.materialCopperOutside"
                  placeholder=" "
                  @change="saveDict(form.materialCopperOutside,'order_material_copperoutside')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_material_copperoutside" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>

<!--              <el-select v-model="form.materialCopperOutside" placeholder="请选择外层铜厚"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_copperoutside" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="内层铜厚" prop="materialCopperInside">
              <el-select suffix-icon=""
                  v-model="form.materialCopperInside"
                  placeholder=" "
                  @change="saveDict(form.materialCopperInside,'order_material_copperinside')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_material_copperinside" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>

<!--              <el-select v-model="form.materialCopperInside" placeholder="请选择内层铜厚"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_material_copperinside" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="单片尺寸" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="singleLength" class="flex-start">
                    <el-input type="number" v-model.number="form.singleLength" placeholder=" "><template #append>mm</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="12">
                  <el-form-item prop="singleWidth" class="flex-start">
                    <el-input type="number" v-model.number="form.singleWidth" placeholder=" "><template #append>mm</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item size="small" label="单片尺寸" prop="singleLength" label-width="80px">
              <el-input v-model="form.singleLength" placeholder="长" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <span style=" float: left;line-height: 30px;">x</span>
          <el-col :span="5">
            <el-form-item size="small" label="" prop="singleWidth" label-width="10px">
              <el-input v-model="form.singleWidth" placeholder="宽" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="11">
            <el-form-item label="联片尺寸" required>
              <el-row>
                <el-col :span="9">
                  <el-form-item prop="unitedLength" class="flex-start">
                    <el-input type="number" v-model.number="form.unitedLength" placeholder=" " @blur="unitedNumberCount(true)"><template #append>mm</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="1">X</el-col>
                <el-col :span="9">
                  <el-form-item prop="unitedWidth" class="flex-start">
                    <el-input type="number" v-model.number="form.unitedWidth" placeholder=" " @blur="unitedNumberCount(true)"><template #append>mm</template></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item prop="unitedNumber" class="flex-start">
                    <el-input type="number" v-model.number="form.unitedNumber" placeholder=" " disabled><template #append>pcs</template></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item size="small" label="联片尺寸" prop="unitedLength">
              <el-input v-model="form.unitedLength" placeholder="长"  @mouseleave="unitedNumberCount()" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <span style=" float: left;line-height: 30px;">x</span>
          <el-col :span="5">
            <el-form-item label="" size="small" prop="unitedWidth" label-width="5px">
              <el-input v-model="form.unitedWidth" placeholder="宽"  @mouseleave="unitedNumberCount()" type="number">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="6">
            <el-form-item size="small" label="联片数量" prop="unitedNumber" label-width="80px">
              <el-col>
                <el-input v-model="form.unitedNumber" :disabled="true" placeholder="联片数量">
                  <template #append>pcs</template>
                </el-input>
              </el-col>
            </el-form-item>
          </el-col> -->
          <el-col :span="5">
            <el-form-item label="连片方式" required>
              <el-row>
                <el-col :span="11">
                  <el-form-item prop="unitedWayLength" class="error-left-one">
                    <el-input type="number" v-model.number="form.unitedWayLength" placeholder=" " @blur="unitedNumberCount()" @input="(val) => mustNumber(val, 'unitedWayLength')"></el-input>
                  </el-form-item>
                </el-col>
                <el-col style="text-align: center;" :span="2">X</el-col>
                <el-col :span="11">
                  <el-form-item prop="unitedWayWidth" class="error-left">
                    <el-input type="number" v-model.number="form.unitedWayWidth" placeholder=" " @input="(val) => mustNumber(val, 'unitedWayWidth')"
                            @blur="unitedNumberCount()"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="10">
            <el-row :gutter="20">
              <el-col :span="15">
                <el-form-item size="small" label="连片方式" prop="unitedWayLength" label-width="80px">
                  <el-input v-model.number="form.unitedWayLength" placeholder="长" @mouseleave="unitedNumberCount()" @input="(val) => mustNumber(val, 'unitedWayLength')"></el-input>
                </el-form-item>
              </el-col>
              <span style=" float: left;line-height: 30px;">x</span>
              <el-col :span="8">
                <el-form-item size="small" label="" prop="unitedWayWidth" label-width="5px">
                  <el-input v-model.number="form.unitedWayWidth" placeholder="宽" @input="(val) => mustNumber(val, 'unitedWayWidth')"
                            @mouseleave="unitedNumberCount()"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col> -->

          <el-col :span="24">
            <el-form-item size="small" label="产品备注" prop="commodityRemark">
              <el-input type="textarea" rows="1" v-model="form.commodityRemark" placeholder=" " :maxlength="666"
                        :error="'输入长度不能超过666个字符'"/>
            </el-form-item>
          </el-col>

          <el-divider content-position="left"></el-divider>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊颜色" prop="commoditySolder">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.commoditySolder"
                  placeholder=" "
                  @change="saveDict(form.commoditySolder,'order_commodity_solder')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_commodity_solder" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commoditySolder" placeholder="请选择阻焊颜色"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_solder" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="阻焊面数" prop="commoditySolderCount">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.commoditySolderCount"
                  placeholder=" "
                  @change="saveDict(form.commoditySolderCount,'order_commodity_solder_count')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_commodity_solder_count" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commoditySolderCount" placeholder="请选择阻焊面数"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_solder_count" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="金厚" prop="goldenThickness">
              <el-input v-model="form.goldenThickness" placeholder=" ">u''
                <template #append>u''</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="字符" prop="characterColor">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.characterColor"
                  placeholder=" "
                  @change="saveDict(form.characterColor,'order_character')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_character" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.characterColor" placeholder="请选择字符颜色"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_character" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="字符面数" prop="characterCount">
              <el-select suffix-icon=""
                  v-model="form.characterCount"
                  placeholder=" "
                  @change="saveDict(form.characterCount,'order_character_count')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_character_count" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.characterCount" placeholder="请选择字符面数"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_character_count" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="成形方式" prop="commodityForm" class="error-left">
              <el-select suffix-icon=""
                  v-model="form.commodityForm"
                  placeholder=" "
                  @change="saveDict(form.commodityForm,'order_commodity_form')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_commodity_form" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试方式" prop="commodityTestWay">
              <el-select suffix-icon="" class="height-light"
                  v-model="form.commodityTestWay"
                  placeholder=" "
                  filterable
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_commodity_testway" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.commodityTestWay" placeholder="请选择测试方式"
                         @keyup.enter="handleQuery">
                <el-option v-for="dict in order_commodity_testway" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试架" prop="testFrame">
              <el-select suffix-icon=""
                  v-model="form.testFrame"
                  placeholder=" "
                  filterable
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_test_stand" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试点" prop="testPoint">
              <el-input v-model="form.testPoint" placeholder=" " class="height-light"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="过孔要求" prop="holeRequirement">
              <el-select suffix-icon=""
                  v-model="form.holeRequirement"
                  placeholder=" "
                  @change="saveDict(form.holeRequirement,'order_hole_requirement')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_hole_requirement" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.holeRequirement" placeholder="过孔要求"  @keyup.enter="handleQuery">
                <el-option v-for="dict in order_hole_requirement" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="检验标准" prop="inspectionStandard">
              <el-select suffix-icon=""
                  v-model="form.inspectionStandard"
                  placeholder=" "
                  @change="saveDict(form.inspectionStandard,'order_inspection_standard')"
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"

                  style="width: 440px"
              >
                <el-option v-for="dict in dictList.order_inspection_standard" :key="dict.value" :label="dict.label" :value="dict.label" />
              </el-select>
<!--              <el-select v-model="form.inspectionStandard" placeholder="检验标准"  @keyup.enter="handleQuery">
                <el-option v-for="dict in order_inspection_standard" :key="dict.value" :label="dict.label"
                           :value="dict.value"/>
              </el-select>-->
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="金面积" prop="goldArea">
              <el-input v-model="form.goldArea" placeholder=" "/>
            </el-form-item>
          </el-col>

          <!-- 订购数量 -->
          <el-col :span="5">
            <el-form-item size="small" label="订购数量" prop="quantity">
              <el-input :controls="false" class="height-light font-14" type="number"  v-model="form.quantity" placeholder=" " @change="countQuantity(form)">pcs
                <template #append>pcs</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="small" label="订单面积" prop="area">
              <el-input class="height-light font-14" v-model="form.area" placeholder=" " type="number" :disabled="true">m²
                <template #append>m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="small" label="平米价" prop="areaPrice">
              <el-input :controls="false" class="height-light font-14"  type="number"  v-model="form.areaPrice" placeholder=" " :min="0" :precision="4" max="99999999999999" @change="countPrice(form)">
                <template #append>元/m²</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item size="small" label="单价" prop="price">
              <el-input class="height-light font-14" v-model="form.price" placeholder=" " @change="countPriceOther(form)" type="number">元/m²
                <template #append>元/pcs</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="加急" prop="urgent">
              <el-select suffix-icon="" class="height-light" v-model="form.urgent" placeholder=" "  @keyup.enter="handleQuery">
                <el-option v-for="dict in dictList.order_urgent" :key="dict.value" :label="dict.label" :value="dict.value"/>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item size="small" label="订单备注" prop="remark">
              <el-input type="textarea" rows="1" v-model="form.remark" placeholder=" " :maxlength="666"
                        :error="'输入长度不能超过666个字符'"/>
            </el-form-item>
          </el-col>

          <el-divider content-position="left"></el-divider>
          <el-col :span="4">
            <el-form-item size="small" label="模具费" prop="mouldCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="form.mouldCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="测试架费" prop="testFrameCost">
              <el-input class="number-left height-light font-14" style="width: 100%;" v-model="form.testFrameCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="飞针费" prop="flyProbeCost">
              <el-input class="number-left height-light font-14" style="width: 100%;" v-model="form.flyProbeCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="工程费" prop="engineeringCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="form.engineeringCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="样板费" prop="sampleCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="form.sampleCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="加急费" prop="expeditedCost">
              <el-input class="number-left font-14" style="width: 100%;" v-model="form.expeditedCost" placeholder=" " @change="countPriceOther(form)"/>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="4"> -->
<!--            <el-form-item size="small" label="其他费用" prop="otherCost">
              <el-input v-model="form.otherCost" placeholder="其他费用" type="number"/>
            </el-form-item>-->
            <!-- <span size="small">其他费用</span>
            <el-button type="text" icon="Plus" @click.prevent="addOtherCost()"></el-button>
          </el-col> -->
          <el-col :span="24">
            <el-form-item label="其他费用" prop="otherCostList" label-width="75px">
              <template #label>
                <el-row>
                  <el-col :span="20"><div style="line-height:28px;">其他费用</div></el-col>
                  <el-col :span="4" class="pointer" @click.prevent="addOtherCost()">
                    <el-button icon="Plus" link type="primary"></el-button>
                  </el-col>
                </el-row>
              </template>
              <el-row style="width: 100%;">
                <template v-for="(item, index) in form.otherCostList" :key="index">
                  <el-col :span="6" v-if="item?.delFlag == '0'">
                    <el-row>
                      <el-col :span="10"><el-input v-model="item.title"></el-input></el-col>
                      <el-col :span="10">
                        <el-form-item :prop="`otherCostList.${index}.price`" :rules="[{required: false, validator: towFloadNegativeHandle, trigger: 'blur'}]">
                          <el-input style="width: 100%;" class="font-14" v-model="item.price" @change="countPriceOther(form)"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="4" style="text-align: center;" class="pointer" @click.prevent="removeotherCost(item)">
                        <el-button icon="Close" link type="primary"></el-button>
                      </el-col>
                    </el-row>
                  </el-col>
                </template>
              </el-row>
            </el-form-item>
          </el-col>

          <!-- <template v-for="(item, index) in form.otherCostList" :key="index">
            <el-col :span="4"  v-if="item?.delFlag == '0'">
              <el-form-item label-width="0"  >
                <div style="display:flex;">
                  <el-input type="text" v-model="item.title" style="width:85px;display:inline-block"></el-input>

                  <el-input-number
                      style="width: 100px;padding-left: 5px"
                      v-model="item.price"
                      type="number"
                      :precision="2"
                      :controls="false"
                  ></el-input-number>
                  <el-button type="text" icon="Close" @click.prevent="removeotherCost(item)"></el-button>
                </div>
              </el-form-item>
            </el-col>
          </template> -->

        <el-divider content-position="left"></el-divider>
          <el-col :span="6">
            <el-form-item size="small" label="最小线宽" prop="minLineWidth">
              <el-input class="height-light" v-model="form.minLineWidth" placeholder=" " type="number" :min="0">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="最小线距" prop="minLineSpace">
              <el-input class="height-light" v-model="form.minLineSpace" placeholder=" " type="number" :min="0">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="最小孔径" prop="minAperture">
              <el-input class="height-light" v-model="form.minAperture" placeholder=" " type="number" :min="0">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="总孔数" prop="holeCount">
              <el-input class="font-14" :controls="false" v-model="form.holeCount" placeholder=" " type="number" :min="0" @blur="holeCountnumber()">
                <template #append>/连板(SLOT)</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="孔密度" prop="holeDensity">
              <el-input  class="height-light" v-model="form.holeDensity" type="number"><template #append>万/m²</template>
              </el-input>
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

        <el-col :span="24" style="margin-bottom: 5px;" v-if="dialog.title != '查看详情'">
          <XUpload v-model:model-value="form.quotationFileList" model="download"></XUpload>
        </el-col>

        <el-col :span="24" style="margin-bottom: 5px;" v-if="popoverFileList.filter((v: any) => v.delFlag == 0).length">
          <XTable ref="popFileRef" :data="popoverFileList.filter((v: any) => v.delFlag == 0)"  border :columnList="quotionFileList" :pageShow="false">
            <template #default-make="{row}">
              <div class="global-flex">
                <el-button link type="primary" @click="deletequotationEvent(row)" v-if="dialog.title != '查看详情'">删除</el-button>
                <el-form>
                  <el-button link type="primary"  @click="downLoadHandle(row.key)">下载</el-button>
                </el-form>
              </div>
            </template>
          </XTable>
        </el-col>
        <!-- <el-divider content-position="left"></el-divider>
        <div :header-cell-style="{ textAlign: 'center' }">
          <span style="float: left;margin-right: 20px;">总价：{{ form.totalOrderPrice }}元</span>
          <span style="float: left;margin-right: 20px;">税金：{{ form.tax }}元</span>
          <span style="float: left;margin-right: 20px;">总金额：{{ form.totalPrice }}元</span>
        </div> -->
      </el-form>
      <template #footer v-if="dialog.title != '查看详情'">
        <!-- <div class="text-center" style="margin-top: 5px;" v-if="dialog.title != '查看详情'"> -->
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        <!-- </div> -->
      </template>
    </el-drawer>

    <!-- 新增地址弹窗-->
    <el-dialog v-model="addressDialog.visible" :title="addressDialog.title" :destroy-on-close="true"
               :close-on-click-modal="false" width="350px">
      <el-form label-width="80px" ref="customerAddressFormRef" :model="formAddress" :rules="rulesAddress">
        <el-form-item size="small" label="联系人" prop="name">
          <el-input v-model="formAddress.name" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系电话" prop="phone">
          <el-input v-model="formAddress.phone" autocomplete="off" placeholder="" type="number"></el-input>
        </el-form-item>
        <el-form-item size="small" label="联系地址" prop="address">
          <el-input v-model="formAddress.address" autocomplete="off" placeholder=""></el-input>
        </el-form-item>
        <el-form-item size="small" label="物流周期" prop="logisticsCycle">
          <el-input-number v-model="formAddress.logisticsCycle" autocomplete="off" :min="0" :precision="0" placeholder=""></el-input-number>
        </el-form-item>
      </el-form>
      <div class="text-right">
        <el-button :loading="buttonLoading" type="primary" @click="submitAddress">确 定</el-button>
        <el-button @click="cancelAddress">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 生成销售报价单对话框 -->
    <el-drawer :title="generateDialog.title" v-model="generateDialog.visible" size="70%" @close="cancel">
      <div class="ptable-card">
        <el-form ref="generatequotationFormRef" :model="formInline" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="6">
              <el-form-item size="small" label="报价客户" prop="cusId">
                <el-select v-model="formInline.cusId"
                           style="width: calc(100%)"
                           placeholder=""
                           :disabled="true"
                >
                  <el-option
                      v-for="item in customerList"
                      :key="item.id"
                      :label="item.customerName"
                      :value="item.id"
  
                  >
                    <span style="float: left">{{ item.customerCode }}</span>
                    <span
                        style="
                            float: right;
                            padding-left: 60px;
                          "
                    >{{ item.customerName }}</span
                    >
                  </el-option>
                </el-select>
              </el-form-item>
  
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="负责人" prop="companyPrincipal">
                <el-input v-model="formInline.companyPrincipal" placeholder=""/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="电话" prop="companyPrincipalPhone">
                <el-input v-model="formInline.companyPrincipalPhone" placeholder="" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="传真" prop="faxes">
                <el-input v-model="formInline.faxes" placeholder=""/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="报价时间" prop="placeOrderTime">
                <el-date-picker
                    style="width: 100%;"
                    v-model="formInline.placeOrderTime"
                    :disabled-date="disabledDateEnd"
                    type="datetime"
                    placeholder="选择日期时间"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    format="YYYY-MM-DD HH:mm:ss"
                    clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="业务人员" prop="cusSaleUserId" >
                <el-select v-model="formInline.cusSaleUserId" clearable :collapse-tags="true" filterable
                           placeholder="请选择业务员">
                  <el-option
                      v-for="item in salerOptions"
                      :key="item.userId"
                      :label="item.nickName"
                      :value="item.userId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label-width="80px" style="flex: 1;" label="币种" prop="currency">
                <el-select v-model="formInline.currency" clearable filterable
                           @change="changeCurrency"
                           placeholder="请选择币种">
                  <el-option
                      v-for="dict in currencyTypeOptions"
                      :key="dict.dictCode"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                  />
                </el-select>
  
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="汇率(%)" prop="exchangeRate">
                <el-input :disabled="formInline.currency=='人民币'" :min="0" style="width: 145px;" v-model="formInline.exchangeRate"
                          type="number"
                          placeholder="" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item size="small" label="收货地址" prop="addressId">
                <el-select v-model="formInline.addressId"
                           style="width: calc(100% - 63px)"
                           clearable :collapse-tags="true"
                           filterable
                           placeholder="请选择收货地址">
                  <el-option
                      v-for="item in customerAddressList"
                      :key="item.id"
                      :label="`${item.status==0?'(已禁用)-':''}${item.name},${item.phone},${item.address}`"
                      :value="item.id"
                      :disabled="item.status==0"
                  />
                </el-select>
                <el-button style="width: 60px;margin-left: 3px" text="plain" @click="handleAddAddress">
                  <el-icon>
                    <Plus/>
                  </el-icon>
                  添加地址
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="邮箱" prop="email">
                <el-input v-model="formInline.email" placeholder=""/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item size="small" label="是否含税">
                <el-switch v-model="formInline.isTax" active-value="1" inactive-value="0" active-text="含税"
                           inactive-text="不含税" @change="changeIsTax"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item size="small" label="备注" prop="remark">
                <el-input v-model="formInline.remark" style="padding-top: -10px;" type="textarea" rows="2"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <XTable
            border
            keep-source
            size="small"
            align="center"
            height="100%"
            :showHead="false"
            class="ptable-content"
            :row-config="{height: 50}"
            :show-footer="true"
            :footer-method="footerMethod"
            :edit-rules="validRules"
            show-overflow
            ref="xTableGenerate"
            :pageShow="false"
            :column-config="{resizable: true}"
            :loading="loading"
            :data="tableData"
            :columnList="columnListGenerate"
            :edit-config="{trigger: 'manual', mode: 'row', autoClear: false, showStatus: true}"
        >
          <!-- <vxe-column type="seq" fixed="left" title="序号" width="60"></vxe-column>
          <vxe-column width="120" title="产品名称" field="commodityName">
            <template #edit="{ row }">
              <el-input v-model="row.commodityName" :maxlength="333"
                        :error="'输入长度不能超过333个字符'"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="65" title="版本号" field="version">
            <template #edit="{ row }">
              <el-input v-model="row.version"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="100" title="产品类型" field="commodityType">
            <template #edit="{ row }">
              <el-select v-model="row.commodityType" placeholder="" clearable>
                <el-option v-for="item in dictList.sys_commodity_type" :key="item.value" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </template>
          </vxe-column>
          <vxe-column width="80" title="加急" field="urgent">
            <template #edit="{ row }">
              <el-select v-model="row.urgent" placeholder="" clearable>
                <el-option v-for="item in dictList.order_urgent" :key="item.value" :label="item.label"
                           :value="item.value"/>
              </el-select>
            </template>
            <template #default="{ row }">
              <div v-for="item in dictList.order_urgent">
                <span v-if="item.value==row.urgent">{{ item.label }}</span>
              </div>
            </template>
          </vxe-column>
          <vxe-column width="90" title="订购数量pcs" field="quantity">
            <template #edit="{ row }">
              <el-input v-model="row.quantity"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="85" title="单价" field="price">
            <template #edit="{ row }">
              <el-input v-model="row.price"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="90" title="订单面积(m²)" field="area">
            <template #edit="{ row }">
              <el-input v-model="row.area"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="85" title="平米价" field="areaPrice">
            <template #edit="{ row }">
              <el-input v-model="row.areaPrice"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="85" title="总价" field="totalOrderPrice">
            <template #edit="{ row }">
              <el-input v-model="row.totalOrderPrice"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="85" title="税金" field="tax">
            <template #edit="{ row }">
              <el-input v-model="row.tax"></el-input>
            </template>
          </vxe-column>
          <vxe-column width="85" title="总金额" field="totalPrice">
            <template #edit="{ row }">
              <el-input v-model="row.totalPrice"></el-input>
            </template>
          </vxe-column>
          <vxe-column fixed="right" title="操作" width="100"> -->
            <template #default-make="{row,rowIndex}">
              <el-button link @click="deleteRowEvent(row,rowIndex)">删除</el-button>
            </template>
          <!-- </vxe-column> -->
        </XTable>
      </div>
      <template #footer>
        <!-- <div class="text-center"> -->
          <el-button :loading="buttonLoading" type="primary" @click="preViewQuotation()">预 览</el-button>
          <el-button :loading="buttonLoading" type="primary" @click="handleSave()">保 存</el-button>
          <el-button :loading="buttonLoading" @click="cancel">取 消</el-button>
        <!-- </div> -->
      </template>
    </el-drawer>

    <!--生成销售合同 -->
    <el-drawer destroy-on-close v-model="editOrder.visible" :title="editOrder.title" size="95%" visible.sync="false" draggable>
      <DirectOrder
        :isComp="true"
        :id="editOrder.id"
        :cusId="editOrder.cusId"
        @save="getList2"
        @finish="finishHandle"
        @close="editOrder.visible = false"
      ></DirectOrder>
    </el-drawer>
  </div>
</template>

<script setup name="Quotation" lang="ts">
import fileSaver from "file-saver";
import {
  addQuotation,
  aleadyQuotation,
  cancellationQuotation,
  delQuotation,
  getQuotation,
  postListQuotation,
  restoreQuotation,
  updateQuotation
} from '@/api/order/quotation';
import DirectOrder from '../directOrder';
import {DirectQuotation, QuotationForm, QuotationQuery, QuotationVO} from '@/api/order/quotation/types';
import {ref} from "vue";
import {CustomerVO} from "@/api/basedata/customer/types";
import {getCustomer, getListCustomer} from "@/api/basedata/customer";
import {VXETable, VxeTableInstance, VxeTablePropTypes} from "vxe-table";
import dayjs from "dayjs";
import {getDicts, saveDictData} from "@/api/system/dict/data";
import {DictDataVO} from "@/api/system/dict/data/types";
import {addCustomerAddress, listCustomerAddressByCusId, updateCustomerAddress} from "@/api/basedata/customerAddress";
import {CustomerAddressForm, CustomerAddressQuery, CustomerAddressVO} from "@/api/basedata/customerAddress/types";
import {listUserByRoleKey} from "@/api/system/user";
import {UserVO} from "@/api/system/user/types";
import router from "@/router";
import {sortBy} from "@/utils/dict";
import {downloadUrl} from '@/api/upload/index'
import {deepClone} from "@/utils";
import {getReportUrl} from "@/utils/report";
import useTagsViewStore from '@/store/modules/tagsView';
import useUserStore from '@/store/modules/user';


const { ownerId } = useUserStore();
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const quotationList = ref<QuotationVO[]>([]);
const quotationQuotedList = ref<QuotationVO[]>([]);
const quotationVoidedList = ref<QuotationVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
// 新增属性
const editableTabsValue = ref('1');

const queryFormRef = ref<ElFormInstance>();
const quotationFormRef = ref<ElFormInstance>();
// 编辑订单
const editOrder = reactive({
  visible: false,
  title: '生成销售合同',
  id: undefined,
  cusId: undefined
});

//客户
const customerList = ref<CustomerVO[]>([]);
/*
//数据字典
//批量/样品
const {order_model} = toRefs<any>(proxy?.useDict("order_model"));
//字符颜色
const {order_character} = toRefs<any>(proxy?.useDict("order_character"));
//成形方式
const {order_commodity_form} = toRefs<any>(proxy?.useDict("order_commodity_form"));
//过孔要求
const {order_hole_requirement} = toRefs<any>(proxy?.useDict("order_hole_requirement"));
//测试方式
const {order_commodity_testway} = toRefs<any>(proxy?.useDict("order_commodity_testway"));
//阻焊面数
const {order_commodity_solder_count} = toRefs<any>(proxy?.useDict("order_commodity_solder_count"));
//阻焊颜色
const {order_commodity_solder} = toRefs<any>(proxy?.useDict("order_commodity_solder"));
//字符面数
const {order_character_count} = toRefs<any>(proxy?.useDict("order_character_count"));
//检验标准
const {order_inspection_standard} = toRefs<any>(proxy?.useDict("order_inspection_standard"));
//加急
const {order_urgent} = toRefs<any>(proxy?.useDict("order_urgent"));
//内层铜厚
const {order_material_copperinside} = toRefs<any>(proxy?.useDict("order_material_copperinside"));
//板材
const {order_material_quality} = toRefs<any>(proxy?.useDict("order_material_quality"));
//板材品牌 order_plate_brand
const {order_plate_brand} = toRefs<any>(proxy?.useDict("order_plate_brand"));
//板材级别 order_material_level
const {order_material_level} = toRefs<any>(proxy?.useDict("order_material_level"));
//成品板厚
const {finish_plate_thickness} = toRefs<any>(proxy?.useDict("finish_plate_thickness"));
//外层铜厚
const {order_material_copperoutside} = toRefs<any>(proxy?.useDict("order_material_copperoutside"));
//产品类型
const {sys_commodity_type} = toRefs<any>(proxy?.useDict("sys_commodity_type"));
//包装要求
const {order_packaging_requirements} = toRefs<any>(proxy?.useDict("order_packaging_requirements"));
//表面处理
const {order_surface_treatment} = toRefs<any>(proxy?.useDict("order_surface_treatment"));
//币种
const {currency_type} = toRefs<any>(proxy?.useDict("currency_type"));

const {order_test_frame} = toRefs<any>(proxy?.useDict("order_test_frame"));*/

//地址
const customerAddressList = ref<CustomerAddressVO[]>([]);

const addressDialog = reactive<DialogOption>({
  visible: false,
  title: ""
});
//入参正整数验证
const mustNumber = (val: any, field: string) => {
  const temp = val
  console.log(temp)
  // e = e.replace(/\D/g,'')
  // console.log(e.target)
  form.value[field] = temp.replace(/\D/g,'')
}

// 新增弹窗
const generatequotationFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const generateDialog = reactive<DialogOption>({
  visible: false,
  title: ""
});

const disabledDateEnd = (data: any) => {
  let res = false
  if (new Date(dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00').getTime() > new Date(data).getTime()) {
    res = true
  }
  return res
}


const initFormData: QuotationForm = {
  id: undefined,
  code: undefined,
  quotationTime: undefined,
  cusId: undefined,
  cusName: undefined,
  commodityName: undefined,
  commodityType: undefined,
  surfaceTreatment: undefined,
  model: undefined,
  materialLayer: undefined,
  serialNumber: undefined,
  materialNumber: undefined,
  materialName: undefined,
  specialRequirement: undefined,
  packRequirement: undefined,
  materialQuality: undefined,
  materialBrand: undefined,
  materialLevel: undefined,
  commodityThickness: undefined,
  materialCopperOutside: undefined,
  materialCopperInside: undefined,
  remark: undefined,
  commodityRemark: undefined,
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
  submitUserName: undefined,
  submitTime: undefined,
  quantity: undefined,
  urgent: undefined,
  area: undefined,
  price: undefined,
  areaPrice: undefined,
  totalPrice: undefined,
  totalOrderPrice: undefined,
  tax: undefined,
  engineeringCost: undefined,
  testFrameCost: undefined,
  flyProbeCost: undefined,
  mouldCost: undefined,
  expeditedCost: undefined,
  otherCost: undefined,
  sampleCost: undefined,
  status: undefined,
  saleAuditId: undefined,
  createDeptName: undefined,
  createByName: undefined,
  otherCostList: [],
  updateByName: undefined,
  appearanceRequirements:undefined,
  quotationFileList:[],

}
const initAddressFormData: CustomerAddressForm = {
  name: undefined,
  phone: undefined,
  address: undefined,
  customerId: undefined,
};

const addressData = reactive<PageDataAddress<CustomerAddressForm, CustomerAddressQuery>>({
  formAddress: {...initAddressFormData},
  queryParamsAddress: {
    pageNum: 1,
    pageSize: 20,
    customerId: undefined,
    name: undefined,
    phone: undefined,
    address: undefined,
    params: {}
  },
  rulesAddress: {
    name: [
      {required: true, message: "联系人不能为空", trigger: "blur"}
    ],
    phone: [
      {required: true, message: "电话不能为空", trigger: "blur"}
    ],
    address: [
      {required: true, message: "联系地址不能为空", trigger: "blur"}
    ],
    logisticsCycle: [
      {required: true, message: "物流周期不能为空", trigger: "blur"}
    ],
  }
});

// 产品编码不能超过18位
const noOverEighteen = (cellValue: any) => {
  if (cellValue.length > 18) {
    return new Error('产品编码不能超过18位')
  }
}
VXETable.validators.add('noOverEighteen', {
  cellValidatorMethod({cellValue}) {
    return noOverEighteen(cellValue)
  }
})
const noOverEighteenHandle = (rule: any, value: any, callback: any) => {
  callback(noOverEighteen(value))
}
// number类型校验
const areaValid = (cellValue: any) => {
  if (!cellValue || Number(cellValue) <= 0) {
    return new Error('面积不合法，请检查长宽等信息')
  }
}
VXETable.validators.add('areaValid', {
  cellValidatorMethod({cellValue}) {
    return areaValid(cellValue)
  }
})
const areaValidHandle = (rule: any, value: any, callback: any) => {
  callback(areaValid(value))
}
// number类型校验
const numberValid = (cellValue: any) => {
  if (!/^(([1-9]\d*)|([0][.]{1}[0-9]{0,2}[1-9]+)|([1-9]\d*[.]{1}[0-9]+))$/g.test(cellValue)) {
    return new Error('请输入整数')
  }
}
VXETable.validators.add('numberValid', {
  cellValidatorMethod({cellValue}) {
    return numberValid(cellValue)
  }
})
const numberValidHandle = (rule: any, value: any, callback: any) => {
  callback(numberValid(value))
}
//正整数校验
const positiveIntValid = (cellValue: any) => {
  if (!/^[1-9]\d*$/.test(cellValue)) {
    return new Error('请输入正整数')
  }
}
VXETable.validators.add('positiveIntValid', {
  cellValidatorMethod({cellValue}) {
    return positiveIntValid(cellValue)
  }
})
const positiveIntValidHandle = (rule: any, value: any, callback: any) => {
  callback(positiveIntValid(value))
}
// 0和正整数校验
const zeroAndPositiveIntValid = (cellValue: any) => {
  if (!/^[0-9]\d*$/.test(cellValue)) {
    return new Error('请输入数字')
  }
}
VXETable.validators.add('zeroAndPositiveIntValid', {
  cellValidatorMethod({cellValue}) {
    return zeroAndPositiveIntValid(cellValue)
  }
})
const zeroAndPositiveIntValidHandle = (rule: any, value: any, callback: any) => {
  callback(zeroAndPositiveIntValid(value))
}
// 0+正数且小数点后最多4位校验
const positiveNumberWithTwoDecimals = (cellValue: any) => {
  if (!/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(cellValue)) {
    return new Error('请输入数字、最多四位小数点')
  }
}
VXETable.validators.add('positiveNumberWithTwoDecimals', {
  cellValidatorMethod({cellValue}) {
    return positiveNumberWithTwoDecimals(cellValue)
  }
})
const positiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
  callback(positiveNumberWithTwoDecimals(value))
}

// 非空 0+正数且小数点后最多4位校验
const nullOrZeroAndPositiveIntValid = (cellValue: any) => {
  if (cellValue&&!/^[0-9]\d*$/.test(cellValue)) {
    return new Error('请输入数字')
  }
}
VXETable.validators.add('nullOrZeroAndPositiveIntValid', {
  cellValidatorMethod({cellValue}) {
    return nullOrZeroAndPositiveIntValid(cellValue)
  }
})
const nullOrZeroAndPositiveIntValidHandle = (rule: any, value: any, callback: any) => {
  callback(nullOrZeroAndPositiveIntValid(value))
}

// 0+正数且小数点后最多4位校验
const nullOrPositiveNumberWithTwoDecimals = (cellValue: any) => {
  if (cellValue&&!/^(0|[1-9]\d*)(\.\d{1,4})?$/.test(cellValue)) {
    return new Error('请输入数字、最多四位小数点')
  }
}
VXETable.validators.add('nullOrPositiveNumberWithTwoDecimals', {
  cellValidatorMethod({cellValue}) {
    return nullOrPositiveNumberWithTwoDecimals(cellValue)
  }
})
const nullOrPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
  callback(nullOrPositiveNumberWithTwoDecimals(value))
}
  // 0+正数且小数点后最多2位校验
  const twoPositiveNumberWithTwoDecimals = (cellValue: any) => {
    if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
      return new Error('请输入数字、最多两位小数点')
    }
  }
  VXETable.validators.add('twoPositiveNumberWithTwoDecimals', {
    cellValidatorMethod({cellValue}) {
      return twoPositiveNumberWithTwoDecimals(cellValue)
    }
  })
  const twoPositiveNumberWithTwoDecimalsHandle = (rule: any, value: any, callback: any) => {
    callback(twoPositiveNumberWithTwoDecimals(value))
  }
  // 小数点后最多2位校验，允许负数
  const towFloadNegative = (cellValue: any) => {
    if (!/^-?(0|[1-9]\d*)(\.\d{1,2})?$/.test(cellValue)) {
      return new Error('请输入数字、最多两位小数点')
    }
  }
  VXETable.validators.add('towFloadNegative', {
    cellValidatorMethod({cellValue}) {
      if (!cellValue) {
        return ''
      }
      return towFloadNegative(cellValue)
    }
  })
  const towFloadNegativeHandle = (rule: any, value: any, callback: any) => {
    if (!value) {
      callback()
    }
    callback(towFloadNegative(value))
  }
// 0+正数且小数点后最多6位校验
const nullOrPositiveNumberWithSixDecimals = (cellValue: any) => {
  if (cellValue&&!/^(0|[1-9]\d*)(\.\d{1,6})?$/.test(cellValue)) {
    return new Error('请输入数字、最多六位小数点')
  }
}
VXETable.validators.add('nullOrPositiveNumberWithSixDecimals', {
  cellValidatorMethod({cellValue}) {
    return nullOrPositiveNumberWithSixDecimals(cellValue)
  }
})
const nullOrPositiveNumberWithSixDecimalsHandle = (rule: any, value: any, callback: any) => {
  callback(nullOrPositiveNumberWithSixDecimals(value))
}


const {queryParamsAddress, formAddress, rulesAddress} = toRefs(addressData);

const data = reactive<PageData<QuotationForm, QuotationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "id",
    code: undefined,
    quotationTime: undefined,
    cusId: undefined,
    cusName: undefined,
    commodityName: undefined,
    commodityType: undefined,
    surfaceTreatment: undefined,
    model: undefined,
    materialLayer: undefined,
    serialNumber: undefined,
    materialNumber: undefined,
    materialName: undefined,
    specialRequirement: undefined,
    packRequirement: undefined,
    materialQuality: undefined,
    materialBrand: undefined,
    materialLevel: undefined,
    commodityThickness: undefined,
    materialCopperOutside: undefined,
    materialCopperInside: undefined,
    commodityRemark: undefined,
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
    submitUserName: undefined,
    submitTime: undefined,
    quantity: undefined,
    urgent: undefined,
    area: undefined,
    price: undefined,
    areaPrice: undefined,
    totalPrice: undefined,
    totalOrderPrice: undefined,
    tax: undefined,
    engineeringCost: undefined,
    testFrameCost: undefined,
    flyProbeCost: undefined,
    mouldCost: undefined,
    expeditedCost: undefined,
    otherCost: undefined,
    sampleCost: undefined,
    status: undefined,
    saleAuditId: undefined,
    createDeptName: undefined,
    createByName: undefined,
    updateByName: undefined,
    params: {}
  },
  rules: {
    cusId: [
      {required: true, message: "客户ID不能为空", trigger: "change"}
    ],
    surfaceTreatment: [
      {required: true, message: "表面处理不能为空", trigger: "change"}
    ],
    model: [
      {required: true, message: "批量/样品不能为空", trigger: "change"}
    ],
    materialLayer: [
      {required: true, message: "板层不能为空", trigger: "change"}
    ],
    version: [
      {required: true, message: "版本号", trigger: "change"}
    ],
    commodityName: [
      {required: true, message: "产品名称不能为空", trigger: "change"}
    ],
    materialQuality: [
      {required: true, message: "板材不能为空", trigger: "change"}
    ],
    singleWidth: [
      {required: true, message: "单片宽不能为空", trigger: "change"},
      {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
    ],
    singleLength: [
      {required: true, message: "单片长不能为空", trigger: "change"},
      {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
    ],
    unitedWidth: [
      {required: true, message: "联片宽不能为空", trigger: "change"},
      {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
    ],
    unitedLength: [
      {required: true, message: "联片长不能为空", trigger: "change"},
      {validator: twoPositiveNumberWithTwoDecimalsHandle, trigger: 'change'},
    ],
    unitedNumber: [
      {required: true, message: "联片数量不能为空", trigger: "change"}
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
    urgent: [
      {required: true, message: "加急不能为空", trigger: "change"}
    ],
    area: [
      {required: true, message: "面积不能为空", trigger: "change"}
    ],
    price: [
      {required: true, message: "单价不能为空", trigger: "change"},
      {validator: positiveNumberWithTwoDecimalsHandle, trigger: 'change'}
    ],
    unitedWayLength: [
      {required: true, message: "连片方式长不能为空", trigger: "change"}
    ],
    unitedWayWidth: [
      {required: true, message: "连片方式宽不能为空", trigger: "change"}
    ],
    placeOrderTime:[
      {required: true, message: "报价时间不能为空", trigger: "change"}
    ],
    cusSaleUserId:[
      {required: true, message: "业务人员不能为空", trigger: "change"}
    ],
    currency:[
      {required: true, message: "币种不能为空", trigger: "change"}
    ],
    exchangeRate:[
      {required: true, message: "汇率不能为空", trigger: "change"}
    ],
    addressId:[
      {required: true, message: "地址不能为空", trigger: "change"}
    ],
    // companyPrincipal:[
    //   {required: true, message: "负责人不能为空", trigger: "change"}
    // ],
    // companyPrincipalPhone:[
    //   {required: true, message: "电话不能为空", trigger: "change"}
    // ],
    mouldCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    testFrameCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    flyProbeCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    engineeringCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    sampleCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    expeditedCost: [
      {required: false, validator: towFloadNegativeHandle, trigger: 'blur'}
    ],
    holeDensity: [
      {required: false, validator: nullOrPositiveNumberWithSixDecimalsHandle,trigger: 'change'}
    ],
    holeCount: [
      {required: false, validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'}
    ],
    quantity: [
      {required: true, message: "订单数量不能为空", trigger: 'change'},
      {validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'}
    ],
    areaPrice: [
      {required: true, message: "平米价不能为空", trigger: 'change'},
      {validator: positiveNumberWithTwoDecimalsHandle, trigger: 'change'}
    ],
    testPoint: [
      {required: false, validator: nullOrZeroAndPositiveIntValidHandle, trigger: 'change'}
    ],
  }
});

const data2 = reactive<PageData<QuotationForm, QuotationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "id",
    params: {}
  },
  rules: {
  }
});
const data3 = reactive<PageData<QuotationForm, QuotationQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 20,
    isAsc: "desc",
    orderByColumn: "id",
    params: {}
  },
  rules: {
  }
});
let initFormInline = {
  id:undefined,
  customerId: undefined,
  cusId: undefined,
  customerName: undefined,
  companyPrincipal: undefined,
  companyPrincipalPhone: undefined,
  faxes: undefined,
  placeOrderTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
  paymentMethod: undefined,
  monthlyMethod: undefined,
  currency: undefined,
  exchangeRate: 1,
  shippingType: undefined,
  checkStandard: undefined,
  customerData: undefined,
  email: undefined,
  userId: undefined,
  addressId: undefined,
  isTax: undefined,
  remark: undefined,
  cusSaleUserId: undefined
}
let formInline = reactive({
  ...initFormInline
});


const {queryParams, form, rules} = toRefs(data);
const xTable = ref<VxeTableInstance<QuotationVO>>();
const xTableGenerate = ref<VxeTableInstance<QuotationVO>>();
const tableData = ref<QuotationVO[]>([]);
const xTableAlready = ref();
const xTableAlreadyOld = ref()
const {queryParams:queryParams2} = toRefs(data2);
const {queryParams:queryParams3} = toRefs(data3);
const total2 = ref(0);
const total3 = ref(0);

const columnListGenerate = ref([
{ width: '60',type: 'seq',title: '序号',fixed: 'left',align: 'center',  },
{ width: '120',title: '产品名称',field: 'commodityName',align: 'center',  },
{ width: '65',title: '版本号',field: 'version',align: 'center',  },
{ width: '100',title: '产品类型',field: 'commodityType',align: 'center',  },
{ width: '80',title: '加急',field: 'urgent',align: 'center',  },
{ width: '90',title: '订购数量pcs',field: 'quantity',align: 'center',  },
{ width: '85',title: '单价',field: 'price',align: 'center',  },
{ width: '90',title: '订单面积(m²)',field: 'area',align: 'center',  },
{ width: '85',title: '平米价',field: 'areaPrice',align: 'center',  },
{ width: '85',title: '总价',field: 'totalOrderPrice',align: 'center',  },
{ width: '85',title: '税金',field: 'tax',align: 'center',  },
{ width: '85',title: '总金额',field: 'totalPrice',align: 'center',  },
{ width: '100',title: '操作',align: 'center',field: 'make',fixed: 'right'  },
]);

/**
 * 查询已作废报价单列表
 * */
const getVoidedList = async () => {
  console.log("editableTabsValue.value",editableTabsValue.value)
  if(editableTabsValue.value == 1){
    queryParams.value.status = editableTabsValue.value
    getList();
  }else if(editableTabsValue.value == 2){
    queryParams2.value.status = editableTabsValue.value
    getList2();
  }else if (editableTabsValue.value == 3){
    queryParams3.value.status = editableTabsValue.value
    getList3();
  }
}

// 完成 生成销售合同
const finishHandle = () => {
  editOrder.visible = false
  getList2()
}

/** 查询报价单列表 */
const getList = async () => {
  loading.value = true;
  const res = await postListQuotation(queryParams.value);
  quotationList.value = res.rows;
  total.value = res.total;
  loading.value = false;

  // const $table = xTable?.value.xTableRef as any
  // if ($table) {
  //   $table.reloadData(quotationList.value)
  // }
}

/** 查询报价单列表 */
const getList2 = async () => {
  loading.value = true;
  const res = await postListQuotation(queryParams2.value);
  quotationQuotedList.value = res.rows;
  total2.value = res.total;
  loading.value = false;

  // const $table = xTableAlready?.value.xTableRef as any
  // if ($table) {
  //   $table.reloadData(quotationQuotedList.value)
  // }
}

/** 查询报价单列表 */
const getList3 = async () => {
  loading.value = true;
  const res = await postListQuotation(queryParams3.value);
  quotationVoidedList.value = res.rows;
  total3.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  generateDialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  generatequotationFormRef.value?.resetFields();
  quotationFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: QuotationVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}


//币种
const currencyTypeOptions = ref<DictDataVO[]>([]);
//销售人员
const salerOptions = ref<UserVO[]>([]);
const getDictOptions = async () => {
  const currencyTypeResponse: any = await getDicts("currency_type");
  currencyTypeOptions.value = currencyTypeResponse.data;
  const salerResponse: any = await listUserByRoleKey("saler");
  salerOptions.value = salerResponse.data;
}

/**
 * 生成报价单页面按钮
 */
const handleSalesContract = async () => {
  const $table = xTableAlready.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (!selectRecords?.length) {
      proxy?.$modal.msgError("请选择订单");
      return
    }
    console.log(selectRecords)
    if (selectRecords?.length>1){
      const selectFirst = selectRecords[0]
      const flag = selectRecords.some(v => (v.customerCode != selectFirst.customerCode));
      if (flag) {
        proxy?.$modal.msgError("请选择相同的客户编码");
        return;
      }
    }
    const tempList = Array.from(new Set((selectRecords.map((item: any) => item.addressId) || [])))
    let resFlag = true
    if (tempList?.length && tempList.length > 1) {
      resFlag = await proxy?.$modal.confirm('两个订单的收货地址不一致，是否生成销售合同？').then(() => true).catch(() => false) as any
    }
    if (!resFlag) return
    //获取多条
    const ids=selectRecords.map((v:any)=>v.id).join(',');
    // router.push({
    //   path: '/order/directOrder',
    //   query: {
    //     id: ids,
    //     cusId: selectRecords[0].cusId
    //   }
    // })
    editOrder.visible = true
    editOrder.id = ids
    editOrder.cusId = selectRecords[0].cusId
    // editOrder.title = `编辑 ${row.code}`
  }
}


/**
 * 生成报价单页面按钮
 */
const handleGenerate = async () => {
  const $table = xTable.value.xTableRef;
  if ($table) {
    const selectRecords = $table.getCheckboxRecords();
    if (!selectRecords?.length) {
      ElMessage.error("请先选择待报价数据");
      return
    }
    //判断是否有单价字段，没有就要求先编辑
    if (selectRecords[0].price == undefined) {
      ElMessage.error("请先选择编辑预审数据");
      return;
    }
    if (selectRecords?.length>1){
      const selectFirst = selectRecords[0]
      console.log(selectFirst, selectRecords)
      const flag = selectRecords.some(v => (v.customerCode != selectFirst.customerCode));
      if (flag) {
        proxy?.$modal.msgError("请选择相同的客户名称");
        return;
      }
    }
    // cusId是客户表Id
    const _id = selectRecords[0].cusId;
    await getTaxRate();
    getCustomerInfo(_id);

  /*  const res = await getCustomerAddressQuotation(_id);
    queryParamsAddress.value.customerId = res.data.id;
    //业务人员
    let salerList = res.data.salerList;
    formInline.cusId = res.data.id;
    //公司负责人
    formInline.companyPrincipal = res.data.companyPrincipal;
    //电话
    formInline.companyPrincipalPhone = res.data.companyPrincipalPhone;
    //传真
    formInline.faxes = res.data.faxes;
    //邮箱
    formInline.email = res.data.email;
    //币种
    formInline.currency = res.data.currency;
    //费率
    formInline.exchangeRate = res.data.exchangeRate;
    //收货地址
    formInline.addressId = res.data.addressId;
    //是否含税
    formInline.isTax = res.data.isTax;

    formInline.cusSaleUserId=salerList[0];
    //备注
    formInline.remark = res.data.remark;*/
  //  getAddressList();
//    changeIsTax(res.data.isTax);
    // Object.assign(form.value, res.data);
    //报价客户
   // form.value.cusId = selectRecords[0].cusName;
    tableData.value = selectRecords;
  }
  generateDialog.visible = true;
  generateDialog.title = "生成销售报价";
}

//选择客户
const getCustomerInfo = (value: string) => {
  getCustomer(value).then(res => {
    const info = res.data;
    Object.keys(info).forEach((item) => {
      formInline[item] = info[item] ? info[item] : formInline[item];
    })
    formInline.cusId = info.id;
    let salerList = info.salerList
    if (salerList) {
      formInline.cusSaleUserId = salerList[0];
    }else {
      formInline.cusSaleUserId="";
    }
    changeIsTax(info.isTax);
    getAddressList(value);
    isDisabledUser(info.sysUserList)
  });
};


const getAddressList = (value: any) => {
  loading.value = true;
  listCustomerAddressByCusId(value).then(res => {
    customerAddressList.value = res;
    if (customerAddressList.value.length > 0) {
      const info = customerAddressList.value.find(item => item.isDefault == 1&&item.status==1)
      if (info) {
        formInline.addressId = info.id
      } else {
        let select = customerAddressList.value.find(item => item.status==1);
        // formInline.addressId = customerAddressList.value[0].id
        formInline.addressId = select?.id

      }
    }
  });

  loading.value = false;
};

//税率
const taxRate = ref(0);
/**
 * 是否含税
 */
const changeIsTax = (value: number) => {
  tableData.value.forEach(row => {
    if (formInline.isTax == 1) {
      // 含税总金额
      row.totalOrderPrice = Number((row.totalPrice / (1 + taxRate.value)).toFixed(2));
      row.tax =  Number(Number(row.totalPrice - row.totalOrderPrice).toFixed(2));
    //  row.totalPrice = Number((row.totalOrderPrice / (1 + taxRate.value)).toFixed(2))
    } else {
      row.totalOrderPrice = row.totalPrice;
      row.tax =  Number(Number(row.totalPrice - row.totalOrderPrice).toFixed(2));
    }
  })
  nextTick(() => {
    // 解决表格已渲染，金额还未计算完成，导致的总计不对
    if (xTableGenerate.value.xTableRef) {
      xTableGenerate.value.xTableRef.reloadData(tableData.value)
    }
  })
}

const reportDrawer = reactive<DrawerOption>({
  direction: 'left',
  visible: false,
  title: '报价单'
});

let reportUrl = ref("");
const saleQuotationUReportHandle = async(row:QuotationVO) => {
  reportDrawer.title = "报价单预览";
  reportDrawer.visible = true;
  //通过主键和报价单编号
  reportUrl.value = getReportUrl() + `&_n=报价单&_u=file:saleQuotation.ureport.xml&url=order/quotation/report/${row.id}&listUrl=order/quotation/reportList&id=${row.id}`;
  //reportUrl.value = getReportUrl() + `&_u=file:saleQuotation.ureport.xml&url=order/quotation/report/${id}&listUrl=order/quotation/reportList&id=${id}`;
  console.log(reportUrl.value);
}



/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加报价单";
}

/**
 * 合计列
 * @param columns
 * @param data
 */
const footerMethod: VxeTablePropTypes.FooterMethod<QuotationVO> = ({columns, data}) => {
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return "合计";
      }
      if (column.field == "area") {
        return `${Number(sumNum(data, "area").toFixed(6))} `;
      }
      if (column.field == "quantity") {
        return `${Number(sumNum(data, "quantity").toFixed(4))} `;
      }
      if (column.field == "totalOrderPrice") {
        return `${Number(sumNum(data, "totalOrderPrice").toFixed(2))} `;
      }
      if (column.field == "totalPrice") {
        return `${Number(sumNum(data, "totalPrice").toFixed(2))} `;
      }
      return "";
    })
  ];
};

const sumNum = (list: QuotationVO[], field: string) => {
  let count = 0;
  list.forEach(item => {
    count += Number(item[field]);
  });
  return count;
};


/**
 * 查看作废详情
 * @param row
 */
const handleSelect = async (row?: QuotationVO) => {
  proxy?.$modal.loading('加载中...')
  try {
    reset();
    const _id = row?.id;
    const res = await getQuotation(_id);
    if (res.data.otherCostList?.length) {
      res.data.otherCostList.map((v: any) => {
        v.price = returnNumberOrEmpty(v.price)
      })
    }
    res.data.engineeringCost = returnNumberOrEmpty(res.data.engineeringCost)
    res.data.testFrameCost = returnNumberOrEmpty(res.data.testFrameCost)
    res.data.flyProbeCost = returnNumberOrEmpty(res.data.flyProbeCost)
    res.data.mouldCost = returnNumberOrEmpty(res.data.mouldCost)
    res.data.expeditedCost = returnNumberOrEmpty(res.data.expeditedCost)
    res.data.sampleCost = returnNumberOrEmpty(res.data.sampleCost)
    res.data.otherCost = returnNumberOrEmpty(res.data.otherCost)
    form.value=res.data;
    // console.log('---------', res, form.value)
    popoverFileList.value=deepClone(form.value.quotationFileList)
    form.value.quotationFileList = [];
    dialog.visible = true;
    dialog.title = "查看详情";
    nextTick(() => {
      quotationFormRef.value.clearValidate();
    });
  } finally {
    proxy?.$modal.closeLoading()
  }
}


// 文件下载
const downLoadHandle = (key: string) => {
  let loadingBox = ElLoading.service({ text: '文件下载中...', background: 'rgba(0, 0, 0, 0.7)' });
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
/**
 * 报价下单文件
 */
const popoverFileList = ref<any[]>([]);
const returnNumberOrEmpty = (val: any) => {
  if (val == undefined) {
    return ''
  }
  return Number(val) ? Number(val) : ''
}
/** 修改按钮操作 */
const handleUpdate = async (row?: QuotationVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getQuotation(_id);
  if (res.data.otherCostList==null){
    res.data.otherCostList=[];
  }
  if (res.data.otherCostList?.length) {
    res.data.otherCostList.map((v: any) => {
      v.price = returnNumberOrEmpty(v.price)
    })
  }
  res.data.engineeringCost = returnNumberOrEmpty(res.data.engineeringCost)
  res.data.testFrameCost = returnNumberOrEmpty(res.data.testFrameCost)
  res.data.flyProbeCost = returnNumberOrEmpty(res.data.flyProbeCost)
  res.data.mouldCost = returnNumberOrEmpty(res.data.mouldCost)
  res.data.expeditedCost = returnNumberOrEmpty(res.data.expeditedCost)
  res.data.sampleCost = returnNumberOrEmpty(res.data.sampleCost)
  res.data.otherCost = returnNumberOrEmpty(res.data.otherCost)
  // Object.assign(form.value, res.data);
  form.value = res.data
  popoverFileList.value=deepClone(form.value.quotationFileList)
  form.value.quotationFileList = []
  dialog.visible = true;
  dialog.title = "销售报价";
}


/**
 *人民币汇率
 * @param value
 */
const changeCurrency = (value: number) => {
  if(value=='人民币'){
    formInline.exchangeRate = 1;
  }
}

/** 提交按钮 */
const submitForm = () => {
  quotationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      let params = deepClone(form.value);
      const currentCustomer: any = customerList.value.find((f:any) => f.id == params.cusId)
      params.email = currentCustomer.email
      params.faxes = currentCustomer.faxes
      params.cusRemark = currentCustomer.remark
      params.currency = currentCustomer.currency
      params.cusIsTaxRate = currentCustomer.isTax
      params.cusSaleUserId = currentCustomer.saleUserId
      params.exchangeRate = currentCustomer.exchangeRate
      params.companyPrincipal = currentCustomer.companyPrincipal
      params.companyPrincipalPhone = currentCustomer.companyPrincipalPhone
      // console.log('params----', params, customerList.value, currentCustomer)
      if (params.id) {
        params.totalPrice = Number(params.totalPrice);
        params.tax = Number(params.tax);
        params.totalOrderPrice = Number(params.totalOrderPrice);
        //面积
        params.area = Number(params.area);
        params.areaPrice = Number(params.areaPrice);
        // 文件
        params.quotationFileList = [...params.quotationFileList, ...popoverFileList.value] as any
        params.quotationFileList.map((v: any) => {
          if (v?.delFlag == undefined || v?.delFlag == '' || v?.delFlag == null) {
            v.delFlag = 0
          }
        })
        await updateQuotation(params).finally(() => buttonLoading.value = false);
      } else {
        await addQuotation(params).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      getDict();
      await getVoidedList();
    }
  });
}


/** 驳回按钮操作 */
const handleDelete = async (row?: QuotationVO) => {
  const _ids = row?.id || ids.value;
  console.log(_ids);
  const customerCode = row?.customerCode;
  await proxy?.$modal.confirm('是否确认驳回客户编码为"' + customerCode + '"的预审单？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await delQuotation(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("驳回成功");
  await getList();
}

/**
 * 作废按钮操作
 */
const handleSubmit = async (row?: QuotationVO) => {
  const _ids = row?.id || ids.value;
  const commodityName = row?.commodityName;
  await proxy?.$modal.confirm('是否确认作废产品名称为"' + commodityName + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await cancellationQuotation(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("作废成功");
  await getList();
}


/**
 * 恢复按钮操作
 */
const handleRestore = async (row?: QuotationVO) => {
  const _ids = row?.id || ids.value;
  const auditCode = row?.auditCode;
  await proxy?.$modal.confirm('是否确认恢复预审单编号为"' + auditCode + '"的数据项？').finally(() => loading.value = false);
  proxy?.$modal.loading('加载中...')
  await restoreQuotation(_ids).finally(() => proxy?.$modal.closeLoading());
  proxy?.$modal.msgSuccess("恢复成功");
  await getList3();
}

/**
 * 生成报价单预览
 */
const preViewQuotation= async () => {
  if (tableData.value.length < 1) {
    ElMessage.error("请选择报价单");
    return;
  }
  generatequotationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //拿到报价表的id
      console.log(tableData.value);
      const directQuotation: DirectQuotation = {
        //负责人
        companyPrincipal: undefined,
        cusId: "",
        companyPrincipalPhone: "",
        faxes: "",
        quotationTime: "",
        email: "",
        currency: "",
        exchangeRate: "",
        addressId: "",
        cusIsTaxRate: "",
        cusRemark: "",
        saleUserId: "",
        saleQuotationList: [],
      };
      directQuotation.id=formInline.id;
      //客户id
      directQuotation.cusId = formInline.cusId;
      //负责人
      directQuotation.companyPrincipal = formInline.companyPrincipal;
      //电话
      directQuotation.companyPrincipalPhone = formInline.companyPrincipalPhone;
      //传真
      directQuotation.faxes = formInline.faxes;
      //报价时间
      directQuotation.quotationTime = formInline.placeOrderTime;
      //邮箱
      directQuotation.email = formInline.email;
      //币种
      directQuotation.currency = formInline.currency;
      //费率
      directQuotation.exchangeRate = Number(formInline.exchangeRate);
      //收货地址
      directQuotation.addressId = formInline.addressId;
      //是否含税
      directQuotation.cusIsTaxRate = formInline.isTax;
      //业务人员id
      directQuotation.saleUserId = formInline.cusSaleUserId;
      //备注
      directQuotation.cusRemark = formInline.remark;
      directQuotation.saleQuotationList = tableData.value;
      buttonLoading.value = true;
      const res = await aleadyQuotation(directQuotation).finally(() => { buttonLoading.value = false; });
      console.log(res.data);
      var id = directQuotation.saleQuotationList[0].id;
      reportDrawer.title = "报价单预览";
      reportDrawer.visible = true;
      //通过主键和报价单编号
      reportUrl.value = getReportUrl() + `&_n=报价单&_u=file:saleQuotation.ureport.xml&url=order/quotation/report/${id}&listUrl=order/quotation/reportList&id=${id}`;
      console.log(reportUrl.value);
     }
   });




}

/**
 * 保存按钮
 */
const handleSave = async () => {
  if (tableData.value.length < 1) {
    ElMessage.error("请选择报价单");
    return;
  }
  generatequotationFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      //拿到报价表的id
      console.log(tableData.value);
      const directQuotation: DirectQuotation = {
       // id: "",
        //负责人
        companyPrincipal: undefined,
        cusId: "",
        companyPrincipalPhone: "",
        faxes: "",
        quotationTime: "",
        email: "",
        currency: "",
        exchangeRate: "",
        addressId: "",
        cusIsTaxRate: "",
        cusRemark: "",
        saleUserId: "",
        saleQuotationList:undefined,
      };
      //报价表id
      //directQuotation.id = tableData.value[0].id;
      //客户id
      directQuotation.cusId = formInline.cusId;
      //负责人
      directQuotation.companyPrincipal = formInline.companyPrincipal;
      //电话
      directQuotation.companyPrincipalPhone = formInline.companyPrincipalPhone;
      //传真
      directQuotation.faxes = formInline.faxes;
      //报价时间
      directQuotation.quotationTime = formInline.placeOrderTime;
      //邮箱
      directQuotation.email = formInline.email;
      //币种
      directQuotation.currency = formInline.currency;
      //费率
      directQuotation.exchangeRate = Number(formInline.exchangeRate);
      //收货地址
      directQuotation.addressId = formInline.addressId;
      //是否含税
      directQuotation.cusIsTaxRate = formInline.isTax;
      //业务人员id
      directQuotation.saleUserId = formInline.cusSaleUserId;
      //备注
      directQuotation.cusRemark = formInline.remark;
      directQuotation.saleQuotationList = tableData.value;
      buttonLoading.value = true;
      await aleadyQuotation(directQuotation).finally(() => { buttonLoading.value = false; });
      proxy?.$modal.msgSuccess("保存成功");
      generateDialog.visible = false;
      await getList();
    }
  });

}


/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/quotation/export', {
    ...queryParams.value
  }, `quotation_${new Date().getTime()}.xlsx`)
}

const customerAddressFormRef = ref<ElFormInstance>();
const resetAddress = () => {
  formAddress.value = {...initAddressFormData};
  customerAddressFormRef.value?.resetFields();
};

//客户下拉数据
const getCustomerList = async () => {
  const res = await getListCustomer();
  customerList.value = res.data;
};

//新增地址按钮操作
const handleAddAddress = () => {
  resetAddress();
  formAddress.value.customerId = formInline.cusId;
  addressDialog.title = "添加地址";
  addressDialog.visible = true;
};

/**
 * 添加地址取消
 */
const cancelAddress = () => {
  resetAddress();
  addressDialog.visible = false;
};

/**
 * 地址提交
 */
const submitAddress = () => {
  customerAddressFormRef.value?.validate(async (valid: boolean) => {
    console.log(formAddress.value);
    if (valid) {
      buttonLoading.value = true;
      //客户地址
      formAddress.value.type = '1';
      if (formAddress.value.id) {
        await updateCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
      } else {
        formAddress.value.customerId = formInline.cusId;
        if (customerAddressList.value.length == 0) {
          formAddress.value.isDefault = 2;
        } else {
          formAddress.value.isDefault = 1;
        }
        await addCustomerAddress(formAddress.value).finally(() => buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      addressDialog.visible = false;
      getAddressList(formInline.cusId);
    }
  });
};
 let resDictData = ref({
    //加急
    order_urgent: [],
    //订单类型
    order_type: [],
    //批量/样品
    order_model: [],
    //板材
    order_material_quality: [],
    //成品板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //表面处理
    order_surface_treatment: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符颜色
    order_character: [],
    //币种
    currency_type: [],
    //包装要求
    order_packaging_requirements: [],
    //付款方式
    payment_method: [],
    //运输方式
    shipping_type: [],
    //板材品牌
    order_plate_brand: [],
    //板材级别
    order_material_level: [],
    //阻焊面数
    order_commodity_solder_count: [],
    //阻焊光泽
    order_commodity_solder_gloss: [],
    //字符面数
    order_character_count: [],
    //成型方式
    order_commodity_form: [],
    //测试方式
    order_commodity_testway: [],
    //过孔要求
    order_hole_requirement: [],
    //检验标准
    order_inspection_standard: [],
    //产品类型
    sys_commodity_type: [],
    //流程状态
    order_flow_status:[],
    //测试架
    order_test_frame:[],
  })
  /**
   * 获取字典数据
   */
  const getDictList = async () => {
    const rules = [['dictSort', 'asc']];
    const string = "order_urgent,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_plate_brand,order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type,order_flow_status,order_test_frame";
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
  };
const customerCodeList = ref();
const customerNameList = ref();
/**
 * 待报价列名
 */
const columnList = ref([
  {type: 'checkbox', width: '60', align: 'center'},
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '报价时间',
    field: 'quotationTime',
    align: 'center',
    width: '120',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }
  },
  // {title: '客户编码', field: 'customerCode', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: '请输入客户编码'}},
  // {title: '客户名称', field: 'cusName', align: 'center',width: '120', filterType: 'input', filterParam: {placeholder: '请输入客户名称'}},

  {title: '客户编码', field: 'customerCodeIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  {title: '客户名称', field: 'customerNameIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerNameList.value},

  {title: '产品名称', field: 'commodityName', align: 'center',width: '120', filterType: 'input', filterParam: {placeholder: '请输入产品名称'}},
  {title: '板层', field: 'materialLayer', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: '请输入板层'}},
  {title: '客户物料编码', field: 'materialNumber', align: 'center',width: '120', filterType: 'input', filterParam: {placeholder: '请输入客户物料编码'}},
  {title: '客户物料名称', field: 'materialName', align: 'center',width: '120', filterType: 'input', filterParam: {placeholder: '请输入客户物料名称'}},
  {title: '孔密度(万/m²)', field: 'holeDensity', align: 'center',width: '120',
      filterType: 'number',
      filterParam: {placeholder: '请输入孔密度'}},
  {title: '联片长', field: 'unitedLength', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入',type:'number'},},
  {title: '联片宽', field: 'unitedWidth', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入',type:'number'}},
  {title: '联片方式长', field: 'unitedWayLength', align: 'center',width: '80'},
  {title: '联片方式宽', field: 'unitedWayWidth', align: 'center',width: '80'},
  {title: '单价', field: 'price', align: 'center',width: '80'},
  {title: '订单数量', field: 'quantity', align: 'center',width: '80'},
  {title: '面积', field: 'area', align: 'center',width: '80'},
  {title: '平米价', field: 'areaPrice', align: 'center',width: '80'},
  {title: '税金', field: 'tax', align: 'center',width: '80'},
  {title: '含税总价', field: 'totalPrice', align: 'center',width: '80'},
  {title: '不含税总价', field: 'totalOrderPrice', align: 'center',width: '80'},
  {title: '模具费', field: 'mouldCost', align: 'center',width: '80'},
  {title: '测试架费', field: 'testFrameCost', align: 'center',width: '80'},
  {title: '飞针费', field: 'flyProbeCost', align: 'center',width: '80'},
  {title: '工程费', field: 'engineeringCost', align: 'center',width: '80'},
  {title: '样板费', field: 'sampleCost', align: 'center',width: '80'},
  {title: '加急费', field: 'expeditedCost', align: 'center',width: '80'},
  {title: '其他费', field: 'otherCost', align: 'center',width: '80'},
  {title: '板材', field: 'materialQuality', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入板材' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_material_quality],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}
},
  {title: '板材品牌', field: 'materialBrand', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材品牌'}},
  {title: '板材级别', field: 'materialLevel', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材级别'}},
  {title: '成品板厚', field: 'commodityThickness', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入成品板厚' , filterable : 'true'},
      filterData: () => [...resDictData.value.finish_plate_thickness],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊颜色', field: 'commoditySolder', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入阻焊颜色' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_commodity_solder],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊面数', field: 'commoditySolderCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊面数'}},
  {title: '金厚', field: 'goldenThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金厚(u\'\')'}},
  {title: '阻焊光泽', field: 'commoditySolderGloss', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊光泽'}},
  {title: '阻焊要求', field: 'commoditySolderRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊要求'}},
  {title: '孔铜厚', field: 'poreCopper', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入孔铜厚'}},
  {title: '字符颜色', field: 'characterColor', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_character],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '字符面数', field: 'characterCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符面数'}},
  {title: '成形方式', field: 'commodityForm', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入成形方式'}},
  {title: '字符要求', field: 'characterRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符要求'}},
  {title: 'SET打叉', field: 'setCross', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET打叉'}},
  {title: '板翘曲度', field: 'warpagePlate', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板翘曲度'}},
  {title: '测试方式', field: 'commodityTestWay', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}},
  {title: '测试点', field: 'testPoint', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试点'}},
  {title: '备品数量', field: 'spareQuantity', align: 'center',width: '80',
      filterType: 'number',
      filterParam: {placeholder: '请输入备品数量'}},
  {title: '铜箔', field: 'copperFoil', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入铜箔'}},
  {title: 'vCut', field: 'vCut', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入V-CUT'}},
  {title: '过孔要求', field: 'holeRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入过孔要求'}},
  {title: '检验标准', field: 'inspectionStandard', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入检验标准'}},
  {title: '金面积', field: 'goldArea', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金面积'}},
  {title: '包装要求', field: 'packRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入包装要求'}},
  {title: 'PP', field: 'pp', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: '请输入PP'}},
  {title: '镍厚', field: 'nickelThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入镍厚'}},
  {title: '锡厚', field: 'tinThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入锡厚'}},
  {title: '外层铜厚', field: 'materialCopperOutside', align: 'center',width: '80',filterType: 'input'},
  {title: '内层铜厚', field: 'materialCopperInside', align: 'center',width: '80',filterType: 'input'},
  {title: '批量/样品', field: 'model', align: 'center',width: '80',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '加急', field: 'urgent', align: 'center',width: '80',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.value.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '提交人名称', field: 'submitUserName', align: 'center',width: '100',
      filterType: 'input',
      filterParam: {placeholder: '请输入提交人名称'}},
  {title: '提交时间', field: 'submitTime', align: 'center',width: '120',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  {title: '文件', field: 'file', align: 'center',width: '80',fixed: 'right', showOverflow: false},
  {title: '操作', align: 'center', field: 'make', width: "170", showOverflow: false, fixed: 'right'},
]);


/**
 * 待下单列表
 */
const columnOrderList = ref([
  {type: 'checkbox', width: '60', align: 'center', fixed: "left"},
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '报价单号', field: 'code', align: 'center', width: '120',fixed: "left", filterType: 'input', filterParam: {placeholder: ''}},

  {title: '客户编码', field: 'customerCodeIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  {title: '客户名称', field: 'customerNameIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerNameList.value},

  {title: '产品名称', field: 'commodityName', align: 'center',width: '120',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '板层', field: 'materialLayer', align: 'center',width: '80',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '客户物料编码', field: 'materialNumber', align: 'center',width: '120',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '客户物料名称', field: 'materialName', align: 'center',width: '120',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '孔密度(万/m²)', field: 'holeDensity', align: 'center',width: '120',
      filterType: 'number',
      filterParam: {placeholder: '请输入孔密度'}},
  {title: '单价', field: 'price', align: 'center',width: '80'},
  {title: '订单数量', field: 'quantity', align: 'center',width: '80'},
  {title: '面积', field: 'area', align: 'center',width: '80'},
  {title: '平米价', field: 'areaPrice', align: 'center',width: '80'},
  {title: '模具费', field: 'mouldCost', align: 'center',width: '80'},
  {title: '飞针费', field: 'flyProbeCost', align: 'center',width: '80'},
  {title: '工程费', field: 'engineeringCost', align: 'center',width: '80'},
  {title: '样板费', field: 'sampleCost', align: 'center',width: '80'},
  {title: '加急费', field: 'expeditedCost', align: 'center',width: '80'},
  {title: '板材', field: 'materialQuality', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入板材' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_material_quality],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '板材品牌', field: 'materialBrand', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材品牌'}},
  {title: '板材级别', field: 'materialLevel', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材级别'}},
  {title: '成品板厚', field: 'commodityThickness', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入成品板厚' , filterable : 'true'},
      filterData: () => [...resDictData.value.finish_plate_thickness],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊颜色', field: 'commoditySolder', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入阻焊颜色' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_commodity_solder],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊面数', field: 'commoditySolderCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊面数'}},
  {title: '金厚', field: 'goldenThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金厚(u\'\')'}},
  {title: '阻焊光泽', field: 'commoditySolderGloss', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊光泽'}},
  {title: '阻焊要求', field: 'commoditySolderRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊要求'}},
  {title: '孔铜厚', field: 'poreCopper', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入孔铜厚'}},
  {title: '字符颜色', field: 'characterColor', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_character],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '字符面数', field: 'characterCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符面数'}},
  {title: '成形方式', field: 'commodityForm', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入成形方式'}},
  {title: '字符要求', field: 'characterRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符要求'}},
  {title: 'SET打叉', field: 'setCross', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET打叉'}},
  {title: '板翘曲度', field: 'warpagePlate', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板翘曲度'}},
  {title: '测试方式', field: 'commodityTestWay', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}},
  {title: '测试点', field: 'testPoint', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试点'}},
  {title: '备品数量', field: 'spareQuantity', align: 'center',width: '80',
      filterType: 'number',
      filterParam: {placeholder: '请输入备品数量'}},
  {title: '铜箔', field: 'copperFoil', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入铜箔'}},
  {title: 'vCut', field: 'vCut', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入V-CUT'}},
  {title: '过孔要求', field: 'holeRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入过孔要求'}},
  {title: '检验标准', field: 'inspectionStandard', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入检验标准'}},
  {title: '金面积', field: 'goldArea', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金面积'}},
  {title: '包装要求', field: 'packRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入包装要求'}},
  {title: 'PP', field: 'pp', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: '请输入PP'}},
  {title: '镍厚', field: 'nickelThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入镍厚'}},
  {title: '锡厚', field: 'tinThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入锡厚'}},
  {title: '外层铜厚', field: 'materialCopperOutside', align: 'center',width: '80',filterType: 'input'},
  {title: '内层铜厚', field: 'materialCopperInside', align: 'center',width: '80',filterType: 'input'},
  {title: '其他费用', field: 'otherCost', align: 'center',width: '80'},
  {title: '税金', field: 'tax', align: 'center',width: '80'},
  {title: '含税总价', field: 'totalPrice', align: 'center',width: '80'},
  {title: '不含税总价', field: 'totalOrderPrice', align: 'center',width: '90'},
  {title: '批量/样品', field: 'model', align: 'center',width: '80',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '加急', field: 'urgent', align: 'center',width: '80',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.value.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '提交人名称', field: 'submitUserName', align: 'center',width: '90',
      filterType: 'input',
      filterParam: {placeholder: '请输入提交人名称'}},
  {title: '提交时间', field: 'submitTime', align: 'center',width: '120',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  {title: '文件', field: 'file', align: 'center',width: '80',fixed: 'right', showOverflow: false},
  {title: '操作', align: 'center', field: 'make', width: "140",fixed: 'right'},
]);

/**
 * 已作废列名
 */
const columnVoidedList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '预审单号', field: 'auditCode', align: 'center',width: '120', filterType: 'input', filterParam: {placeholder: ''}},
  {title: '客户编码', field: 'customerCodeIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerCodeList.value},
  {title: '客户名称', field: 'customerNameIdList', align: 'center',width: '120', filterType: 'checkboxSearch' , filterData:()=>customerNameList.value},
  {title: '产品名称', field: 'commodityName', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: ''}},
  {title: '产品类型', field: 'commodityType', align: 'center',width: '80',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '客户物料编码', field: 'materialNumber', align: 'center',width: '120',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '客户物料名称', field: 'materialName', align: 'center',width: '120',filterType: 'input', filterParam: {placeholder: ''}},
  {title: '批量/样品', field: 'model', align: 'center',width: '80',
      filterType: 'radioButton',
      filterParam: {placeholder: '请输入批量/样品'},
      filterData: () => [...resDictData.value.order_model],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '加急', field: 'urgent', align: 'center',width: '80',
      filterType: 'checkboxButton',
      filterParam: {placeholder: '请输入加急'},
      filterData: () => [...resDictData.value.order_urgent],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '单价', field: 'price', align: 'center',width: '80'},
  {title: '订单数量', field: 'quantity', align: 'center',width: '80'},
  {title: '面积', field: 'area', align: 'center',width: '80'},
  {title: '平米价', field: 'areaPrice', align: 'center',width: '80'},
  {title: '模具费', field: 'mouldCost', align: 'center',width: '80'},
  {title: '测试架费', field: 'testFrameCost', align: 'center',width: '80'},
  {title: '飞针费', field: 'flyProbeCost', align: 'center',width: '80'},
  {title: '工程费', field: 'engineeringCost', align: 'center',width: '80'},
  {title: '样板费', field: 'sampleCost', align: 'center',width: '80'},
  {title: '加急费', field: 'expeditedCost', align: 'center',width: '80'},
  {title: '其他费', field: 'otherCost', align: 'center',width: '80'},
  {title: '税金', field: 'tax', align: 'center',width: '80'},
  {title: '含税总价', field: 'totalPrice', align: 'center',width: '80'},
  {title: '不含税总价', field: 'totalOrderPrice', align: 'center',width: '90'},
  {title: '提交人名称', field: 'submitUserName', align: 'center',width: '90',
      filterType: 'input',
      filterParam: {placeholder: '请输入提交人名称'}},
  {title: '提交时间', field: 'submitTime', align: 'center',width: '80',
    filterType: 'intervalDate',
    filterParam: {
      startParams: {placeholder: '请输入开始时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
      endParams: {placeholder: '请输入结束时间', type: 'datetime', valueFormat: 'YYYY-MM-DD HH:mm:ss'},
    }},
  {title: '板材', field: 'materialQuality', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入板材' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_material_quality],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '板材品牌', field: 'materialBrand', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材品牌'}},
  {title: '板材级别', field: 'materialLevel', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板材级别'}},
  {title: '成品板厚', field: 'commodityThickness', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入成品板厚' , filterable : 'true'},
      filterData: () => [...resDictData.value.finish_plate_thickness],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊颜色', field: 'commoditySolder', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入阻焊颜色' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_commodity_solder],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '阻焊面数', field: 'commoditySolderCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊面数'}},
  {title: '金厚', field: 'goldenThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金厚(u\'\')'}},
  {title: '阻焊光泽', field: 'commoditySolderGloss', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊光泽'}},
  {title: '阻焊要求', field: 'commoditySolderRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入阻焊要求'}},
  {title: '孔铜厚', field: 'poreCopper', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入孔铜厚'}},
  {title: '字符颜色', field: 'characterColor', align: 'center',width: '80',
      filterType: 'select',
      filterParam: {placeholder: '请输入' , filterable : 'true'},
      filterData: () => [...resDictData.value.order_character],
      filterCustom: {label: 'dictLabel', value: 'dictValue'}},
  {title: '字符面数', field: 'characterCount', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符面数'}},
  {title: '成形方式', field: 'commodityForm', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入成形方式'}},
  {title: '字符要求', field: 'characterRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入字符要求'}},
  {title: 'SET打叉', field: 'setCross', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入SET打叉'}},
  {title: '板翘曲度', field: 'warpagePlate', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入板翘曲度'}},
  {title: '测试方式', field: 'commodityTestWay', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试方式'}},
  {title: '测试点', field: 'testPoint', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入测试点'}},
  {title: '备品数量', field: 'spareQuantity', align: 'center',width: '80',
      filterType: 'number',
      filterParam: {placeholder: '请输入备品数量'}},
  {title: '铜箔', field: 'copperFoil', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入铜箔'}},
  {title: 'vCut', field: 'vCut', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入V-CUT'}},
  {title: '过孔要求', field: 'holeRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入过孔要求'}},
  {title: '检验标准', field: 'inspectionStandard', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入检验标准'}},
  {title: '金面积', field: 'goldArea', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入金面积'}},
  {title: '包装要求', field: 'packRequirement', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入包装要求'}},
  {title: 'PP', field: 'pp', align: 'center',width: '80', filterType: 'input', filterParam: {placeholder: '请输入PP'}},
  {title: '镍厚', field: 'nickelThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入镍厚'}},
  {title: '锡厚', field: 'tinThickness', align: 'center',width: '80',
      filterType: 'input',
      filterParam: {placeholder: '请输入锡厚'}},
  {title: '外层铜厚', field: 'materialCopperOutside', align: 'center',width: '80',filterType: 'input'},
  {title: '内层铜厚', field: 'materialCopperInside', align: 'center',width: '80',filterType: 'input'},
  {title: '文件', field: 'file', align: 'center',width: '80',fixed: 'right', showOverflow: false},
  {title: '操作', align: 'center', field: 'make', width: "140",fixed: 'right'},
]);

/**
 * 查看弹框，文件列表
 */
const quotionFileList = ref([
  {title: "序号", type: 'seq', align: 'center', width: '60'},
  {title: '文件名', field: 'name', align: 'center',minWidth: '200'},
  {title: '上传人', field: 'updateByName', align: 'center',width: '70'},
  {title: '文件大小(kb)', field: 'size', align: 'center',width: '80'},
  {title: '上传时间', field: 'createTime', align: 'center',width: '120'},
  {title: '操作', field: 'make', align: 'center',width: '120'},
])

// 删除文件
const delFile = (row: any) => {
  console.log('删除文件', row)
}

// 下载文件
const downLoadFile = (row: any) => {
  console.log('下载文件', row)
}

/**
 * 生成报价单表格里面的删除按钮
 * @param row
 * @param index
 */
const deleteRowEvent = (row: QuotationVO, index: number) => {
  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        tableData.value.splice(index, 1);//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });
};




let dictList = ref<any>({
  //客户级别
  customer_level: [],
  //付款方式
  payment_method: [],
  //月结方式
  monthly_method: [],
  //币种
  currency_type: [],
  //运输方式
  shipping_type: [],
  //检验标准
  check_standard: [],
  //客户资料
  customer_data: [],
  //对账日期
  reconciliation_time: [],
  //表面处理
  order_surface_treatment: [],
  //批量/样品
  order_model: [],
  //产品类型
  sys_commodity_type: [],
  //订单类型
  order_type: [],
  //包装要求
  order_packaging_requirements: [],
  //板材
  order_material_quality: [],
  //板材品牌
  order_plate_brand: [],
  //板材级别
  order_material_level: [],
  //外层铜厚
  order_material_copperoutside: [],
  //内层铜厚
  order_material_copperinside: [],
  //阻焊颜色
  order_commodity_solder: [],
  //阻焊面数
  order_commodity_solder_count: [],
  //字符颜色
  order_character: [],
  //字符面数
  order_character_count: [],
  //成型方式
  order_commodity_form: [],
  //测试方式
  order_commodity_testway: [],
  //过孔要求
  order_hole_requirement: [],
  //检验标准
  order_inspection_standard: [],
  //加急
  order_urgent: [],
  //成品板厚
  finish_plate_thickness: [],
  //测试架
  order_test_stand:[],
})
const getDict = () => {
  const rules = [['dictSort', 'asc']];
  const string = "customer_level,monthly_method,shipping_type,order_urgent,customer_data,reconciliation_time,check_standard,order_type,order_model,order_material_quality,finish_plate_thickness,order_material_copperoutside,order_material_copperinside," +
      "order_surface_treatment,order_commodity_solder,order_character,currency_type,order_packaging_requirements,payment_method,shipping_type,order_plate_brand," +
      "order_material_level,order_commodity_solder_count,order_commodity_solder_gloss,order_character_count,order_commodity_form,order_commodity_testway," +
      "order_hole_requirement,order_inspection_standard,sys_commodity_type,order_test_stand";
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

const fisrtEnter = ref(false)
onActivated(async () => {
  // onMounted执行后再执行 http://www.codebaoku.com/question/question-sd-1010000043593478.html
  if(!fisrtEnter.value) return
  if (useTagsViewStore().refreshSale) {
    editableTabsValue.value = '2'
    queryParams.value.status = editableTabsValue.value
    // queryParams.value.status = "2";
    await getList();
    useTagsViewStore().setRefreshSale(false)
  }
})

const getListCust = async() => {
    const custRes = await getListCustomer();
    const resCust = custRes.data;
    if(resCust){
      customerCodeList.value = resCust.map(item=>{ return { value:item.id, label:item.customerCode } });
      customerNameList.value = resCust.map(item=>{ return { value:item.id, label:item.customerName } });
    }
}

onMounted(async () => {
  getListCust();
  getDict();
  getDictOptions();
  getDictList();
  queryParams.value.status = "1";
  getTaxRate();
  await getList();
  //查询客户下拉数据
  getCustomerList();
  fisrtEnter.value = true
});

const countPrice = (row: OrderVO) => {
  row.price = Number((returnNumber(row.areaPrice) * (returnNumber(row.unitedLength) * returnNumber(row.unitedWidth)) / returnNumber(row.unitedNumber) / 1000000).toFixed(4))
  countAreaPrice(row)
  countTotalPrice(row)
}
// 通过单价去计算平米价
const countAreaPrice = (row: any) => {
  const areaPrice = Number((returnNumber(row.price) * returnNumber(row.unitedNumber) / (returnNumber(row.unitedLength) * returnNumber(row.unitedWidth)) * 1000000).toFixed(4))
  if (isNaN(areaPrice)) {
    row.areaPrice = 0;
  } else {
    row.areaPrice = Number(Number(areaPrice).toFixed(4));
    //总金额
    row.totalPrice = Number(Number(parseFloat(row.price) * parseFloat(row.quantity)).toFixed(2));
    //不含税总价
    row.totalOrderPrice = Number(Number(parseFloat(row.totalPrice) / (1 + taxRate.value)).toFixed(2));
    //税金
    row.tax = Number(Number(parseFloat(row.totalPrice) - parseFloat(row.totalOrderPrice)).toFixed(2));
  }
}
const returnNumber = (val: any) => {
  return Number(val || 0)
}
// 计算膜具费 得到 总金额
const countTotalPrice = (row: any) => {
  row.totalPrice = Number(parseFloat(row.price) * parseFloat(row.quantity));
  row.totalPrice = returnNumber(row.totalPrice) + returnNumber(row.mouldCost) + returnNumber(row.testFrameCost) + returnNumber(row.flyProbeCost) + returnNumber(row.engineeringCost) + returnNumber(row.sampleCost) + returnNumber(row.expeditedCost)
  const tempOtherCostList = row.otherCostList?.length ? row.otherCostList.filter((item: any) => item.delFlag == '0') : []
  if (tempOtherCostList?.length) {
    tempOtherCostList.forEach((item: any) => {
      row.totalPrice += returnNumber(item.price)
    })
  }
  row.totalPrice = Number(returnNumber(row.totalPrice).toFixed(2))
  //不含税总价
  row.totalOrderPrice = Number(Number(parseFloat(row.totalPrice) / (1 +  taxRate.value)).toFixed(2));
  //税金
  row.tax = Number(Number(parseFloat(row.totalPrice) - parseFloat(row.totalOrderPrice)).toFixed(2));
}

// 计算膜具费 得到 总金额
const countPriceOther = (row: any) => {
  countAreaPrice(row)
  countTotalPrice(row)
}
//删除选中的其他费用按钮
const removeotherCost = (item: any) => {
  var index = form.value.otherCostList.indexOf(item)
  if (index !== -1) {
    item.delFlag = 2;
    /*form.value.otherCostList.splice(index, 1)*/
  }
};

//删除已经上传的文件
const deletequotationEvent= (row: any) => {
  ElMessageBox.confirm(
      "您确定要删除该记录吗?",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
  )
      .then(() => {
        ElMessage({
          type: "success",
          message: "删除成功"
        });
        row.delFlag = 2;//删除该行记录
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "取消删除"
        });
      });

}

//新建其他费按钮事件
const addOtherCost = () => {
  if (form.value.otherCostList?.length && (form.value.otherCostList.filter(v=>v.delFlag == '0').length >= 8)) {
    ElMessage.warning("最多添加8条其他费用");
    return;
  }
  var tmp = '其他费用' + (form.value.otherCostList.filter(v=>v.delFlag == '0').length + 1);
  form.value.otherCostList.push({
    title: tmp,
    delFlag: '0',
    price: undefined,
  });
};

/**
 * 新增数据字典
 * @param row
 */
const saveDict= async (dictLabel : string,dictType:string) => {
  if ( dictLabel!="" && dictType!=null){
    await saveDictData(dictLabel,dictType);
  }
}

//税率
const getTaxRate = async () => {
  const res = await proxy?.getConfigKey("taxRate");
  if (res != undefined) {
    taxRate.value = Number(res.data);
    console.log(taxRate.value)
  }
}

/**
 * 预审单查询
 * @param params
 */
const searchChange = (params: any) => {
  console.log("==============>>>",params);
  if(editableTabsValue.value == 1){

    queryParams.value = params;
       Object.keys(params).forEach(key => {
      if (key == 'urgent') {
        queryParams.value['urgentList'] = params[key];
        queryParams.value['urgent']=undefined;
      }
    });
    queryParams.value.status = editableTabsValue.value
    getList();
  }else if(editableTabsValue.value == 2){
    queryParams2.value = params;
     Object.keys(params).forEach(key => {
      if (key == 'urgent') {
        queryParams2.value['urgentList'] = params[key];
        queryParams2.value['urgent']=undefined;
      }
    });
    queryParams2.value.status = editableTabsValue.value
    getList2();
  }else if (editableTabsValue.value == 3){
    queryParams3.value = params;
     Object.keys(params).forEach(key => {
       if (key == 'urgent') {
        queryParams3.value['urgentList'] = params[key];
        queryParams3.value['urgent']=undefined;
      }
    });
    queryParams3.value.status = editableTabsValue.value
    getList3();
  }
}

/**
 * 计算孔密度
 */
const holeCountnumber = async () => {
  form.value.holeDensity = Number(Number(parseFloat(form.value.holeCount) / parseFloat(form.value.unitedLength) / parseFloat(form.value.unitedWidth) * 100).toFixed(6));
  form.value.holeDensity = form.value.holeDensity == 'NaN' ? '' : form.value.holeDensity
}


const unitedNumberCount = async (flag?: boolean) => {
  //计算联片数量
  form.value.unitedNumber = parseFloat(form.value.unitedWayLength) * parseFloat(form.value.unitedWayWidth);
  //计算订单面积 (订单面积（㎡）=订购数量/连片方式（长+宽）*连片尺寸（长*宽）/1000000）
  form.value.area = Number(Number(parseFloat(form.value.quantity) / parseFloat(form.value.unitedNumber) * parseFloat(form.value.unitedLength) * parseFloat(form.value.unitedWidth) / 1000000).toFixed(4));
  countPriceOther(form.value)
  if (flag) {
    holeCountnumber()
  }
}

const countQuantity = (row: OrderVO, column?: any) => {
  //计算面积
  row.area = Number(Number(parseFloat(row.quantity) / parseFloat(row.unitedNumber) * parseFloat(row.unitedLength) * parseFloat(row.unitedWidth) / 1000000).toFixed(4));
  //总金额
  row.totalPrice = Number(Number(parseFloat(row.price) * parseFloat(row.quantity)).toFixed(2));
  countTotalPrice(row)

  if (row && column) {
    xTable.value?.updateStatus({row,column});
  }
}
const areaPriceCount = async () => {
  // 总金额=订单面积*平米价  含税总价
  //计算订单面积 (订单面积（㎡）=订购数量/连片方式（长*宽）*连片尺寸（长*宽）/1000000）
  form.value.area = Number(Number(parseFloat(form.value.quantity) / parseFloat(form.value.unitedNumber) * parseFloat(form.value.unitedLength) * parseFloat(form.value.unitedWidth) / 1000000).toFixed(4));
  //计算单价  单价（元/PCS=订单面积*平米价/订购数量））
  //form.value.price = (parseFloat(form.value.quantity) / parseFloat(form.value.unitedWayWidth) * parseFloat(form.value.unitedWayLength) * parseFloat(form.value.unitedLength) * parseFloat(form.value.unitedWidth) / 1000000 * parseFloat(form.value.areaPrice) / parseFloat(form.value.quantity)).toFixed(4);
  form.value.price = Number(Number(parseFloat(form.value.area) * parseFloat(form.value.areaPrice) / parseFloat(form.value.quantity)).toFixed(4));
  //总金额
  form.value.totalPrice = Number(Number(parseFloat(form.value.price) * parseFloat(form.value.quantity)).toFixed(2));
  //不含税总价
  form.value.totalOrderPrice = Number(Number(parseFloat(form.value.totalPrice) / (1 + taxRate.value)).toFixed(2));
  //税金
  form.value.tax = Number(Number(parseFloat(form.value.totalPrice) - parseFloat(form.value.totalOrderPrice)).toFixed(2));

  if (form.value.totalPrice == 'NaN') {
    form.value.totalPrice = 0
  }
  if (form.value.totalOrderPrice == 'NaN') {
    form.value.totalOrderPrice = 0
  }
  if (form.value.tax == 'NaN') {
    form.value.tax = 0
  }
}

// 判断业务员是否禁用
const isDisabledUser = (list: any[]) => {
  // console.log(val)
  if (!formInline.cusSaleUserId) return
  if (!list?.length) return
  const name = list.find((item: any) => item.userId == formInline.cusSaleUserId && item.status == '1')?.nickName
  const name1 = salerOptions.value.find((item: any) => item.userId == formInline.cusSaleUserId)
  if (!name && !name1) {
    const name2 = list.find((item: any) => item.userId == formInline.cusSaleUserId)?.nickName
    ElMessage.error(`【${name2}】已不是业务员，请重新选择业务员。`)
    formInline.cusSaleUserId = undefined
    return
  }
  if (name) {
    ElMessage.error(`业务员【${name}】已禁用，请重新选择业务员。`)
    formInline.cusSaleUserId = undefined
  }
}

</script>
<style lang="scss" scoped>
:deep(.el-form-item--small) {
  margin-bottom: 18px !important;
}

:deep(.el-select) {
  width: 100%;
}

:deep(.el-input__wrapper) {
  width: 100%;
}

:deep(.vxe-table--fixed-left-wrapper) {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}

:deep(.vxe-table--fixed-right-wrapper) {
  z-index: 2 !important;
  height: calc(100% - 10px) !important;
}

:deep(.el-drawer__header) {
  padding: 0px 20px;
  height: 40px;
  margin-bottom: 0px;
}

// :deep(.add-prod-drawder) {
//   .el-drawer__header {
//     height: auto;
//     padding: 5px !important;
//     margin-bottom: 5px !important;
//   }
//   .el-drawer__body {
//     padding: 5px 5px !important;

//     .el-divider {
//       margin: 0 0 6px 0 !important;
//     }
//     .error-left {
//       .el-form-item__error {
//         left: -20px;
//       }
//     }
//     .error-left-one {
//       .el-form-item__error {
//         left: -30px;
//       }
//     }

//     .el-form-item {
//       margin-bottom: 6px !important;

//       .el-form-item__label {
//         padding-right: 3px !important;
//       }

//       .el-form-item__content {
//         .el-form-item {
//           margin-bottom: 0 !important;
//         }
//         .el-textarea,
//         .el-input__wrapper,
//         .el-textarea__inner {
//           background-color: #FDFFE1 !important;
//           color: #000000 !important;
//         }
//         .el-input__inner {
//           -webkit-text-fill-color: #000000;
//           color: #000000 !important;
//         }
//         .height-light .el-input__wrapper {
//           background-color: #FED547 !important;
//         }
//         .font-14 .el-input__inner {
//           font-size: 14px;
//         }
//         .el-input-group__prepend,
//         .el-input-group__append {
//           padding: 0 2px !important;
//         }
//         .el-input-number {
//           width: 100% !important;
//           .el-input__wrapper {
//             padding: 1px 7px !important;
//             .el-input__inner {
//               width: 100% !important;
//               text-align: left !important;
//             }
//           }
//         }

//         .el-input__inner {
//           // 去除 数字表单 上下按钮
//           &::-webkit-outer-spin-button,
//           &::-webkit-inner-spin-button {
//               -webkit-appearance: none;
//           }
//           &[type="number"] {
//               -moz-appearance: textfield;
//               appearance: textfield;
//           }
//           border: none;
//         }
//       }

//       &.is-error .el-input__wrapper {
//         box-shadow: 0 0 0 2px var(--el-color-danger) inset;
//       }
//       .el-form-item__error {
//         display: none;
//         // margin-top: -2px;
//         // white-space: nowrap !important;
//         // font-size: 12px !important;
//         // transform: scale(0.9) !important;
//         // z-index: 10 !important;
//       }
//       .error-right {
//         .el-form-item__error {
//           /* text-align: right; */
//           left: 105px !important;
//         }
//         z-index: 10 !important;
//       }
//     }
//   }
//   /* .el-drawer__footer {
//     padding: 5px;
//   } */
//   .flex-start {
//     .el-form-item__content {
//       justify-content: flex-start !important;
//       align-items: center;
//       .el-input-number {
//         flex:1 !important;
//         width: auto;
//       }
//     }
//   }
// }
</style>
