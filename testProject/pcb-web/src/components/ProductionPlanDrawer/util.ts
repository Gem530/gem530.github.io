import dayjs from 'dayjs'
import { deepClone } from '@/utils'
import { Decimal } from 'decimal.js'

let defaultSort = 10000

//获取工艺要求Json
export function getCraftRequirementJson(workflow: any[], schemeList: any[], pnlList: any[], isCutting: boolean) {
  if (!workflow) return []
  let tempconfigVoList: any[] = []
  let tempList = { schemeList, pnlList }
  workflow.map((v) => {
    v.isBold = v.isBold == ' ' ? '0' : v.isBold
    v.isChecked = v.isChecked == ' ' ? '0' : v.isChecked
    if (v.isDifferentiatePnl == '1') {
      v.differPNL = []
      tempList[isCutting ? 'schemeList' : 'pnlList'].forEach(val => {
        v.differPNL.push({
          pnlName: val.name,
          isBold: v.isBold || '0',
          isChecked: v.isChecked || '0',
          defaultValue: v.defaultValue || '',
        })
      })
      tempconfigVoList.push(v)
    } else {
      tempconfigVoList.push(v)
    }
  })
  return tempconfigVoList
}

//获取备注Json
export function getRemarkJson(remark: any, schemeList: any[], pnlList: any[], isCutting: boolean) {
  let remarkJson = remark || {}
  let tempList = { schemeList, pnlList }
  let tempDifferPNL: any[] = []
  tempList[isCutting ? 'schemeList' : 'pnlList'].forEach(val => {
    const obj = remarkJson?.differPNL && remarkJson.differPNL.find((v: any) => v.pnlName == val.name)
    if (obj) {
      tempDifferPNL.push({
        pnlName: val.name,
        remark: obj.remark
      })
    }
  })
  remarkJson.differPNL = tempDifferPNL
  remarkJson.public = remarkJson.public
  // console.log(remarkJson)
  return remarkJson
}

