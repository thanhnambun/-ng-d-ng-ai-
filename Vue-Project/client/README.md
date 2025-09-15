# Learning Management System - Client

## 🚀 Setup Instructions

### Prerequisites
- Node.js v16+ and npm
- JSON Server for backend API

### 1. Environment Configuration

Create a `.env` file in the `client/` directory:

```bash
# API Configuration
VITE_APP_API_URL=http://localhost:3000
VITE_APP_API_TIMEOUT=10000

# App Configuration
VITE_APP_TITLE=Learning Management System
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# Feature Flags
VITE_APP_ENABLE_ANALYTICS=false
VITE_APP_ENABLE_ERROR_REPORTING=true
VITE_APP_ENABLE_PERFORMANCE_MONITORING=false
VITE_APP_DEBUG=true
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start JSON Server (Backend)

In a separate terminal, navigate to the server directory:

```bash
cd ../server
npm install
npm run dev
```

This will start the JSON Server on http://localhost:3000

### 4. Start Development Server

```bash
npm run dev
```

The client application will be available at http://localhost:5173

## 🛠️ Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
client/
├── src/
│   ├── components/       # Reusable components
│   │   ├── admin/       # Admin-specific components
│   │   ├── common/      # Base components (BaseModal, BaseForm, etc.)
│   │   └── user/        # User-facing components
│   ├── views/           # Page components
│   │   ├── admin/       # Admin pages
│   │   └── user/        # User pages
│   ├── composables/     # Vue composables
│   ├── services/        # API services
│   ├── store/           # Vuex store modules
│   ├── styles/          # CSS architecture
│   │   ├── base.css     # Reset & base styles
│   │   ├── components.css # Component styles
│   │   ├── layout.css   # Layout styles
│   │   ├── utilities.css # Utility classes
│   │   └── variables.scss # SCSS variables
│   ├── utils/           # Utility functions
│   └── config/          # Configuration files
├── public/              # Static assets
└── dist/               # Production build output
```

## 🔧 Configuration

### API Configuration
The application uses centralized API configuration:
- Base URL: Configure via `VITE_APP_API_URL`
- All API calls use the `buildApiUrl()` helper from `@/utils/api.js`
- No hardcoded URLs in components

### Port Configuration
- **Client (Vite)**: Default port 5173
- **Server (JSON Server)**: Default port 3000

To change server port:
```bash
cd server
npm run dev:port 3001  # Custom port
```

Then update your `.env` file:
```bash
VITE_APP_API_URL=http://localhost:3001
```

### CSS Architecture
The project uses a modern CSS architecture:
- **Tailwind CSS**: Utility-first framework
- **SCSS Variables**: For theming and consistency
- **Component Classes**: Reusable button, card, form styles
- **Layout System**: Admin/User layout patterns

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```bash
VITE_APP_API_URL=https://your-api-domain.com
VITE_APP_ENV=production
VITE_APP_DEBUG=false
```

## 🔑 Demo Accounts

The application includes demo accounts for testing:

- **Admin**: admin@demo.com / admin123
- **User**: user@demo.com / user123

## 🎨 Features

### Admin Dashboard
- User management
- Course management  
- Exam management
- Question management
- Real-time statistics

### User Interface
- Course browsing
- Exam taking
- Result viewing
- Profile management
- History tracking

### Technical Features
- **Vue 3 Composition API**
- **Vuex 4** for state management
- **Vue Router 4** with navigation guards
- **Tailwind CSS** for styling
- **Axios** for API calls
- **SweetAlert2** for notifications
- **FontAwesome** icons
- **Responsive design**

## 📱 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API Connection Issues
1. Verify JSON Server is running on port 3000
2. Check `.env` file configuration
3. Ensure no firewall blocking localhost connections

### Build Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is licensed under the MIT License.