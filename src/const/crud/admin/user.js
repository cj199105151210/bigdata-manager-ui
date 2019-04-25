import { getDetails } from '@/api/admin/user'
import { isvalidatemobile } from "@/utils/validate";

// 手机号码验证
const validatePhone = (rule, value, callback) => {
  if (isvalidatemobile(value)[0]) {
    callback(new Error(isvalidatemobile(value)[1]));
  } else {
    callback();
  }
};

// 用户名验证
var validateUsername = (rule, value, callback) => {
  getDetails(value).then(response => {
    if (window.boxType === 'edit') callback()
    let result = response.data.data
    if (result !== null) {
      callback(new Error('用户名已经存在'))
    } else {
      callback()
    }
  })
}
export const tableOption = {
  border: true,  // 边框
  index: true,    // 表格左侧的序号
  indexLabel: '序号', // 序号标题
  stripe: false, // 各行换色
  menuAlign: 'center', // 操作区按钮的位置
  editBtn: false, // 编辑按钮(自定义按钮需要把原先的按钮删除)
  delBtn: false, // 删除按钮 
  align: 'center',
  addBtn: false, // 添加按钮
  selection: true, //  左侧的选中功能开启
  // fixed:false,
  showPage: true, // 显示分页 默认是true
  // size:'small',
  saveBtnTitle: '保存', // 弹出新增按钮标题
  updateBtnTitle: '保存', //弹出框更新按钮标题
  dialogClickModal: false, // 限制弹框点击灰色背景关闭
  column: [
    {
      label: 'id',  //列名称
      prop: 'userId', // 列字段
      span: 24, //表单栅列 添加编辑时会体现
      hide: true, // 是否隐藏
      editDisabled: true,  // 表单编辑时是否禁止
      addVisdiplay: false  //表单新增时是否可见
    },
    {
      label: '用户名',
      prop: 'username',
      editDisabled: true,
      solt: false, // 列自定义
      search: true,  // 开启搜索功能模块
      // autoComplete:false,
      span: 24,
      rules: [{
        required: true,
        message: '请输入用户名'
      },
      {
        min: 3,
        max: 20,
        message: '长度在 3 到 20 个字符',
      },
      { validator: validateUsername }
      ]
    }, {
      label: '初始密码',
      prop: 'password',
      type: 'text',
      value: '123456',
      hide: true,
      addDisabled: true,
      editVisdiplay: false,
      span: 24,
      rules: [{
        required: true,
      }]
    }, {
      label: '所属部门',
      prop: 'deptId',
      formsolt: true,
      solt: true,
      // search:true,
      span: 24,
      hide: true,
      rules: [{
        required: true,
        message: '请选择部门',
        trigger: 'blur'
      }]
    }, {
      label: '所属部门',
      prop: 'deptName',
      editDisabled: false,  // 表单编辑时是否禁止
      addVisdiplay: false,  //表单新增时是否可见
      editVisdiplay: false,
    },
    {
      label: '手机号',
      prop: 'phone',
      type: 'phone',
      width: 150,
      value: '',
      span: 24,
      rules: [
        {
          required: true,
          message: '手机号码不能为空',
        },
        {
          min: 11,
          max: 11,
          message: '长度在 11 个字符',
        },
        { validator: validatePhone }
      ]
    }, {
      label: '角色',
      prop: 'role',
      formsolt: true,
      solt: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择角色',
      }]
    }, {
      label: '状态',
      prop: 'lockFlag',
      type: 'select',
      solt: true,
      span: 24,
      rules: [{
        required: true,
        message: '请选择状态',
      }],
      dicData: [{
        label: '有效',
        value: '0'
      }, {
        label: '锁定',
        value: '9'
      }]
    }, {
      label: '创建时间',
      prop: 'createTime',
      type: 'datetime',
      format: 'yyyy-MM-dd HH:mm',
      valueFormat: 'yyyy-MM-dd HH:mm:ss',
      width: 150,
      editDisabled: true,
      addVisdiplay: false,
      span: 24,
    }]
}
