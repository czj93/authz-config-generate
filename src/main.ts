import { createApp } from 'vue'
import App from './App.vue'
import './style/index.scss'

import {
    ElUpload,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElRow,
    ElCol,
} from 'element-plus'
import 'element-plus/packages/theme-chalk/src/base.scss'

const app = createApp(App)

const components = [
    ElUpload,
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElSelect,
    ElRow,
    ElCol,
]
components.forEach(component => {
    app.component(component.name, component)
})

app.mount('#app')
