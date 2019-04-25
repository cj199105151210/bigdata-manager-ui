export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  editBtn: false,
  delBtn: false,
  align: 'center',
  addBtn: false,
  saveBtnTitle:'保存', // 弹出新增按钮标题
  updateBtnTitle:'保存', //弹出框更新按钮标题
  dialogClickModal:false, // 限制弹框点击灰色背景关闭
  column: [{
    label: '角色名称',
    prop: 'roleName',
    span: 24,
    search:true,
    rules: [{
      required: true,
      message: '角色名称不能为空',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 20,
      message: '长度在 3 到 20 个字符',
      trigger: 'blur'
    }]
  }, {
    width: 120,
    label: '角色标识',
    prop: 'roleCode',
    span: 24,
    editDisabled: true,
    rules: [{
      required: true,
      message: '角色标识不能为空',
      trigger: 'blur'
    },
      {
        min: 3,
        max: 20,
        message: '长度在 3 到 20 个字符',
        trigger: 'blur'
      }
    ]
  }, {
    width: 150,
    label: '角色描述',
    prop: 'roleDesc',
    overHidden: true,
    span: 24
  }, {
    width: 180,
    label: '数据权限',
    prop: 'dsType',
    type: 'select',
    span: 24,
    rules: [{
      required: true,
      message: '请选择数据权限类型',
      trigger: 'blur'
    }],
    dicData: [{
      label: '全部',
      value: 0
    }, {
      label: '自定义',
      value: 1
    }, {
      label: '本级及子级',
      value: 2
    }, {
      label: '本级',
      value: 3
    }]
  }, {
    label:'',
    prop: 'dsScope',
    formsolt: true,
    showClomnu:false,
    hide: true
  }, {
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss',
    width:150,
    editVisdiplay: false,
    addVisdiplay: false,
    span: 24
  }]
}
