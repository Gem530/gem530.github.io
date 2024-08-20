import { deepClone } from '@/utils'
import { Decimal } from 'decimal.js'
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
    getFieldTableIndex(tableList, item, planType, scheme, pnlList, compensation, outsideLineTemp)
  })
}

// 工序工艺加工要求参数从表格第一条取字段数据，单个初始化
export const getFieldTableIndex = (tableList: any, nodeInfo: any, planType: string, scheme: any[], pnlList: any[], compensation: any, outsideLineTemp: any) => {
  // console.log('nodeInfo-----', nodeInfo)
  const tableInfo = tableList[0]
  if (!nodeInfo?.configVoList?.length) return
  nodeInfo.configVoList.map((item: any) => {
    fieldToChangeDefaultValue(tableList, item, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp)
  })
  if (nodeInfo.configVoList?.length) {
    nodeInfo.requirement = getCraftRequirementJson(JSON.parse(JSON.stringify(nodeInfo.configVoList)), scheme, pnlList, nodeInfo.code == 'CuttingMaterial_System')
  }
}

// 去除 大括号 并赋值
export const fieldToChangeDefaultValue = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any[], pnlList: any[], compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
  if (nodeInfo.code == 'CuttingMaterial_System') {
    // 开料
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   scheme.forEach((scheme, index) => {
    //     initCutting(tableInfo, valueInfo, nodeInfo, planType, scheme, pnlList[index], compensation, outsideLineTemp)
    //   })
    // } else {
    initCutting(tableList, valueInfo, nodeInfo, planType, scheme, pnlList, compensation, outsideLineTemp)
    // }
  }
  if (nodeInfo.code == "OutsideLine") {
    // 外层线路
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   pnlList.forEach((pnlList, index) => {
    //     initOutsideLine(tableInfo, valueInfo, nodeInfo, planType, scheme[index], pnlList, compensation, outsideLineTemp)
    //   })
    // } else {
    initOutsideLine(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp)
    // }
  }
  if (nodeInfo.code == "Etch") {
    //处理【退膜/蚀刻】节点
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   pnlList.forEach((pnlList, index) => {
    //     computeEtchPara(tableInfo, valueInfo, nodeInfo, planType, scheme[index], pnlList, compensation, outsideLineTemp)
    //   })
    // } else {
    computeEtchPara(tableList, valueInfo, nodeInfo, planType, scheme[0], pnlList[0], compensation, outsideLineTemp)
    // }
  }

  if (valueInfo.defaultValue == undefined || valueInfo.defaultValue == '') return
  if (typeof valueInfo.defaultValue == 'string' && valueInfo.defaultValue.includes('{{') && valueInfo.defaultValue.includes('}}')) {
    const fieldStr = valueInfo.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
    if (fieldStr == 'commodityCode' && planType == '2') {
      let tempValue = tableList.map((m: any) => m[fieldStr]).join('-')
      valueInfo.defaultValue = tempValue || undefined
    } else {
      valueInfo.defaultValue = tableInfo[fieldStr] || undefined
    }
    // console.log('fieldStr', fieldStr, valueInfo.defaultValue)
  }
}

// 初始化开料信息
const initCutting = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
  if (valueInfo.code == 'BoardThickness') {
    valueInfo.isChecked = '1';
    if (planType == '2') {
      // 板厚 并且是 双面板
      let resNumber = Number(tableInfo.commodityThickness)
      if (typeof resNumber == 'number' && resNumber>0) {
        // 订单中板厚有值，就计算（双面板的开料工艺，板厚设置为成品板厚-0.1）；否则取工艺配置中的默认值
        // valueInfo.defaultValue = resNumber ? resNumber - 0.1 : valueInfo.defaultValue
        valueInfo.defaultValue = resNumber ? Decimal(resNumber).sub(Decimal(0.1)).toNumber() : valueInfo.defaultValue
        // console.log('valueInfo.defaultValue', valueInfo.defaultValue)
      }
      // if (valueInfo.isDifferentiatePnl == '1') {
      //   valueInfo.differPNL = []
      //   scheme.forEach((item: any) => {
      //     valueInfo.differPNL.push({
      //       pnlName: item.name,
      //       isBold: valueInfo.isBold,
      //       isChecked: valueInfo.isChecked,
      //       defaultValue: valueInfo.defaultValue || undefined
      //     })
      //   })
      // }
    } else {
      valueInfo.defaultValue = Number(tableInfo.commodityThickness) || tableInfo.commodityThickness;
    }
  }
  //板材
  if (valueInfo.code === 'BoardMaterial') {
    valueInfo.isChecked = '1';
    valueInfo.defaultValue = tableInfo.materialQuality;
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   valueInfo.differPNL = []
    //   scheme.forEach((item: any) => {
    //     valueInfo.differPNL.push({
    //       pnlName: item.name,
    //       isBold: valueInfo.isBold,
    //       isChecked: valueInfo.isChecked,
    //       defaultValue: valueInfo.defaultValue || undefined
    //     })
    //   })
    // }
  }
  //铜厚
  if (valueInfo.code === 'CopperThickness') {
    valueInfo.isChecked = '1';
    valueInfo.defaultValue = tableInfo.materialCopperOutside;
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   valueInfo.differPNL = []
    //   scheme.forEach((item: any) => {
    //     valueInfo.differPNL.push({
    //       pnlName: item.name,
    //       isBold: valueInfo.isBold,
    //       isChecked: valueInfo.isChecked,
    //       defaultValue: valueInfo.defaultValue || undefined
    //     })
    //   })
    // }
  }
  //开料尺寸
  if (valueInfo.code === 'CutSizeMm') {
    valueInfo.isChecked = '1';
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   valueInfo.differPNL = []
    //   scheme.forEach((item: any) => {
    //     let length = item.boardLength ? item.boardLength : 0;
    //     let width = item.boardWidth ? item.boardWidth : 0;
    //     let resNum = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
    //     console.log('开料尺寸', resNum)
    //     valueInfo.differPNL.push({
    //       pnlName: item.name,
    //       isBold: valueInfo.isBold,
    //       isChecked: valueInfo.isChecked,
    //       defaultValue: resNum || undefined
    //     })
    //   })
    // } else {
    let length = scheme?.length ? scheme[0].boardLength : 0;
    let width = scheme?.length ? scheme[0].boardWidth : 0;
    valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
    // }
  }
  //开料英寸尺寸
  if (valueInfo.code === 'CutSize') {
    valueInfo.isChecked = '1';
    // if (valueInfo.isDifferentiatePnl == '1') {
    //   valueInfo.differPNL = []
    //   scheme.forEach((item: any) => {
    //     let length = item.boardLength ? (item.boardLength / 25.4) : 0;
    //     let width = item.boardWidth ? (item.boardWidth / 25.4) : 0;
    //     let resNum = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
    //     console.log('开料英寸尺寸', resNum)
    //     valueInfo.differPNL.push({
    //       pnlName: item.name,
    //       isBold: valueInfo.isBold,
    //       isChecked: true,
    //       defaultValue: resNum || undefined
    //     })
    //   })
    //   console.log(valueInfo.differPNL)
    // } else {
    let length = scheme?.length ? (scheme[0].boardLength / 25.4) : 0;
    let width = scheme?.length ? (scheme[0].boardWidth / 25.4) : 0;
    valueInfo.defaultValue = Number(length).toFixed(1) + '*' + Number(width).toFixed(1);
    // }
  }
}

// 初始化外层线路
const initOutsideLine = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
  // try {
    // console.log(pnlList)
    // OutsideLine_Compensation 补偿值
    // FilmSize 干膜尺寸
    // para.parameterValue === '{{Material.CopperThickness}}' 底铜（基板铜厚）
    // console.log(pnlList)
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
    // 底铜（基板铜厚） 配置了默认值，{{Material.CopperThickness}}会自动走fieldToChangeDefaultValue的逻辑
  // } catch(err) {
  //   console.log(err)
  // }
}

// 初始化退膜/蚀刻
const computeEtchPara = (tableList: any, valueInfo: any, nodeInfo: any, planType: string, scheme: any, pnlList: any, compensation: any, outsideLineTemp: any) => {
  const tableInfo = tableList[0]
  // try {
  //【外层线路】工序的最小线宽和最小线距需要根据补偿值自动计算得出【退膜/蚀刻】工序的最小线宽和最小线距
  // console.log('outsideLineTemp', outsideLineTemp)
  if (outsideLineTemp) {
    //补偿值
    let minWidth = outsideLineTemp.requirement.find(o => o.code == 'OutsideLine_MinWidth');
    compensation = outsideLineTemp.requirement.find(o => o.code == 'OutsideLine_Compensation');
    let minDistance = outsideLineTemp.requirement.find(o => o.code == 'OutsideLine_MinDistance');
    if (minWidth
      && minWidth.defaultValue
      && compensation?.defaultValue && valueInfo.code == 'Etch_MinWidth'
    ) {
      valueInfo.isChecked = '1';
      if (typeof minWidth.defaultValue == 'string' && minWidth.defaultValue.includes('{{') && minWidth.defaultValue.includes('}}')) {
        const fieldStr = minWidth.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minWidth.defaultValue = tableInfo[fieldStr] || undefined
      }
      valueInfo.defaultValue = Decimal(minWidth.defaultValue).sub(Decimal(compensation.defaultValue)).toNumber()
    }

    if (minDistance
      && minDistance.defaultValue
      && compensation?.defaultValue && valueInfo.code == 'Etch_MinDistance'
    ) {
      valueInfo.isChecked = '1';
      if (typeof minDistance.defaultValue == 'string' && minDistance.defaultValue.includes('{{') && minDistance.defaultValue.includes('}}')) {
        const fieldStr = minDistance.defaultValue.replace(/\{\{/g,'').replace(/\}\}/g, '')
        minDistance.defaultValue = tableInfo[fieldStr] || undefined
      }
      valueInfo.defaultValue = Decimal(minDistance.defaultValue).add(Decimal(compensation.defaultValue)).toNumber()
    }
  }
  // } catch(err) {
  //   console.log(err)
  // }
}

// 初始化数据
export const initNodeInfoList = (list: any, tableList: any, planType: any) => {
  const tableInfo = tableList[0]
  list.map((item: any) => {
    item.configVoList?.length && item.configVoList.map((valueInfo: any) => {
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
        // valueInfo.defaultValue = tableInfo[fieldStr] || undefined
        // console.log('fieldStr', fieldStr, valueInfo.defaultValue)
      }
    })
    item.requirement.map((el: any) => {
      if (el.isDifferentiatePnl == '1') {
        el.differPNL.map((d: any) => {
          d.isChecked = '1'
        })
      }
    })
  })
}
