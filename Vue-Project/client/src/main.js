import './styles/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'

// Ant Design Icons
import { SearchOutlined, CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons-vue'

// FontAwesome setup
import '@fortawesome/fontawesome-free/css/all.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// FontAwesome icons
import { 
  faBuilding, 
  faUsers, 
  faShop, 
  faCircleInfo, 
  faShieldHalved, 
  faTruckFast, 
  faBlog, 
  faCircleQuestion, 
  faHandshake, 
  faHeart 
} from '@fortawesome/free-solid-svg-icons'

import { 
  faFacebook, 
  faTwitter, 
  faGithub, 
  faInstagram 
} from '@fortawesome/free-brands-svg-icons'

// Add icons to library
library.add(
  faBuilding, 
  faUsers, 
  faShop, 
  faCircleInfo, 
  faShieldHalved, 
  faTruckFast, 
  faBlog, 
  faCircleQuestion, 
  faHandshake, 
  faHeart,
  faFacebook, 
  faTwitter, 
  faGithub, 
  faInstagram
)

// Create Vue app
const app = createApp(App)

// Register global components
app.component('SearchOutlined', SearchOutlined)
app.component('CaretUpOutlined', CaretUpOutlined)
app.component('CaretDownOutlined', CaretDownOutlined)
app.component('FontAwesomeIcon', FontAwesomeIcon)

// Use plugins
app.use(router)
app.use(store)

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component instance:', instance)
  console.error('Error info:', info)
  
  // Có thể gửi lỗi lên monitoring service như Sentry
  // sendErrorToMonitoring(err, instance, info)
}

// Global warning handler for development
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Vue warning:', msg)
    console.warn('Component trace:', trace)
  }
}

// Performance monitoring in development
if (import.meta.env.DEV) {
  app.config.performance = true
}

// Mount the app
app.mount('#app')