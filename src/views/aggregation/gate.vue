<template>
    <div class="app-container calendar-list-container">
        <basic-container>
            <div>
                <avue-curd
                    :option="tableOption"
                    :data="tableData"
                    ref="crud"
                    :page="page"
                    v-model="form"
                    :table-loading="listLoading"
                    :before-open="handleOpenBefore"
                    @on-load="getList"
                    @search-change="handleFilter"
                    @refresh-change="handleRefreshChange"
                    @row-update="update"
                    @row-save="create"
                    @row-query="query"
                >
                    <template slot="menuLeft">
                        <el-button class="filter-item"
                            @click="handleCreate"
                            size="small"
                            type="primary"
                            icon="el-icon-circle-plus">添加</el-button>
                        <el-button class="filter-item"
                            @click="handleDeleteMore"
                            size="small"
                            type="primary"
                            icon="el-icon-delete">删除</el-button>
                        <el-button class="filter-item"
                            @click="handlePassMore"
                            size="small"
                            type="primary"
                            icon="el-icon-circle-check">启用</el-button>
                        <el-button class="filter-item"
                            @click="handleUnpassMore"
                            size="small"
                            type="primary"
                            icon="el-icon-circle-close">禁用</el-button>  
                    </template>

                    <template slot="menu" slot-scope="scope">
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row,scope.index)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row,scope.index)">删除</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-circle-check-outline"
                            v-if="scope.row.status != 1"
                            @click="handlePass(scope.row,scope.index)">启用</el-button>
                        <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-remove-outline"
                            v-if="scope.row.status == 1"
                            @click="handleUnpass(scope.row,scope.index)">禁用</el-button>
                    </template>
                </avue-curd>
            </div>
        </basic-container>
    </div>
</template>

<script>
import {fetchList, addObj, delObj,getObj, editObj,getCodeDetailFromDB,pass, unpass,checkName,checkCode} from '@/api/aggregation/gateway'
import {mapGetters} from 'vuex'
import { tableOption } from "@/const/crud/aggregation/gateway";
export default {
    name:'gate',
    data(){
        return{
            tableOption: tableOption,
            tableData:[],
            page: {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10 // 每页显示多少条
            },
            listLoading: true,
            form: {},


        }
    },

    created(){
        this.getType();

    },

    methods:{
        //初始化加载数据
        getList(){
            fetchList(Object.assign({
                current : this.page.currPage,
                size :this.page.pageSize
            })).then(response => {
                this.tableData = response.data.data.records
                this.page.total = response.data.data.total
            })
        },
         //每页记录数发生变化时，动态改变
        handleSizeChange(val){
            this.page.pageSize = val;  
            this.getList();
        },
        //页码改变
        handleCurrentChange(val){
            this.page.currPage = val;   
            this.getList()
        },
        //加载字典项
        getType(){
            getCodeDetailFromDB("gateway_type").then(response => {
                this.gatewaytypeOptions = response.data.data;
            });
            getCodeDetailFromDB("identity_type").then(response =>{
                this.identityOptions = response.data.data
            });
        },
        //门户类型进行格式化展示
        formatGatewayType(row){
            for(var i = 0 ; i < this.gatewaytypeOptions.length ; i++){
                if(this.gatewaytypeOptions[i].value == row.type){
                    return this.gatewaytypeOptions[i].label;
                }
            }
        },
        //启用/禁用状态
        formatStatus(row,column){
            if(row.status == 1){
                this.status = true;
                return "启用";
            }else{
                this.status == false;
                return "禁用";
            }
        },
        //身份类型进行格式化展示
        formatIdentity(row){
            for(var i = 0 ;i < this.identityOptions.length ; i++){
                if(this.identityOptions[i].value == row.identity){
                    return this.identityOptions[i].label;
                }
            }
        },
        //新增按钮
        handleCreate(){
            this.$refs.curd.rowAdd();
        },
        //新增确定
        create(row,done,loading){
            addObj(this.form).then(response => {
                this.getList(this.page);
                done();
                this.$notify({
                    title: "成功",
                    message: "创建成功",
                    type: "success",
                    duration: 2000
                });
            }).catch(() => {
                loading();
            });
        },
        //编辑按钮
        handleUpdate(row, index) {
            this.$refs.crud.rowEdit(row, index);
        },
        //编辑
        update(row, index, done, loading){
            editObj(this.form).then(response =>{
                this.getList(this.page);
                done();
                this.$notify({
                    title: "成功",
                    message: "创建成功",
                    type: "success",
                    duration: 2000
                });
            }).catch(() => {
                loading();
            })
        },

    },
}
</script>

<style>

</style>
