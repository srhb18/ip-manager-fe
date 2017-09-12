<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 应用管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="handle-del" @click="createApp">新建应用</el-button>
            <el-button type="danger" icon="delete" class="handle-del" :disabled="canDelete" @click="batchDelete">批量删除</el-button>
            <el-input v-model="keyword" placeholder="按应用名称、管理员名称搜索" class="handle-input"></el-input>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="tableList" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" sortable width="120" />
            <el-table-column prop="name" label="名称" width="120" />
            <el-table-column prop="managerInfo" label="管理员" />
            <el-table-column prop="description" label="备注" />
            <el-table-column label="操作" width="180">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change ="handleCurrentPageChange"
                layout="total, prev, pager, next"
                :page-size="15"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {purify} from '../lib/util';

export default {
    data() {
        return {
            appList: [],
            totalCount: 0,
            currentPage: 1,
            selectedItems: [],
            keyword: ''
        }
    },
    created(){
        this.getAppList();
    },
    computed: {
        tableList() {
            return this.appList.map(
                item => {
                    const {managerName, managerTel} = item;
                    const managerInfo = `${managerName}(${managerTel})`;
                    return {...item, managerInfo};
                }
            );
        },
        canDelete() {
            return !(this.selectedItems.length > 0);
        }
    },
    methods: {
        getAppList() {
            const params = {
                pageNo: this.currentPage,
                keyword: this.keyword
            };
            this.$axios.get(
                'http://127.0.0.1:3000/api/js/apps',
                {
                    params: purify(params)
                }
            ).then(results => {
                this.appList = results.data.results;
                this.totalCount = results.data.totalCount;
                this.selectedItems = [];
            });
        },
        search() {
            this.getAppList();
        },
        handleCurrentPageChange(pageNo) {
            this.currentPage = pageNo;
            this.getAppList();
        },
        handleSelectionChange(selectedItems) {
            this.selectedItems = selectedItems;
        },
        handleEdit(index, row) {
            this.$router.push({path: `/app/update/${row.id}`});
        },
        handleDelete(index, row) {
            this.batchOption([row.id], 'remove');
        },
        createApp() {
            this.$router.push({path: '/app/create'});
        },
        batchDelete() {
            const ids = this.selectedItems.map(({id}) => id);
            this.batchOption(ids, 'remove');
        },
        batchOption(ids, targetStatus) {
            const status = 0;
            this.$axios.post(
                'http://127.0.0.1:3000/api/js/apps/batch',
                {ids, status}
            ).then(this.getAppList);
        }

    }
}
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>