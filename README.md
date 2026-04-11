# 🏦 Jio Finserv Mobile App

A production-ready fintech mobile application built with **React Native**, **Expo**, **TypeScript**, and **Expo Router**. This app features a complete loan management system with authentication, EMI calculator, and user profiles.

## ✨ Features

- 🎯 **Home Screen** - Carousel showcasing loan products, features, testimonials, and FAQs
- 💰 **EMI Calculator** - Real-time calculations for monthly EMI, total amount, and interest
- 📋 **About Section** - Company mission, vision, and values
- 📞 **Contact Form** - Get in touch with office locations and contact info
- 👤 **User Profile** - Authentication flow with login/signup screens
- 🔐 **Authentication** - Secure login and signup with validation
- 🎨 **Beautiful UI** - Fintech design with warm mustard orange theme
- 📱 **Responsive Design** - Mobile-first architecture
- ⚡ **Smooth Navigation** - Bottom tabs + stack navigation
- 🔄 **Carousel** - Horizontal scrollable banners
- 🎯 **Reusable Components** - Modular UI component library

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.x
- npm or yarn
- expo-cli >= 5.x

### Installation

```bash
# Navigate to frontend directory
cd apps/frontend

# Install dependencies
npm install
```

### Development

```bash
# Start Expo development server
expo start

# Follow terminal options to run on:
# i - iOS Simulator
# a - Android Emulator
# w - Web Browser
```

## 📱 Screens & Navigation

### Main Screens
- **Home** (`/`) - Landing page with all features
- **(Tabs) Home** (`/(tabs)`) - Home tab with stats and featured loans
- **About** (`/(tabs)/about`) - Company information
- **EMI Calculator** (`/(tabs)/emi-calculator`) - Calculate loan EMI
- **Contact** (`/(tabs)/contact`) - Contact form and office info
- **Profile** (`/(tabs)/profile`) - User profile & authentication

### Auth Screens
- **Login** (`/auth/login`) - User login with email/password
- **Sign Up** (`/auth/signup`) - Create new account with validation

## 🎨 Design System

### Brand Colors
- **Primary**: #D58F16 (Warm Mustard Orange)
- **Secondary**: #CDC58E (Soft Olive Beige)
- **Accent**: #F1B643 (Golden Yellow)
- **Neutral**: #BDBBBC (Light Cool Gray)
- **Dark**: #252A39 (Dark Navy Charcoal)

All colors are centralized in `constants/colors.ts`.

## 🧩 Component Architecture

### Reusable Components
- **Header** - Logo + CTA button
- **Carousel** - Horizontal scrollable banners with pagination
- **LoanCard** - Product card with icon and description
- **FeatureCard** - Feature highlight card
- **TestimonialCard** - Customer testimonial with rating
- **FAQ** - Accordion-style FAQ component

## 📂 Project Structure

```
app/
├── _layout.tsx          # Root navigation
├── index.tsx            # Home screen
├── (tabs)/              # Tab navigation group
│   ├── _layout.tsx      # Tab configuration
│   ├── index.tsx        # Home tab
│   ├── about.tsx        # About tab
│   ├── emi-calculator.tsx
│   ├── contact.tsx
│   └── profile.tsx
├── auth/
│   ├── login.tsx
│   └── signup.tsx
└── modal.tsx

components/
├── Header/
├── Carousel/
├── LoanCard/
├── FeatureCard/
├── TestimonialCard/
├── FAQ/
└── [other UI components]

constants/
├── colors.ts            # Brand color palette
└── theme.ts

hooks/
├── use-color-scheme.ts
└── use-theme-color.ts
```

## 🔧 Technology Stack

- **Framework**: React Native + Expo
- **Routing**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Styling**: React Native StyleSheet (no inline styles)
- **Navigation**: React Navigation + Expo Router
- **Components**: Functional components with hooks

## 📝 Key Files

- `ARCHITECTURE.md` - Complete architectural documentation
- `QUICKSTART.md` - 5-minute quick start guide
- `app/_layout.tsx` - Root layout & navigation setup
- `constants/colors.ts` - Brand colors & theme

## 🎯 Navigation Flow

```
Root (_layout.tsx)
├── Home Screen (index.tsx)
├── Tabs Navigation ((tabs)/_layout.tsx)
│   ├── Home Tab
│   ├── About
│   ├── EMI Calculator
│   ├── Contact
│   └── Profile
└── Auth Navigation
    ├── Login
    └── Sign Up
```

## 💡 Features Breakdown

### Home Screen
- Header with "Get Started" CTA → Routes to Login
- Carousel with 5 loan products
- Loan categories grid (Personal, Home, Auto, Business)
- Why Choose Us features (2x2 grid)
- Customer testimonials carousel
- FAQ accordion
- Quick stats (customers, loans disbursed)

### EMI Calculator
- Loan amount input with quick buttons (50K, 100K, 500K, 1M)
- Interest rate input with quick buttons (8%, 10%, 12%, 15%)
- Tenure input with quick buttons (12mo, 24mo, 36mo, 60mo)
- Real-time calculation engine
- Detailed breakdown display
- Reset functionality

### Authentication
- **Login**: Email, password, remember me, forgot password
- **Sign Up**: Full validation, password strength indicator, terms acceptance
- **PSD Requirements**: 8+ chars, uppercase, lowercase, numbers
- **Social Login**: Google & Apple options (placeholder)

### Profile
- **If Logged Out**: Show login/signup prompts with benefits
- **If Logged In**: Show user info, active loans, settings, logout

## 🚀 Building & Deployment

### Build for iOS
```bash
expo build:ios
```

### Build for Android
```bash
expo build:android
```

### Configure EAS Build
```bash
eas build -p ios
eas build -p android
```

## 🔐 About This Version

This is a **production-ready** frontend structure with:
- ✅ Complete file-based routing
- ✅ Modular, reusable components
- ✅ Consistent design system
- ✅ Type safety with TypeScript
- ✅ Mobile-first responsive design
- ✅ Dummy data ready for API integration
- ✅ Form validation & error handling
- ✅ Smooth animations & transitions

**Status**: Ready for development ✅
**Next**: Connect to backend API & database

## 📚 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Full architectural guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick start in 5 minutes
- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)

## 🆘 Troubleshooting

**App won't start?**
```bash
expo start -c  # Clear cache
```

**Navigation not working?**
- Check file names (case-sensitive)
- Verify folder structure matches `app/` directory
- Restart Expo server

**Styling issues?**
- Ensure using `constants/colors.ts` for colors
- Use `StyleSheet.create()` for all styles
- No inline styles

## 👨‍💻 Development Tips

1. **Add New Route**: Create file in `app/` or `app/(tabs)/`, add to `_layout.tsx`
2. **Update Colors**: Edit `constants/colors.ts`, applies everywhere
3. **Reuse Components**: Import from `components/` folder
4. **Type Safety**: Always use TypeScript interfaces for props
5. **Testing**: Test on real device for best results

## 📞 Support

For questions or issues:
- 📖 See [ARCHITECTURE.md](./ARCHITECTURE.md)
- 📚 Check [Expo Docs](https://docs.expo.dev)
- 💻 Review [React Native References](https://reactnative.dev)

## 📄 License

Created for Jio Finserv. All rights reserved.

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Last Updated**: April 2026
