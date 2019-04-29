export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: false,
  menuAlign: 'center',
  align: 'center',
  refreshBtn: false,
  showClomnuBtn: false,
  refreshBtn: true,
  searchSize: 'mini',
  editBtn: false,
  delBtn: false,
  saveBtnTitle: '保存', // 弹出新增按钮标题
  updateBtnTitle: '保存', //弹出框更新按钮标题
  dialogClickModal: false, // 限制弹框点击灰色背景关闭
  column: [{
    label: '类型',
    prop: 'type',
    'search': true,
    rules: [{
      required: true,
      message: '请输入字典类型',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 64,
      message: '长度在 2 到 64 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '描述',
    prop: 'description',
    rules: [{
      required: true,
      message: '请输入字典描述',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 64,
      message: '长度在 2 到 64 个字符',
      trigger: 'blur'
    }]
  }, {
    label: '备注信息',
    prop: 'remarks',
    rules: [{
      min: 0,
      max: 64,
      message: '长度在 2 到 64 个字符',
      trigger: 'blur'
    }]
  }, {
    minWidth: 150,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    addVisdiplay: false,
    editDisabled: true,
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }]
}


export const tableDictItemOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: 'mini',
  saveBtnTitle: '保存', // 弹出新增按钮标题
  updateBtnTitle: '保存', //弹出框更新按钮标题
  dialogClickModal: false, // 限制弹框点击灰色背景关闭
  column: [{
    label: '类型',
    prop: 'type',
    addDisabled: true,
    editDisabled: true
  }, {
    minWidth: 150,
    label: '数据值',
    prop: 'value',
    rules: [{
      required: true,
      message: '请输入数据值',
      trigger: 'blur'
    }]
  }, {
    label: '标签名',
    prop: 'label',
    rules: [{
      required: true,
      message: '请输入标签名',
      trigger: 'blur'
    }]
  }, {
    label: '描述',
    prop: 'description',
    rules: [{
      required: true,
      message: '请输入字典描述',
      trigger: 'blur'
    }]
  }, {
    label: '排序',
    prop: 'sort',
    type: 'number',
    rules: [{
      required: true,
      message: '请输入排序',
      trigger: 'blur'
    }]
  }, {
    label: '备注信息',
    prop: 'remarks'
  }]
}
