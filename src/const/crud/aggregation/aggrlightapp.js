export const tableOption = {
  selection: true,
  border: true,
  index: true,
  indexLabel: '序号',
  stripe: true,
  menuAlign: 'center',
  align: 'center',
  editBtn: false,
  delBtn: false,
  addBtn: false,
  viewBtn: false,
  column: [
    {
      label: '应用图标',
      prop: 'photoUrl',
      type:'upload',
      listType:'picture-img',
      imgWidth:50,
      imgHeight:50,
      span: 24,
      rules: [{
        required: true,
        message: "请选择应用图标",
        trigger: "blur"
      }]
    },
	  {
      label: '应用名称',
      prop: 'name',
      search:true,
      rules: [{
        required: true,
        message: "请填写应用名称",
        trigger: "blur"
      }]
    },
    {
      label: '图标名',
      prop: 'photoName',
      hide: true,
      addVisdiplay: false,
      editVisdiplay: false,
      viewVisdiplay: false
    },
	  {
      label: '应用链接',
      prop: 'url',
      hide: true,
      rules: [{
        required: true,
        message: "请填写应用链接",
        trigger: "blur"
      }]
    },
    {
      label: '编码',
      prop: 'code',
      hide: true,
      rules: [{
        required: true,
        message: "请填写编码",
        trigger: "blur"
      }]
    },
    {
      label: '状态',
      prop: 'status',
      type:'radio',
      dicData:[
        {
          label:'启用',
          value:'1'
        },{
          label:'禁用',
          value:'0'
        }
      ],
      rules: [{
        required: true,
        message: "请选择状态",
        trigger: "blur"
      }],
      valueDefault: '1'
    },
    {
      label: '服务类别',
      prop: 'serviceCategory',
      type:'select',
      dicData:[],
      search:true,
      rules: [{
        required: true,
        message: "请选择服务类别",
        trigger: "blur"
      }]
    },
    {
      label: '服务专题',
      prop: 'serviceTopice',
      type:'select',
      dicData:[],
      search:true
    },
    {
      label: '办理时间',
      prop: 'serviceTime',
      type: 'timerange',
      startPlaceholder: '开始时间',
      endPlaceholder: '结束时间',
      hide: true,
      format: "HH:mm:ss",
      valueFormat: "HH:mm:ss",
      rules: [{
        trigger: "blur",
        validator: undefined
      }]
    },
    {
      label: '办理地点',
      prop: 'processingPlace',
      hide: true,
      rules: [{
        trigger: "blur",
        validator: undefined
      }]
    },
    {
      label: '服务方式',
      prop: 'serviceMode',
      type:'select',
      dicData:[],
      search:true,
      rules: [{
        required: true,
        message: "请选择服务方式",
        trigger: "blur"
      }]
    },
    {
      label: '用户组',
      prop: 'groups',
      type:'select',
      multiple: true,
      dicData:[],
      rules: [{
        required: true,
        message: "请选择用户组",
        trigger: "blur"
      }]
    },
    {
      label: '服务部门',
      prop: 'serviceDpt',
      type:'select',
      dicData:[],
      rules: [{
        required: true,
        message: "请选择服务部门",
        trigger: "blur"
      }]
    },
    {
      label: '联系人',
      prop: 'contacts',
      hide: true
    },
    {
      label: '联系电话',
      prop: 'contactNumber',
      hide: true
    },
    {
      label: '描述',
      prop: 'describeMsg',
      hide: true,
      span: 24
    }
  ]
}
