# Harrison Munden Portfolio Website

## Overview
Designer portfolio website built with React + Vite, featuring 3D artwork galleries, print sales with cart/checkout, and animated page transitions. Deployed via GitHub Pages.

## Tech Stack
- **Framework**: React 18 with Vite 5
- **Routing**: React Router DOM (HashRouter for GitHub Pages compatibility)
- **Styling**: Tailwind CSS 3 + component-level CSS files
- **Animation**: Framer Motion (page transitions, layout animations)
- **3D**: Three.js, @react-three/fiber, @react-three/drei (ModelViewer for 3D artwork)
- **Email**: EmailJS (order notifications and customer confirmations)

## Commands
- `npm run dev` - Start dev server
- `npm run build` - Production build (outputs to `dist/`)
- `npm run preview` - Preview production build
- `npm run lint` - ESLint check

## Project Structure
```
src/
  App.jsx              # Root component, routing, shared navigation headers
  main.jsx             # Entry point
  index.css            # Global styles
  App.css              # App-level styles
  config/
    emailjs.js         # EmailJS service credentials
  contexts/
    CartContext.jsx     # Cart state management (React Context)
  hooks/
    useScrollToTop.js  # Scroll restoration on navigation
  components/
    Home.jsx           # Landing page
    About.jsx          # About page
    PrintsForSale.jsx  # Print artwork gallery with purchase
    RealtimeArtwork.jsx # 3D realtime artwork gallery
    ProfessionalWork.jsx # Professional work showcase
    Works.jsx          # Works grid display
    VideoGamePage.jsx  # Individual video game project pages
    PersonFigure.jsx   # Animated character figure (appears on multiple pages)
    ModelViewer.jsx     # 3D model viewer (Three.js)
    ImageCarousel.jsx   # Image carousel component
    CartPage.jsx        # Shopping cart page
    CartIcon.jsx        # Cart icon in navigation
    AddToCartModal.jsx  # Add to cart confirmation modal
    CheckoutModal.jsx   # Checkout flow modal
    hooks/
      useFadeInOnVisible.js  # Intersection Observer fade-in hook
    styles/
      about.css        # About page styles
      home.css         # Home page styles
public/                # Static assets (served directly, also in dist/ for GitHub Pages)
dist/                  # Production build output (tracked in git for GitHub Pages)
```

## Architecture Notes
- **Routing**: Uses HashRouter (`/#/path`) for GitHub Pages compatibility. Routes defined in `App.jsx`.
- **Navigation**: Shared animated headers (`SharedPrintsHeader`, `SharedRealtimeHeader`, `SharedProfessionalHeader`) in App.jsx use Framer Motion `layoutId` for smooth transitions.
- **Cart**: Global cart state via React Context (`CartProvider` wraps the app).
- **Assets**: Images are in `src/assets/` subdirectories (3DArtwork, VideoGameAssets, etc.) and `public/` for static files like GlassyObjects.
- **3D Models**: `ModelViewer.jsx` uses Three.js/R3F. Note: uses deprecated `sRGBEncoding`/`LinearEncoding` from Three.js (pre-existing warnings).
- **Deployment**: `dist/` is committed to git for GitHub Pages. `CNAME` file in root for custom domain.
- **Vite config**: Uses `base: './'` for relative paths (GitHub Pages).
