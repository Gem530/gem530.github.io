<template>
  <!--修改弹窗-->
  <el-drawer
    v-model="openFlag"
    :title="miDrawer.title"
    size="90%"
    :close-on-click-modal="false"
    modal-class="mi-drawer-scoped"
    :direction="miDrawer.direction"
    :destroy-on-close="true"
    @close="cancelMi"
  >
    <template #header="{ close, titleId, titleClass }">
      <el-row>
        <el-col :span="12">
          <div style="text-align: left">MI单号:{{currentMiInfo.code}}</div>
        </el-col>
        <el-col :span="12">
          <div style="text-align: right">制单人:{{currentMiInfo.createByName}}&nbsp;&nbsp;&nbsp;&nbsp;制单时间:{{currentMiInfo.createTime}}</div>
        </el-col>
      </el-row>
    </template>
    <vxe-table
      border
      keep-source
      align="center"
      min-height="48px"
      max-height="200px" class="padding-table"
      show-overflow :loading="dialogLoading"
      :column-config="{resizable: true}"
      :data="orderList">
      <vxe-column fixed="left" type="seq" title="序号" width="40"></vxe-column>
      <vxe-column width="45" title="新/返" field="orderType">
        <template #default="{row}">
          <div v-for="item in resDictData.order_type">
            <span v-if="item.dictValue==row.orderType">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="70" title="批量/样品" field="model">
        <template #default="{ row }">
          <div v-for="item in resDictData.order_model">
            <span v-if="item.dictValue==row.model">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="40" title="加急" field="urgent">
        <template #default="{ row }">
          <div v-for="item in resDictData.order_urgent">
            <span v-if="item.dictValue==row.urgent">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="40" title="EQ" field="eq">
        <template #default="{ row }">
          <el-switch
            v-model="row.isEqConfirm"
            style="--el-switch-on-color: #13ce66;"
            active-value="1"
            inactive-value="0"
            @change="handleChange($event,row)"
          />
        </template>
      </vxe-column>
      <vxe-column width="70" title="产品编码" field="commodityCode">
        <template #default="{ row }">
          <el-button link type="primary" @click="openOrderDetail(row)">{{row.commodityCode}}</el-button>
        </template>
      </vxe-column>
      <vxe-column width="70" title="订单数量" field="quantity">
      </vxe-column>
      <vxe-column width="70" title="订单面积" field="area">
      </vxe-column>
      <vxe-column width="70" title="PCS/SET" field="unitedNumber">
      </vxe-column>
      <vxe-column width="50" title="板材" field="materialQuality">
      </vxe-column>
      <vxe-column width="50" title="品牌" field="materialBrand">
      </vxe-column>
      <vxe-column width="50" title="级别" field="materialLevel">
      </vxe-column>
      <vxe-column width="50" title="板厚" field="commodityThickness">
      </vxe-column>
      <vxe-column width="70" title="外层铜厚" field="materialCopperOutside">
      </vxe-column>
      <vxe-column width="70" title="内层铜厚" field="materialCopperInside">
      </vxe-column>
      <vxe-column width="65" title="单片尺寸" filed="singleLength">
        <template #default="{ row }">
          <span>{{Number(row.singleLength)?.toFixed(2)}}*{{Number(row.singleWidth)?.toFixed(2)}}</span>
        </template>
      </vxe-column>
      <vxe-column width="65" title="连片尺寸" filed="unitedLength">
        <template #default="{ row }">
          <span>{{Number(row.unitedLength)?.toFixed(2)}}*{{Number(row.unitedWidth)?.toFixed(2)}}</span>
        </template>
      </vxe-column>
      <vxe-column width="65" title="连片数量" field="unitedNumber">
        <template #default="{ row }">
          <span>{{row.unitedNumber}}</span>
        </template>
      </vxe-column>
      <vxe-column width="65" title="联片方式" field="unitedWayLength">
        <template #default="{ row }">
          <span>{{row.unitedWayLength}}*{{row.unitedWayWidth}}</span>
        </template>
      </vxe-column>
      <vxe-column width="65" title="阻焊颜色" field="commoditySolder">
      </vxe-column>
      <vxe-column width="50" title="字符" field="characterColor">
        <template #default="{ row }">
          <div v-for="item in resDictData.order_character">
            <span v-if="item.dictValue==row.characterColor">{{item.dictLabel}}</span>
          </div>
        </template>
      </vxe-column>
      <vxe-column width="70" title="金厚(u'')" field="goldenThickness">
        <template #edit="{ row }">
          <el-input style="width: 100%" v-model="row.goldenThickness"></el-input>
        </template>
      </vxe-column>
      <vxe-column width="65" title="过孔要求" field="holeRequirement">
      </vxe-column>
      <vxe-column show-overflow="false" min-width="180" title="操作" field="make">
        <template #default="{ row }">
          <el-button link type="primary" @click="assignTaskHistoryUReportHandle(row)">制作单</el-button>
          <el-button link type="primary" @click="openCustomerRequire(row)">客户要求</el-button>
          <el-button link type="primary" @click="openUpload(row)">EQ文件</el-button>
        </template>
      </vxe-column>
    </vxe-table>
    <el-tabs type="border-card" class="plan-tabs" v-loading="dialogLoading">
      <el-form ref="productionPlanFormRef" :model="form" :rules="rules" label-width="110px" label-position="right">
        <el-tab-pane label="基础信息" class="plan-tab-auto">
          <el-row>
            <el-col :span="12">
              <el-form-item label="工艺名称" prop="name">
                <el-input v-model="form.name" maxlength="100"
                          placeholder="请输入工艺名称" clearable></el-input>
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="生产截止时间" prop="deliveryTime">
                <el-date-picker v-model="form.dispatchTime"
                                type="datetime"
                                placeholder="选择日期"
                                style="width:100%!important;"
                                format="YYYY-MM-DD HH:mm"
                                :disabled="true"
                                value-format="YYYY-MM-DD HH:mm:ss">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" rows="3" v-model="form.remark"/>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">TGZ文件</el-divider>
              <div style="text-align:left;">
                <!-- <el-upload action="#"
                           v-model:file-list="form.tgzFiles"
                           :auto-upload="false"
                           :before-remove="beforeRemove"
                           :on-change="onTgzUploadChange"
                           :on-remove="onTgzUploadRemove"
                           multiple>
                  <div style="width:110px;text-align:right">
                    <el-button type="primary" style="width:90px;">上传文件</el-button>
                  </div>
                </el-upload> -->
                <XUpload v-model:model-value="tgzFileList" model="download" @delFile="delFile"></XUpload>
              </div>
            </el-col>
            <el-col :span="24">
              <el-divider content-position="left">MI文件</el-divider>
              <div style="text-align:left;">
                <!-- <el-upload action="#"
                           v-model:file-list="form.files"
                           :auto-upload="false"
                           :before-remove="beforeRemove"
                           :on-change="onUploadChange"
                           :on-remove="onUploadRemove"
                           multiple>
                  <div style="width:110px;text-align:right">
                    <el-button type="primary" style="width:90px;">上传文件</el-button>
                  </div>
                </el-upload> -->
                <XUpload v-model:model-value="miFileList" model="download" @delFile="delFile"></XUpload>
              </div>
            </el-col>

            <el-col :span="24">
              <el-divider content-position="left">外形图</el-divider>
              <div style="text-align:left;">
                <!-- <el-upload
                  class="avatar-uploader"
                  action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus/>
                  </el-icon>
                </el-upload> -->
                <XUpload v-model:model-value="outSideFileList" @delFile="delFile"></XUpload>
              </div>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="开料信息" class="plan-tab-auto">
          <el-card class="pnl-card">
            <template #header>
              <span>PNL配置</span>
              <el-button
                type="primary"
                style="margin-left: 20px;"
                @click="addPnlPara" :disabled="disabledTab">新增PNL
              </el-button>
            </template>
            <div v-for="(item,index) in pnlList"
                 :key="item.id">
              <div class="pnlInfo-row">
                <div class="pnlInfo-row-label">
                  <!-- <div >
                    <el-input v-model="item.name"></el-input>
                  </div> -->
                  <EditName v-model:name="item.name" :disabled="disabledTab"></EditName>
                </div>
                <el-row class="pnlInfo-row-content" :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="长">
                      <el-input v-model="item.pnlLength"
                                type="number"
                                placeholder="长" :disabled="disabledTab"
                                style="width:100%">
                        <template slot="append">
                          mm
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="宽" label-width="140px">
                      <el-input v-model="item.pnlWidth"
                                type="number"
                                placeholder="宽" :disabled="disabledTab"
                                style="width:100%">
                        <template slot="append">
                          mm
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="pnlInfo-row-operate">
                  <el-button v-if="pnlList.length!=1"
                             class="el-icon-delete"
                             link type="primary" :disabled="disabledTab"
                             @click="deletePnlPara(item,index)">删除
                  </el-button>
                </div>
              </div>
              <div class="pnlInfo-row">
                <div class="pnlInfo-row-label">SET/PNL</div>
                <el-row class="pnlInfo-row-content" :gutter="20">
                  <el-col :span="8"
                          v-for="(value,key) in pnlList[index].pnlSetBoList"
                          :key="key">
                    <el-form-item :label="value.saleOrderBo?.commodityCode">
                      <el-input-number style="width:100%"
                                       controls-position="right"
                                       v-model.number="value.quantity"
                                       placeholder="SET/PNL"
                                       :min="0" :disabled="disabledTab"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="pnlInfo-row-operate"></div>
              </div>
              <div class="pnlInfo-row">
                <div class="pnlInfo-row-label">PCS/PNL</div>
                <el-row class="pnlInfo-row-content" :gutter="20">
                  <el-col :span="8"
                          v-for="(value,key) in pnlList[index].pnlSetBoList"
                          :key="key">
                    <el-form-item :label="value.saleOrderBo?.commodityCode"
                                  style="text-align:center">
                      {{pnlList[index].pnlSetBoList[key].quantity && value.saleOrderBo?.unitedNumber?
                      pnlList[index].pnlSetBoList[key].quantity*value.saleOrderBo?.unitedNumber:0}}
                      pcs/pnl
                    </el-form-item>
                  </el-col>
                </el-row>
                <div class="pnlInfo-row-operate"></div>
              </div>
              <!-- <el-divider></el-divider> -->
            </div>
            <!-- <div style="text-align:center">
            </div> -->
          </el-card>
          <el-card v-for="(item, index) in schemeList"
                   :key="item.index"
                   style=" margin-top: 3px;padding:0px;">
            <template #header>
              <div style="position:relative;display:flex;justify-content:space-between;">
                <div style="display:flex;align-items: center;">
                  <!-- <el-input v-model="item.name" style="width: 100px"></el-input> -->
                  <EditName v-model:name="item.name" style="width: 100px" :disabled="disabledTab"></EditName>

                  <el-button
                    size="small"
                    type="primary"
                    style="margin-left: 20px;" :disabled="disabledTab"
                    @click="addScheme">新增开料方案
                  </el-button>
                </div>
                <!--                <editorLabel v-model="item.name" @change="onSchemeNameChange(item,index)"></editorLabel>-->
                <span v-if="getCuttingRate(item) > 100 || getCuttingRate(item)< minCuttingRate"
                      style="margin-right:25px;color:#ff0000;">开料率：{{formatNumber(getCuttingRate(item))}}%</span>
                <span v-else
                      style="margin-right:25px;color:green;">开料率：{{ formatNumber(getCuttingRate(item))}}%</span>
                <el-button link icon="Close" style="position:absolute;right:0px;top:50%;transform:translate(0, -55%);font-size:16px;"
                  v-if="schemeList.length!=1" :disabled="disabledTab" @click="deleteScheme(item,index)"
                ></el-button>
                <!-- <el-icon style="position:absolute;right:0px;" @click="deleteScheme(item,index)"
                         v-if="schemeList.length!=1 " :disabled="disabledTab"
                >
                  <Close/>
                </el-icon> -->
              </div>
            </template>
            <el-row :gutter="10">
              <el-col :span="10">
                <el-row :gutter="10">
                  <el-col :span="24">
                    <el-form-item label="板材">
                      <el-input style="width: 90%" :model-value="item?.rawMaterial?.name" disabled></el-input>
                      <el-button ref="button"
                                 icon="Search"
                                 size="small"
                                 @click="openDialog(index)" :disabled="disabledTab">
                      </el-button>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="长">
                      <el-input :model-value="item.rawMaterial?.length" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="宽">
                      <el-input :model-value="item.rawMaterial?.width" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="12">
                    <el-form-item label="板厚">
                      <el-input :model-value="item.rawMaterial?.boardThickness" disabled></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="铜厚">
                      <el-input :model-value="item.rawMaterial?.copperThickness" disabled></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="12">
                    <el-form-item label="板材用量">
                      <el-input-number style="width:100%" controls-position="right" v-model="item.materialNumber"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12"
                          v-for="(value,pnlIndex) in item.pnlCountList"
                          :key="pnlIndex">
                    <el-form-item :label="pnlList[pnlIndex].name +'数量'">
                      <el-input-number style="width:100%"
                                       controls-position="right"
                                       v-model="value.pnlQuantity"
                                       clearable :disabled="disabledTab"
                                       :placeholder="'输入PNL'+(pnlIndex+1)+'数量(个)'"
                                       :min="0"
                      ></el-input-number>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col :span="12"
                          v-for="(commodity,commodityIndex) in currentMiInfo.saleOrderVoList"
                          :key="commodityIndex"
                          style="height:47px">
                    <el-form-item :label="commodity.commodityCode">
                      <div style="text-align:center">{{getTotalPcs(item,commodity)}} pcs</div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="14">
                <!--开料图-->
                <el-divider content-position="left" class="scheme_divider">
                  <el-icon>
                    <PictureFilled/>
                  </el-icon>
                  开料图
                </el-divider>
                <XUpload v-model:model-value="schemeList[index].schemeFileList" accept="image/*" @delFile="delFile"></XUpload>
                <!--                  <schemeImg :scheme="item"-->
                <!--                             :schemeIndex="index"-->
                <!--                             @pictureRemove="pictureRemove"-->
                <!--                             @pictureChange="pictureChange">-->
                <!--                  </schemeImg>-->
              </el-col>
            </el-row>
            <!--新增开料方案按钮-->
            <!-- <el-row style="">
            </el-row> -->
          </el-card>

        </el-tab-pane>
        <el-tab-pane label="工序工艺" class="plan-tab-three">
          <el-row class="plan-tab-row">
            <el-col :span="5">
              <el-form-item label="开料板厚"
                            prop="boardThickness">
                <el-input v-model="form.boardThickness"
                          controls-position="right"
                          :min="0"
                          style="width:100%">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="开料铜厚"
                            prop="copperThickness">
                <el-select v-model="form.copperThickness" :collapse-tags="true" filterable placeholder="请选择" style="width: 100%;">
                  <el-option
                    v-for="item in resDictData.order_material_copperoutside"
                    :key="item.dictLabel"
                    :label="item.dictLabel"
                    :value="item.dictLabel"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="最小线宽"
                            prop="minLineWidth">
                <el-input-number v-model="form.minLineWidth"
                                 controls-position="right"
                                 :min="0"
                                 style="width:100%">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="最小线距"
                            prop="minLineSpace">
                <el-input-number v-model="form.minLineSpace"
                                 controls-position="right"
                                 :min="0"
                                 style="width:100%">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="补偿值"
                            prop="compensation">
                <el-input-number v-model="form.compensation"
                                 controls-position="right"
                                 :min="0"
                                 style="width:100%">
                </el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电镀面积(GTL)"
                            prop="platingArea_GTL">
                <el-input v-model="form.platingArea_GTL" placeholder="请选择电镀面积(GTL)">
                  <template #append>
                    %
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item label="电镀面积(GBL)"
                            prop="platingArea_GBL">
                <el-input v-model="form.platingArea_GBL" placeholder="请选择电镀面积(GBL)">
                  <template #append>
                    %
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="5">
              <el-form-item label="金厚"
                            prop="goldenThickness">
                <el-input v-model="form.goldenThickness" placeholder="请选择金厚">
                  <template #append>
                    u''
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="9" class="fill-data">
              <el-button size="small" link type="primary" @click="fillData">填充</el-button>
            </el-col>
          </el-row>
          <el-tabs type="border-card" class="plan-tab-table">
            <el-tab-pane label="主工序工艺">
              <!-- 主工序工艺 左 -->
              <el-row class="plan-tab-height">
                <el-col :span="14" class="plan-tab-height">
                    <!-- :height="leftWorkHeight" -->
                  <div class="plan-xtable">
                    <XTable
                      border
                      min-height="0px"
                      :pageShow="false"
                      :data="nodeInfoList"
                      height="100%"
                      :columnList="mainColumnList"
                      @cell-click="handleCellClick"
                      :row-config="{isHover:true,isCurrent:true}"
                      :sort-config="{showIcon:false,remote:false}"
                      ref="mainWorkmanshipListRef">
                      <template #default-isCount="{row}">
                        <el-checkbox v-model="row.isCount" true-label="1" false-label="0"></el-checkbox>
                      </template>
                      <template #default-requirement="{row}">
                        <!-- <el-tooltip raw-content placement="top">
                          <template #content>
                            <CraftQuirementText :detailsJson="row.requirement" v-if="row && row.requirement"></CraftQuirementText>
                          </template>
                          <template #default>
                            <div style="white-space: nowrap;overflow: hidden;">
                            </div>
                          </template>
                        </el-tooltip> -->
                        <CraftQuirementText :detailsJson="row.requirement" v-if="row && row.requirement"></CraftQuirementText>
                      </template>
                      <template #default-remark="{row}">
                        <!-- <el-tooltip raw-content placement="top">
                          <template #content>
                            <RemarkText :remarkJson="row.remark" v-if="row && row.remark"></RemarkText>
                          </template>
                          <template #default>
                            <div style="white-space: nowrap;overflow: hidden;">
                            </div>
                          </template>
                        </el-tooltip> -->
                        <RemarkText :remarkJson="row.remark" v-if="row && row.remark"></RemarkText>
                      </template>
                      <template #default-make="{row}">
                        <el-button
                          size="small" link type="primary" @click.stop="moveRow('up', row, nodeInfoList, index)" icon="Top"
                          v-if="row.sort != 1"
                        >上移
                        </el-button>
                        <el-button
                          size="small" link type="primary" @click.stop="moveRow('down', row, nodeInfoList, index)" icon="Bottom"
                          v-if="row.sort != nodeInfoList.length"
                        >下移
                        </el-button>
                        <el-button size="small" link type="primary" icon="Plus" @click.stop="openAddWorkFlag(1, row)">插入</el-button>
                        <el-button size="small" link type="primary" icon="Delete" @click.stop="delWork(row)">删除</el-button>
                      </template>
                    </XTable>
                  </div>
                  <el-row>
                    <el-col :span="12">
                      <div style="text-align: left">
                        <el-button size="small" link type="primary" @click="openAddWorkFlag(1)">新增工序</el-button>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div style="text-align: right">
                        <el-button size="small" link type="primary" @click="openAddWorkFlag(2)">生成模板</el-button>
                        <el-button size="small" link type="primary" @click="openAddWorkFlag(3)">导入模板</el-button>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
                <!-- 主工序工艺 右 -->
                <el-col :span="10" class="plan-tab-height">
                  <div class="right-work" v-if="crruntWorkInfo">
                    <el-row>
                      <el-col :span="8" class="right-flex start">
                        <!-- <template v-if="!editTitleFlag"> -->
                          <span>{{ workTitleValue }}</span>
                          <!-- <el-icon @click="showTitleChange">
                            <EditPen/>
                          </el-icon>
                        </template>
                        <template v-else>
                          <el-input ref="workTitleRef" v-model="workTitleValue" placeholder="请输入标题" clearable autofocus
                                    @blur="changeWorkTitle"/>
                        </template> -->
                      </el-col>
                      <el-col :span="8" class="right-flex wrap">
                        <div class="right-flex margin-right" v-for="(item, comIndex) in currentMiInfo.saleOrderVoList" :key="comIndex">
                          <span>{{ item.commodityCode }}</span>
                          <el-icon v-if="item.commodityCode" v-copyText="item.commodityCode" v-copyText:callback="copyTextSuccess">
                            <DocumentCopy/>
                          </el-icon>
                        </div>
                      </el-col>
                      <el-col :span="8" class="right-flex end">
                        <el-button type="primary" @click="saveCrtMiInfo">保存参数</el-button>
                      </el-col>
                    </el-row>
                    <div class="right-work-content">
                      <el-card class="box-card" v-if="crruntWorkInfo.isLamination == '1'">
                        <el-form label-width="60px">
                          <el-form-item label="层叠状态">
                            <el-select v-model="crruntWorkInfo.cascadingState" @change="changeCascading">
                              <el-option
                                :key="item.dictValue"
                                :label="item.dictLabel"
                                :value="item.dictValue"
                                v-for="item in resDictData.cascading_state"
                              ></el-option>
                            </el-select>
                          </el-form-item>

                          <div class="card-header left">
                            <div class="card-line"></div>
                            <div class="card-title">层压结构信息</div>
                            <div class="card-line"></div>
                          </div>
                          <XTable
                            border
                            show-footer
                            height="200px"
                            :pageShow="false"
                            :searchShow="false"
                            ref="cascadXTableRef"
                            style="margin-bottom: 10px;"
                            :columnList="laminatedColumnList"
                            :sort-config="{showIcon:false,remote:false}"
                            :data="crruntWorkInfo.laminatedStructureList">
                            <template #default-layer="{row}">
                              <!-- {{ resDictData.compacted_layer.find((v: any) => v.dictValue == row.layer)?.dictLabel || row.layer }} -->
                              <el-image style="width: 100px; height: 25px;" :src="resDictData.compacted_layer.find((v: any) => v.dictValue == row.layer)?.remark" fit="cover" />
                            </template>
                            <template #default-rawMaterialType="{row}">
                              {{ resDictData.laminated_materials.find((v: any) => v.dictValue == row.rawMaterialType)?.dictLabel || row.rawMaterialType }}
                            </template>
                            <template #default-linkCopper="{row}">
                              {{ linkCopperList.find((v: any) => v.value == row.linkCopper)?.label || row.linkCopper }}
                            </template>
                            <template #default-make="{row}">
                              <el-button
                                size="small" link type="primary" @click.stop="moveRowLaninated('up', row)" icon="Top"
                                v-if="row.sort != 1"
                              >上移
                              </el-button>
                              <el-button
                                size="small" link type="primary" @click.stop="moveRowLaninated('down', row)" icon="Bottom"
                                v-if="row.sort != crruntWorkInfo.laminatedStructureList.length"
                              >下移
                              </el-button>
                              <el-button size="small" link type="primary" icon="Plus" @click.stop="openAddWorkFlag(9, row)">编辑</el-button>
                              <el-button size="small" link type="primary" icon="Delete" @click.stop="delLaninated(row)">删除</el-button>
                            </template>
                          </XTable>
                          <div class="flex-between">
                            <el-button size="small" link type="primary" @click="openAddWorkFlag(6)">新增层压结构</el-button>
                            <div>
                              <el-button size="small" link type="primary" @click="openAddWorkFlag(7)">生成模板</el-button>
                              <el-button size="small" link type="primary" @click="openAddWorkFlag(8)">导入模板</el-button>
                            </div>
                          </div>

                          <div class="card-header left">
                            <div class="card-line"></div>
                            <div class="card-title">层压结构图</div>
                            <div class="card-line"></div>
                          </div>
                          <XUpload v-model:model-value="crruntWorkInfo.laminatedFileList" @fileChange="laminatedFileChange" @delFile="(val, files) => delFile(val, files, 2)"></XUpload>
                        </el-form>
                      </el-card>
                      <!-- Drill_System 未定，可能会变 -->
                      <el-card class="box-card" v-if="crruntWorkInfo.isDrill == '1'">
                        <template #header>
                          <div class="card-header">
                            <div class="card-line"></div>
                            <div class="card-title">钻孔参数设置</div>
                            <div class="card-line"></div>
                          </div>
                        </template>
                        <XTable
                          border
                          show-footer
                          height="200px"
                          :pageShow="false"
                          :searchShow="false"
                          ref="drillXTableRef"
                          style="margin-bottom: 10px;"
                          :columnList="drlColumnList"
                          :footer-method="footerMethod"
                          :sort-config="{defaultSort:[{field:'code',order:'asc'}],showIcon:false,remote:false}"
                          :data="pnlInfoList[0]?.drillParameterList || []">
                          <template #default-isPth="{row}">
                            {{ row.isPth ? '是' : '否' }}
                          </template>
                          <template #[`default-count_${i}`]="{row,rowIndex}" v-for="(item, i) in pnlList">
                            {{ pnlInfoList[i]?.drillParameterList[rowIndex]?.quantity }}
                          </template>
                          <template #default-make="{row, rowIndex}">
                            <el-button size="small" link type="primary" icon="Edit" @click.stop="openAddWorkFlag(5, rowIndex)">编辑</el-button>
                            <el-button size="small" link type="primary" icon="Delete" @click.stop="delDrilList(row, rowIndex)">删除</el-button>
                          </template>
                        </XTable>
                        <el-button size="small" link type="primary" @click="openAddWorkFlag(4)">读取drl文件</el-button>
                      </el-card>
                      <el-card class="box-card">
                        <template #header>
                          <div class="card-header">
                            <div class="card-line"></div>
                            <div class="card-title">公共加工参数设置</div>
                            <div class="card-line"></div>
                          </div>
                        </template>
                        <ParameterSettings
                          :isDiffer="false"
                          :isScheme="false"
                          :pnlList="pnlList"
                          :schemeList="schemeList"
                          :remark="crruntWorkInfo.remark"
                          :localUid="crruntWorkInfo.localUid"
                          :requirement="crruntWorkInfo.requirement"
                          :configVoList="crruntWorkInfo.configVoList"
                          @paramsChange="paramsChange"
                        ></ParameterSettings>
                      </el-card>
                      <el-card class="box-card">
                        <template #header>
                          <div class="card-header">
                            <div class="card-line"></div>
                            <div class="card-title">{{crruntWorkInfo.isCutting == '1' ? '开料相关文件':'上传工序相关文件'}}</div>
                            <div class="card-line"></div>
                          </div>
                        </template>
                        <XUpload v-model:model-value="crruntWorkInfo.craftFileList" model="download" @fileChange="craftFileChange" @delFile="(val, files) => delFile(val, files, 1)"></XUpload>
                      </el-card>
                      <el-card class="box-card">
                        <el-tabs @tab-change="tabChange" v-model="nodeIndex" v-if="crruntWorkInfo">
                          <!-- <el-tab-pane :label="item.name" v-for="item in schemeList" :key="item.name"> -->
                          <el-tab-pane :name="i" :label="item.name" v-for="(item, i) in (crruntWorkInfo.isCutting == '1' ? schemeList : pnlList)" :key="item.name">
                            <ParameterSettings
                              :key="item.name"
                              :isDiffer="true"
                              :isScheme="crruntWorkInfo.isCutting == '1'"
                              :title="item.name"
                              :pnlList="pnlList"
                              :schemeList="schemeList"
                              :remark="crruntWorkInfo.remark"
                              :localUid="crruntWorkInfo.localUid"
                              :requirement="crruntWorkInfo.requirement"
                              :configVoList="crruntWorkInfo.configVoList"
                              @paramsChange="paramsChange"
                              v-if="i == nodeIndex"
                            ></ParameterSettings>
                          </el-tab-pane>
                        </el-tabs>
                      </el-card>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-form>
    </el-tabs>
    <template #footer>
      <div class="text-center">
        <el-button :loading="buttonLoading" @click="cancelMi">取消</el-button>
        <el-button :loading="buttonLoading" @click="preShow('')">预览</el-button>
        <template v-if="props.type == 'work'">
          <el-button :loading="buttonLoading" @click="submitForm('')">暂存</el-button>
          <el-button v-if="currentMiInfo.status=='1' || currentMiInfo.status == '7'" :loading="buttonLoading" type="primary" @click="submitForm('2')">提交审核</el-button>
          <el-button v-if="currentMiInfo.status == '5' || currentMiInfo.status == '6'" :loading="buttonLoading" type="primary" @click="submitForm('',true)">同步工序至生产</el-button>
        </template>
        <template v-else>
          <el-button :loading="buttonLoading" @click="submitForm('')">暂存</el-button>
          <el-button :loading="buttonLoading" type="danger" @click="submitForm('7')">驳回</el-button>
          <el-button :loading="buttonLoading" type="success" @click="submitForm('3')">通过</el-button>
        </template>
      </div>
    </template>
  </el-drawer>

  <!-- 选择工艺单对话框 -->
  <el-dialog :title="rawMaterialDialog.title" v-model="rawMaterialDialog.visible" width="50%"
             :close-on-click-modal="false" destroy-on-close>
    <vxe-table
      border
      keep-source
      align="center"
      :row-config="{height: 40,isCurrent:true}"
      show-overflow
      :column-config="{resizable: true}"
      @cell-dblclick="chooseRawMaterial"
      :loading="loading"
      :data="rawMaterialList">
      <vxe-column fixed="left" type="seq" title="序号" width="60"></vxe-column>
      <vxe-column width="290" title="物料名称" field="name">
      </vxe-column>
      <vxe-column width="290" title="长" field="length">
      </vxe-column>
      <vxe-column width="290" title="宽" field="width">
      </vxe-column>
    </vxe-table>
    <pagination
      v-show="materialTotal>0"
      :total="materialTotal"
      v-model:page="materialListQueryParam.pageNum"
      v-model:limit="materialListQueryParam.pageSize"
      @pagination="getMaterialList"
    />
  </el-dialog>

  <!-- 新增工序 -->
  <el-dialog :title="nodeData.addWorkTitle" v-model="nodeData.addWorkOpen" :width="[5,6,9].includes(nodeData.addWorkType) ? '80%' : '600px'" destroy-on-close>
    <el-form
      label-width="120px"
      ref="addWorkFormRef"
      class="demo-ruleForm"
      :model="nodeData.addWorkForm"
      :rules="nodeData.addWorkRules"
    >
      <template v-if="nodeData.addWorkType == 1">
        <el-form-item label="工艺" prop="roleId">
          <el-select v-model="nodeData.addWorkForm.roleId" placeholder="请选择工艺" filterable @change="getCraftAPI" style="width: 100%" fit-input-width>
            <el-option
              v-for="item in nodeData.craftList"
              :key="item.id"
              :value="item.id"
              :label="item.craftName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="工序名称" prop="roleName">
          <el-input v-model="nodeData.addWorkForm.roleName" placeholder="请输入工序名称"/>
        </el-form-item>
      </template>
      <template v-if="nodeData.addWorkType == 2">
        <el-form-item label="模板名称" prop="templateName">
          <el-input v-model="nodeData.addWorkForm.templateName" placeholder="请输入模板名称"/>
        </el-form-item>
      </template>
      <template v-if="nodeData.addWorkType == 3">
        <el-form-item label="选择模板" prop="choceTemplate">
          <el-select v-model="nodeData.addWorkForm.choceTemplate" placeholder="请选择模板" filterable @change="changeTemplate" style="width: 100%;" fit-input-width>
            <el-option
              v-for="item in nodeData.templateList"
              :key="item.id"
              :value="item.id"
              :label="item.templateName"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-if="nodeData.addWorkType == 4">
        <el-form-item v-if="pnlList.length>0" v-for="pnl in pnlInfoList" :key="pnl.id" :label="pnl.name">
          <input type="file" @change="onFileChange($event,pnl)"/>
        </el-form-item>
      </template>
      <template v-if="nodeData.addWorkType == 5">
        <!-- 编辑钻孔 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="序号" prop="code">
              <el-input v-model="nodeData.addWorkForm.code" placeholder="请输入序号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="孔径" prop="diameter">
              <el-select v-model="nodeData.addWorkForm.diameter" placeholder="请选择孔径" style="width: 100%;" clearable>
                <el-option
                  v-for="item in resDictData.aperture"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="公差" prop="tolerance">
              <el-select v-model="nodeData.addWorkForm.tolerance" placeholder="请选择公差" style="width: 100%;" clearable>
                <el-option
                  v-for="item in resDictData.deviation"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="成品孔径" prop="productDiameter">
              <el-select v-model="nodeData.addWorkForm.productDiameter" placeholder="请选择成品孔径" style="width: 100%;" clearable>
                <el-option
                  v-for="item in resDictData.aperture"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PTH/NPTH" prop="isPth">
              <el-select v-model="nodeData.addWorkForm.isPth" placeholder="请选择" style="width: 100%;">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="打孔类型" prop="drillType">
              <el-select v-model="nodeData.addWorkForm.drillType" placeholder="请选择打孔类型" style="width: 100%;" clearable>
                <el-option
                  v-for="item in resDictData.drill_type"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>


          <el-col :span="8" v-for="(elCount, elIndex) in nodeData.addWorkForm.quantityList" :key="elIndex">
            <el-form-item :label="`${elCount.label}孔数`">
              <el-input v-model.number="elCount.value" :placeholder="`请输入${elCount.label}孔数`" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="nodeData.addWorkForm.remark" placeholder="请输入备注" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="[6,9].includes(nodeData.addWorkType)">
        <el-row>
          <el-col :span="8">
            <el-form-item label="图层" prop="layer">
              <el-select v-model="nodeData.addWorkForm.layer" placeholder="请选择图层" style="width: 100%;">
                <el-option
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                  v-for="item in resDictData.compacted_layer">
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>{{ item.dictLabel }}</span>
                    <el-image style="width: 100px; height: 25px;" :src="item.remark" fit="cover" />
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层号" prop="layerIndex">
              <el-input v-model="nodeData.addWorkForm.layerIndex" placeholder="请输入层号" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="原料类型" prop="rawMaterialType">
              <el-select v-model="nodeData.addWorkForm.rawMaterialType" placeholder="请选择原料类型" style="width: 100%;">
                <el-option
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                  v-for="item in resDictData.laminated_materials"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="材质" prop="material">
              <el-input v-model="nodeData.addWorkForm.material" placeholder="请输入材质" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="PP片" prop="pp">
              <el-input v-model="nodeData.addWorkForm.pp" placeholder="请输入PP片" clearable/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="板厚" prop="boardThickness">
              <el-input v-model="nodeData.addWorkForm.boardThickness" placeholder="请输入板厚" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="连铜" prop="linkCopper">
              <el-select v-model="nodeData.addWorkForm.linkCopper" placeholder="请选择连铜" style="width: 100%;">
                <el-option :label="item.label" :value="item.value" v-for="item in linkCopperList" :key="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="层压铜厚" prop="copperThickness">
              <el-input v-model="nodeData.addWorkForm.copperThickness" placeholder="请输入层压铜厚" clearable/>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <el-input v-model="nodeData.addWorkForm.remark" placeholder="请输入备注" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="nodeData.addWorkType == 7">
        <el-form-item label="模板名称" prop="laminationName">
          <el-input v-model="nodeData.addWorkForm.laminationName" placeholder="请输入模板名称"/>
        </el-form-item>
      </template>
      <template v-if="nodeData.addWorkType == 8">
        <el-form-item label="选择模板" prop="laminationTemplate">
          <el-select v-model="nodeData.addWorkForm.laminationTemplate" filterable placeholder="请选择模板" @change="changeLaminationTemplate" style="width: 100%;" fit-input-width>
            <el-option
              v-for="item in nodeData.laminationTemplateList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
      </template>
      <div style="display: flex; justify-content: center; width: 100%;" v-if="![3,8].includes(nodeData.addWorkType)">
        <el-button @click="cancelAddWork">取消</el-button>
        <el-button type="primary" @click="addWorkHandle">确认</el-button>
      </div>
    </el-form>
  </el-dialog>

  <!--客户要求-->
  <el-dialog :title="customerDialog.title" v-model="customerDialog.visible" width="1000px" destroy-on-close>
    <el-input type="textarea" rows="25" maxlength="2000" show-word-limit v-model="customerDemand">
    </el-input>
    <div style="text-align: center;padding: 5px">
      <el-button @click="customerDialog.visible = false">关闭</el-button>
      <el-button type="primary" @click="saveCustomer">保存</el-button>
    </div>
  </el-dialog>

  <!--PCB制作单预览 -->
  <el-drawer destroy-on-close v-model="reportDrawer.visible" :title="reportDrawer.title" size="60%"
             visible.sync="false" draggable>
    <iframe :src="reportUrl" style="width: 100%; height: 100%; border: none;"></iframe>
  </el-drawer>

  <!--eq文件-->
  <el-dialog :title="uploadDialog.title" v-model="uploadDialog.visible" width="1000px">
    <XUpload v-model:model-value="fileList" :readOnly="currentVo.isEqConfirm == '0'" model="download"
             @fileChange="fileChange" @delFile="delEqFile"></XUpload>
  </el-dialog>

  <!--详情预览-->
  <el-drawer
    v-model="orderDrawer.visible"
    :title="orderDrawer.title"
    size="850px"
    :direction="orderDrawer.direction"
    :destroy-on-close="true"
    modal-class="detail-prod-drawder"
  >
    <SaleDescriptions v-if="currentVo" :currentInfo="currentVo" :customerList="customerList" :isShow="false"
                      :resDictData="resDictData"></SaleDescriptions>
  </el-drawer>
  <MIPrint ref="PlanMIPrintRef"  ></MIPrint>