// 初始化填充数据值
export const initFillData = (nodeInfoList: any[], form: any) => {
  //--如果对应的字段已设置了值，则需要用设置的值覆盖--
  // 开料
  var node = nodeInfoList.find(o => {
    return o.code == 'CuttingMaterial_System';
  })
  if (node) {
    var paras = node.requirement;
    if (paras) {
      // 板厚
      var para = paras.find((o: any) => {
        return o.code == 'BoardThickness';
      });
      if (para) {
        form.boardThickness = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }

      // 铜厚
      para = paras.find((o: any) => {
        return o.code == 'CopperThickness';
      })
      if (para) {
        form.copperThickness = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
    }
  }

  // 外层线路
  var node = nodeInfoList.find((o: any) => o.code == 'OutsideLine');
  if (node) {
    var paras = node.requirement;
    if (paras) {
      // 最小线宽
      var para = paras.find((o: any) => o.code == 'OutsideLine_MinWidth');
      if (para) {
        form.minLineWidth = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
      // 最小线距
      para = paras.find((o: any) => o.code == 'OutsideLine_MinDistance');
      if (para) {
        form.minLineSpace = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
      // 补偿值
      para = paras.find((o: any) => o.code == 'OutsideLine_Compensation');
      if (para) {
        form.compensation = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
    }
  }

  // 表面处理
  node = nodeInfoList.find((o: any) => o.code == 'Surface_Treatment');
  if (node) {
    var paras = node.requirement;
    if (paras) {
      // 金厚
      var para = paras.find((o: any) => o.code == 'GoldenThickness');
      if (para) {
        form.goldenThickness = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
    }
  }

  // 图形电镀
  node = nodeInfoList.find((o: any) => o.code == 'GraphicElectroplating');
  if (node) {
    var paras = node.requirement;
    if (paras) {
      // 电镀面积(GTL)
      var para = paras.find((o: any) => o.code == 'Electroplate_GTL');
      if (para) {
        form.platingArea_GTL = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
      // 电镀面积(GBL)
      para = paras.find((o: any) => o.code == 'Electroplate_GBL');
      if (para) {
        form.platingArea_GBL = para?.differPNL?.length ? para.differPNL[0].defaultValue : para.defaultValue;
      }
    }
  }
}

// 工序工艺加工要求参数从表格第一条取字段数据，单个初始化
export const getFieldTable = (tableList: any, nodeInfoList: any[], planType: string, scheme: any[], pnlList: any[], compensation: any) => {
  const outsideLineTemp = nodeInfoList.find((item: any) => item.code == 'OutsideLine')
  nodeInfoList.map((item: any) => {
    getFieldTableIndex(tableList, item, planType, scheme, pnlList, compensation, outsideLineTemp, [], nodeInfoList)
  })
}

// 工序工艺加工要求参数从表格第一条取字段数据，单个初始化
export const getFieldTableIndex = (tableList: any, nodeInfo: any, planType: string, scheme: any[], pnlList: any[], compensation: any, outsideLineTemp: any, codeList: string[] = [], nodeInfoList: any[] = []) => {
  // console.log('nodeInfo-----', nodeInfo)
  const tableInfo = tableList[0]
  if (!nodeInfo?.configVoList?.length) return
  nodeInfo.configVoList.map((item: any) => {
    // 根据configVoList初始化requirement，并不会改nodeInfo的requirement
    fieldToChangeDefaultValue(tableList, item, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp, nodeInfoList)
  })
  if (nodeInfo.configVoList?.length) {
    let tempRequirement = getCraftRequirementJson(JSON.parse(JSON.stringify(nodeInfo.configVoList)), scheme, pnlList, nodeInfo.code == 'CuttingMaterial_System')
    if (codeList?.length && tempRequirement?.length) {
      tempRequirement = tempRequirement.filter((f: any) => codeList.includes(f.code))
      // nodeInfo.requirement = tempRequirement
      nodeInfo.requirement.map((m: any) => {
        let crtReq = tempRequirement.find((f: any) => f.code == m.code)
        // console.log('crtReq', crtReq)
        if (crtReq) {
          // m = crtReq
          m.isChecked = crtReq?.isChecked
          m.defaultValue = crtReq?.defaultValue
        }
      })
      // console.log('tempRequirement', tempRequirement, nodeInfo.requirement)
    } else {
      nodeInfo.requirement = tempRequirement || []
    }
    sortRequirment(nodeInfo.requirement)
  }
}

// 去除 大括号 并赋值
export const fieldToChangeDefaultValue = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any[], pnlList: any[], compensation: any, outsideLineTemp: any, nodeInfoList: any[] = []) => {
  const tableInfo = tableList[0]
  if (nodeInfo.code == 'CuttingMaterial_System') {
    // 开料
    initCutting(tableList, valueInfo, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp)
  }
  if (nodeInfo.code == "OutsideLine") {
    // 外层线路
    initOutsideLine(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp)
  }
  if (nodeInfo.code == "Etch") {
    //处理【退膜/蚀刻】节点
    computeEtchPara(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp, nodeInfoList)
  }
  if (nodeInfo.code == "负片蚀刻") {
    //处理【负片蚀刻】节点
    computeFilmEtchPara(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp)
  }
  if (nodeInfo.code == "Lamination_System") {
    // 压合
    initLamina(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp)
  }
  if (nodeInfo.code == "Conductive_Film") {
    // 导电膜
    initConductiveFilm(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp, nodeInfoList)
  }
  if (nodeInfo.code == "Copper_Sinking") {
    // 沉铜
    initCopperSinking(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp, nodeInfoList)
  }

  if (valueInfo.defaultValue == undefined || valueInfo.defaultValue == '') return
  if (typeof valueInfo.defaultValue == 'string' && valueInfo.defaultValue.includes('{{') && valueInfo.defaultValue.includes('}}')) {
    const fieldStr = valueInfo.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
    if (fieldStr == 'commodityCode' && planType == '2') {
      // 合拼的mi单,编号拼接
      let tempValue = tableList.map((m: any) => m[fieldStr]).join('-')
      valueInfo.defaultValue = tempValue || undefined
    } else {
      valueInfo.defaultValue = tableInfo[fieldStr] || undefined
    }
    // console.log('fieldStr', fieldStr, valueInfo.defaultValue)
  }
}

// 取出配置的字段
const getFormatField = (val: any) => {
  let start = val.indexOf('{{')
  let end = val.indexOf('}}')
  let res = val.slice(start + 2, end)
  return res
}
// 公式拆分，并计算
const formula = (valueInfo: any, tableInfo: any, isH: boolean = false) => {
  if (typeof valueInfo.defaultValue == 'string' && valueInfo.defaultValue.includes('{{') && valueInfo.defaultValue.includes('}}')) {
    // 原始公式
    let oldStr = valueInfo.defaultValue
    // 得到配置字段
    const fieldStr = getFormatField(valueInfo.defaultValue)
    // 用得到的值返回到公式中
    let infoVal = tableInfo[fieldStr]
    if (infoVal.includes('?')) {
      valueInfo.defaultValue = infoVal || undefined
      return;
    }
    // 去除取值中的单位，无单位是正常数据，有单位的后续会去除;H表示0.5
    infoVal = isH ? infoVal.replace(/[^0-9H\/\.]/g, '').replace(/H/g, '0.5') : infoVal
    if (!infoVal || infoVal == '0') {
      // 为空为0，则不计算
      valueInfo.defaultValue = infoVal || undefined
      return;
    }
    if (infoVal.indexOf('/') != -1) {
      let noFieldStr = oldStr.replace(`{{${fieldStr}}}`, '')
      if (isH && noFieldStr.indexOf('H') != -1) {
        noFieldStr = noFieldStr.replace(/H/g, '0.5')
      }
      // 根据 / 拆分成两块，然后分别计算，最后再拼接
      let infoValArr = infoVal.split('/')
      let numOne = infoValArr[0]
      let numTwo = infoValArr?.length >= 2 ? infoValArr[1] : ''
      let resOne =(!numOne || numOne == '0') ? numOne : eval(numOne+noFieldStr)
      let resTwo = (!numTwo || numTwo == '0') ? numTwo : eval(numTwo+noFieldStr)
      resOne = (resOne <= 0 ? numOne : resOne)+''
      resTwo = (resTwo <= 0 ? numTwo : resTwo)+''
      let resOne1 = Number(Number(resOne || 0).toFixed(15)).toString()
      let resTwo1 = Number(Number(resTwo || 0).toFixed(15)).toString()
      infoVal = `${isH ? resOne1.replace(/^0.5/g, 'H') : resOne1}/${isH ? resTwo1.replace(/^0.5/g, 'H') : resTwo1}`
    } else {
      let oldInfoVal = infoVal
      let noFieldStr = oldStr.replace(`{{${fieldStr}}}`, infoVal)
      if (isH && noFieldStr.indexOf('H') != -1) {
        noFieldStr = noFieldStr.replace(/H/g, '0.5')
      }
      infoVal = eval(noFieldStr)
      infoVal = (infoVal <= 0 ? oldInfoVal : infoVal)+''
      infoVal = Number(Number(infoVal || 0).toFixed(15)).toString()
      infoVal = isH ? infoVal.replace(/^0.5/g, 'H') : infoVal
    }
    valueInfo.defaultValue = infoVal || undefined
  }
}
// 铜厚计算
const countThickness = (val: any) => {
  let res = undefined
  if (val == 1) {
    res = new Decimal(val).sub(new Decimal(0.5)).toNumber();
  } else if (val > 1) {
    res = new Decimal(val).sub(new Decimal(1)).toNumber();
  } else {
    res = val
  }
  return Number(res || 0)
}
// 设置铜厚
const setThickness = (valueInfo: any, tableInfo: any, isH: boolean = false) => {
  if (typeof valueInfo.defaultValue == 'string' && valueInfo.defaultValue.includes('{{') && valueInfo.defaultValue.includes('}}')) {
    // 原始公式
    let oldStr = valueInfo.defaultValue
    // 得到配置字段
    const fieldStr = getFormatField(valueInfo.defaultValue)
    // 用得到的值返回到公式中
    let infoVal = tableInfo[fieldStr]
    if (infoVal.includes('?')) {
      valueInfo.defaultValue = infoVal || undefined
      return;
    }
    // 去除取值中的单位，无单位是正常数据，有单位的后续会去除;H表示0.5
    infoVal = isH ? infoVal.replace(/[^0-9H\/\.]/g, '').replace(/H/g, '0.5') : infoVal
    if (!infoVal || infoVal == '0') {
      // 为空为0，则不计算
      valueInfo.defaultValue = infoVal || undefined
      return;
    }
    if (infoVal.indexOf('/') != -1) {
      let noFieldStr = oldStr.replace(`{{${fieldStr}}}`, '')
      if (isH && noFieldStr.indexOf('H') != -1) {
        noFieldStr = noFieldStr.replace(/H/g, '0.5')
      }
      // 根据 / 拆分成两块，然后分别计算，最后再拼接
      let infoValArr = infoVal.split('/')
      let numOne = infoValArr[0]
      let numTwo = infoValArr?.length >= 2 ? infoValArr[1] : ''
      let resOne =(!numOne || numOne == '0') ? numOne : eval(numOne+noFieldStr)
      let resTwo = (!numTwo || numTwo == '0') ? numTwo : eval(numTwo+noFieldStr)
      resOne = (resOne <= 0 ? numOne : resOne)+''
      resTwo = (resTwo <= 0 ? numTwo : resTwo)+''
      let resOne1 = Number(countThickness(resOne || 0).toFixed(15)).toString()
      let resTwo1 = Number(countThickness(resTwo || 0).toFixed(15)).toString()
      infoVal = `${isH ? resOne1.replace(/^0.5/g, 'H') : resOne1}/${isH ? resTwo1.replace(/^0.5/g, 'H') : resTwo1}`
    } else {
      let oldInfoVal = infoVal
      let noFieldStr = oldStr.replace(`{{${fieldStr}}}`, infoVal)
      if (isH && noFieldStr.indexOf('H') != -1) {
        noFieldStr = noFieldStr.replace(/H/g, '0.5')
      }
      infoVal = eval(noFieldStr)
      infoVal = (infoVal <= 0 ? oldInfoVal : infoVal)+''
      infoVal = Number(countThickness(infoVal || 0).toFixed(15)).toString()
      infoVal = isH ? infoVal.replace(/^0.5/g, 'H') : infoVal
    }
    valueInfo.defaultValue = infoVal || undefined
  }
}
// 初始化开料信息
const initCutting = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = JSON.parse(JSON.stringify(tableList[0]))
  if (valueInfo.code == 'BoardThickness') {
    valueInfo.isChecked = '1';
    if (tableInfo?.materialLayer == '2') {
      // 板厚 并且是 双面板
      // formula(valueInfo, tableInfo)
      let resNumber = Number(tableInfo.commodityThickness)
      // 先初始化
      valueInfo.defaultValue = resNumber || tableInfo.commodityThickness;
      if (typeof resNumber == 'number' && resNumber > 0.1) {
        // 订单中板厚有值，就计算（双面板的开料工艺，板厚设置为成品板厚-0.1）；否则取工艺配置中的默认值
        valueInfo.defaultValue = resNumber ? new Decimal(resNumber).sub(new Decimal(0.1)).toNumber() : valueInfo.defaultValue
      }
    } else {
      valueInfo.defaultValue = Number(tableInfo.commodityThickness) || tableInfo.commodityThickness;
    }
  }
  //板材
  if (valueInfo.code === 'BoardMaterial') {
    valueInfo.isChecked = '1';
    valueInfo.defaultValue = tableInfo.materialQuality;
  }
  //铜厚
  if (valueInfo.code === 'CopperThickness') {
    valueInfo.isChecked = '1';
    // valueInfo.defaultValue = new Decimal(tableInfo.materialCopperOutside).sub(new Decimal(0.5)).toNumber();
    // formula(valueInfo, tableInfo, true)
    setThickness(valueInfo, tableInfo, true)
  }
  //开料尺寸
  if (valueInfo.code === 'CutSizeMm') {
    valueInfo.isChecked = '1';
    let length = scheme?.length ? scheme[0].boardLength : 0;
    let width = scheme?.length ? scheme[0].boardWidth : 0;
    valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
  }
  //开料英寸尺寸
  if (valueInfo.code === 'CutSize') {
    valueInfo.isChecked = '1';
    let length = scheme?.length ? (scheme[0].boardLength / 25.4) : 0;
    let width = scheme?.length ? (scheme[0].boardWidth / 25.4) : 0;
    valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
  }
}

// 初始化外层线路
const initOutsideLine = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
    // OutsideLine_Compensation 补偿值
    // FilmSize 干膜尺寸
    // para.parameterValue === '{{Material.CopperThickness}}' 底铜（基板铜厚）
    // 补偿值
    if (valueInfo.code === 'OutsideLine_Compensation') {
      valueInfo.isChecked = '1';
      valueInfo.defaultValue = compensation;
    }
    // 干膜尺寸
    if (valueInfo.code === 'FilmSize') {
      valueInfo.isChecked = '1';
      let width = pnlList.pnlWidth ? pnlList.pnlWidth : 0
      let length = pnlList.pnlLength ? pnlList.pnlLength : 0
      width = width * 0.03937;
      length = length * 0.03937;
      valueInfo.defaultValue = Number(length).toFixed(2) + '*' + Number(width).toFixed(2);
    }
    // 线路类型
    if (valueInfo.code === '线路类型') {
      valueInfo.isChecked = '1';
      if (tableInfo?.materialLayer <= 1) {
        valueInfo.defaultValue = '负片干膜'
      } else {
        valueInfo.defaultValue = '正片干膜'
      }
    }
    // 底铜（基板铜厚） 配置了默认值，{{Material.CopperThickness}}会自动走fieldToChangeDefaultValue的逻辑
}

// 初始化退膜/蚀刻
const computeEtchPara = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any, nodeInfoList: any[] = []) => {
  const tableInfo = tableList[0]
  // try {
  //【外层线路】工序的最小线宽和最小线距需要根据补偿值自动计算得出【退膜/蚀刻】工序的最小线宽和最小线距
  // console.log('outsideLineTemp', outsideLineTemp)
  if (outsideLineTemp) {
    //补偿值
    let minWidth = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinWidth');
    compensation = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_Compensation');
    let minDistance = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinDistance');
    if (minWidth
      && minWidth.defaultValue
      && valueInfo.code == 'Etch_MinWidth'
    ) {
      // 补偿值为空或为0时，当作0计算，而不是跳过计算
      valueInfo.isChecked = '1';
      if (typeof minWidth.defaultValue == 'string' && minWidth.defaultValue.includes('{{') && minWidth.defaultValue.includes('}}')) {
        const fieldStr = minWidth.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minWidth.defaultValue = tableInfo[fieldStr] || undefined
      }
      let tempValue = new Decimal(minWidth.defaultValue).sub(new Decimal(compensation?.defaultValue || 0)).toNumber()
      valueInfo.defaultValue = tempValue <= 0 ? '0' : tempValue
    }

    if (minDistance
      && minDistance.defaultValue
      && valueInfo.code == 'Etch_MinDistance'
    ) {
      // 补偿值为空或为0时，当作0计算，而不是跳过计算
      valueInfo.isChecked = '1';
      if (typeof minDistance.defaultValue == 'string' && minDistance.defaultValue.includes('{{') && minDistance.defaultValue.includes('}}')) {
        const fieldStr = minDistance.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minDistance.defaultValue = tableInfo[fieldStr] || undefined
      }
      let tempValue = new Decimal(minDistance.defaultValue).add(new Decimal(compensation?.defaultValue || 0)).toNumber()
      valueInfo.defaultValue = tempValue <= 0 ? '0' : tempValue
    }
  }

  if (valueInfo?.code == '底铜') {
    // 虽然配置了默认值，但是新增了以下规则，所以底铜不再取配置的参数
    // console.log(valueInfo, tableInfo, tableInfo?.materialLayer, JSON.parse(JSON.stringify(nodeInfoList)))
    if (tableInfo?.materialLayer <= 2) {
      // 少于2层，取开料铜厚
      valueInfo.isChecked = '1';
      const requirementList = nodeInfoList.find((o: any) => o.code == 'CuttingMaterial_System')?.
      requirement
      // console.log('---', requirementList)
      if (requirementList?.length) {
        const copperInfo = requirementList.find((o: any) => o.code == 'CopperThickness')
        // console.log(copperInfo)
        if (copperInfo?.isDifferentiatePnl == '1') {
          valueInfo.defaultValue = copperInfo?.differPNL?.length ? copperInfo?.differPNL[0].defaultValue : ''
        } else{
          valueInfo.defaultValue = copperInfo?.defaultValue
        }
      }
    } else {
      // 大于2层，取压合铜厚
      valueInfo.isChecked = '1';
      const requirementList = nodeInfoList.find((o: any) => o.code == 'Lamination_System')?.requirement
      // console.log('---1', requirementList)
      if (requirementList?.length) {
        const copperInfo = requirementList.find((o: any) => o.code == '压合铜厚')
        // console.log(copperInfo)
        if (copperInfo?.isDifferentiatePnl == '1') {
          valueInfo.defaultValue = copperInfo?.differPNL?.length ? copperInfo?.differPNL[0].defaultValue : ''
        } else{
          valueInfo.defaultValue = copperInfo?.defaultValue
        }
      }
    }
  }
}

// 初始化负片蚀刻
const computeFilmEtchPara = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
  // try {
  //【外层线路】工序的最小线宽和最小线距需要根据补偿值自动计算得出【退膜/蚀刻】工序的最小线宽和最小线距
  // console.log('outsideLineTemp', outsideLineTemp)
  if (outsideLineTemp) {
    //补偿值
    let minWidth = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinWidth');
    compensation = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_Compensation');
    let minDistance = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinDistance');
    if (minWidth
      && minWidth.defaultValue
      && valueInfo.code == '最小线宽'
    ) {
      // 补偿值为空或为0时，当作0计算，而不是跳过计算
      valueInfo.isChecked = '1';
      if (typeof minWidth.defaultValue == 'string' && minWidth.defaultValue.includes('{{') && minWidth.defaultValue.includes('}}')) {
        const fieldStr = minWidth.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minWidth.defaultValue = tableInfo[fieldStr] || undefined
      }
      let tempValue = new Decimal(minWidth.defaultValue).sub(new Decimal(compensation?.defaultValue || 0)).toNumber()
      valueInfo.defaultValue = tempValue <= 0 ? '0' : tempValue
    }

    if (minDistance
      && minDistance.defaultValue
      && valueInfo.code == '最小线距'
    ) {
      // 补偿值为空或为0时，当作0计算，而不是跳过计算
      valueInfo.isChecked = '1';
      if (typeof minDistance.defaultValue == 'string' && minDistance.defaultValue.includes('{{') && minDistance.defaultValue.includes('}}')) {
        const fieldStr = minDistance.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minDistance.defaultValue = tableInfo[fieldStr] || undefined
      }
      let tempValue = new Decimal(minDistance.defaultValue).add(new Decimal(compensation?.defaultValue || 0)).toNumber()
      valueInfo.defaultValue = tempValue <= 0 ? '0' : tempValue
    }
  }
}

// 初始化 压合
const initLamina = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
    // 压合厚度  【压合】工序的【压合厚度】为订单中的【成品板厚】-0.1
    if (valueInfo.code === 'Pressed_Thickness') {
      valueInfo.isChecked = '1';
      let resNumber = Number(tableInfo.commodityThickness)
      // 先初始化
      valueInfo.defaultValue = resNumber || tableInfo.commodityThickness;
      if (typeof resNumber == 'number' && resNumber > 0.1) {
        // 订单中板厚有值，就计算（双面板的开料工艺，板厚设置为成品板厚-0.1）；否则取工艺配置中的默认值
        valueInfo.defaultValue = resNumber ? new Decimal(resNumber).sub(new Decimal(0.1)).toNumber() : valueInfo.defaultValue
      } else {
        valueInfo.defaultValue = Number(tableInfo?.commodityThickness) || tableInfo?.commodityThickness;
      }
      // valueInfo.defaultValue = tableInfo?.commodityThickness && !isNaN(Number(tableInfo?.commodityThickness)) ? new Decimal(tableInfo?.commodityThickness).sub(new Decimal(0.1)).toNumber() : tableInfo?.commodityThickness;
    }
}

