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
  column: [
    {
      label: '名称',
      prop: 'name',
      search:true,
      rules: [{
        trigger: "blur",
        validator: undefined
      },
      {
        required: true,
        message: "请输入名称",
        trigger: "blur"
      }]
    },
	  {
      label: '编码',
      prop: 'code',
      search:true,
      rules: [{
        trigger: "blur",
        validator: undefined
      },
      {
        required: true,
        message: "请输入编码",
        trigger: "blur"
      }]
    },
	  {
      label: '类型',
      prop: 'type',
      search:true,
      type:'select',
      dicData:[],
      rules: [{
        required: true,
        message: "请选择类型",
        trigger: "blur"
      }]
    },
	  {
      label: '身份标识',
      prop: 'identity',
      type:'select',
      dicData:[]
    },
    {
      label: '启用状态',
      prop: 'status',
      search:true,
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
        message: "请选择启用状态",
        trigger: "blur"
      }]
    },
  ]
}
