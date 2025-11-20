# 🎵 MIDI Memory Match

A captivating 3D memory matching game that combines visual gameplay with musical discovery. Match pairs of flower-themed tiles across multiple layers while discovering MIDI notes and their frequencies. Built with React, Three.js, and modern web technologies.

![Game Preview](https://img.shields.io/badge/Game-3D%20Memory%20Match-purple?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)

## ✨ Features

- **🎮 3D Gameplay**: Immersive 3D memory matching experience powered by Three.js and React Three Fiber
- **🎼 MIDI Integration**: Each tile pair represents a unique MIDI note with its frequency
- **📊 Multiple Difficulty Levels**: 
  - **Easy**: 2 layers (4x4, 2x2 grids)
  - **Medium**: 3 layers (6x6, 4x4, 2x2 grids)
  - **Hard**: 4 layers (6x6, 6x6, 4x4, 2x2 grids)
- **🌸 Beautiful Visuals**: Flower-themed tiles with smooth flip animations
- **🔊 Sound Effects**: Background music and interactive sound feedback
- **⏱️ Performance Tracking**: Timer and move counter to track your progress
- **🏆 End Game Summary**: View discovered MIDI notes and game statistics
- **📱 Responsive Design**: Optimized for various screen sizes
- **🎨 Modern UI**: Built with Radix UI primitives and Tailwind CSS

## 🎯 How to Play

1. **Enter Team ID**: Start by entering your team identifier
2. **Select Difficulty**: Choose Easy, Medium, or Hard
3. **Match Tiles**: Click on tiles to flip them and find matching pairs
4. **Layer System**: Complete the top layer to unlock the next layer beneath
5. **Discover Notes**: Each matched pair reveals a MIDI note with its frequency
6. **Complete All Layers**: Clear all layers to finish the game
7. **View Results**: See your performance stats and all discovered MIDI notes

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Three.js** - 3D graphics engine
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **Zustand** - State management
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Framer Motion** - Animation library
- **Howler.js** - Audio library
- **Lucide React** - Icon library

### Backend
- **Express.js** - Web server
- **TypeScript** - Type-safe backend
- **Drizzle ORM** - Database schema and migrations (configured for future use)

### Build Tools
- **Vite** - Fast build tool and dev server
- **esbuild** - JavaScript bundler
- **PostCSS** - CSS processing
- **tsx** - TypeScript execution for Node.js

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- Modern web browser with WebGL support

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/AkshayBasutkar/midi-memory-game.git
cd midi-memory-game
```

2. **Install dependencies**
```bash
npm install
```

## 💻 Running the Application

### Development Mode

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or another port if 5000 is busy).

### Production Build

1. **Build the application**
```bash
npm run build
npm run build:server
```

2. **Start the production server**
```bash
npm start
```

## 📁 Project Structure

```
midi-memory-game/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/       # Reusable UI components
│   │   │   ├── GameScene.tsx
│   │   │   ├── GameHUD.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── EndScreen.tsx
│   │   │   └── ...
│   │   ├── lib/
│   │   │   └── stores/   # Zustand state stores
│   │   │       ├── useMemoryGame.tsx
│   │   │       ├── useAudio.tsx
│   │   │       └── useGame.tsx
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── midiNoteMapping.ts  # MIDI note configurations
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # Application entry point
│   ├── public/
│   │   ├── images/       # Game assets (flowers)
│   │   ├── sounds/       # Audio files
│   │   ├── textures/     # 3D textures
│   │   └── geometries/   # 3D models
│   └── index.html        # HTML entry point
├── server/                # Backend application
│   ├── index.ts          # Express server entry point
│   ├── routes.ts         # API routes
│   ├── storage.ts        # Data storage interface
│   └── vite.ts           # Vite middleware configuration
├── shared/               # Shared code between client and server
├── package.json          # Project dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── drizzle.config.ts     # Database configuration
```

## 🎨 Key Components

### Game State Management (`useMemoryGame`)
- Manages game phases (menu, playing, ended)
- Handles tile flipping and matching logic
- Tracks layers, moves, and timer
- Maintains discovered MIDI notes

### MIDI Note System
The game uses difficulty-specific MIDI note mappings:
- Each tile pair is assigned a unique MIDI number
- Notes include frequency information
- Different mappings for Easy, Medium, and Hard difficulties
- Discovered notes are tracked and displayed

### 3D Rendering
- Uses React Three Fiber for declarative 3D rendering
- Orbit controls for camera manipulation
- Smooth animations for tile flips and layer transitions
- Sky blue background with proper lighting

## ⚙️ Configuration

### Environment Variables
Create a `.env` file in the root directory (if needed):
```env
PORT=5000
NODE_ENV=development
```

### Tailwind Configuration
Customizable theme in `tailwind.config.ts` with:
- HSL-based color system
- Custom animations
- Responsive breakpoints

### Database Setup (Optional)
The project is configured for PostgreSQL using Drizzle ORM but currently uses in-memory storage:
```bash
npm run db:push  # Push schema to database (when configured)
```

## 🎵 MIDI Note Mappings

The game features three difficulty-specific MIDI note sets:
- **Easy**: 11 unique MIDI notes (simpler frequency range)
- **Medium**: 11 unique MIDI notes (varied frequencies)
- **Hard**: 11 unique MIDI notes (complex frequency patterns)

Each matched pair reveals the MIDI note name and its frequency in Hertz.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build frontend for production
- `npm run build:server` - Build backend for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema (when configured)

## 🎮 Game Mechanics

1. **Tile Flipping**: Click any tile in the active (topmost) layer to flip it
2. **Matching Logic**: Two tiles are flipped at a time; if they match, they stay revealed
3. **Layer Progression**: Complete all matches in the current layer to proceed to the next
4. **Moves Counter**: Every pair of flips counts as one move
5. **Timer**: Starts when the game begins and stops when all layers are cleared
6. **Note Discovery**: Each successful match reveals a new MIDI note entry

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Akshay Basutkar**
- GitHub: [@AkshayBasutkar](https://github.com/AkshayBasutkar)

## 🙏 Acknowledgments

- React Three Fiber community for excellent 3D rendering tools
- Radix UI for accessible component primitives
- All open-source contributors whose libraries made this project possible

---

Made with ❤️ and 🎵 by Akshay Basutkar
