# CollabDen 🎵

**Where Africa's Music Professionals Collaborate, Get Paid, and Grow.**

CollabDen is a specialized collaboration platform designed specifically for the African music industry. It streamlines the creative process by bringing file sharing, communication, project management, and payments into a single, cohesive ecosystem.

---

## Vision

Stop juggling disconnected tools. CollabDen solves the industry's fragmentation by providing music professionals with a unified space to manage their creative workflow from start to finish.

## Key Features

- **Seamless Collaboration**: Share high-quality audio files and project assets effortlessly.
- **Unified Communication**: Keep all project-related discussions in one place.
- **Project Management**: Track milestones, deadlines, and creative tasks geared towards music production.
- **Secure Payments**: Get paid for your work directly through the platform.
- **African-Centric**: Built from the ground up to address the unique needs and challenges of the African music landscape.

## Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Typography**: Raleway (Google Fonts)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm (or yarn/pnpm/bun)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/CollabDen-Africa/collabden-frontend.git
   cd collabden-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Contains the Next.js App Router routes and page definitions.
  - `about/`: About page.
  - `waitlist/`: Early access waitlist page.
  - `components/`: Reusable UI components.
    - `homepage/`: Hero, Features, and How-it-works sections.
    - `layout/`: Navbar, Footer, etc.
    - `ui/`: Fundamental UI elements (Buttons, Cards, etc.)
- `public/`: Static assets (Videos, Images, Fonts).

## Deployment

The project is optimized for deployment on the [Vercel Platform](https://vercel.com).

### Root Directory Note
If deploying to Vercel, ensure the **Root Directory** in Project Settings is set to the repository root (or adjusted if nested) to avoid build errors.

---

## License

This project is private and proprietary. Copyright © 2026 CollabDen-Africa.
