# 🏢 Enterprise Business Management App

A modern, full-featured multi-outlet business management system built with React, TypeScript, Firebase, and Vite. Manage multiple outlets, track sales, analyze performance, and leverage AI-powered insights.

## ✨ Features

- **Multi-Outlet Management** - Create and manage multiple business outlets
- **Sales Entry & Tracking** - Record and monitor sales transactions in real-time
- **Manager Dashboard** - Comprehensive analytics and performance metrics
- **Firebase Integration** - Secure cloud database with real-time sync
- **AI-Powered Insights** - Gemini AI integration for intelligent analytics
- **Modern UI** - Built with Radix UI components and responsive design

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or later) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/download/win)
- **Firebase Account** - [Create one here](https://firebase.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "New folder"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   
   a. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
   
   b. Open `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_DATABASE_URL=your_database_url_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 🔧 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

### 2. Enable Firestore Database

1. In your Firebase project, go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** or **test mode** (for development)
4. Choose a location closest to your users

### 3. Configure Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /outlets/{outlet} {
      allow read, write: if true; // Update with proper auth rules
    }
    match /sales/{sale} {
      allow read, write: if true; // Update with proper auth rules
    }
  }
}
```

### 4. Get Your Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the **Web** icon (`</>`)
4. Register your app and copy the configuration
5. Add these values to your `.env` file

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `build/` directory.

## 🔐 Security Notes

- **Never commit `.env` files** - They contain sensitive credentials
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use `.env.example` as a template for other developers
- Update Firebase security rules before deploying to production

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Firebase** - Backend and database
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization
- **Lucide React** - Icon library

## 📁 Project Structure

```
├── src/
│   ├── lib/
│   │   ├── firebase.ts      # Firebase configuration
│   │   └── gemini.ts        # AI integration
│   ├── screens/
│   │   ├── OutletSelection.tsx
│   │   ├── SalesEntry.tsx
│   │   └── ManagerDashboard.tsx
│   └── ...
├── .env                     # Your Firebase credentials (gitignored)
├── .env.example             # Template for environment variables
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🔗 Resources

- [Original Figma Design](https://www.figma.com/design/JEKDCzLY4brzVTjRSQx6lH/Enterprise-Business-Management-App)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)

  