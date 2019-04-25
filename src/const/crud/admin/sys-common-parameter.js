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
      width: 80,
      type: 'select',
      dicData: [{
        label: '无效',
        value: 2
      }, {
        label: '有效',
        value: 1
      }]
    },
	  {
      label: '编码',
      prop: 'validateCode'
    },
    {
      label: '类型',
      prop: 'publicType',
      width: 80,
      type: 'select',
      dicData: [{
        label: '系统',
        value: 0
      }, {
        label: '公共',
        value: 1
      }]
    }
  ]
}
