import { createApp } from 'vue'
import App from './App.vue'

import { ElUpload, ElButton } from 'element-plus'
import 'element-plus/packages/theme-chalk/src/base.scss'

const app = createApp(App)

const components = [ ElUpload, ElButton ]
components.forEach(component => {
    app.component(component.name, component)
})

app.mount('#app')
