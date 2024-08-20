import{_ as e,a as t}from"./index.vue_vue_type_script_setup_true_name_g-table_lang.ff194d02.js";import{P as a,i as l}from"./element-plus.1a8f7ccb.js";import{_ as r}from"./index.7ae2f1d9.js";import{t as i}from"./table.5f1c0de7.js";import{k as s,$ as o,o as p,c as d,W as n,U as c,u as m,a8 as b,Y as u,F as g,a as f}from"./@vue.df4a0536.js";import"./index.f5ed39b5.js";import"./pinia.447e158a.js";import"./vue-router.3b0bf160.js";import"./@vueuse.ca8459fe.js";import"./@element-plus.5fd8ebeb.js";import"./nprogress.058bccf8.js";import"./axios.68af02ab.js";import"./pako.fc44881c.js";import"./mitt.550594b0.js";import"./ws.f1fd17a3.js";import"./lodash-es.503fa2cd.js";import"./dayjs.6e4093f3.js";import"./async-validator.fb49d0f5.js";import"./@ctrl.82a509e0.js";import"./@popperjs.36402333.js";import"./memoize-one.4ee5c96d.js";import"./escape-html.e5dfadb9.js";import"./normalize-wheel-es.8aeb3683.js";import"./index.vue_vue_type_script_setup_true_name_wang-editor_lang.6813ac8c.js";import"./base.cc75b0f9.js";import"./index.b0f22997.js";import"./@wangeditor.6de03d2f.js";import"./index.2157c526.js";const y=f("h2",null,"表格",-1),h=b("删除"),j=b("新增"),_=b("编辑"),v=b("删除"),k=s({__name:"hookTable",setup(s){const{GFormRef:f,tableRef:k,dealTable:w,tableData:x,dealSearch:S,dealDialog:R,showDialog:L,modalFormRef:C,search:T,getList:U,initTable:I,delHandle:z,changeSearch:F,addDialogOpen:D,confirmDialog:N,editDialogOpen:P,keyUpEnterSearch:q,delMultiplepHandle:G}=i(),H=[{visible:!0,sort:1,attrs:{align:"center",type:"selection"}},{visible:!0,sort:2,attrs:{align:"center",width:""},type:"dictId",label:"字典编号"},{visible:!0,sort:3,attrs:{align:"center",width:""},type:"dictName",label:"字典名称"},{visible:!0,sort:4,attrs:{align:"center",width:""},type:"dictType",label:"字典类型"},{visible:!0,sort:4,attrs:{align:"center",width:""},type:"status",label:"状态"},{visible:!0,sort:5,attrs:{align:"center",width:""},type:"remark",label:"备注"},{visible:!0,sort:6,attrs:{align:"center",width:""},type:"createTime",label:"创建时间"},{visible:!0,sort:8,slot:"make"}],O=o({formList:[{col:8,value:"",type:"input",prop:"dictName",label:"字典名称",attrs:{type:"text",clearable:!0,placeholder:"请输入字典名称",onkeyup:e=>q(e)}},{col:8,value:"",type:"input",prop:"dictType",label:"字典类型",attrs:{type:"text",clearable:!0,placeholder:"请输入字典类型",onkeyup:e=>q(e)}},{col:8,label:"状态",type:"select",prop:"status",value:void 0,attrs:{clearable:!0,placeholder:"操作状态",onChange:()=>F()},data:[{label:"正常",value:0},{label:"停用",value:1}]},{col:8,type:"date",label:"创建时间",prop:"dateRange",attrs:{type:"daterange",clearable:!0,rangeSeparator:"-",endPlaceholder:"结束时间",startPlaceholder:"开始时间",onChange:()=>F()}},{col:12,type:"btn",btn:{search:!0,searchName:"搜索",reset:!0,resetName:"重置"}}],oprtIdList:[],dialogRules:{dictName:[{required:!0,message:"字典名称不能为空",trigger:"blur"}],dictType:[{required:!0,message:"字典类型不能为空",trigger:"blur"}]},dialogFormList:[{type:"input",prop:"dictName",label:"字典名称",attrs:{type:"text",clearable:!0}},{type:"input",prop:"dictType",label:"字典类型",attrs:{type:"text",clearable:!0}},{value:"1",type:"radio",prop:"status",label:"状态",data:[{label:"正常",value:"0"},{label:"停用",value:"1"}]},{type:"input",prop:"remark",label:"备注",attrs:{type:"textarea"}}]}),E=e=>{O.oprtIdList=e.map((e=>e.dictId))};return I({dataStr:"rows",addUrl:"/system/dict/type",getUrl:"/system/dict/type/",editUrl:"/system/dict/type",delUrl:"/system/dict/type/",tableUrl:"/system/dict/type/page"}),S.value=e=>(e.dateRange&&(e.beginTime=e.dateRange[0],e.endTime=e.dateRange[1],e.dateRange=void 0),e),(i,s)=>{const o=l,w=r,S=a,R=e,I=t;return p(),d("div",null,[y,n(w,{ref_key:"GFormRef",ref:f,"label-width":"100px",formList:O.formList,onSearch:m(T)},{"make-btn":c((()=>[n(o,{onClick:s[0]||(s[0]=e=>m(G)(O.oprtIdList)),type:"primary"},{default:c((()=>[h])),_:1}),n(o,{onClick:s[1]||(s[1]=e=>m(D)("新增字典")),type:"primary"},{default:c((()=>[j])),_:1})])),_:1},8,["formList","onSearch"]),n(R,{ref_key:"tableRef",ref:k,total:m(x).total,data:m(x).dataSource,columns:H,page:m(x).pageIndex,"onUpdate:page":s[2]||(s[2]=e=>m(x).pageIndex=e),pageSize:m(x).pageSize,"onUpdate:pageSize":s[3]||(s[3]=e=>m(x).pageSize=e),onPagination:m(U),onSelectionChange:E},{"column-status":c((e=>[b(u(0==e.row.status?"正常":"异常"),1)])),"table-column-make":c((()=>[n(S,{fixed:"right",label:"操作",align:"center"},{default:c((e=>[n(o,{onClick:t=>m(P)(e.row.dictId,"编辑字典")},{default:c((()=>[_])),_:2},1032,["onClick"]),n(o,{onClick:t=>m(z)(e.row.dictId)},{default:c((()=>[v])),_:2},1032,["onClick"])])),_:1})])),_:1},8,["total","data","page","pageSize","onPagination"]),n(I,{title:"编辑",ref_key:"modalFormRef",ref:C,show:m(L),"onUpdate:show":s[4]||(s[4]=e=>g(L)?L.value=e:null),rules:O.dialogRules,formList:O.dialogFormList,onConfirm:m(N)},null,8,["show","rules","formList","onConfirm"])])}}});export{k as default};