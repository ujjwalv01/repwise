# ⚡ RepWise - Train Smarter, Not Just Harder

RepWise is a state-of-the-art, AI-powered fitness and nutrition ecosystem designed to help you crush your health goals with precision and style. Built with a premium Glassmorphism design and powered by advanced AI models, RepWise turns complex data into actionable insights.

![RepWise Banner](public/og-image.png)

## 🌟 Key Features

### 🥗 AI Food Scanner & Nutrition Tracking
*   **Natural Language Logging**: Just type "I had two eggs and a slice of toast" and let the AI handle the macro breakdown.
*   **Photo Recognition**: Snap a photo of your meal for instant calorie and nutrient estimation.
*   **Real-time Macro Dashboard**: Track your daily protein, carbs, fats, and calories against personalized targets.

### 🏋️ Smart Workout Intelligence
*   **AI Plan Generator**: Custom workout routines generated instantly based on your goal (Lose Fat, Gain Muscle, Maintain, or Endurance).
*   **Flexible Locations**: Tailored exercises for Gym, Home, or Hybrid environments.
*   **Progressive Tracking**: Log your sets, reps, and rest times with ease.

### 💧 Interactive Hydration Tracker
*   **3D Water Bottle**: A beautiful, interactive 3D bottle that fills up as you log your water intake.
*   **Daily Goals**: Stay on top of your hydration with smart reminders and goal tracking.

### 📈 Progress Analytics
*   **Visual Trends**: Track your weight change and daily step counts over time.
*   **Personal Records (PRs)**: Celebrate your strongest moments with a dedicated PR showcase.
*   **Onboarding Engine**: A personalized setup flow that calculates your maintenance calories and macro splits using the Mifflin-St Jeor formula.

---

## 🎨 Design Philosophy
RepWise uses a **Premium Dark Glassmorphism** aesthetic:
*   **Modern Typography**: Utilizing Inter and JetBrains Mono for a high-tech feel.
*   **Interactive Elements**: Smooth Framer Motion animations and 3D scenes (Three.js/React Three Fiber).
*   **Mobile-First**: Fully optimized for mobile devices with responsive grids and touch-friendly navigation.

---

## 🛠️ Tech Stack
*   **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **AI Engine**: [Groq AI (Llama 3)](https://groq.com/)
*   **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
*   **ORM**: [Prisma](https://www.prisma.io/)
*   **Auth**: [NextAuth.js (Google OAuth)](https://next-auth.js.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **3D / Animations**: [Three.js](https://threejs.org/), [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ujjwalv01/repwise.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   DATABASE_URL="your_postgresql_url"
   GROQ_API_KEY="your_groq_key"
   AUTH_SECRET="your_nextauth_secret"
   GOOGLE_CLIENT_ID="your_google_id"
   GOOGLE_CLIENT_SECRET="your_google_secret"
   CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
   CLOUDINARY_API_KEY="your_cloudinary_key"
   CLOUDINARY_API_SECRET="your_cloudinary_secret"
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📜 License
This project is licensed under the MIT License.

---

*Built with ❤️ by [Ujjwal](https://github.com/ujjwalv01)*
