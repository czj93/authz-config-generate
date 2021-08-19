<template>
    <div class="config">
        <div>参数配置</div>
        <el-form :model="state" size="small">
            <el-form-item label="菜单区域信息">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.menuRow">
                            <el-input v-model="state.excelConfig.menuRow" placeholder="请输入起始行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.menuCol">
                            <el-input v-model="state.excelConfig.menuCol" placeholder="请输入起始列"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.menuRowCount">
                            <el-input v-model="state.excelConfig.menuRowCount" placeholder="请输入菜单行数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.menuColCount">
                            <el-input v-model="state.excelConfig.menuColCount" placeholder="请输入菜单列数"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="角色数据区域">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.rolesHeader.row">
                            <el-input v-model="state.excelConfig.rolesHeader.row" placeholder="请输入起始行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.rolesHeader.col">
                            <el-input v-model="state.excelConfig.rolesHeader.col" placeholder="请输入起始列"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.rolesHeader.rowCount">
                            <el-input v-model="state.excelConfig.rolesHeader.rowCount" placeholder="请输入行数"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.rolesHeader.colCount">
                            <el-input v-model="state.excelConfig.rolesHeader.colCount" placeholder="请输入列数"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="按钮区域信息">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.btnRow">
                            <el-input v-model="state.excelConfig.menuRow" placeholder="请输入起始行"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="excelConfig.btnCol">
                            <el-input v-model="state.excelConfig.menuCol" placeholder="请输入起始列"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="ClientId" prop="transformOptions.clientId">
                <el-row :gutter="16">
                    <el-col :span="6">
                        <el-input v-model="state.transformOptions.clientId"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { defineComponent } from 'vue'
import { ParseConfig } from '../../../core/parse'

const config: ParseConfig = {
    excelConfig: {
        menuRow: 2,
        menuCol: 0,
        menuRowCount: 16,
        menuColCount: 4,
        rolesHeader: {
            row: 1,
            col: 4,
            rowCount: 1,
            colCount: 3
        },
        btnRow: 2,
        btnCol: 3,
    },
    transformOptions: {
        clientId: 'test',
        scopeProps: {}
    }
}
// const state = reactive(config)

export default defineComponent({
    data() {
        return {
            state: config
        }
    }
})


</script>
<style>
.config .el-form > .el-form-item--small.el-form-item {
    margin-bottom: 0;
}
</style>