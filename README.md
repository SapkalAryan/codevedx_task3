# 🎬 Cine Buddy

Cine Buddy is a dynamic, modern movie discovery web application built with React, Vite, and the TMDB (The Movie Database) API. Featuring a fluid, gesture-driven recommendation stack and a robust dual-mode search system, it delivers an optimized, mobile-first cinematic browsing experience.

---

## ✨ Features

### 1. 🎴 Smart Recommendation Stack
* **Gesture-Driven UX:** Swipe through personalized movie recommendations with hardware-accelerated, high-performance transitions powered by customized pointer tracking.
* **Intelligent Caching:** Implements automated `sessionStorage` caching to reduce API overhead, with smart cache invalidation triggering instantly when updating your profile or watchlists.

### 2. 🔍 Advanced Dual-Mode Search
* **Simple Search:** Real-time text searching combined with powerful dynamic client-side filtering (by genres, release year range, rating, and language).
* **Match Search (Co-Viewing):** Input separate preferences for **You** and a **Partner**, select a matching logic (*Any genre picked* or *Must match both*), and discover movies that perfectly satisfy both parties.
* **Persistent State Across Routes:** Utilizing a tailored `sessionStorage` snapshot technique, search queries, filter matrices, current results, and layout state persist seamlessly when navigating in and out of movie detail pages.

### 3. 💾 Personal Collections
* **Watchlist:** Save titles you plan to watch later, accessible globally with instant removal toggles.
* **My Movies (Watched History):** Maintain a log of movies you've already watched, linked cleanly via a dedicated entry point in the header.

### 4. 🎨 Responsive Design & Architecture
* Fully optimized for all device form factors (2-column grid on Mobile, 3 on Tablet, and 5 on Desktop).
* Built using highly modular components, clean custom hooks (`useCardSwipe`), and strict utility-first layout structures.

---

## 🛠️ Tech Stack

* **Frontend Framework:** React 18 (Functional Components, Hooks)
* **Build Tool:** Vite (Ultra-fast HMR and bundling)
* **Styling:** CSS3 (Variables, Flexbox/Grid layouts, custom `@keyframes` animations)
* **Icons:** React Icons (`react-icons`)
* **Routing:** React Router DOM v6
* **Data Provider:** TMDB API (The Movie Database)

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/Cine-Buddy.git](https://github.com/YOUR_USERNAME/Cine-Buddy.git)
   cd Cine-Buddy