// 计算孔径比
const countApertureRatio = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any, nodeInfoList: any) => {
  const tableInfo = tableList[0]
  // 【导电膜】和【沉铜】的孔径比默认值设置：(【成品板厚】-0.1)/【外层钻孔】最小钻咀/   除不尽的，保留两位小数。比如最小钻咀是0.25，成品板厚是1。
  // 孔径比=(1-0.1)/0.25=3.6，  则孔径比为：3.6:1
  // 获取 外层钻孔-最小钻咀 的值
  const requirementList = nodeInfoList.find((o: any) => o.code == 'Drill_System')?.requirement
  console.log('---', requirementList)
  const crtWork = requirementList?.length && requirementList.find((o: any) => o.code == '最小钻咀')
  console.log('---crtWork', crtWork)
  let minJoran = 0 // 最小钻咀
  if (crtWork) {
    if (crtWork?.isDifferentiatePnl == '1') {
      minJoran = crtWork?.differPNL?.length ? crtWork?.differPNL[0]?.defaultValue : 0
    } else {
      minJoran = crtWork?.defaultValue || 0
    }
  }
  let resNumber = Number(tableInfo.commodityThickness)
  // 先初始化
  // valueInfo.defaultValue = resNumber || tableInfo.commodityThickness;
  console.log('crtWork', crtWork, minJoran, resNumber)
  if (typeof resNumber == 'number' && resNumber > 0.1 && minJoran) {
    // 订单中板厚有值，就计算（双面板的开料工艺，板厚设置为成品板厚-0.1）；否则取工艺配置中的默认值
    valueInfo.defaultValue = resNumber ? new Decimal(resNumber).sub(new Decimal(0.1)).div(new Decimal(minJoran)).toNumber() : valueInfo.defaultValue
    // 保留两位小数，四舍五入
    // toFixed 方法在 JavaScript 中用于将数字格式化为指定小数位数的字符串，它遵循的是银行家舍入法（Banker's Rounding），也称为四舍六入五成双，而不是简单的五舍六入。
    valueInfo.defaultValue = Number(Math.round(valueInfo.defaultValue * Math.pow(10, 2)) / Math.pow(10, 2))
    valueInfo.defaultValue = `${Number(valueInfo.defaultValue).toFixed(2)}:1`
  }
}
// 初始化 导电膜
const initConductiveFilm = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any, nodeInfoList: any) => {
  const tableInfo = tableList[0]
  // 压合厚度  【压合】工序的【压合厚度】为订单中的【成品板厚】-0.1
  if (valueInfo.code === '孔径比') {
    valueInfo.isChecked = '1';
    countApertureRatio(tableList, valueInfo, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp, nodeInfoList)
  }
}
// 初始化 沉铜
const initCopperSinking = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any, nodeInfoList: any) => {
  const tableInfo = tableList[0]
  // 压合厚度  【压合】工序的【压合厚度】为订单中的【成品板厚】-0.1
  if (valueInfo.code === '孔径比') {
    valueInfo.isChecked = '1';
    countApertureRatio(tableList, valueInfo, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp, nodeInfoList)
  }
}