</template>

<script setup name="ProductionPlanDrawer" lang="ts">
  import {
    saveMi, getMiInfo, getCheckUpdate,checkSaleOrderByBo
  } from '@/api/project/productionPlan';
  import {addCraftTemplate} from '@/api/basedata/craftTemplate/index'
  import {getCraftRequirementJson,getRemarkJson,initFillData,getFieldTable,getFieldTableIndex,initNodeInfoList} from './util'
  import {getTemplateList} from '@/api/project/productionPlan/index'
  import {getCraft,getCraftList} from '@/api/basedata/craft/index'
  import {ProductionPlanQuery, ProductionPlanForm, linkCopperList} from '@/api/project/productionPlan/types';
  import {saveStructureTemplate,getStructureTemplateList} from '@/api/basedata/structureTemplateLayer'
  import {getDicts} from "@/api/system/dict/data";
  import {sortBy} from "@/utils/dict";
  import {deepClone, getCharName} from "@/utils";
  import {RawMaterialVO} from "@/api/basedata/rawMaterial/types";
  import {VxeTableEvents} from "vxe-table";
  import {listMaterial} from "@/api/basedata/rawMaterial";
  import {ref} from "vue";
  import {ElMessageBox} from "element-plus";
  import {OrderVO} from "@/api/order/directOrder/types";
  import {getReportUrl} from "@/utils/report";
  import {AssignTaskVO} from "@/api/project/assignTask/types";
  import {addFile, deleteFile, getFileList} from "@/api/upload";
  import { updateMiNodesToCard } from '@/api/production/card';
  import {getCustomer, updateCustomer} from "@/api/basedata/customer";
  import { updateEq} from "@/api/project/assignTask";

  const {proxy} = getCurrentInstance() as ComponentInternalInstance;
  const emits = defineEmits(['update:open', 'saveFinish'])
  const props = withDefaults(defineProps<{
    open: boolean
    type: string
    crtMiInfo: any
  }>(), {
    open: false,
    type: 'work', // work:工序工艺模块弹框  examine:审核模块弹框
    crtMiInfo: undefined
  })
  const PlanMIPrintRef = ref();
  const workTitleRef = ref()
  const drillXTableRef = ref()
  const addWorkFormRef = ref()
  const cascadXTableRef = ref()
  const productionPlanFormRef = ref()
  const openFlag = computed({
    get() {
      return props.open
    },
    set(val) {
      emits('update:open', val)
    }
  })

  const materialTotal = ref(0);

  watch(() => openFlag.value, (v) => {
    if (v) {
      // console.log(111111)
      // console.log(props.crtMiInfo)
      if (props.crtMiInfo) {
        buttonLoading.value = false;
        editMi(props.crtMiInfo)
        checkIsUpdate(props.crtMiInfo.id)
      }
    } else {
      reset()
    }
  })

  let currentMiInfo = ref<any>({});

  const rawMaterialList = ref<RawMaterialVO[]>([]);

  /* 工序工艺数据 */
  const nodeInfoList = ref<any[]>([])
  const delNodeInfoList = ref<any[]>([])
  const nodeData = reactive<Record<string, any>>({
    craftList: [],
    addWorkType: 1, // 1新增工序 2生成模板 3导入模板 4读取drl文件 5编辑钻孔
    templateList: [],
    addWorkTitle: '新增工序',
    addWorkOpen: false,
    newAddWorkRow: undefined,
    row: undefined,
    drillRowIndex: 0,
    laminatedIndex: 0,
    addWorkForm: {
      roleId: undefined,
      roleName: undefined,
      templateName: undefined,
      choceTemplate: undefined,

      code: undefined, // 钻孔编号
      diameter: undefined, // 对应孔径
      tolerance: undefined, // 公差
      productDiameter: undefined, // 成品孔径
      isPth: '1', // 是否是金属钻,默认是
      drillType: undefined, // 打孔类型
      quantityList: [
        { label: 'PNLA', value: 0 }
      ], // 孔数
      remark: undefined, // 备注

      // 层压
      laminationName: undefined,
      laminationTemplate: undefined,
      laminationTemplateList: [],

      layer: undefined,
      layerIndex: undefined,
      rawMaterialType: undefined,
      material: undefined,
      pp: undefined,
      boardThickness: undefined,
      linkCopper: undefined,
      copperThickness: undefined,
    },
    addWorkRules: {
      roleId: [{ required: true, message: '请选择工艺', trigger: 'change' }],
      roleName: [{ required: true, message: '请输入工序名称', trigger: 'blur' }],
      templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      choceTemplate: [{ required: true, message: '请选择模板', trigger: 'change' }],
      code: [{ required: true, message: '请输入序号', trigger: 'blur' }],
      diameter: [{ required: true, message: '请选择孔径', trigger: 'change' }],
      isPth: [{ required: true, message: '请选择PTH/NPTH', trigger: 'change' }],

      laminationName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      laminationTemplate: [{ required: true, message: '请选择模板', trigger: 'change' }],
      layer: [{ required: true, message: '请选择图层', trigger: 'change' }],
    }
  })

  /*pnl配置数据*/
  let pnlList = reactive([]);
  let delPnlList = reactive([]);
  let pnlInfoList = reactive([]);
  let delPnlSetList = reactive([]);

  /*开料方案*/
  let schemeList = reactive([]);
  let delSchemeList = reactive([]);
  let delSchemePnlList = reactive([]);

  /*工艺工序*/
  const workTitleValue = ref('')
  const editTitleFlag = ref(false)
  const workflowList = reactive([{}])
  const crruntWorkInfo = ref<any>(undefined)
  const loading = ref(true);

  /*tgz文件*/
  const tgzFileList = ref([]);
  const miFileList = ref([]);
  const outSideFileList = ref([]);
  const delFileIdList = ref([]);
  /*eq文件*/
  const fileList = ref<any[]>([]);

  const minCuttingRate = ref(0);
  const currentSchemeIndex = ref(0);

  const rawMaterialDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const customerDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const uploadDialog = reactive<DialogOption>({
    visible: false,
    title: ''
  });

  const materialListQueryParam = {
    pageNum: 1,
    pageSize: 20,
    rawMaterialTypeName: "板材",
    name: "不指定板材",
    params: {}
  }

  watch([() => schemeList, () => pnlList], ([v1, old1], [v2, old2]) => {
    if (crruntWorkInfo.value) {
      if (crruntWorkInfo.value.isCutting == '1' && v1 != old1) {
        initRequirementJson()
        // if (v1?.length < old1?.length) {
        //   nodeIndex.value = 0
        // }
      }
      if (crruntWorkInfo.value.isCutting != '1' && v2 != old2) {
        initRequirementJson()
        // if (v2?.length < old2?.length) {
        //   nodeIndex.value = 0
        // }
      }
    }
    nodeIndex.value = 0
  }, { deep: true })

  const buttonLoading = ref(false);
  let resDictData = {
    //工艺单状态
    mi_status: [],
    //订单类型
    order_type: [],
    //MI类型
    mi_type: [],
    //批量/样品
    order_model: [],
    //加急
    order_urgent: [],
    //产品类型
    sys_commodity_type: [],
    //表面处理
    order_surface_treatment: [],
    //板材
    order_material_quality: [],
    //品牌
    order_plate_brand: [],
    //级别
    order_material_level: [],
    //板厚
    finish_plate_thickness: [],
    //外层铜厚
    order_material_copperoutside: [],
    //内层铜厚
    order_material_copperinside: [],
    //阻焊颜色
    order_commodity_solder: [],
    //字符
    order_character: [],
    //过孔要求
    order_hole_requirement: [],
    // 打孔类型
    drill_type: [],
    // 公差
    deviation: [],
    // 孔径
    aperture: [],
    // 层叠状态
    cascading_state: [],
    // 压合图层
    compacted_layer: [],
    // 层压原料类别
    laminated_materials: [],
  }

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
    preFeedAuditUserName: undefined,
  }
  const data = reactive<PageData<ProductionPlanForm, ProductionPlanQuery>>({
    form: {...initFormData},
    queryParams: {},
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

  const {form, rules} = toRefs(data);

  /*订单*/
  const currentVo = ref<any>({});
  let customerDemand = ref("");
  /*客户要求*/
  const openCustomerRequire = (info: any) => {
    currentVo.value = info;
    customerDemand.value = info.customerDemand;
    customerDialog.visible = true;
    customerDialog.title = "客户要求";
  }

  const saveCustomer = async ()=>{
    currentVo.value.customerDemand = customerDemand.value;
    const res = await getCustomer(currentVo.value.cusId);
    const saveData = res.data
    saveData.customerDemand = customerDemand.value
    await updateCustomer(saveData);
    proxy?.$modal.msgSuccess("操作成功");
    customerDialog.visible = false;
  }

  const openUpload = async (info: any) => {
    currentVo.value = info;
    // currentVo.value.isEqConfirm = props.type == 'work' ? props.crtMiInfo.miAssignTaskVoList.find(vo=> info.id == vo.saleOrderId)?.isEqConfirm : orderList.value.find(vo=>vo.id == info.id)?.isEqConfirm;
    getEqFileList();
    uploadDialog.visible = true;
    uploadDialog.title = "EQ文件";
  }

  const getEqFileList = async ()=>{
    const param = {
      bizId: currentVo.value.id,
      bizType: "12",
      moduleCode: "2",
    }
    const res = await getFileList(param);
    fileList.value = res.data;
  }

  const fileChange = (value: any) => {
    let lastFile = value.find(vo => vo.key == value[value.length - 1].key);
    var data = {
      bizId:  currentVo.value.id,
      moduleCode: "2",
      bizType: "12",
      type: lastFile.type,
      size: lastFile.size,
      name: lastFile.name,
      key: lastFile.key,
    }
    addFile(data).then(()=>{
      getEqFileList()
    })
  }

  const delEqFile = (value: any) => {
    const _ids = value?.id;
    deleteFile(_ids);
    proxy?.$modal.msgSuccess("删除成功");
  }

  /*switch change事件*/
  const handleChange = async ($event: any, row: any) => {
    console.log(row);
    const submitInfo = {
      id: row.assignTaskId,
      isEqConfirm: row.isEqConfirm,
    }
    await updateEq(submitInfo).finally(() => buttonLoading.value = false);
    currentVo.value = row;
    proxy?.$modal.msgSuccess("修改成功");
  };

  const reportDrawer = reactive<DrawerOption>({
    direction: 'left',
    visible: false,
    title: '预审单'
  });

  let reportUrl = ref("");
  const assignTaskUReportHandle = async (row: OrderVO) => {
    reportDrawer.title = "PCB制作单";
    reportDrawer.visible = true;
    reportUrl.value = getReportUrl() + `&_n=PCB制作单&_u=file:saleOrder.ureport.xml&url=order/saleOrder/reportMi/${row.id}`;
    console.log(reportUrl.value);
  }

  const assignTaskHistoryUReportHandle = async (row: AssignTaskVO) => {
    reportDrawer.title = "PCB制作单";
    reportDrawer.visible = true;
    reportUrl.value = getReportUrl() + `&_n=PCB制作单&_u=file:saleOrder.ureport.xml&url=order/saleOrder/reportMi/${row.id}`;
    console.log(reportUrl.value);
  }

  const orderDrawer = reactive<DrawerOption>({
    title: '订单详情',
    visible: false,
    direction: "rtl"
  });

  const openOrderDetail =(row:any)=>{
    currentVo.value = row;
    console.log(currentVo.value)
    orderDrawer.visible = true;
    orderDrawer.title = row.code;
  }

  /*获取字典数据*/
  const getDictData = async () => {
    const rules = [['dictSort', 'asc']];
    let string = "order_type,order_model,order_urgent,order_material_quality,order_plate_brand,order_plate_brand," +
      "order_material_level,finish_plate_thickness,order_material_copperoutside,order_material_copperinside,order_commodity_solder,order_character,order_hole_requirement," +
      "drill_type,deviation,aperture,cascading_state,compacted_layer,laminated_materials";
    getDicts(string)
      .then(res => {
        const dictData = res.data;
        string.split(",").forEach(item => {
          Object.keys(resDictData).forEach(dictItem => {
            if (item == dictItem) {
              resDictData[dictItem] = sortBy(dictData.filter(info => {
                return item == info.dictType
              }), rules);
            }
          })
        })
      });
  }

  //新增Pnl参数
  const addPnlPara = () => {
    //新增Pnl时，需要复制主工作流
    var workflow = deepClone(workflowList[0]);

    //新建Pnl
    const newPnl = {
      name: 'PNL' + getCharName(pnlList.length),
      pnlSetBoList: [],
      platingAreaCS: null,//受镀面积(C/S)
      platingAreaSS: null,//受镀面积(S/S)
      typesettingLength: null,
      typesettingWidth: null,
      workflow: workflow,
      index: pnlList.length + 1
    };

    //按CommodityList初始化Pnl的产品Set数据
    currentMiInfo.value.saleOrderVoList.forEach(saleOrder => {
      newPnl.pnlSetBoList.push({
        saleOrderBo: saleOrder,
        quantity: 0,
      });
    });

    //将第一个PNL下的钻孔节点中的钻头参数数据复制到新的PNL
    /*    pnlList[0].workflow.nodeList.forEach((item, index) => {
          if (item.code == 'Drill_System') {

            var newPnlDrillPara = newPnl.workflow.nodeList[index].drillParameterList;
            //清除复制过来的数据
            newPnlDrillPara.splice(0, newPnlDrillPara.length);
            //重新复制数据
            item.drillParameterList.forEach((drillPara) => {
              var para = deepClone(drillPara);
              para.bomId = 0;
              para.count = 0;
              newPnlDrillPara.push(para);
            });
          }
        });*/

    //将Pnl加入到Pnl列表
    pnlList.push(newPnl);

    if (pnlInfoList.length) {
      const drillParameterList = JSON.parse(JSON.stringify(pnlInfoList[pnlInfoList.length - 1].drillParameterList)).map(v => {
        v.id = undefined
        v.quantity = 0
        return v
      })
      pnlInfoList.push({
        id: undefined,
        name: newPnl.name,
        pnl: newPnl,
        drillParameterList,
        drillList: []
      })
      // console.log(pnlInfoList)
    }

    //在每个开料方案下，添加新Pnl的对应数量
    for (var i = 0; i < schemeList.length; i++) {
      schemeList[i].pnlCountList.push({
        pnlQuantity: 0,
      });
    }
  }

  //选择板材后的处理
  const chooseRawMaterial: VxeTableEvents.CellDblclick<RawMaterialVO> = ({row}) => {
    schemeList[currentSchemeIndex.value].rawMaterial = row;
    schemeList[currentSchemeIndex.value].boardLength = row.length;
    schemeList[currentSchemeIndex.value].boardWidth = row.width;
    schemeList[currentSchemeIndex.value].rawMaterialId = row.id;
    rawMaterialDialog.visible = false;
    if (currentSchemeIndex.value == 0) {
      // 如果工序列表有开料，需要重新计算开料尺寸和开料英寸尺寸
      // 初始化数据
      if (orderList.value?.length) {
        // const outsideLineTemp = nodeInfoList.value.find((item: any) => item.code == 'OutsideLine')
        const CuttingTemp = nodeInfoList.value.find((item: any) => item.code == 'CuttingMaterial_System')
        const CuttingRequire = CuttingTemp?.requirement
        // if (CuttingMaterialSystemTemp) {
        //   getFieldTableIndex(orderList.value, CuttingMaterialSystemTemp, currentMiInfo.value.planType, schemeList, pnlList, form.value.compensation, outsideLineTemp, false)
        // }
        if (CuttingRequire) {
          //开料尺寸
          let valueInfo = CuttingRequire.find((f: any) => f.code == 'CutSizeMm')
          if (valueInfo) {
            // valueInfo.isChecked = '1';
            if (valueInfo.isDifferentiatePnl == '1') {
              let length = schemeList?.length ? schemeList[0].boardLength : 0;
              let width = schemeList?.length ? schemeList[0].boardWidth : 0;
              let resNumber = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
              valueInfo.differPNL.map((d: any) => {
                d.defaultValue = resNumber
              })
            } else {
              let length = schemeList?.length ? schemeList[0].boardLength : 0;
              let width = schemeList?.length ? schemeList[0].boardWidth : 0;
              valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
            }
            // console.log('CutSizeMm', valueInfo)
          }
          //开料英寸尺寸
          valueInfo = CuttingRequire.find((f: any) => f.code == 'CutSize')
          if (valueInfo) {
            // valueInfo.isChecked = '1';
            if (valueInfo.isDifferentiatePnl == '1') {
              let length = schemeList?.length ? (schemeList[0].boardLength / 25.4) : 0;
              let width = schemeList?.length ? (schemeList[0].boardWidth / 25.4) : 0;
              let resNumber = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
              valueInfo.differPNL.map((d: any) => {
                d.defaultValue = resNumber
              })
            } else {
              let length = schemeList?.length ? (schemeList[0].boardLength / 25.4) : 0;
              let width = schemeList?.length ? (schemeList[0].boardWidth / 25.4) : 0;
              valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
            }
            // console.log('CutSize', valueInfo)
          }
          if (crruntWorkInfo.value && crruntWorkInfo.value.code == 'CuttingMaterial_System') {
            crruntWorkInfo.value = CuttingTemp
          }
        }
      }
    }
  }


  //获取指定开料方案中的产品PCS
  const getTotalPcs = (scheme: any, saleOrder: any) => {
    // console.log(111)
    return getSchemeCommidtyPcs(scheme, saleOrder);
// return item.setNumber * saleOrder.unitedNumber;
  }

  //计算指定开料方案下，某个产品的总数量，pcs/大料
  const getSchemeCommidtyPcs = (scheme: any, saleOrder: any) => {
    var total = 0;
    //循环开料方案下的pnlCount
    scheme.pnlCountList.forEach((item, index) => {
      //在对应的pnlList中找到指定商品的Set
      const setPnls = pnlList[index].pnlSetBoList.filter((set) => {
        if (set.quantity && set.saleOrderBo.id == saleOrder.id) {
          return set;
        }
      });
      //如果pnl下的set数量大于0，则计算
      if (item.pnlQuantity) {
        setPnls.forEach((set) => {
          //pnl数量 * set数量 * 每个set上的pcs数量
          total += scheme.materialNumber *  item.pnlQuantity * set.quantity * saleOrder.unitedNumber;
        });
      }
    });
    return total ;
  }

  //获取指定开料方案中的产品Set数
  const getSetPerScheme = (scheme: any, saleOrder: any) => {
    var total = 0;
    //循环开料方案下的pnlCount
    scheme.pnlCountList.forEach((item, index) => {
      //在对应的pnlList中找到指定商品的Set
      const setPnls = pnlList[index].pnlSetBoList.filter((set) => {
        if (set.quantity && set.saleOrderBo.id == saleOrder.id) {
          return set;
        }
      });
      //如果pnl下的set数量大于0，则计算
      if (item.pnlQuantity) {
        setPnls.forEach((set) => {
          //投料数量 * pnl数量 * set数量 * 每个set上的pcs数量
          total += item.pnlQuantity * set.quantity;
        });
      }
    });
    return total;
  }

  const formatNumber = (value: any, length: any) => {
    if (!length) {
      length = 2;
    }
    var tmp = Math.pow(10, length);
    var result = Math.round(value * tmp) / tmp;
    return Number(result.toFixed(length));
  }

  //获取开料率
  const getCuttingRate = (scheme: any) => {
      //大料面积
      var schemeArea = scheme.rawMaterial?.length * scheme.rawMaterial?.width;
      //set的总面积
      var totalSetArea = 0;
      //按产品循环,计算Scheme上产品对应的Set的面积
      currentMiInfo.value.saleOrderVoList?.forEach(saleOrder => {
        var setPerScheme = getSetPerScheme(scheme, saleOrder);
        var setArea = setPerScheme * saleOrder.unitedLength * saleOrder.unitedWidth;
        totalSetArea += setArea;
      });
      var cuttingRate = 0;
      if (schemeArea) {
        cuttingRate = totalSetArea / schemeArea * 100;
      }
      scheme.cuttingRate = formatNumber(cuttingRate, 2);
      return cuttingRate?cuttingRate:'0';
  }

  /*获取选择板材列表*/
  const getMaterialList = () => {
    loading.value = true;
    listMaterial(materialListQueryParam).then(res => {
      rawMaterialList.value = res.rows;
      materialTotal.value = res.total;
    });
    loading.value = false;
  }

  /*打开板材列表*/
  const openDialog = (index: number) => {
    currentSchemeIndex.value = index;
    getMaterialList();
    rawMaterialDialog.title = '选择板材';
    rawMaterialDialog.visible = true;
  }


  //删除Pnl参数
  const deletePnlPara = (item: any, index: any) => {
    ElMessageBox.confirm(
      '确定删除' + item.name + '吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      if (pnlList.length > 1) {
        //移除PNL
        if (pnlInfoList && pnlInfoList.length == pnlList.length) {
          pnlInfoList.splice(index, 1);
        }
        pnlList.splice(index, 1);
        if (item.id != null) {
          delPnlList.push(item.id);
          item.pnlSetBoList.forEach(info => {
            delPnlSetList.push(info.id)
          })
        }
        //移除Scheme中对应的PNL信息
        for (var i = 0; i < schemeList.length; i++) {
          schemeList[i].pnlCountList.splice(index, 1);
        }
        //重新设置流程节点的Requirement和Remark
        ElMessage({
          type: 'success',
          message: '操作成功',
        })
      }
    })
  }

  //新建开料方案
  const addScheme = () => {
    const newScheme = {
      name: '开料方案' + getCharName(schemeList.length),
      pnlCountList: [],
      rawMaterial: {
        boardThickness: '',
        brand: '',
        copperThickness: '',
        id: 0,
        name: '',
        no: '',
        length: 0,
        width: 0
      },
      cuttingRate: 0,
      rawMaterialId: 0,
      boardLength: 0,
      boardWidth: 0,
      productionRate: 1,//投产倍率
      files: [],
      unit: '',
      workflowList: []
    };
    //为开料方案创建Pnl数量
    for (var t = 0; t < pnlList.length; t++) {
      newScheme.pnlCountList.push({pnlQuantity: 0});
    }
    //为开料方案添加流程
    var tmp = JSON.stringify(workflowList);
    newScheme.workflowList = JSON.parse(tmp);
    //添加开料方案到开料方案列表
    schemeList.push(newScheme);
  }
  //删除开料方案
  const deleteScheme = (item: any, index: any) => {
    ElMessageBox.confirm(
      '确定删除' + item.name + '吗?',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true,
        type: 'warning',
      }
    ).then(() => {
      const index = schemeList.indexOf(item)
      if (index !== -1) {
        schemeList.splice(index, 1);
        if (item.id != null) {
          delSchemeList.push(item.id);
          item.pnlCountList.forEach(info => {
            delSchemePnlList.push(info.id)
          })
        }
      }
      //重新设置流程节点的Requirement和Remark
      // resetNodeRequirementAndRemark(index, true);
    })
  }


  const miDrawer = reactive<DrawerOption>({
//   visible: false,
    title: "",
    direction: "rtl"
  });

  /** 表单重置 */
  const reset = () => {
    crruntWorkInfo.value = undefined
    form.value = {...initFormData};
    productionPlanFormRef.value?.resetFields();
  }

  const resetList = () => {
    pnlList.length = 0;
    schemeList.length = 0;
    delPnlList.length = 0;
    pnlInfoList.length = 0;
    nodeData.addWorkType = 1;
    delPnlSetList.length = 0;
    delSchemeList.length = 0;
    delSchemePnlList.length = 0;
    nodeInfoList.value.length = 0;
    delFileIdList.value.length = 0;
    delNodeInfoList.value.length = 0;
    reset();
  }
  const cancelMi = () => {
    resetList()
    openFlag.value = false;
  }

  const disabledTab = ref(false)

  const orderList = ref([]);

  // 校验是否可以修改1,2tab
  const checkIsUpdate = (id: number) => {
    getCheckUpdate(id).then((res) => {
      // console.log(res)
      disabledTab.value = res.data
    })
  }
  /** 修改按钮操作 */
  const editMi = async (row?: any) => {
    currentMiInfo.value = row;
    form.value = row;
    const res = await getMiInfo(row.id)
    const data = res.data;
    orderList.value = res.data.saleOrderVoList;
    form.value.name = data.name;
    form.value.remark = data.remark;
    form.value.dispatchTime = undefined
    if (form.value.saleOrderVoList?.length) {
      let tempTime = form.value.saleOrderVoList[0].dispatchTime
      form.value.saleOrderVoList.forEach((v: any) => {
        // console.log(v.dispatchTime)
        if (new Date(tempTime).getTime() > new Date(v.dispatchTime).getTime()) {
          tempTime = v.dispatchTime
        }
      })
      form.value.dispatchTime = tempTime
    }
    if (data.nodeInfoList && data.nodeInfoList.length) {
      nodeInfoList.value = data.nodeInfoList.map((v) => {
        // 两层json，所以需要转换一下
        v.localUid = v.craftName + v.id + Math.random()
        v.remark = v?.remark
        v.requirement = v?.requirement
        v.extension = v?.extension
        v.delMiDrillIdList = []
        return v
      })
    }
    if (data.pnlBoList.length > 0) {
      data.pnlBoList.forEach(item => {
        pnlList.push(item)
        // console.log('pnlList', pnlList)
      })
    } else {
      const info = {
        name: 'PNLA',
        pnlSetBoList: [],
        length: 0,
        width: 0,
        workflow: {
          title: '主工序工艺',
          commodityId: 0,
          nodeList: [
            {
              drillParameterList: [],
            }
          ]
        },
      }
      pnlList.push(info);
      currentMiInfo.value.saleOrderVoList?.length && currentMiInfo.value.saleOrderVoList.forEach(item => {
        pnlList[0].pnlSetBoList.push({
          saleOrderBo: item,
          quantity: 0,
        });
      });
    }
    if (data.schemeBoList.length > 0) {
      data.schemeBoList.forEach(item => {
        schemeList.push(item)
      })
    } else {
      const scheInfo = {
        name: '开料方案A',
        rawMaterial: {
          boardThickness: '',
          brand: '',
          copperThickness: '',
          id: 0,
          name: '',
          no: '',
          length: 0,
          width: 0
        },
        cuttingRate: 0,
        rawMaterialId: 0,
        boardLength: 0,
        boardWidth: 0,
        schemeFileList: [],
        pnlCountList: [],
      }
      schemeList.push(scheInfo);
      schemeList[0].pnlCountList.push({
        pnlQuantity: 0,
      })
    }
    setPnlInfoList()
    tgzFileList.value = data.tgzFileList
    miFileList.value = data.miFileList
    outSideFileList.value = data.outSideFileList
    // console.log(JSON.parse(JSON.stringify(schemeList)))

    // 初始化节点数据
    initNodeInfoList(nodeInfoList.value, form.value.saleOrderVoList, currentMiInfo.value.planType)

    // 初始化填充数据
    initFillData(nodeInfoList.value, form.value)
  }

  //检验pnl/scheme名称是否有重复
  const checkName = (list: any) => {
    var data: any = list.map((item: any) => {
      return item.name;
    })
    let res = false
    for (var i = 0; i < list.length - 1; i++) {
      if (data.indexOf(data[i], i + 1) > -1) {
        ElMessage.error("存在同名PNL或开料方案!");
        // return;
        res = true
      }
    }
    return res
  }

  // 处理主工序工艺数据
  const dealNodeInfoList = (list) => {
    list = list.map((v: any) => {
      v.id = v?.id || undefined
      if (v.requirement) {
        const tempReqrirement = v.requirement
        tempReqrirement.map((m: any) => {
          delete m?.options
          delete m?.optionsValueList
          delete m?.inputHiddenValue
          delete m?.uuid
        })
        const temp = tempReqrirement.filter(el => el.isChecked == '1')
        v.requirement = temp.length ? temp : null
        delete v.configVoList
      }
      // console.log(v.miDrillDataList)
      // if (v.miDrillDataList && v.miDrillDataList.length) {
      //   // let drillList = []
      //   // console.log(drillList)
      //   // v.miDrillDataList.forEach((val) => {
      //   //   val.drillParameterList?.forEach(el => {
      //   //     el.quantity = el.quantity+''
      //   //     el.isPth = el.isPth == true ? '1' : '0'
      //   //     el.productDiameter = el.productDiameter+''
      //   //     drillList.push({
      //   //       planId: form.value.id,
      //   //       craftId: v.craftId,
      //   //       pnlId: val.id,
      //   //       pnlName: val.name,
      //   //       ...el
      //   //     })
      //   //   })
      //   // })
      //   // v.miDrillDataList = drillList
      // } else {
      //   v.miDrillDataList = []
      // }
      return v
    })
  }

  //参数检测
  function checkStatusData () {
    let result = {
      status: true,
      message: []
    };
    //阻焊颜色
    let para = getPara('SolderResist', 'Solder_SS');
    if (para) {
      let commodityValue = currentMiInfo.value.saleOrderVoList[0].commoditySolder;
      comparePara(para, commodityValue, result);
    }

    para = getPara('SolderResist', 'Solder_CS');
    if (para) {
      let commodityValue = currentMiInfo.value.saleOrderVoList[0].commoditySolder;
      comparePara(para, commodityValue, result);
    }

    //字符颜色
    para = getPara('PrintingCharacter', 'Character_GTO');
    if (para) {
      let commodityValue = currentMiInfo.value.saleOrderVoList[0].characterColor;
      comparePara(para, commodityValue, result);
    }

    para = getPara('PrintingCharacter', 'Character_GBO');
    if (para) {
      let commodityValue = currentMiInfo.value.saleOrderVoList[0].characterColor;
      comparePara(para, commodityValue, result);
    }


    // //表面处理
    // para = getPara('Surface_Treatment', 'SurfaceTreatment_Type');
    // commodityValue = getCommodityValue('surface_Treatment');
    // comparePara(para, commodityValue, result);

    // //板厚
    // para = getPara('CuttingMaterial_System', 'BoardThickness');
    // if (para) {
    //   let commodityValue = getCommodityValue('boardThickness');
    //   let paraValue = para.differPNL[0].defaultValue;
    //   if (paraValue && commodityValue) {
    //     if (Number(paraValue) < Number(commodityValue) - 0.2) {
    //       result.status = false;
    //       result.message.push({
    //         paraName: para.name,
    //         paraValue: paraValue,
    //         commodityValue: commodityValue
    //       })
    //     }
    //   }
    // }
    return result;
  }
  //比较参数
  function comparePara(para: any, commodityValue: any,result: any) {
    // console.log('para', para)
    if (para) {
      if (para.isDifferentiatePnl == '0') {
        // 公共参数
        if (para.defaultValue != commodityValue && para.isChecked == '1') {
          result.status = false;
          result.message.push({
            paraName: para.name,
            paraValue: para.defaultValue,
            commodityValue: commodityValue,
            paraType: true, // true 公共参数 false 非公共参数
          });
        }
      } else if (para.isDifferentiatePnl == '1') {
        // 非公共参数
        para.differPNL.forEach((v: any) => {
          if (v.defaultValue != commodityValue && v.isChecked == '1') {
            result.status = false;
            result.message.push({
              paraName: para.name,
              paraValue: v.defaultValue,
              commodityValue: commodityValue,
              paraType: false, // true 公共参数 false 非公共参数
              paraPnlName: v.pnlName
            });
          }
        })
      }
    }
  }
  //获取节点参数信息
  function getPara(craftCode: any,paraCode: any) {
    let node = nodeInfoList.value.find(o => o.code == craftCode);
    if (node) {
      let paras = node.requirement;
      let para = paras.find(o => o.code == paraCode);
      if (para) {
        return para;
      }
    }
    return null;
  }
  //获取产品属性值
  function getCommodityValue(code: any) {
    let commodity = currentMiInfo.value.saleOrderVoList[0];
    return commodity[code];
  }

  const messagePop = () => {
    return new Promise((resolve: any, reject: any) => {
      let result = checkStatusData();
      if (!result.status) {
        let msg = '以下参数在产品信息与工艺要求中不一致，您确认继续提交审核吗?<br/>';
        result.message.forEach(item => {
          // msg += item.paraName + '：' + item.paraType ? (item.commodityValue + '->' + item.paraValue + '<br/>') : (item.paraPnlName + ':' + item.commodityValue + '->' + item.paraValue + '<br/>');
          msg += `${item.paraName}：${item.paraType ? (item.commodityValue + '->' + item.paraValue + '<br/>')
          : (item.paraPnlName + '：' + item.commodityValue + '->' + item.paraValue + '<br/>')}`
        });
        // return this.$confirm(msg, "提示", {
        //   type: 'warning',
        //   dangerouslyUseHTMLString: true
        // });
        ElMessageBox.confirm(msg, '提示', {
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).then(() => {
          resolve(true)
        }).catch(() => {
          resolve(false)
        })
      } else {
        resolve(true)
      }
    })
  }
  const checkValidator = (submitInfo: any) => {
    let res = ''
    if (!submitInfo.nodeInfoList?.length) {
      res = '工序工艺不能为空'
    }
    submitInfo.pnlBoList?.length && submitInfo.pnlBoList.some((item: any) => {
      if (item.name == '' || item.name == undefined || item.name == null) {
        res = 'PNL名称不能为空'
        return true
      }
      if (item.pnlLength == '' || item.pnlLength == undefined || item.pnlLength == null) {
        res = item.name + ' 长不能空'
        return true
      }
      if (item.pnlWidth == '' || item.pnlWidth == undefined || item.pnlWidth == null) {
        res = item.name + ' 宽不能空'
        return true
      }
      item.pnlSetBoList?.length && item.pnlSetBoList.forEach((pnl: any) => {
        if (pnl.quantity == '' || pnl.quantity == undefined || pnl.quantity == null) {
          res = item.name + ' SET/PNL不能为空'
          return true
        }
      })
    })
    submitInfo.schemeBoList?.length && submitInfo.schemeBoList.some((sch: any) => {
      const cuttingRate = (sch?.cuttingRate && sch.cuttingRate.toString().replace(/\./g,'')) || '0'
      if (cuttingRate.length > 8) {
        res = '开料率过大'
        return
      }
      if (sch.name == '' || sch.name == undefined || sch.name == null) {
        res = '开料方案名称不能为空'
        return true
      }
      if (sch.rawMaterialId == '' || sch.rawMaterialId == undefined || sch.rawMaterialId == null) {
        res = '板材不能为空'
        return true
      }
      sch.pnlCountList?.length && sch.pnlCountList.some((v: any) => {
        if (v.pnlQuantity == '' || v.pnlQuantity == undefined || v.pnlQuantity == null) {
          res = sch.name + ' 数量不能为空'
          return true
        }
      })
      if (res) {
        return true
      }
    })
    return res
  }

  //预览
  const preShow = async (status: string) => {
    const _planId=currentMiInfo.value.id;
    await submitForm('').then(() => {
      PlanMIPrintRef.value.doPrint(_planId, 'noOutsideImages');
    });
  }

  const dialogLoading = ref(false)
  /** 提交按钮 */
  const submitForm = (status: string,update?:boolean) => {
    return new Promise(async (resolve, reject) => {
      const _planId=currentMiInfo.value.id;
      let check =false;
      buttonLoading.value = true;
      const submitInfo = {
        id: currentMiInfo.value.id,
        name: currentMiInfo.value.name,
        remark: currentMiInfo.value.remark,
        status: status == '' ? undefined : status,
        pnlBoList: deepClone(pnlList),
        schemeBoList: schemeList,
        delPnlList: delPnlList,
        delPnlSetList: delPnlSetList,
        delSchemeList: delSchemeList,
        miFileList: miFileList.value,
        tgzFileList: tgzFileList.value,
        delSchemePnlList: delSchemePnlList,
        delFileIdList: delFileIdList.value,
        outSideFileList: outSideFileList.value,
        delNodeInfoList: delNodeInfoList.value,
        nodeInfoList: JSON.parse(JSON.stringify(nodeInfoList.value)),
        saleOrderIdList: currentMiInfo.value.saleOrderVoList?.length && currentMiInfo.value.saleOrderVoList.map((v:any)=> {return v.id}) || [],
      }
      console.log(submitInfo)
      const res = checkValidator(submitInfo)
      if (res) {
        ElMessage.error(res)
        buttonLoading.value = false;
        return
      }
      check = await checkSaleOrderByBo({planId:_planId}).catch(() => {buttonLoading.value = false});
      if (!check) {
          buttonLoading.value = false;
          return;
      }

      if (status == '2') {
        // 提交审核
        const flag = await messagePop()
        if (!flag) {
          buttonLoading.value = false;
          return
        }
      }
      try {
      if (checkName(submitInfo.pnlBoList)) {
        buttonLoading.value = false;
        return
      }
      if (checkName(submitInfo.schemeBoList)) {
        buttonLoading.value = false;
        return
      }
      dealNodeInfoList(submitInfo.nodeInfoList);
      if (submitInfo.pnlBoList?.length) {
        submitInfo.pnlBoList.map((m: any) => {
          m.pnlSetBoList?.length && m.pnlSetBoList.map((item: any) => {
            const order = {
              id : item.saleOrderBo.id
            }
            delete item.saleOrderBo
            item.saleOrderBo = order;
          })
        })
      }
      } catch(err) {
        buttonLoading.value = false;
      }
      productionPlanFormRef.value?.validate(async (valid: boolean) => {
        if (valid) {
          try {
            buttonLoading.value = true;
            await saveMi(submitInfo);
            if(update){
              const updateNode = {
                id:currentMiInfo.value.id
              }
              await updateMiNodesToCard(updateNode);
            }
            proxy?.$modal.msgSuccess("修改成功");
            if(""!=status){
              openFlag.value = false;
            } else {
              try {
                dialogLoading.value = true
                resetList()
                await editMi(currentMiInfo.value)
              } finally {
                dialogLoading.value = false
              }
            }
            buttonLoading.value = false
            resolve(true)
            emits('saveFinish')
          } catch(err) {
            // console.log(err)
            buttonLoading.value = false
            reject(false)
          }
        }
      });
    })
  }

  // 初始化当前加工要求的json
  const initRequirementJson = () => {
    if (crruntWorkInfo.value) {
      let tempRequirement = getCraftRequirementJson(JSON.parse(JSON.stringify(crruntWorkInfo.value.configVoList)), schemeList, pnlList, crruntWorkInfo.value.isCutting == '1')
      tempRequirement = tempRequirement && tempRequirement.map(v => {
        const crtCraft = crruntWorkInfo.value.requirement && crruntWorkInfo.value.requirement.find(el => el.id == v.id || el.name == v.name)
        // console.log(crtCraft)
        if (crtCraft) {
          if (crtCraft.isDifferentiatePnl == '1') {
            if (crtCraft?.differPNL?.length) {
              v.differPNL?.length && v.differPNL.map((dif: any) => {
                const crtPnl = crtCraft.differPNL.find((difF: any) => difF.pnlName == dif.pnlName)
                if (crtPnl) {
                  // dif = crtPnl
                  dif.defaultValue = crtPnl.defaultValue
                  dif.isBold = crtPnl.isBold
                  dif.isChecked = crtPnl.isChecked
                }
              })
            }
          } else {
            v.defaultValue = crtCraft.defaultValue
            v.isBold = crtCraft.isBold
            v.isChecked = crtCraft.isChecked
          }
        } else {
          if (v?.differPNL?.length) {
            v.differPNL.map((m: any) => {
              m.isChecked = false
            })
          }
          v.isChecked = false
        }
        return v
      })
      crruntWorkInfo.value.requirement = tempRequirement
      crruntWorkInfo.value.remark = getRemarkJson(crruntWorkInfo.value.remark, schemeList, pnlList, crruntWorkInfo.value.isCutting == '1')
      // console.log(tempRequirement, crruntWorkInfo.value)
    }
  }

  // 点击 工艺表格，右侧出现表格
  const handleCellClick = ({row}) => {
    crruntWorkInfo.value = JSON.parse(JSON.stringify(row))
    workTitleValue.value = crruntWorkInfo.value.craftName
    // crruntWorkInfo.value.delMiDrillIdList = []
    nodeIndex.value = 0

    if (crruntWorkInfo.value.isLamination == '1') {
      crruntWorkInfo.value.delLaminatedIdList = crruntWorkInfo.value.delLaminatedIdList || []
      crruntWorkInfo.value.cascadingState = crruntWorkInfo.value.extension ? crruntWorkInfo.value.extension?.cascadingState : undefined
      crruntWorkInfo.value.laminatedStructureList = crruntWorkInfo.value.laminatedStructureList || []
      // console.log(crruntWorkInfo.value)
    }

    // const miTempDrillDataList = nodeInfoList.value.find(v => v.isDrill == '1')?.miDrillDataList || []
    // console.log(pnlInfoList,crruntWorkInfo.value.miDrillDataList)
    // if (crruntWorkInfo.value.miDrillDataList?.length) {
      pnlInfoList.map(item => {
          item.drillParameterList = crruntWorkInfo.value.miDrillDataList?.length ? crruntWorkInfo.value.miDrillDataList.filter(v => v.pnlId == item.id) : []
      });
      nextTick(() => {
        if (drillXTableRef.value) {
          const $drlTable = drillXTableRef.value.xTableRef
          if ($drlTable) {
            // $drlTable.updateData()
            $drlTable.reloadData(pnlInfoList[0].drillParameterList)
            $drlTable.sort('code','asc')
            // setMiDrillList()
          }
        }
      })
    // } else {
    //   pnlInfoList.map(item => {
    //       item.drillParameterList = []
    //   });
    // }
    initRequirementJson()
  }

  // 改变层叠状态
  const changeCascading = (val: any) => {
    const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
    if (i != -1) {
      const tempExtension = {
        thickness: '',
        tolerance: '',
        cascadingState: val,
        remark: '',
      }
      crruntWorkInfo.value.extension = tempExtension
      nodeInfoList.value[i].extension = tempExtension
    }
  }

  // 点击 开启修改标题
  const showTitleChange = () => {
    editTitleFlag.value = true
    nextTick(() => {
      workTitleRef.value.focus()
    })
  }
  // 失去焦点 改变标题
  const changeWorkTitle = () => {
    editTitleFlag.value = false
    crruntWorkInfo.value.name = workTitleValue.value
  }

  /** 复制代码成功 */
  const copyTextSuccess = () => {
    proxy?.$modal.msgSuccess('复制成功');
  }

  onMounted(() => {
    getDictData();
  });

  // 测试数据------ start
  const mainWorkmanshipListRef = ref()
  // // 文件 列表
  // const fileList = ref([
  //     // {
  //     //   url:'http://pcb-test.oss-cn-shenzhen.aliyuncs.com/000000/d2eb52e80ea6486686a328c6b30e9fac_200319120534-7-1200.jpg?Expires=1699502971&OSSAccessKeyId=LTAI5tMisk8sS9jyXWbWKemu&Signature=qabUm%2Bt7c3dTa%2BrXQqsTSHLY2%2BA%3D',
  //     //   key:'000000/d2eb52e80ea6486686a328c6b30e9fac_200319120534-7-1200.jpg',name:'200319120534-7-1200.jpg',size:413
  //     // },
  //     // {
  //     //   url:'http://pcb-test.oss-cn-shenzhen.aliyuncs.com/000000/425153cd66be48369b88cf3420e67f97_-1081086182_1781555942.png?Expires=1699502971&OSSAccessKeyId=LTAI5tMisk8sS9jyXWbWKemu&Signature=npDY0hRqQRLwqtUeYT%2BTa8wCiU4%3D',
  //     //   key:'000000/425153cd66be48369b88cf3420e67f97_-1081086182_1781555942.png',name:'-1081086182_1781555942.png',size:99.7
  //     // },
  //     // {
  //     //   url:'http://pcb-test.oss-cn-shenzhen.aliyuncs.com/000000/9831ab17543648d5b9c7649ebf0f5276_ureport-borrow%20%282%29.pdf?Expires=1699502971&OSSAccessKeyId=LTAI5tMisk8sS9jyXWbWKemu&Signature=ADivThJSlUokxvjGcBvM3eSMLmA%3D',
  //     //   key:'000000/9831ab17543648d5b9c7649ebf0f5276_ureport-borrow (2).pdf',name:'ureport-borrow (2).pdf',size:55.8
  //     // },
  // ])
  const leftWorkHeight = ref(document.documentElement.clientHeight - 615 + 'px')
  window.onresize = () => {
    if (openFlag.value) {
      leftWorkHeight.value = document.documentElement.clientHeight - 615 + 'px'
    }
  }

  // 层压表格
  const laminatedColumnList = ref([
    {title: '序号', field: 'sort', align: 'center', width: 60, sortable: true},
    {title: '图层', field: 'layer', align: 'center', width: 80},
    {title: '层号', field: 'layerIndex', align: 'center', width: 80},
    {title: '原材类型', field: 'rawMaterialType', align: 'center', width: 80},
    {title: '材质', field: 'material', align: 'center', width: 80},
    {title: 'PP片', field: 'pp', align: 'center', width: 80},
    {title: '板厚', field: 'boardThickness', align: 'center', width: 80},
    {title: '连铜', field: 'linkCopper', align: 'center', width: 80},
    {title: '铜厚', field: 'copperThickness', align: 'center', width: 80},
    {title: '备注', field: 'remark', align: 'center'},
    {title: '操作', field: 'make', align: 'center', minWidth: 120, showOverflow: false, fixed: 'right'},
  ])

  const mainColumnList = ref([
    {title: '序号', field: 'sort', align: 'center', width: 66, sortable: true},
    {title: '工序名称', field: 'craftName', align: 'center', width: 66},
    {title: '加工要求', field: 'requirement', align: 'center', minWidth: 144, showOverflow: false},
    {title: '备注', field: 'remark', align: 'center', showOverflow: false},
    {title: '过数', field: 'isCount', align: 'center', width: 66, showOverflow: false},
    {title: '操作', field: 'make', align: 'center', width: 122, showOverflow: false},
  ])
  const drlColumnList = ref([
    {title: '序号', field: 'code', align: 'center', width: 50, fixed: 'left', sortable: true},
    {title: '打孔类型', field: 'drillType', align: 'center', width: 65},
    {title: '孔径', field: 'diameter', align: 'center', width: 65},
    {title: '公差', field: 'tolerance', align: 'center', width: 65},
    {title: '成品孔径', field: 'productDiameter', align: 'center', width: 65},
    {title: 'PTH/NPTH', field: 'isPth', align: 'center'},
  ])
  watch(() => pnlList, (v) => {
    drlColumnList.value = drlColumnList.value.slice(0, 6)
    v.forEach((val, i) => {
      drlColumnList.value.push({title: `${val.name}孔数`, field: `count_${i}`, align: 'center', width: 100})
    })
    drlColumnList.value.push({title: '备注', field: 'remark', align: 'center'})
    drlColumnList.value.push({title: '操作', field: 'make', align: 'center', width: 130, showOverflow: false, fixed: 'right'})
  }, { deep: true, immeditate: true })

  // 表格尾部合计
  const footerMethod = ({ columns, data }) => {
    // 返回一个二维数组的表尾合计
    let result = []
    columns.forEach((v, i) => {
      // v.field
      const strI = v.field.indexOf('count_')
      if (i == 0) {
        result.push(`共${data.length}条`)
      } else if (strI != -1) {
        const num = Number(v.field.substring(6))
        let countSum = 0
        pnlInfoList[num]?.drillParameterList.forEach((el) => {
          countSum = countSum + Number(el.quantity)
        })
        result.push(countSum)
      } else {
        result.push('')
      }
    })
    return [result]
  }

  const nodeIndex = ref(0)
  const tabChange = (name) => {
    nodeIndex.value = name
  }

  // 获取工艺列表
  const getCraftListAPI = () => {
    const data = {
      isOpen:"1"
    }
    getCraftList(data).then(res => {
      if (res.code == 200) {
        nodeData.craftList = res.data || []
      }
    })
  }
  // 获取工艺详情
  const getCraftAPI = (id: number) => {
    proxy.$modal.loading()
    getCraft(id).then(res => {
      proxy.$modal.closeLoading()
      if (res.code == 200) {
        let {
          id,
          createDeptName,
          createByName,
          updateByName,
          craftName,
          isAutoWip: isCount,
          craftParameterConfigs: configVoList,
          isDrill,
          isCutting,
          isLamination,
          code
        } = res.data
        isCount = isCount == '1' ? '0' : '1'
        // 初始化备注
        const remark = { public: '', differPNL: [] }
        const localUid = craftName + id + Math.random()
        nodeData.newAddWorkRow = {
          // id,
          createDeptName,
          createByName,
          updateByName,
          planId: form.value.id,
          craftId: id,
          localUid,
          craftName,
          remark,
          sort: nodeData.row ? (nodeData.row.sort + 1) : nodeInfoList.value.length ? (nodeInfoList.value.length + 1) : 1,
          requirement: undefined,
          isCount,
          configVoList,
          isDrill,
          isCutting,
          isLamination,
          code
        }
        // 初始化数据
        if (orderList.value?.length) {
          const outsideLineTemp = nodeInfoList.value.find((item: any) => item.code == 'OutsideLine')
          getFieldTableIndex(orderList.value, nodeData.newAddWorkRow, currentMiInfo.value.planType, schemeList, pnlList, form.value.compensation, outsideLineTemp)
        }
        nodeData.newAddWorkRow.requirement = getCraftRequirementJson(configVoList, schemeList, pnlList, isCutting == '1')
        // console.log(nodeData.newAddWorkRow)
        nodeData.addWorkForm.roleName = craftName
      }
    }).catch(() => {
      proxy.$modal.closeLoading()
    })
  }
  // 获取工艺模板
  const getTemplateListAPI = () => {
    getTemplateList().then(res => {
      if (res.code == 200) {
        nodeData.templateList = res.data || []
      }
    })
  }

  // 组成 pnlInfoList
  const setPnlInfoList = () => {
    const miTempDrillDataList = nodeInfoList.value.find(v => v.isDrill == '1')?.miDrillDataList || []
    pnlInfoList = pnlList.map(item => {
      return {
        id: item.id,
        name: item.name,
        pnl:item,
        drillParameterList: miTempDrillDataList.filter(v => v.pnlId == item.id),
        drillList: []
      };
    });

    if (pnlInfoList.length == 0) {
      pnlInfoList.push({
        id: '',
        name: '',
        pnl: {},
        drillParameterList: miTempDrillDataList,
        drillList:[]
      });
    }
    // console.log(pnlInfoList)
  }

  // 删除钻孔
  const delDrilList = (row: any, index: number) => {
    proxy.$modal.confirm(`确认删除 ${row.code} 钻孔`).then(() => {
      pnlInfoList.forEach(v => {
        // const rowIndex = v.drillParameterList.findIndex(el => el.code == row.code)
        if (index != -1) {
          const tempDrill = deepClone(v.drillParameterList[index])
          tempDrill?.id && crruntWorkInfo.value.delMiDrillIdList.push(tempDrill.id)
          v.drillParameterList.splice(index, 1)
        }
      })
      const $drlTable = drillXTableRef.value.xTableRef
      if ($drlTable) {
        $drlTable.reloadData(pnlInfoList[0].drillParameterList)
        $drlTable.updateData()
        setMiDrillList()
      }
    })
  }

  // 上传文件
  const craftFileChange = (val) => {
    const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
    if (i != -1) {
      nodeInfoList.value[i].craftFileList = val
      crruntWorkInfo.value.craftFileList = val
    }
  }
  // 上传层压文件
  const laminatedFileChange = (val) => {
    const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
    if (i != -1) {
      nodeInfoList.value[i].laminatedFileList = val
      crruntWorkInfo.value.laminatedFileList = val
    }
  }

  // 删除文件
  const delFile = (val: any, files: any, type?: number) => {
    // console.log(val)
    if (val.id) {
      delFileIdList.value.push(val.id)
    }

    if (type == 1) {
      craftFileChange(files)
    } else if (type == 2) {
      laminatedFileChange(files)
    }
  }

  // 获取层压模板列表
  const getStructureTemplateListAPI = () => {
    getStructureTemplateList().then((res: any) => {
      nodeData.laminationTemplateList = res.data || []
    })
  }

  // 打开新增工序弹框
  const openAddWorkFlag = (type, row?: any) => {
    nodeData.addWorkType = type
    if (nodeData.addWorkType == 1) {
      nodeData.addWorkTitle = '新增工序'
      nodeData.row = row || undefined
      getCraftListAPI()
    } else if (nodeData.addWorkType == 2) {
      nodeData.addWorkTitle = '生成模板'
      // getTemplateListAPI()
    } else if (nodeData.addWorkType == 3) {
      nodeData.addWorkTitle = '导入模板'
      pnlInfoList.length = 0;
      setPnlInfoList()
      getTemplateListAPI()
    } else if (nodeData.addWorkType == 4) {
      nodeData.addWorkTitle = '读取drl文件'
    } else if (nodeData.addWorkType == 5) {
      nodeData.addWorkTitle = '编辑钻孔参数'
      nodeData.drillRowIndex = row
      const crtDrillParament = pnlInfoList[0].drillParameterList[nodeData.drillRowIndex]
      let quantityList = []
      // let TempdrillParameterList = []
      pnlInfoList.forEach(v => {
        const tempCrtDrill = v.drillParameterList.find(el => el.code == crtDrillParament.code)
        quantityList.push({
          label: v.name,
          value: tempCrtDrill?.quantity || 0
        })
      })
      const tempRow = {
        code: crtDrillParament.code, // 钻孔编号
        diameter: crtDrillParament.diameter, // 对应孔径
        tolerance: crtDrillParament.tolerance, // 公差
        productDiameter: crtDrillParament.productDiameter, // 成品孔径
        isPth: crtDrillParament.isPth, // 是否是金属钻,默认是
        drillType: crtDrillParament.drillType, // 打孔类型
        quantityList, // 孔数
        remark: crtDrillParament.remark, // 备注
      }
      nodeData.addWorkForm = tempRow
    } else if (nodeData.addWorkType == 6) {
      // 新增层压结构
      nodeData.addWorkTitle = '新增层压结构'
      const tempList = crruntWorkInfo.value.laminatedStructureList
      nodeData.addWorkForm = {
        layer: undefined,
        layerIndex: undefined,
        rawMaterialType: undefined,
        material: undefined,
        pp: undefined,
        boardThickness: undefined,
        linkCopper: undefined,
        copperThickness: undefined,
        sort: tempList.length ? (tempList[tempList.length - 1].sort + 1) : 1,
        productionPlanId: form.value.id,
      }
    } else if (nodeData.addWorkType == 7) {
      // 生成模板
      nodeData.addWorkTitle = '生成模板'
    } else if (nodeData.addWorkType == 8) {
      // 导入模板
      nodeData.addWorkTitle = '导入模板'
      getStructureTemplateListAPI()
    } else if (nodeData.addWorkType == 9) {
      // 编辑层压结构
      nodeData.addWorkForm.productionPlanId = form.value.id
      nodeData.addWorkTitle = '编辑层压结构'
      nodeData.laminatedIndex = row.sort
      nodeData.addWorkForm = deepClone(row)
    }
    nodeData.addWorkOpen = true

    nextTick(() => {
      addWorkFormRef.value.clearValidate()
    })
  }

  // 删除工序
  const delWork = (row) => {
    proxy.$modal.confirm(`确认删除 ${row.craftName} 工序`).then(() => {
      if (crruntWorkInfo.value && row.sort == crruntWorkInfo.value.sort) {
        crruntWorkInfo.value = undefined
      }
      nodeInfoList.value.splice(row.sort - 1, 1)
      nodeInfoList.value.map((v, i) => {
        v.sort = (i + 1)
      })
      if (row.id) {
        // 有id才存，说明是新增的工序，而不是模板本身存在
        delNodeInfoList.value.push(row.id)
      }
    })
  }

  // 删除压合
  const delLaninated = (row) => {
    proxy.$modal.confirm(`确认删除该层压数据?`).then(() => {
      crruntWorkInfo.value.laminatedStructureList.splice(row.sort - 1, 1)
      crruntWorkInfo.value.laminatedStructureList.map((v, i) => {
        v.sort = (i + 1)
      })
      if (row?.id) {
        crruntWorkInfo.value.delLaminatedIdList.push(row.id)
      }
      const $cascadTable = cascadXTableRef.value.xTableRef
      if ($cascadTable) {
        $cascadTable.reloadData(crruntWorkInfo.value.laminatedStructureList)
        const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
        if (i != -1) {
          nodeInfoList.value[i].laminatedStructureList = crruntWorkInfo.value.laminatedStructureList
          nodeInfoList.value[i].delLaminatedIdList = crruntWorkInfo.value.delLaminatedIdList
        }
      }
    })
  }

  // 上移 下移操作
  const moveRowLaninated = (type: string, row: any) => {
    let arr: any[] = crruntWorkInfo.value.laminatedStructureList
    // type up上移 down下移
    // console.log(type, arr, row.sort, index)
    if (type == 'up') {
      // 本身上移 上一个下移
      arr[row.sort - 2].sort = row.sort
      arr[row.sort - 1].sort = row.sort - 1
    } else {
      // 本身下移 下一个上移
      arr[row.sort].sort = row.sort
      arr[row.sort - 1].sort = row.sort + 1
    }

    arr = arr.sort((a, b) => a.sort - b.sort)
    // console.log(arr)
    const $table = cascadXTableRef.value.xTableRef
    if ($table) {
        $table.sort({field: 'sort'}, 'desc')
    }
  }

  // 关闭新增工序弹框 共用方法
  const closeAddWorkDialog = () => {
    nodeData.addWorkOpen = false
    for (let key in nodeData.addWorkForm) {
      nodeData.addWorkForm[key] = undefined
    }
  }

  // 处理钻孔数据
  const setMiDrillList = () => {
    let drillList: any = []
    pnlInfoList.forEach((val: any) => {
      val.drillParameterList?.forEach((el: any) => {
        el.quantity = el.quantity+''
        el.isPth = el.isPth == true ? '1' : '0'
        el.productDiameter = el.productDiameter+''
        drillList.push({
          planId: form.value.id,
          miNodeInfoId: crruntWorkInfo.value?.id || undefined,
          pnlId: val.id,
          pnlName: val.name,
          ...el
        })
      })
    })

    const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
    if (i != -1) {
      nodeInfoList.value[i].delMiDrillIdList = crruntWorkInfo.value.delMiDrillIdList
      nodeInfoList.value[i].miDrillDataList = drillList
      crruntWorkInfo.value.miDrillDataList = drillList
    }
  }

  // 新增工序
  const addWorkHandle = () => {
    // const $table = mainWorkmanshipListRef.value.xTableRef
    // if ($table) {
    addWorkFormRef.value.validate((val) => {
      if (val) {
        if (nodeData.addWorkType == 1) {
          // 新增工序
          nodeData.newAddWorkRow.craftName = nodeData.addWorkForm.roleName
          if (nodeData.row?.sort) {
            nodeInfoList.value.splice(nodeData.row.sort, 0, nodeData.newAddWorkRow)
          } else {
            nodeInfoList.value.push(nodeData.newAddWorkRow)
          }
          nodeInfoList.value.map((v, i) => {
            v.sort = (i + 1)
          })
          closeAddWorkDialog()
          initFillData(nodeInfoList.value, form.value)
        } else if (nodeData.addWorkType == 2) {
          // 生成模板
          const params = {
            craftIdList: nodeInfoList.value.length ? nodeInfoList.value.map(v => v.craftId) : [],
            templateName: nodeData.addWorkForm.templateName
          }
          // console.log(params)
          proxy.$modal.loading()
          addCraftTemplate(params).then((res) => {
            proxy.$modal.closeLoading()
            if (res.code == 200) {
              closeAddWorkDialog()
            } else {
              proxy.$modal.msgError(res.msg)
            }
          }).catch(() => {
            proxy.$modal.closeLoading()
          })
        } else if (nodeData.addWorkType == 4) {
          // 读取drl文件
          var isValid = checkData();
          if (isValid) {
            dealData();
            // console.log('pnlInfoList', pnlInfoList)
            const $drlTable = drillXTableRef.value.xTableRef
            if ($drlTable) {
              $drlTable.reloadData(pnlInfoList[0].drillParameterList)
              $drlTable.updateData()
              closeAddWorkDialog()
              setMiDrillList()
            }
            // this.$emit('confirm', this.pnlInfoList);
          }
        } else if (nodeData.addWorkType == 5) {
          // 编辑钻孔参数
          const tempWorkForm = JSON.parse(JSON.stringify(nodeData.addWorkForm))
          // console.log('tempWorkForm', tempWorkForm)
          pnlInfoList.forEach((v) => {
            let tempList = []
            JSON.parse(JSON.stringify(v.drillParameterList)).map((el, i) => {
              let temp = el
              if (i == nodeData.drillRowIndex) {
                temp.code = tempWorkForm.code
                temp.diameter = tempWorkForm.diameter
                temp.tolerance = tempWorkForm.tolerance
                temp.productDiameter = tempWorkForm.productDiameter
                temp.isPth = tempWorkForm.isPth == '1' ? true : false
                temp.drillType = tempWorkForm.drillType
                temp.remark = tempWorkForm.remark
                tempWorkForm.quantityList.forEach((val) => {
                  if (v.name == val.label) {
                    temp.quantity = val.value
                  }
                })
              }
              tempList.push(temp)
            })
            v.drillParameterList = tempList
          })
          const $drlTable = drillXTableRef.value.xTableRef
          if ($drlTable) {
            // console.log(pnlInfoList)
            $drlTable.reloadData(pnlInfoList[0].drillParameterList)
            $drlTable.updateData()
            closeAddWorkDialog()
            setMiDrillList()
          }
        } else if ([6,9].includes(nodeData.addWorkType)) {
          // 新增、编辑层压
          if ([6].includes(nodeData.addWorkType)) {
            // 新增
            crruntWorkInfo.value.laminatedStructureList.push(deepClone(nodeData.addWorkForm))
          } else {
            crruntWorkInfo.value.laminatedStructureList = crruntWorkInfo.value.laminatedStructureList.map((v: any) => {
              if (v.sort == nodeData.laminatedIndex) {
                v = deepClone(nodeData.addWorkForm)
              }
              return v
            })
          }
          const $cascadTable = cascadXTableRef.value.xTableRef
          if ($cascadTable) {
            $cascadTable.reloadData(crruntWorkInfo.value.laminatedStructureList)

            const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
            if (i != -1) {
              nodeInfoList.value[i].laminatedStructureList = crruntWorkInfo.value.laminatedStructureList
            }
            closeAddWorkDialog()
          }
        } else if ([7].includes(nodeData.addWorkType)) {
          const param = {
            name: nodeData.addWorkForm.laminationName,
            layerList: crruntWorkInfo.value.laminatedStructureList.map((v: any) => v.layer)
          }
          proxy.$modal.loading()
          saveStructureTemplate(param).then((res: any) => {
            proxy.$modal.closeLoading()
            if (res.code == 200) {
              closeAddWorkDialog()
            } else {
              proxy.$modal.msgError(res.msg)
            }
          }).catch(() => {
            proxy.$modal.closeLoading()
          })
        }
      }
    })
    // }
  }

  // 改变层压结构模板
  const changeLaminationTemplate = (id: any) => {
    crruntWorkInfo.value.laminatedStructureList.map((v: any) => {
      if (v?.id) {
        crruntWorkInfo.value.delLaminatedIdList.push(v.id)
      }
    })
    const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
    if (i != -1) {
      nodeInfoList.value[i].delLaminatedIdList = crruntWorkInfo.value.delLaminatedIdList
    }

    crruntWorkInfo.value.laminatedStructureList = nodeData.laminationTemplateList.find((v: any) => v.id == id)?.templateLayerVoList
    crruntWorkInfo.value.laminatedStructureList.map((v: any, i: number) => {
      v.sort = (i + 1)
      v.id = undefined
      v.ownerId = undefined
      v.templateId = undefined
      v.layerIndex = undefined
      v.rawMaterialType = undefined
      v.material = undefined
      v.pp = undefined
      v.boardThickness = undefined
      v.linkCopper = undefined
      v.copperThickness = undefined
      v.productionPlanId = form.value.id
    })
    const $cascadTable = cascadXTableRef.value.xTableRef
    if ($cascadTable) {
      $cascadTable.reloadData(crruntWorkInfo.value.laminatedStructureList)

      const i = nodeInfoList.value.findIndex(v => v.localUid == crruntWorkInfo.value.localUid)
      if (i != -1) {
        nodeInfoList.value[i].laminatedStructureList = crruntWorkInfo.value.laminatedStructureList
      }
      closeAddWorkDialog()
    }
  }

  // 取消新增工序
  const cancelAddWork = () => {
    closeAddWorkDialog()
  }

  // 改变模板
  const changeTemplate = (id: any) => {
    // console.log(id)
    let tempList = nodeData.templateList.find((v: any) => v.id == id)?.craftList || []
    crruntWorkInfo.value = undefined
    tempList.map((v: any) => {
      v.configVoList = v.craftParameterConfigs
      v.requirement = getCraftRequirementJson(v.craftParameterConfigs, schemeList, pnlList, v.isCutting == '1')
    })

    // 从第一条数据中取值
    if (orderList.value?.length) {
      const outsideLineTemp = tempList.find((item: any) => item?.code == 'OutsideLine')
      getFieldTable(orderList.value, tempList, currentMiInfo.value.planType, schemeList, pnlList, form.value.compensation, outsideLineTemp, outsideLineTemp)
    }
    tempList = tempList.map((v: any, i: number) => {
      return {
        localUid: v.craftName + v.id + Math.random(),
        // id: v.id,
        createDeptName: v.createDeptName,
        createByName: v.createByName,
        updateByName: v.updateByName,
        planId: form.value.id,
        craftId: v.id,
        craftName: v.craftName,
        remark: { public: '', differPNL: [] },
        sort: i + 1,
        isCount: v.isAutoWip == '1' ? '0' : '1',
        requirement: getCraftRequirementJson(v.craftParameterConfigs, schemeList, pnlList, v.isCutting == '1'),
        configVoList: v.configVoList,
        isDrill: v.isDrill,
        isCutting: v.isCutting,
        isLamination: v.isLamination,
        code: v.code,
      }
    })
    const tempNodeList = deepClone(nodeInfoList.value)
    tempNodeList.forEach((item: any) => {
      if (item.id) {
        // 有id才存，说明是新增的工序，而不是模板本身存在
        delNodeInfoList.value.push(item.id)
      }
    })
    nodeInfoList.value = tempList
    // console.log(nodeInfoList.value)
    closeAddWorkDialog()
    initFillData(nodeInfoList.value, form.value)
  }

  // 填充工序数据
  const fillData = () => {
    //开料
    var node = nodeInfoList.value.find(o => {
      return o.code == 'CuttingMaterial_System';
    })
    if (node) {
      var paras = node.requirement;
      if (paras) {
        var para = paras.find(o => {
          return o.code == 'BoardThickness';
        });
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.boardThickness;
            })
          } else {
            para.defaultValue = form.value.boardThickness;
          }
        }

        para = paras.find(o => {
          return o.code == 'CopperThickness';
        })
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.copperThickness;
            })
          } else {
            para.defaultValue = form.value.copperThickness;
          }
        }
        node.requirement = paras;
      }
      if (crruntWorkInfo.value?.localUid == node.localUid) {
        crruntWorkInfo.value.requirement = node.requirement
      }
    }

    //外层线路
    var node = nodeInfoList.value.find(o => o.code == 'OutsideLine');
    if (node) {
      var paras = node.requirement;
      if (paras) {
        var para = paras.find(o => o.code == 'OutsideLine_MinWidth');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.minLineWidth;
            })
          } else {
            para.defaultValue = form.value.minLineWidth;
          }
        }
        para = paras.find(o => o.code == 'OutsideLine_MinDistance');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.minLineSpace;
            })
          } else {
            para.defaultValue = form.value.minLineSpace;
          }
        }

        para = paras.find(o => o.code == 'OutsideLine_Compensation');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.compensation;
            })
          } else {
            para.defaultValue = form.value.compensation;
          }
          // 说明有外层线路，并且有补偿值
          if (orderList.value?.length) {
            // const outsideLineTemp = nodeInfoList.value.find((item: any) => item.code == 'OutsideLine')
            const EtchTemp = nodeInfoList.value.find((item: any) => item.code == 'Etch')
            if (EtchTemp) {
              getFieldTableIndex(orderList.value, EtchTemp, currentMiInfo.value.planType, schemeList, pnlList, form.value.compensation, node, false)
            }
            if (crruntWorkInfo.value && crruntWorkInfo.value.code == 'Etch') {
              crruntWorkInfo.value = EtchTemp
            }
          }
        }
        node.requirement = paras;
      }
      if (crruntWorkInfo.value?.localUid == node.localUid) {
        crruntWorkInfo.value.requirement = node.requirement
      }
    }

    //图形电镀
    node = nodeInfoList.value.find(o => o.code == 'GraphicElectroplating');
    if (node) {
      var paras = node.requirement;
      if (paras) {
        var para = paras.find(o => o.code == 'Electroplate_GTL');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.platingArea_GTL;
            })
          } else {
            para.defaultValue = form.value.platingArea_GTL;
          }
        }
        para = paras.find(o => o.code == 'Electroplate_GBL');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.platingArea_GBL;
            })
          } else {
            para.defaultValue = form.value.platingArea_GBL;
          }
        }
        node.requirement = paras;
      }
      if (crruntWorkInfo.value?.localUid == node.localUid) {
        crruntWorkInfo.value.requirement = node.requirement
      }
    }
    //表面处理
    node = nodeInfoList.value.find(o => o.code == 'Surface_Treatment');
    if (node) {
      var paras = node.requirement;
      if (paras) {
        var para = paras.find(o => o.code == 'GoldenThickness');
        if (para) {
          if (para.isDifferentiatePnl == '1') {
            para.differPNL.forEach(item => {
              item.defaultValue = form.value.goldenThickness;
            })
          } else {
            para.defaultValue = form.value.goldenThickness;
          }
        }
        node.requirement = paras;
      }
      if (crruntWorkInfo.value?.localUid == node.localUid) {
        crruntWorkInfo.value.requirement = node.requirement
      }
    }

    const $table = mainWorkmanshipListRef.value.xTableRef
    if ($table) {
        // $table.updateData()
        $table.reloadData(nodeInfoList.value)
        $table.setCurrentRow(crruntWorkInfo.value)
    }
  }

  // 加工要求 工艺参数 数据变化
  const paramsChange = (item) => {
    const params = JSON.parse(JSON.stringify(item))
    // console.log(item, params)
    if (params?.remark) {
      crruntWorkInfo.value.remark = params.remark
    }
    if (params?.requirement) {
      crruntWorkInfo.value.requirement = params.requirement
    }
  }

  // 保存工艺参数
  const saveCrtMiInfo = () => {
    const tempWorkInfo = JSON.parse(JSON.stringify(crruntWorkInfo.value))
    const i = nodeInfoList.value.findIndex(v => v.localUid == tempWorkInfo.localUid)
    if (i != -1) {
      nodeInfoList.value[i] = tempWorkInfo
      // nodeInfoList.value[i].miDrillDataList = pnlInfoList
    }
    // console.log(tempWorkInfo, nodeInfoList.value)

    const $table = mainWorkmanshipListRef.value.xTableRef
    if ($table) {
        // $table.updateData()
        $table.reloadData(nodeInfoList.value)
        $table.setCurrentRow(nodeInfoList.value[i])
    }
    // console.log('--', nodeInfoList.value[i], JSON.parse(nodeInfoList.value[i].requirement))
  }

  // 上移 下移操作
  const moveRow = (type: string, row: any, arr: any[], index: number) => {
    // type up上移 down下移
    // console.log(type, arr, row.sort, index)
    if (type == 'up') {
      // 本身上移 上一个下移
      arr[row.sort - 2].sort = row.sort
      arr[row.sort - 1].sort = row.sort - 1
    } else {
      // 本身下移 下一个上移
      arr[row.sort].sort = row.sort
      arr[row.sort - 1].sort = row.sort + 1
    }

    arr = arr.sort((a, b) => a.sort - b.sort)
    // console.log(arr)
    const $table = mainWorkmanshipListRef.value.xTableRef
    if ($table) {
        $table.sort({field: 'sort'}, 'desc')
    }
  }

  // ----- 读取drl文件 start -----
  //选中drl文件后发生
  function onFileChange(data, pnl) {
    var file = data.srcElement.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        var content = reader.result.split('\n');
        pnl.drillList = readData(content);
      };
      reader.readAsText(file, 'utf8');
    } else {
      if (!pnl?.drillList) {
        pnl.drillList = [];
      }
    }
  }
  //读取drl文件数据
  function readData(content) {
    var result = [];

    //钻头信息
    var regDrillInfo = /^(T[0-9]{2})C(.+)/;

    //钻头编号
    var regDrillCode = /^(T[0-9]{2})$/;

    //是否是位置信息
    var regIsPosition = /^[XY]/;

    //读取位置信息
    var regPosition = /(X([0-9]+))*(Y([0-9]+))*/;

    //槽孔数据
    var regPosition_slot = /X([0-9]+)Y([0-9]+)G[0-9]+X([0-9]+)Y([0-9]+)/

    //判断是否是内容
    var isContent = false;

    //当前处理的钻头信息
    var currentDrillInfo;

    //循环读取每行数据
    for(var index in content){
      var line = content[index].replace('\r', '');

      if (index == 0 && line != "M48") {
        proxy.$modal.msgError('不是M48格式的文件，不能读取');
        break;
      }

      if (line == "%") {
        isContent = true;
        continue;
      }

      if (!isContent) {
        //读取钻头信息
        var item = regDrillInfo.exec(line);
        if (item) {
          //记录钻头信息
          result.push({
            code: item[1],
            diameter: item[2],
            type:'',
            positions: []
          });
          continue;
        }
      } else {
        //读取钻孔位置信息
        var drillCode = regDrillCode.exec(line);
        if (drillCode) {
          currentDrillInfo = result.find(o => {
            return o.code == drillCode[0];
          });
          continue;
        }

        //判断是否是位置数据
        var isPosition = regIsPosition.test(line);
        if (!isPosition) {
          continue;
        }

        //先判断是不是槽孔
        var position_slot = regPosition_slot.exec(line);
        if (position_slot) {
          //处理槽孔
          currentDrillInfo.type = '槽孔';
          var startPoint = {
            x: convertPointValue(position_slot[1]),
            y: convertPointValue(position_slot[2])
          }

          var endPoint = {
            x: convertPointValue(position_slot[3]),
            y: convertPointValue(position_slot[4])
          }

          var holeCount = getSlotHoleCount(currentDrillInfo.diameter, startPoint, endPoint);

          currentDrillInfo.positions.push({
            x: position_slot[1] ? position_slot[1] : '',
            y: position_slot[2] ? position_slot[2] : '',
            x2: position_slot[3] ? position_slot[3] : '',
            y2: position_slot[4] ? position_slot[4] : '',
            quantity: holeCount
          });

          continue;
        }


        //非槽孔
        var position = regPosition.exec(line);
        if (currentDrillInfo && position) {
          currentDrillInfo.positions.push({
            x: position[2] ? position[2] : '',
            y: position[4] ? position[4] : '',
            quantity:1
          });
        }
      }
    }
    return result;
  }
  //获取
  function convertPointValue(value) {
    if (!value)
      return 0;
    var tmp = value.substring(0, 3) + '.' + value.substring(3);
    var result = parseFloat(tmp) * 1000;
    return parseInt(result);
  }
  //求线Line slot槽孔数 （同CAM350一致)
  //diameter 孔径
  //startPoint 起始点
  //endPoint 结束点
  function getSlotHoleCount(diameter, startPoint, endPoint) {
    var tol_ = 0.0127;
    //半径
    var r = diameter * 0.5;

    var center_L = getDistance(startPoint, endPoint)/1000;
    var hole_L = Math.sqrt(Math.pow(r, 2) - Math.pow(r - tol_, 2)) * 2;
    var quantity = Math.abs(Math.floor(-center_L / hole_L)) + 1;
    return quantity;
  }

  //返回两点之间欧氏距离
  function getDistance(p1, p2) {
    return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
  }


  //验证数据
  function checkData() {
    var isValid = true;
    // console.log(pnlInfoList)

    //判断数据是否已获取
    for (var obj of pnlInfoList) {
      if (!obj.drillList.length) {
        isValid = false;
        proxy.$modal.msgError(obj.name + '数据未获取');
        break;
      }
    }
    if (!isValid) {
      return;
    }

    //多Pnl情况下，判断序号和孔径数据是否一致
    if (pnlInfoList.length > 1) {
      var info = pnlInfoList[0];

      for (var i = 1; i < pnlInfoList.length; i++) {
        var tmp = pnlInfoList[i];

        //判断钻头数量是否一致
        if (info.drillList.length != tmp.drillList.length) {
          proxy.$modal.msgError(tmp.name + '钻头数量不一致');
          isValid = false;
          break;
        }

        for (var j in info.drillList) {
          if (info.drillList[j].code != tmp.drillList[j].code) {
            proxy.$modal.msgError(tmp.name + tmp.drillList[j].code + '序号不一致');
            isValid = false;
            break;
          }

          if (info.drillList[j].diameter != tmp.drillList[j].diameter) {
            proxy.$modal.msgError(tmp.name + '-' + tmp.drillList[j].code + '孔径不一致');
            isValid = false;
            break;
          }
        }

      }
    }
    return isValid;
  }
  //处理数据
  function dealData() {
    pnlInfoList.forEach((v: any) => {
      v.drillParameterList.map((item: any) => {
        if (item?.id) {
          crruntWorkInfo.value.delMiDrillIdList.push(item.id)
        }
      })
    })
    setMiDrillList()
    //默认的数据为当前节点的drillParameterList，通过参数传入
    //如果是有个多Pnl的情况，需要分Pnl,为每个Pnl对应的workflow下对应的Node的drillParameterList赋值

    // //将第一条数据作为默认的数据
    // var drillList = pnlInfoList[0].drillList;
    // setParameter(crruntWorkInfo.value.miDrillDataList, drillList);

    //当是主流程，有Pnl时
    // if (pnlList.length) {
    pnlInfoList.forEach((item, i) => {
      // var node = item.pnl.workflow.nodeList[nodeFileIndex.value];
      setParameter(item.drillParameterList, item.drillList);
    });
    // }
  }
  //设置数据
  function setParameter(oldParameter,newParameter) {
    //移除原有的数据
    // while (oldParameter.length) {
    //   oldParameter.splice(0, 1);
    // }
    oldParameter.length = 0
    //添加新数据
    newParameter.forEach(item => {
      var holeCount = item.positions.reduce((total, current) => {
        return total + current.quantity;
      }, 0);


      //处理备注信息
      // 孔距 的最后一位数字（小数点位数有且只有三位才适用此规则）自动填写备注
      //1、5 -> 槽孔
      //2 -> 连孔
      //3 -> 除尘孔

      var dia = Number(item.diameter.toString().split('.')[1]).toString();
      var remark = '';
      if (dia.length == 3) {
        var last = dia.substring(2);
        switch (last) {
          case '1':
          case '5':
            remark = '槽孔';
            break;
          case '2':
            remark = '连孔';
            break;
          case '3':
            remark = '除尘孔';
            break;
        }
      }

      var para = {
        code: item.code,
        diameter: Number(item.diameter).toFixed(3),
        tolerance: 0,
        productDiameter: 0,
        isPth: true,
        drillType: item.type,
        remark: remark,
        quantity: holeCount
      };
      oldParameter.push(para);
    });
  }
  // ----- 读取drl文件 end -----
  // 测试数据------ end

  // 未定义，页面报错，初始化
  const imageUrl = ref('')
  const engineerOptions = ref([])
  const beforeRemove = () => {
  }
  const onTgzUploadChange = () => {
  }
  const onTgzUploadRemove = () => {
  }
  const onUploadChange = () => {
  }
  const onUploadRemove = () => {
  }
  const handleAvatarSuccess = () => {
  }
  const beforeAvatarUpload = () => {
  }
