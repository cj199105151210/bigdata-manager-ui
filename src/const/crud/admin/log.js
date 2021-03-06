export const tableOption = {
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  menu:false,
  align: 'center',
  refreshBtn: true,
  showClomnuBtn: false,
  searchSize: 'mini',
  addBtn: false,
  editBtn: false,
  delBtn: false,
  viewBtn: true,
  dicUrl: '/api/admin/dict/type/log_type',
  dialogClickModal: false, // 限制弹框点击灰色背景关闭
  props: {
    label: 'label',
    value: 'value'
  },
  column: [{
    label: '类型',
    prop: 'type',
    type: 'select',
    formsolt: true,
    solt: true,
    dicData: [{
      label: '正常',
      value: '0'
    }, {
      label: '异常',
      value: '1'
    }],
    search: true
  }, {
    label: '标题',
    prop: 'title'
  }, {
    label: 'IP地址',
    prop: 'remoteAddr'
  }, {
    label: '请求方式',
    prop: 'method'
  }, {
    label: '客户端',
    prop: 'serviceId'
  }, {
    minWidth: 80,
    label: '请求时间',
    prop: 'time'
  }, {
    minWidth: 150,
    label: '创建时间',
    prop: 'createTime',
    type: 'datetime',
    format: 'yyyy-MM-dd HH:mm',
    valueFormat: 'yyyy-MM-dd HH:mm:ss'
  }]
}
