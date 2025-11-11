import { useEffect, useState } from "react";
import { useMemoryGame } from "@/lib/stores/useMemoryGame";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, Move, Timer, Layers, TrendingDown } from "lucide-react";
import { saveScore } from "@/lib/leaderboardStorage";

export function EndScreen() {
  const moves = useMemoryGame((state) => state.moves);
  const elapsedTime = useMemoryGame((state) => state.elapsedTime);
  const difficulty = useMemoryGame((state) => state.difficulty);
  const layers = useMemoryGame((state) => state.layers);
  const teamId = useMemoryGame((state) => state.teamId);
  const discoveredNotes = useMemoryGame((state) => state.discoveredNotes);
  const resetGame = useMemoryGame((state) => state.resetGame);
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    if (moves > 0 && elapsedTime > 0) {
      const calculatedScore = elapsedTime / moves;
      setScore(calculatedScore);
      
      // Submit to leaderboard
      if (teamId && !submitted && !submitting) {
        setSubmitting(true);
        submitScore(calculatedScore);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moves, elapsedTime, teamId, submitted, submitting]);
  
  const submitScore = (calculatedScore: number) => {
    try {
      if (!teamId) {
        console.error("No team ID available");
        return;
      }
      
      console.log("Saving score to local storage:", { teamId, score: calculatedScore });
      saveScore(teamId, calculatedScore);
      setSubmitted(true);
    } catch (error) {
      console.error("Error saving score:", error);
    } finally {
      setSubmitting(false);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };
  
  const getDifficultyLabel = () => {
    switch (difficulty) {
      case "easy": return "Easy";
      case "medium": return "Medium";
      case "hard": return "Hard";
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100 z-50">
      <Card className="w-full max-w-md mx-4 shadow-2xl bg-white/95 backdrop-blur">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <Trophy className="w-20 h-20 text-yellow-500" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
            Congratulations!
          </CardTitle>
          <p className="text-gray-600 mt-2">You matched all the MIDI notes!</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-2 border-purple-200">
            <h3 className="text-center font-semibold text-gray-700 mb-4">
              Game Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span className="text-gray-700 font-medium">Layers Cleared</span>
                </div>
                <span className="font-bold text-gray-900">{layers.length}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Move className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700 font-medium">Total Moves</span>
                </div>
                <span className="font-bold text-gray-900">{moves}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5 text-orange-600" />
                  <span className="text-gray-700 font-medium">Time Taken</span>
                </div>
                <span className="font-bold text-gray-900">{formatTime(elapsedTime)}</span>
              </div>
              
              {score !== null && (
                <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-purple-600" />
                    <span className="text-gray-700 font-medium">Final Score</span>
                  </div>
                  <span className="font-bold text-lg text-purple-700">
                    {score.toFixed(2)}
                  </span>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 font-medium">Notes Discovered</span>
                </div>
                <span className="font-bold text-gray-900">{discoveredNotes.length}</span>
              </div>
            </div>
          </div>
          
          {submitting && (
            <div className="text-center text-sm text-gray-600">
              Submitting score to leaderboard...
            </div>
          )}
          
          {submitted && (
            <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              ✓ Score submitted to leaderboard!
            </div>
          )}
          
          <Button
            onClick={resetGame}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            size="lg"
          >
            Play Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
