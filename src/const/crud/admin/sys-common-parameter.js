export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  saveBtnTitle: '保存', // 弹出新增按钮标题
  updateBtnTitle: '保存', //弹出框更新按钮标题
  dialogClickModal: false, // 限制弹框点击灰色背景关闭
  column: [
    {
      label: '编号',
      prop: 'publicId',
      hide: true,
      addVisdiplay: false,
      editDisabled: true
    },
    {
      label: '名称',
      search: true,
      prop: 'publicName'
    },
    {
      label: '键值',
      search: true,
      prop: 'publicKey'
    },
    {
      label: '数值',
      prop: 'publicValue'
    },
    {
      label: '状态',
      prop: 'status',
      type: 'select',
      solt: true,
      dicData: [{
        label: '无效',
        value: '0'
      }, {
        label: '有效',
        value: '1'
      }]
    },
    {
      label: '编码',
      prop: 'validateCode'
    },
    {
      label: '类型',
      prop: 'publicType',
      type: 'select',
      solt: true,
      dicData: [{
        label: '系统',
        value: '0'
      }, {
        label: '公共',
        value: '1'
      }]
    }
  ]
}
