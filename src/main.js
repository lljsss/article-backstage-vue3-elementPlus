import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale'
locale.use(lang)
// import 'normalize.css'
import { 
  ElButton,ElForm,ElFormItem,ElInput,ElCheckbox,ElMessage,
  ElContainer,ElAside,ElHeader, ElMain, ElMenu, ElMenuItem, 
  ElIcon, ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessageBox, 
  ElCard,ElBreadcrumb, ElBreadcrumbItem, ElRadioGroup, ElRadio, ElSelect,
  ElOption,ElDatePicker, ElTable, ElImage,ElTableColumn, ElTag, ElPagination, 
  ElRadioButton,ElRow,ElCol, ElDialog, ElUpload, ElTabs, ElTabPane, ElAvatar, ElSwitch,
  
} from 'element-plus';



createApp(App).use(store).use(router).
use(ElButton).use(ElFormItem).use(ElForm).use(ElInput).use(ElCheckbox).
use(ElMessage).use(ElContainer).use(ElAside).use(ElHeader).use(ElMain).
use(ElMenu).use(ElMenuItem).use(ElIcon).use(ElDropdown).use(ElDropdownMenu).
use(ElDropdownItem).use(ElMessageBox).use(ElCard).use(ElBreadcrumb).
use(ElBreadcrumbItem).use(ElRadioGroup).use(ElRadio).use(ElSelect).
use(ElOption).use(ElDatePicker).use(ElTable).use(ElImage).use(ElTableColumn).
use(ElTag).use(ElPagination).use(ElRadioButton).use(ElRow).use(ElCol).
use(ElDialog).use(ElUpload).use(ElTabs).use(ElTabPane).use(ElAvatar).use(ElSwitch)
.mount('#app')