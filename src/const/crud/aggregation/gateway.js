import { format } from "upath";

var validateCode = (rule ,value ,callback) => {
    if(value !== ''){
        var reg = /^[0-9a-zA-Z_].{7,}/;
        if(!reg.test(value)){
            callback(new Error('请输入长度大于8位的编码'));
        }
        callback();    
    }
};
//校验门户名称
var validateName = (rule ,value ,callback) => {
    if(value !== ''){
        var reg = /^[\u4E00-\u9FA5A-Za-z0-9_].{1,19}/;
        if(!reg.test(value)){
            callback(new Error('长度在2-20之间'));
        }
        callback();    
    }
};

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
    column:[{
        label:'ID',
        prop:'gatewayId',
        overHidden:true,
    },{
        label:'门户名称',
        prop:'name',
        span:24,
        rules:[{
            required: true,
            message: '门户名称不能为空',
            trigger: 'blur',
        },
        {validator:validateName,trigger: 'blur'}]
    },{
        label:'门户编码',
        prop:'code',
        span:24,
        rules:[{
            required: true,
            message: '门户名称不能为空',
            trigger: 'blur',
        },
        {validator:validateCode,trigger: 'blur'}]
    },{
        label:'类型',
        prop:'type',
        format:"formatGatewayType",
        rules:[{
            required: true,
            message: '门户类型不能为空',
            trigger: 'blur',
        }]
    },{
        label:'启用状态',
        prop:'status',
        span:24,
        formatter:"formatStatus",
        rules:[{
            required: true,
            message: '请选择启用状态',
            trigger: 'blur',
        }]
    },{
        label:'身份类型',
        prop:'identity',
        span:24,
        formatter:"formatIdentity",
        rules:[{
            required: true,
            message: '请选择人员类别',
            trigger: 'blur',
        }]
    },{
        label:'创建人',
        prop:'createUser',
        span:24,
        overHidden:true
    },{
        label:'创建时间',
        prop:'createTime',
        span:24,
        overHidden:true
    }]



}