// 初始化数据
export const initNodeInfoList = (list: any, tableList: any, planType: any) => {
  const tableInfo = tableList[0]
  list.map((item: any) => {
    // 先暂存 json，然后清空，按照configVoList的顺序重新组合
    let tempRequirement = JSON.parse(JSON.stringify(item.requirement))
    item.requirement = []

    item.configVoList?.length && item.configVoList.map((valueInfo: any) => {
      // 重新排序
      const crtTempReq = tempRequirement?.length && tempRequirement.find((f: any) => f.code ? (f.code == valueInfo.code) : (valueInfo.name == f.name))
      if (crtTempReq) {
        item.requirement.push(crtTempReq)
      }

      if (valueInfo.defaultValue == undefined || valueInfo.defaultValue == '') return
      if (typeof valueInfo.defaultValue == 'string' && valueInfo.defaultValue.includes('{{') && valueInfo.defaultValue.includes('}}')) {
        const fieldStr = valueInfo.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        if (fieldStr == 'commodityCode' && planType == '2') {
          let tempValue = tableList.map((m: any) => m[fieldStr]).join('-')
          // console.log('产品编码', tempValue)
          valueInfo.defaultValue = tempValue || undefined
        } else {
          valueInfo.defaultValue = tableInfo[fieldStr] || undefined
        }
      }
    })
    item.requirement.map((el: any) => {
      const crtConfigItem = item.configVoList?.length && item.configVoList.find((f: any) => el.code ? (f.code == el.code) : (el.name == f.name))
      if (crtConfigItem) {
        el.sort = (crtConfigItem?.sort == undefined || crtConfigItem?.sort == null || crtConfigItem?.sort == '') ? defaultSort : crtConfigItem?.sort
      }
      if (el.isDifferentiatePnl == '1') {
        el.differPNL.map((d: any) => {
          d.isChecked = '1'
        })
      }
    })

    // console.log('item.requirement', item.requirement)
    sortRequirment(item.requirement)
  })
}

