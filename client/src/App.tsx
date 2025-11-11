import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import "@fontsource/inter";
import { useMemoryGame } from "./lib/stores/useMemoryGame";
import { LoginScreen } from "./components/LoginScreen";
import { GameScene } from "./components/GameScene";
import { GameHUD } from "./components/GameHUD";
import { EndScreen } from "./components/EndScreen";
import { SoundManager } from "./components/SoundManager";
import { GameSounds } from "./components/GameSounds";
import { NavBar } from "./components/NavBar";
import { LeaderboardPage } from "./components/LeaderboardPage";
import { DiscoveredNotesPanel } from "./components/DiscoveredNotesPanel";
import { NoteMatchPopup } from "./components/NoteMatchPopup";

function App() {
  const phase = useMemoryGame((state) => state.phase);
  const [currentPage, setCurrentPage] = useState<"home" | "leaderboard">("home");
  
  // Show leaderboard page if on leaderboard route
  if (currentPage === "leaderboard") {
    return (
      <div style={{ width: '100vw', minHeight: '100vh', position: 'relative' }}>
        <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="pt-16">
          <LeaderboardPage />
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <SoundManager />
      
      {phase === "menu" && <LoginScreen />}
      
      {phase === "playing" && (
        <>
          <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
          <GameSounds />
          <Canvas
            shadows
            camera={{
              position: [0, 8, 10],
              fov: 50,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#87CEEB"]} />
            
            <Suspense fallback={null}>
              <GameScene />
            </Suspense>
            
            <OrbitControls
              enablePan={false}
              minDistance={8}
              maxDistance={20}
              minPolarAngle={Math.PI / 6}
              maxPolarAngle={Math.PI / 2.5}
            />
          </Canvas>
          <GameHUD />
          <DiscoveredNotesPanel />
          <NoteMatchPopup />
        </>
      )}
      
      {phase === "ended" && (
        <>
          <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
          <EndScreen />
        </>
      )}
    </div>
  );
}

export default App;
