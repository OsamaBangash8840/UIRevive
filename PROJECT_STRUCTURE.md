# 🚀 Premier Vehicles Website V2 - Beginner Developer Guide

Welcome to the **Premier Vehicles Website V2** repository! This document is designed for new developers joining the codebase. It explains how the project is organized, where key features live, and how everything connects together.

---

## 🛠️ Tech Stack Overview

- **Framework**: Next.js 14 (App Router)
- **Language**: JavaScript (ES6+ / JSX)
- **Styling**: Tailwind CSS, PostCSS
- **Internationalization (i18n)**: `next-intl` (Multi-language support for English `/en` and Urdu `/ur`)
- **Icons**: `lucide-react` & `react-icons`
- **UI Libraries**: Radix UI, Framer Motion, Swiper, React Select, React Phone Number Input

---

## 📂 Project Directory Structure

Here is a breakdown of the codebase directory by directory:

```
Premier-Vehicles-Website-Version-2/
├── messages/                  # 🌐 Translation dictionaries
│   ├── en.json                # English text strings
│   └── ur.json                # Urdu text strings
│
├── public/                    # 🖼️ Static assets & images
│   └── assets/                # Logos, SVG icons, banners, & company images
│
├── src/                       # 💻 Main Source Code Directory
│   ├── app/                   # Next.js App Router core
│   │   ├── [locale]/          # 🌍 Internationalized Page Routes ([locale] = en | ur)
│   │   │   └── (pages)/       # Main Application Pages
│   │   │       ├── homepage/  # Landing Home Page
│   │   │       ├── dashboard/ # Vendor / Merchant Business Dashboard
│   │   │       │   ├── layout.js            # Full-screen Dashboard Shell Layout
│   │   │       │   └── rent-a-car/          # Rental Vendor Routes
│   │   │       │       └── ownerProfile/    # Owner Profile Page (/dashboard/rent-a-car/ownerProfile)
│   │   │       ├── cars/      # Vehicle Listings Page
│   │   │       ├── bikes/     # Bike Listings Page
│   │   │       ├── autoparts/ # Auto Parts Page
│   │   │       ├── rent-a-car/# Rent A Car listings
│   │   │       ├── chat/      # Messaging / Chat System Pages
│   │   │       └── profile/   # Customer Profile Page
│   │   │
│   │   ├── api/               # ⚡ API Handlers
│   │   │   ├── auth/          # Authentication API routes
│   │   │   └── google/        # Google Auth integration endpoints
│   │   │
│   │   ├── components/        # 🧩 Reusable React UI Components
│   │   │   ├── commnon/       # 🎨 Shared Design System Components
│   │   │   │   ├── inputField/     # Reusable text input field (<InputField />)
│   │   │   │   ├── passwordField/  # Password input with eye toggle (<PasswordField />)
│   │   │   │   ├── phoneField/     # Country picker phone input (<PhoneNumberInput />)
│   │   │   │   ├── SelectField/    # Custom dropdown select (<SelectField />)
│   │   │   │   ├── primaryBtn/     # Standard action buttons (<PrimaryButton />)
│   │   │   │   ├── typography/     # Styled headings & text (<Typography />)
│   │   │   │   ├── AppLink/        # i18n Aware Next.js Link (<AppLink />)
│   │   │   │   └── Modal/          # Reusable Modal dialog (<Modal />)
│   │   │   │
│   │   │   ├── dashboard/     # 📊 Vendor Dashboard Components
│   │   │   │   ├── Sidebar.jsx      # Left Navigation Sidebar (Desktop & Mobile Drawer)
│   │   │   │   ├── form/            # Dashboard form elements (UploadField, etc.)
│   │   │   │   └── rentACar/        # Rent A Car vendor components
│   │   │   │       ├── OwnerProfile.jsx  # Vendor profile form
│   │   │   │       ├── Profile.jsx       # Profile completion progress banner
│   │   │   │       └── Subscription.jsx  # Vendor subscription card
│   │   │   │
│   │   │   ├── homeScreen/    # Home page hero sections & grids
│   │   │   ├── layouts/       # Site Navigation & Footer layouts
│   │   │   ├── product/       # Vehicle cards & post ad workflows
│   │   │   ├── productDetails/# Vehicle detail specs & photo gallery
│   │   │   └── user/          # User edit profile components
│   │   │
│   │   ├── utils/             # 🛠️ Helper Utilities
│   │   │   ├── authToken.js   # JWT / Token storage handlers
│   │   │   ├── colours.js     # Color tokens & theme constants
│   │   │   └── constants.js   # Site configuration & dropdown options
│   │   │
│   │   ├── hooks/             # Custom React Hooks (e.g., useOutsideAlert)
│   │   └── globals.css        # Global CSS styles & Tailwind directives
│   │
│   ├── middleware.js          # Next-intl middleware for locale routing
│   └── routing.js             # Internationalized navigation helpers (usePathname, useRouter)
│
├── tailwind.config.js         # Tailwind CSS theme customization
└── package.json               # Project dependencies and script runner
```

---

## 🗺️ How Routing Works in Next.js 14 App Router

This project uses Next.js 14 **App Router** with `next-intl` internationalized routing.

### Example Route Mapping:
| Browser URL | Project File Location | Rendered Main Component |
|---|---|---|
| `http://localhost:3000/en` | `src/app/[locale]/(pages)/page.js` | `<HomeScreen />` |
| `http://localhost:3000/en/dashboard/rent-a-car` | `src/app/[locale]/(pages)/dashboard/rent-a-car/page.js` | Rent A Car Dashboard view |
| `http://localhost:3000/en/dashboard/rent-a-car/ownerProfile` | `src/app/[locale]/(pages)/dashboard/rent-a-car/ownerProfile/page.js` | `<OwnerProfile />` |

---

## 🧩 Component Architecture Rules

1. **`src/app/components/commnon/`**: Shared atomic UI elements (Inputs, Buttons, Modals, Selects). Always use these components across the app to maintain visual consistency.
2. **`src/app/components/dashboard/`**: Specific components built for vendor management (e.g., `OwnerProfile.jsx`, `Sidebar.jsx`, `Subscription.jsx`).
3. **Responsive Design**: Form fields use flex containers (`flex flex-col sm:flex-row gap-4 w-full`) so they stack vertically on mobile screens (`flex-col`) and split side-by-side on desktop (`sm:flex-row`).

---

## 🚦 Common Commands

- **Start Dev Server**: `npm run dev` (Runs locally on `http://localhost:3000`)
- **Build Project**: `npm run build`
- **Lint Code**: `npm run lint`