// 读取drl文件时，赋值最小钻咀，以及总孔数
export const getMinDirllAndTotalDirll = (list: any[], crruntWorkInfo: any) => {
  let pnlInfoList = deepClone(list)
  console.log('读取drl文件时，赋值最小钻咀，以及总孔数:', pnlInfoList, crruntWorkInfo)
  if (pnlInfoList?.length && pnlInfoList[0]?.drillParameterList) {
    // 最小钻咀
    console.log(pnlInfoList[0].drillParameterList)
    const descPnlArr = pnlInfoList[0].drillParameterList.sort((a: any, b: any) => a?.diameter - b?.diameter) // 升序，孔径最小的排前面
    const diameterParams = crruntWorkInfo.requirement.find((f: any) => f.code == '最小钻咀')
    if (diameterParams) {
      diameterParams.defaultValue = descPnlArr?.length ? descPnlArr[0]?.diameter : undefined
    }

    // 总孔数
    const diffDrillTotalList: any[] = []
    pnlInfoList.map((m: any) => {
      // 根据PNL'X' 分组
      let tempDrill = {
        name: m.name,
        total: 0
      }
      m.drillParameterList.map((dm: any) => {
        tempDrill.total = new Decimal(tempDrill.total).add(new Decimal(Number(dm.quantity || 0))).toNumber()
      })
      diffDrillTotalList.push(tempDrill)
    })
    const drillTotalParams = crruntWorkInfo.requirement.find((f: any) => f.code == 'HoleNumber')
    if (drillTotalParams) {
      drillTotalParams.differPNL?.length && drillTotalParams.differPNL.map((m: any) => {
        const crtDiffer = diffDrillTotalList.find((f: any) => f.name == m.pnlName)
        if (crtDiffer) {
          m.defaultValue = crtDiffer.total
        }
      })
      // console.log(descPnlArr, diffDrillTotalList, drillTotalParams)
    }
  }
}

