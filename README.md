# Slimly 🔗

**The ultimate link shortener with premium aesthetics.**

Slimly is a high-performance URL shortening application built with Next.js, focused on providing a stunning user experience and deep analytical insights.

[**View the Product Walkthrough 🚀**](./WALKTHROUGH.md)

---

## ✨ Features (Phase 1)
- **Premium UX**: Glassmorphism design system with high-precision GSAP animations.
- **Persistent Analytics**: Robust Mixpanel integration with "Sticky ID" session tracking.
- **Dynamic Previews**: Real-time short link previews with QR code generation.
- **Branding Engine**: Configuration-driven theme and messaging system.

## 🛠️ Tech Stack
- **Framework**: [Next.js 14+](https://nextjs.org) (App Router)
- **Animation**: [GSAP](https://gsap.com)
- **Analytics**: [Mixpanel](https://mixpanel.com)
- **Database**: [Firebase](https://firebase.google.com)
- **Styling**: Vanilla CSS with modern tokens.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Mixpanel Token
- A Firebase Project

### Installation Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/lilithfactor/slimly.git
   cd slimly
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   # ... add other firebase config items
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) to see Slimly in action.

---

## 📝 Product Handover
For technical trade-offs, architectural decisions, and the roadmap to Phase 2, please refer to the [Phase 1 Conclusion](./context/specific/conclusion.md).
