import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { MIDI_NOTES, type MIDINote } from "@/lib/midiData";

export type GamePhase = "menu" | "playing" | "ended";
export type Difficulty = "easy" | "medium" | "hard";

export interface Tile {
  id: string;
  layerIndex: number;
  position: [number, number, number];
  midiNumber: number;
  isFlipped: boolean;
  isMatched: boolean;
  isActive: boolean;
}

export interface Layer {
  index: number;
  gridSize: number;
  tiles: Tile[];
  isActive: boolean;
  isCleared: boolean;
}

interface GameState {
  phase: GamePhase;
  difficulty: Difficulty;
  layers: Layer[];
  currentLayerIndex: number;
  flippedTiles: string[];
  moves: number;
  startTime: number | null;
  elapsedTime: number;
  isBusy: boolean;
  teamId: string | null;
  discoveredNotes: MIDINote[];
  matchedNote: MIDINote | null; // For popup display
  
  setTeamId: (teamId: string) => void;
  initGame: (difficulty: Difficulty) => void;
  flipTile: (tileId: string) => void;
  checkMatch: () => void;
  resetFlippedTiles: () => void;
  clearLayer: (layerIndex: number) => void;
  updateTimer: (time: number) => void;
  endGame: () => void;
  resetGame: () => void;
  startPlaying: () => void;
  clearMatchedNote: () => void;
}

const getDifficultyConfig = (difficulty: Difficulty) => {
  switch (difficulty) {
    case "easy":
      return { layers: [{ size: 4 }, { size: 2 }] };
    case "medium":
      return { layers: [{ size: 6 }, { size: 4 }, { size: 2 }] };
    case "hard":
      return { layers: [{ size: 6 }, { size: 6 }, { size: 4 }, { size: 2 }] };
  }
};

const generateTilesForLayer = (layerIndex: number, gridSize: number): Tile[] => {
  const tiles: Tile[] = [];
  const totalTiles = gridSize * gridSize;
  const pairCount = totalTiles / 2;
  
  // Select random MIDI numbers from the available range (1-128)
  // Use a subset to avoid too many different notes
  const availableMIDIs = Array.from({ length: 128 }, (_, i) => i + 1);
  const selectedMIDIs: number[] = [];
  
  // Randomly select MIDI numbers for pairs
  for (let i = 0; i < pairCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableMIDIs.length);
    const midiNumber = availableMIDIs.splice(randomIndex, 1)[0];
    selectedMIDIs.push(midiNumber, midiNumber); // Add pair
  }
  
  // Shuffle the selected MIDI numbers
  for (let i = selectedMIDIs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [selectedMIDIs[i], selectedMIDIs[j]] = [selectedMIDIs[j], selectedMIDIs[i]];
  }
  
  let tileIndex = 0;
  const offset = (gridSize - 1) / 2;
  const layerHeight = layerIndex * 0.3;
  
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = (col - offset) * 1.2;
      const z = (row - offset) * 1.2;
      const y = layerHeight;
      
      tiles.push({
        id: `layer${layerIndex}-tile${tileIndex}`,
        layerIndex,
        position: [x, y, z],
        midiNumber: selectedMIDIs[tileIndex],
        isFlipped: false,
        isMatched: false,
        isActive: false,
      });
      tileIndex++;
    }
  }
  
  return tiles;
};

