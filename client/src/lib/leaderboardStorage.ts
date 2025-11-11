/**
 * Local storage utility for leaderboard
 * Stores leaderboard as: { "Team1": 2, "Team2": 5 }
 * Where the value is the score (timeTaken / moves)
 */

const STORAGE_KEY = "tileMatchLeaderboard";

export interface LeaderboardData {
  [teamId: string]: number;
}

/**
 * Get the entire leaderboard from local storage
 */
export function getLeaderboard(): LeaderboardData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return {};
    }
    return JSON.parse(stored) as LeaderboardData;
  } catch (error) {
    console.error("Error reading leaderboard from local storage:", error);
    return {};
  }
}

/**
 * Save a score for a team
 * If the team already has a score, it will be updated if the new score is better (lower)
 */
export function saveScore(teamId: string, score: number): void {
  try {
    const leaderboard = getLeaderboard();
    
    // If team doesn't exist or new score is better (lower), update it
    if (!leaderboard[teamId] || score < leaderboard[teamId]) {
      leaderboard[teamId] = score;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leaderboard));
    }
  } catch (error) {
    console.error("Error saving score to local storage:", error);
  }
}

/**
 * Get leaderboard entries sorted by score (ascending - lower is better)
 * Returns array of [teamId, score] tuples
 */
export function getSortedLeaderboard(): Array<[string, number]> {
  const leaderboard = getLeaderboard();
  return Object.entries(leaderboard).sort((a, b) => a[1] - b[1]);
}

/**
 * Clear the entire leaderboard
 */
export function clearLeaderboard(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing leaderboard from local storage:", error);
  }
}