</script>

<style lang="scss" scoped>
.left-work {
  height: calc(100vh - 562px);
  // overflow-y: auto;
}
.right-work {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 0 0 10px;
    overflow: hidden;

    .right-flex {
        display: flex;
        justify-content: center;
        align-items: center;
        .el-icon {
            margin-left: 5px;
        }

        &.start {
            justify-content: flex-start;
        }

        &.end {
            justify-content: flex-end;
        }

        &.wrap {
          flex-wrap: wrap;
        }

        &.margin-right {
          margin-right: 5px;
        }
    }

    .right-work-content {
      // display: flex;
      // flex-direction: column;
      height: 100%;
      overflow-y: auto;
    }
}

.box-card {
    margin-top: 10px;

    :deep(.el-card__header) {
        border: none !important;
    }
    .card-header {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0 5px;

        &.left {
          margin-bottom: 10px;
          padding: 0;
          .card-line {
            &:first-child {
              flex: none;
              width: 25px;
            }
          }
        }

        .card-line {
            flex: 1;
            height: 0;
            border-top: 1px solid #DCDFE6;
        }

        .card-title {
            padding: 0 20px;
        }
    }
}

:deep(.pnl-card) {
  .el-card__body {
    padding-bottom: 5px !important;
  }
}

.fill-data {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-top: 10px;
  box-sizing: border-box;
}
</style>
<style lang="scss">
.mi-drawer-scoped {
  .el-drawer__header {
    padding-top: 10px !important;
    margin-bottom: 12px !important;
  }

  .el-drawer__body {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .plan-tabs {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden;

      .el-tabs__content {
        flex: 1;
        overflow: hidden;
        .el-form {
          height: 100%;
        }

        .plan-tab-auto {
          height: 100%;
          overflow-y: auto;
        }
        .plan-tab-three {
          display: flex;
          flex-direction: column;
          // flex: 1;
          height: 100%;
          overflow: hidden;

          .plan-tab-table {
            display: flex;
            flex-direction: column;
            flex: 1;
            overflow: hidden;
            .el-tabs__content {
              flex: 1;
              .el-tab-pane {
                height: 100%;
                // .el-row {
                //   height: 100%;
                //   .el-col {
                //     height: 100%;

                .plan-tab-height {
                  height: 100%;
                }
                .plan-xtable {
                  height: calc(100% - 18px);
                  .newVxeTable {
                    display: flex;
                    flex-direction: column;
                    // flex: 1;
                    height: 100%;
                    overflow: hidden;
                    .x-table-dom {
                      flex: 1;
                      overflow: hidden;
                    }
                  }
                }
                //   }
                // }
              }
            }
          }
        }
      }
    }
  }
  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}

.pnlInfo-row {
  display: flex;
  flex-direction: row;
  min-height: 35px;
  line-height: 24px;
}

.pnlInfo-row .pnlInfo-row-label {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100px;
}

.pnlInfo-row .pnlInfo-row-content {
  flex: 1;
}

.pnlInfo-row .pnlInfo-row-operate {
  width: 50px;
}

.padding-table {
  .vxe-cell {
    padding-left: 2px !important;
    padding-right: 2px !important;
  }
}
</style>