export const useMemoryGame = create<GameState>()(
  subscribeWithSelector((set, get) => ({
    phase: "menu",
    difficulty: "medium",
    layers: [],
    currentLayerIndex: 0,
    flippedTiles: [],
    moves: 0,
    startTime: null,
    elapsedTime: 0,
    isBusy: false,
    teamId: null,
    discoveredNotes: [],
    matchedNote: null,
    
    setTeamId: (teamId: string) => {
      set({ teamId });
    },

    initGame: (difficulty: Difficulty) => {
      console.log("Initializing game with difficulty:", difficulty);
      const config = getDifficultyConfig(difficulty);

      const layers: Layer[] = config.layers.map((layerConfig, index) => ({
        index,
        gridSize: layerConfig.size,
        tiles: generateTilesForLayer(index, layerConfig.size),
        isActive: false,
        isCleared: false,
      }));

      // ✅ Activate the topmost layer and its tiles
      const topIndex = layers.length - 1;
      if (topIndex >= 0) {
        layers[topIndex] = {
          ...layers[topIndex],
          isActive: true,
          tiles: layers[topIndex].tiles.map(t => ({ ...t, isActive: true })),
        };
      }

      set({
        difficulty,
        layers,
        currentLayerIndex: topIndex,
        flippedTiles: [],
        moves: 0,
        startTime: null,
        elapsedTime: 0,
        discoveredNotes: [],
        matchedNote: null,
      });
    },

    
    
    flipTile: (tileId: string) => {
      const state = get();

      // 1) Block if store is busy resolving a previous pair
      if (state.isBusy) {
        console.log("flipTile ignored: store isBusy");
        return;
      }

      // 2) Existing guards
      if (state.flippedTiles.length >= 2) return;
      if (state.flippedTiles.includes(tileId)) return;

      // 3) Start timer on first flip
      if (!state.startTime) {
        set({ startTime: Date.now() });
      }

      // 4) Flip the tile only if it's active and not matched
      const newLayers = state.layers.map(layer => ({
        ...layer,
        tiles: layer.tiles.map(tile => {
          if (tile.id === tileId && !tile.isMatched && tile.isActive) {
            return { ...tile, isFlipped: true };
          }
          return tile;
        }),
      }));

      const newFlippedTiles = [...state.flippedTiles, tileId];
      const newMoves = state.moves + 1;

      console.log(`Tile flipped: ${tileId}, Total flipped: ${newFlippedTiles.length}`);

      set({
        layers: newLayers,
        flippedTiles: newFlippedTiles,
        moves: newMoves,
      });

      // 5) If this is the second flipped tile, lock further clicks and schedule match check
      if (newFlippedTiles.length === 2) {
        set({ isBusy: true }); // <- block further flipTile calls until match resolution
        setTimeout(() => {
          get().checkMatch();
          // checkMatch should clear isBusy after it resolves (see instructions)
        }, 800);
      }
    },

    
    checkMatch: () => {
      const state = get();
      const [tile1Id, tile2Id] = state.flippedTiles;

      let tile1: Tile | undefined;
      let tile2: Tile | undefined;

      // find both tiles
      for (const layer of state.layers) {
        for (const tile of layer.tiles) {
          if (tile.id === tile1Id) tile1 = tile;
          if (tile.id === tile2Id) tile2 = tile;
        }
      }

      // safety check
      if (!tile1 || !tile2) {
        console.error("Tiles not found for match check");
        set({ flippedTiles: [], isBusy: false }); // <-- also clear isBusy here
        return;
      }

      const isMatch = tile1.midiNumber === tile2.midiNumber;
      console.log(`Match check: ${tile1.midiNumber} vs ${tile2.midiNumber} = ${isMatch}`);

      if (isMatch) {
        // Get the note information for the matched MIDI number
        const matchedNote = MIDI_NOTES.find(n => n.midi === tile1.midiNumber);
        
        // Add to discovered notes if not already there
        const newDiscoveredNotes = [...state.discoveredNotes];
        if (matchedNote && !newDiscoveredNotes.find(n => n.midi === matchedNote.midi)) {
          newDiscoveredNotes.push(matchedNote);
        }
        
        // mark both tiles as matched
        const newLayers = state.layers.map(layer => ({
          ...layer,
          tiles: layer.tiles.map(tile => {
            if (tile.id === tile1Id || tile.id === tile2Id) {
              return { ...tile, isMatched: true };
            }
            return tile;
          }),
        }));

        set({ 
          layers: newLayers, 
          flippedTiles: [],
          discoveredNotes: newDiscoveredNotes,
          matchedNote: matchedNote || null,
        });

        // delay to let player see the match, then check if layer is cleared
        setTimeout(() => {
          const currentLayer = get().layers[get().currentLayerIndex];
          const allMatched = currentLayer.tiles.every(tile => tile.isMatched);

          if (allMatched) {
            console.log(`Layer ${get().currentLayerIndex} cleared!`);
            get().clearLayer(get().currentLayerIndex);
          }

          // ✅ release busy after all animations/updates are done
          set({ isBusy: false });
        }, 500);
      } else {
        // tiles don't match -> flip them back after short delay
        setTimeout(() => {
          get().resetFlippedTiles();

          // ✅ release busy after flip-back animation completes
          set({ isBusy: false });
        }, 600);
      }
    },

    
    resetFlippedTiles: () => {
      const state = get();
      const newLayers = state.layers.map(layer => ({
        ...layer,
        tiles: layer.tiles.map(tile => {
          if (state.flippedTiles.includes(tile.id) && !tile.isMatched) {
            return { ...tile, isFlipped: false };
          }
          return tile;
        }),
      }));
      
      set({ layers: newLayers, flippedTiles: [] });
    },
    
    clearLayer: (layerIndex: number) => {
      const state = get();
      const nextLayerIndex = layerIndex - 1;
      const isLastLayer = nextLayerIndex < 0;
      
      const newLayers = state.layers.map((layer, index) => {
        if (index === layerIndex) {
          return {
            ...layer,
            isCleared: true,
            isActive: false,
            tiles: layer.tiles.map(tile => ({ ...tile, isActive: false })),
          };
        }
        if (index === nextLayerIndex && !isLastLayer) {
          return {
            ...layer,
            isActive: true,
            tiles: layer.tiles.map(tile => ({ ...tile, isActive: true })),
          };
        }
        return layer;
      });
      
      const clampedLayerIndex = isLastLayer
        ? layerIndex
        : nextLayerIndex;
      set({ layers: newLayers, currentLayerIndex: clampedLayerIndex });
      
      if (isLastLayer) {
        console.log("All layers cleared! Game won!");
        setTimeout(() => {
          get().endGame();
        }, 1000);
      }
    },
    
    updateTimer: (time: number) => {
      set({ elapsedTime: time });
    },
    
    endGame: () => {
      set({ phase: "ended" });
    },
    
    resetGame: () => {
      set({
        phase: "menu",
        layers: [],
        currentLayerIndex: 0,
        flippedTiles: [],
        moves: 0,
        startTime: null,
        elapsedTime: 0,
        discoveredNotes: [],
        matchedNote: null,
        teamId: null,
        isBusy: false,
      });
    },
    
    startPlaying: () => {
      set({ phase: "playing" });
    },
    
    clearMatchedNote: () => {
      set({ matchedNote: null });
    },
  }))
);