// 根据code获取工序参数
export const getNodeWorkFieldValue = (nodeInfoList: any[], firstCode: string, secodCode: string) => {
  let res = ''
  const crtWorkTemp = nodeInfoList.find((item: any) => item.code == firstCode)
  console.log(crtWorkTemp)
  if (crtWorkTemp && crtWorkTemp.requirement?.length) {
    const crtWorkRequirement = crtWorkTemp.requirement.find((item: any) => item.code == secodCode)
    if (crtWorkRequirement) {
      if (crtWorkRequirement.isDifferentiatePnl == 1) {
        if (crtWorkRequirement?.differPNL?.length) {
          res = crtWorkRequirement?.differPNL[0].defaultValue
        }
      } else {
        res = crtWorkRequirement?.defaultValue
      }
    }
  }
  return res;
}

// 校验单个表单数据是否正确 下拉框，时间，数字
// type  9:UnDefine 8:Select 7:Switch 6:CheckBox 5:RadioButton 4:TextBox 3:DateTime 2:Textarea 1:Number
export const checkFormItemWork = (item: any, configVo: any) => {
  let res = []
  // 数字类型校验
  if (item?.type == 1) {
    let regs = /^-?\d{0,8}(\.\d{1,4})?$/
    if (item?.isDifferentiatePnl == 1) {
      // 非公共参数
      if (item?.differPNL?.length) {
        item.differPNL.map((m: any) => {
          if (m?.defaultValue && !regs.test(m?.defaultValue)) {
            res.push(`${item?.name}-${m?.pnlName}: ${m?.defaultValue} 不是数字，请输入数字`)
          }
        })
      }
    } else {
      // 公共参数
      if (item?.defaultValue && !regs.test(item?.defaultValue)) {
        res.push(`${item.name}: ${item?.defaultValue} 不是数字，请输入数字`)
      }
    }
  }
  // 时间格式 校验
  if (item?.type == 3) {
    if (item?.isDifferentiatePnl == 1) {
      // 非公共参数
      if (item?.differPNL?.length) {
        item.differPNL.map((m: any) => {
          if (m?.defaultValue && !dayjs(m?.defaultValue).isValid()) {
            res.push(`${item?.name}-${m?.pnlName}: ${m?.defaultValue} 格式不正确，请选择时间`)
          }
        })
      }
    } else {
      // 公共参数
      if (item?.defaultValue && !dayjs(item?.defaultValue).isValid()) {
        res.push(`${item.name}: ${item?.defaultValue} 格式不正确，请选择时间`)
      }
    }
  }
  // 下拉框 校验
  if (item?.type == 8 && item.code) {
    // json数据中的值有code，才进行校验参数值是否正确，没有code就跳过去
    configVo.options = (configVo?.options || []).map((m: any) => m+'')
    if (item?.isDifferentiatePnl == 1) {
      // 防止为空，并且数据格式化位字符串，以便于下方校验
      // 非公共参数
      if (item?.differPNL?.length) {
        item.differPNL.map((m: any) => {
          if (m?.defaultValue && !configVo?.options.includes(m?.defaultValue+'')) {
            res.push(`${item?.name}-${m?.pnlName}: ${m?.defaultValue} 不存在`)
          }
        })
      }
    } else {
      // 公共参数
      if (item?.defaultValue && !configVo?.options.includes(item?.defaultValue+'')) {
        // console.log('configVo?.options---', configVo?.options, item?.defaultValue)
        res.push(`${item.name}: ${item?.defaultValue} 不存在`)
      }
    }
  }
  return res
}

