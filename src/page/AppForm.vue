<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> 应用管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{formType === 'create' ? ' 新建' : ' 修改'}}应用</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="entity" :rules="rules" label-position="top" label-width="100px">
                <el-form-item label="应用名称" prop="name">
                    <el-input v-model="entity.name"></el-input>
                </el-form-item>
                <el-form-item label="管理员姓名" prop="managerName">
                    <el-input v-model="entity.managerName"></el-input>
                </el-form-item>
                <el-form-item label="管理员电话" prop="managerTel">
                    <el-input v-model="entity.managerTel"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="description">
                    <el-input type="textarea" v-model="entity.description"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                entity: {
                    name: '',
                    managerName: '',
                    managerTel: '',
                    description: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入应用名称', trigger: 'blur'},
                        {min: 5, max: 40, message: '长度为3到40个字符', trigger: 'blur'}
                    ],
                    managerName: [
                        {required: true, message: '请输入管理员姓名', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度为1到20个字符', trigger: 'blur'}
                    ],
                    managerTel: [
                        {required: true, message: '请输入管理员电话', trigger: 'blur'},
                        {pattern: /^(\d+)-?(\d)+(-(\d)+)*$/, message: '请输入正确的电话格式', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            if (this.formType === 'update') {
                this.getFormData();
            }
        },
        computed: {
            formType() {
                return this.$route.params.id ? 'update' : 'create';
            },
            id() {
                return this.$route.params.id || null;
            }
        },
        methods: {
            getFormData() {
                this.$axios.get(
                    'http://127.0.0.1:3000/api/js/apps/' + this.id,
                    {
                        params: {
                            id: this.id
                        }
                    }
                ).then(result => {
                    const {id, name, managerName, managerTel, description} = result.data;
                    this.entity = {
                        ...this.entity,
                        ...result.data
                    };
                });
            },
            onSubmit() {
                const form = this.$refs['form'].validate(
                    valid => {
                        if (valid) {
                            const method = this.formType === 'create' ? 'post' : 'put';
                            const url = this.formType === 'create'
                                ? 'http://127.0.0.1:3000/api/js/apps'
                                : `http://127.0.0.1:3000/api/js/apps/${this.id}`
                            this.$axios[method](
                                url,
                                {
                                    ...this.entity
                                }
                            ).then(
                                () => {
                                    const actionName = this.formType === 'create' ? '新建' : '修改';
                                    this.$message.success(`${actionName}应用成功`);
                                    this.$router.go(-1);
                                }
                            );
                        }
                        else {
                            return false;
                        }
                    }
                )
            },
            onCancel() {
                this.$router.go(-1);
            }
        }
    }
</script>