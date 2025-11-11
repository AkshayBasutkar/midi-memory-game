import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Trophy, TrendingDown } from "lucide-react";
import { getSortedLeaderboard } from "@/lib/leaderboardStorage";

interface LeaderboardEntry {
  teamId: string;
  score: number;
}

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchLeaderboard();
    // Refresh every 2 seconds to catch updates
    const interval = setInterval(fetchLeaderboard, 2000);
    return () => clearInterval(interval);
  }, []);
  
  const fetchLeaderboard = () => {
    try {
      const sortedEntries = getSortedLeaderboard();
      const formattedEntries: LeaderboardEntry[] = sortedEntries.map(([teamId, score]) => ({
        teamId,
        score,
      }));
      setEntries(formattedEntries);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl bg-white/95 backdrop-blur">
          <CardHeader className="text-center pb-4 border-b">
            <div className="flex justify-center mb-4">
              <Trophy className="w-16 h-16 text-yellow-500" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Leaderboard
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Best scores (lower is better)
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading leaderboard...</p>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No entries yet. Be the first to play!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry, index) => (
                  <div
                    key={entry.teamId}
                    className={`bg-gradient-to-r p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      index === 0
                        ? "from-yellow-50 to-orange-50 border-yellow-300 shadow-lg"
                        : index === 1
                        ? "from-gray-50 to-slate-50 border-gray-300"
                        : index === 2
                        ? "from-orange-50 to-amber-50 border-orange-300"
                        : "from-purple-50 to-pink-50 border-purple-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`text-2xl font-bold w-12 h-12 rounded-full flex items-center justify-center ${
                            index === 0
                              ? "bg-yellow-400 text-white"
                              : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                              ? "bg-orange-400 text-white"
                              : "bg-purple-200 text-purple-700"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-900">
                            {entry.teamId}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-gray-600 text-xs mb-1">
                            <TrendingDown className="w-4 h-4" />
                            Score
                          </div>
                          <div className="font-bold text-lg text-purple-700">
                            {entry.score.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

