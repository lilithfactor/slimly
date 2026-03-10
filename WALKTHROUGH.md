# Slimly Product Walkthrough

Welcome to the visual and technical breakdown of **Slimly**—a premium, high-performance link shortener designed for impact. 

## ✨ Premium UI Features

### 🌈 Gooey Dynamic Background
Our global background isn't just a gradient. It's a high-performance **interactive gooey manifold** powered by custom shaders/GSAP.
- **Interactive**: The blobs react to your mouse movement.
- **Dynamic**: Colors are pulled directly from `branding.json` for instant theme swaps.

### 🎯 Custom Crosshair Cursor
We've replaced the generic browser cursor with a **context-aware crosshair**.
- **Adaptive**: It changes state (size, blur, color) when hovering over interactive elements.
- **Fizzy Feedback**: Triggers specialized GSAP 'pop' animations when clicking buttons or links.

### ✍️ Brand-Defining Hero
- **Rotating Sublines**: A seamless vertical carousel of value propositions.
- **Static Branding**: A punchy headline that anchors the brand identity.
- **Responsive Layout**: Perfectly centered and balanced gaps across mobile, tablet, and desktop.

## ⚡ Technical Excellence

### 💓 Optimistic UI & Hearts
The "Like" system feels instantaneous.
- **No Lag**: The heart fills and animates immediately on click.
- **Server Sync**: Firebase updates occur in the background, with automatic rollback on failure.
- **GSAP Powered**: High-performance animations for the 'pop' effect.

### 🔗 Smart URL Shortening
- **Custom Slugs**: Full control over your link identity.
- **Environment Aware**: The UI detects whether you're on `localhost` or production to show the correct domain prefix.
- **Auto-Copy**: Instant clipboard feedback when a link is generated.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock)
- **Database**: Firebase / Firestore
- **Font**: Manrope (Custom local loading)

---

> [!NOTE]
> This walkthrough is intended to showcase the core experience of Slimly. For development instructions, see [README.md](./README.md).