// 对工序中的工艺参数进行排序
// 注意点：点编辑时，工序展示会排序，但是如果不保存，就会只是展示，数据的顺序不会改变
export const sortRequirment = (item: any) => {
  if (!item) return item;
  item.map((m: any, mI: any) => {
    m.sort = (m?.sort == undefined || m?.sort == null || m?.sort == '') ? defaultSort : m?.sort
  })
  return item.sort((a: any, b: any) => {
    return a.sort - b.sort
    // return b?.name.localeCompare(a?.name, 'zh-CN')
  })
}

// 修改requirement中的值，未考虑到参数从 公共参数 改变为 非公共参数 的情况，赋值复杂，弃用
export const changeRequirementValue = (tableList: any, nodeInfoList: any, outsideLineTemp: any, craftCode: any, paraCode: any) => {
  const tableInfo = tableList[0]
  let node = nodeInfoList.find((o: any) => o.code == craftCode);
  if (node) {
    let paras = node.requirement;
    let para = paras.find((o: any) => o.code == paraCode);
    if (para && ['Etch','负片蚀刻'].includes(node.code+'')) {
      // console.log('para', para)
      if (['Etch_MinWidth', 'Etch_MinDistance', '最小线宽', '最小线距'].includes(para?.code+'')) {
        //【外层线路】工序的最小线宽和最小线距需要根据补偿值自动计算得出【退膜/蚀刻】工序的最小线宽和最小线距
        if (outsideLineTemp) {
          //补偿值
          let minWidth = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinWidth');
          let compensation = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_Compensation');
          let minDistance = outsideLineTemp.requirement.find((o: any) => o.code == 'OutsideLine_MinDistance');
          if (minWidth
            && minWidth.defaultValue
            && (para.code == 'Etch_MinWidth' || para.code == '最小线宽')
          ) {
            // 补偿值为空或为0时，当作0计算，而不是跳过计算
            para.isChecked = '1';
            if (typeof minWidth.defaultValue == 'string' && minWidth.defaultValue.includes('{{') && minWidth.defaultValue.includes('}}')) {
              const fieldStr = minWidth.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
              minWidth.defaultValue = tableInfo[fieldStr] || undefined
            }
            let tempValue = new Decimal(minWidth.defaultValue).sub(new Decimal(compensation?.defaultValue || 0)).toNumber()
            para.defaultValue = tempValue <= 0 ? '0' : tempValue
          }

          if (minDistance
            && minDistance.defaultValue
            && (para.code == 'Etch_MinDistance' || para.code == '最小线距')
          ) {
            // 补偿值为空或为0时，当作0计算，而不是跳过计算
            para.isChecked = '1';
            if (typeof minDistance.defaultValue == 'string' && minDistance.defaultValue.includes('{{') && minDistance.defaultValue.includes('}}')) {
              const fieldStr = minDistance.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
              minDistance.defaultValue = tableInfo[fieldStr] || undefined
            }
            let tempValue = new Decimal(minDistance.defaultValue).add(new Decimal(compensation?.defaultValue || 0)).toNumber()
            para.defaultValue = tempValue <= 0 ? '0' : tempValue
          }
        }
      }
      // return para;
    }
  }
  return node
}