<template>
    <div class="main">
        <el-row :gutter="16">
            <el-col :span="12">
                <Config ref="config" />
                <el-upload
                    class="mt16 mb16"
                    multiple
                    action="post"
                    :auto-upload="false"
                    :on-change="fileChangle"
                >
                    <el-button size="small" type="primary">选择文件</el-button>
                </el-upload>
                <el-button class="mt16" size="small" type="primary" @click="generate">点击生成配置</el-button>
            </el-col>
            <el-col :span="12">
                <JsonEditor v-model:value="authzConfig.config" :options="editorOptions" style="height: calc(100vh - 16px)" />
            </el-col>
        </el-row>
    </div>
</template>
<script lang="ts" setup>
import XLSX from 'xlsx'
import { ref, Ref, reactive, toRaw, watch } from 'vue'
import { UploadFile } from 'element-plus/es/el-upload/src/upload.type'

import Config from './components/Config.vue'
import { parse, ParseConfig } from '../../core/parse'
import JsonEditor from '../../components/JsonEditor/index.vue'

const files:Array<File> = []
let config: Ref<Config | null> = ref()
let authzConfig = reactive({
    config: {},
})

const editorOptions = reactive({
    mode: 'view',
    modes: ['view', 'text', 'code'],
})

const parseTable = (file: File, config: ParseConfig) => {
    var reader = new FileReader()
    reader.onload = (e) => {
        var data = new Uint8Array(e.target?.result as ArrayBuffer)
        var workbook = XLSX.read(data, {type: 'array'})
        
        const conf = parse(workbook, config.excelConfig, config.transformOptions)
        authzConfig.config = conf
    }
    reader.readAsArrayBuffer(file)
}

const fileChangle = (file:UploadFile, fileList: Array<File>) => {
    files.push(file.raw)
}

const generate = () => {
    const c: ParseConfig = toRaw(config.value.state)
    parseTable(files[0], c)
}

</script>
<style>
.main {
    width: 1200px;
    margin: 0 auto;
}
</style>