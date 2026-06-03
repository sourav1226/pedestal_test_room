import React from 'react';
import { Card, ScoreCard } from '../student-common';

/**
 * LeaderboardStats Component - Shows overall statistics
 */
const LeaderboardStats = ({ stats }) => {
  const {
    totalParticipants = 0,
    averageScore = 0,
    highestScore = 0,
    lowestScore = 0,
    medianScore = 0,
  } = stats;

  return (
    <Card title="Leaderboard Statistics" subtitle="Overall performance metrics">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <ScoreCard
          label="Total Participants"
          value={totalParticipants}
          unit=""
          variant="primary"
          size="md"
        />
        <ScoreCard
          label="Average Score"
          value={averageScore}
          maxValue={100}
          unit=""
          variant="default"
          size="md"
        />
        <ScoreCard
          label="Highest Score"
          value={highestScore}
          maxValue={100}
          unit=""
          variant="success"
          size="md"
        />
        <ScoreCard
          label="Lowest Score"
          value={lowestScore}
          maxValue={100}
          unit=""
          variant="danger"
          size="md"
        />
        <ScoreCard
          label="Median Score"
          value={medianScore}
          maxValue={100}
          unit=""
          variant="primary"
          size="md"
        />
      </div>
    </Card>
  );
};

export default LeaderboardStats;
