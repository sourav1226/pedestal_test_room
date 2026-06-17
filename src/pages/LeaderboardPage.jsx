import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/student-common';
import {
  LeaderboardTable,
  TopPerformers,
  LeaderboardStats,
} from '../components/leaderboard';
import leaderboardService from '../services/leaderboardService';
import { useAuthStore } from '../store/authStore';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, accessToken } = useAuthStore();
  const navigate = useNavigate();

  const currentUserId = user ? String(user.id) : '';

  useEffect(() => {
    if (!accessToken || !user) {
      navigate('/login');
      return;
    }

    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const quizId = new URLSearchParams(window.location.search).get('quizId');

        if (!quizId) {
          setError('No quiz selected');
          setLoading(false);
          return;
        }

        const [leaderboard, performers, statsData] = await Promise.all([
          leaderboardService.getLeaderboard(quizId),
          leaderboardService.getTopPerformers(quizId),
          leaderboardService.getLeaderboardStats(quizId),
        ]);

        setLeaderboardData(leaderboard);
        setTopPerformers(performers);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [user, accessToken, navigate]);

  const handleSearch = async (searchTerm) => {
    const quizId = new URLSearchParams(window.location.search).get('quizId');
    if (searchTerm.trim() === '') {
      const data = await leaderboardService.getLeaderboard(quizId);
      setLeaderboardData(data);
    } else {
      const data = await leaderboardService.searchLeaderboard(quizId, searchTerm);
      setLeaderboardData(data);
    }
  };

  const handleSort = async (field) => {
    const quizId = new URLSearchParams(window.location.search).get('quizId');
    const data = await leaderboardService.getLeaderboard(quizId, {
      sortBy: field,
      order: 'desc',
    });
    setLeaderboardData(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <Card variant="danger">
            <p className="text-red-700 font-semibold mb-4">Error</p>
            <p className="text-red-600 mb-4">{error}</p>
            <Button label="Retry" variant="primary" onClick={() => window.location.reload()} />
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank compared to other participants</p>
        </div>

        {topPerformers.length > 0 && (
          <div className="mb-8">
            <TopPerformers performers={topPerformers} />
          </div>
        )}

        {stats && (
          <div className="mb-8">
            <LeaderboardStats stats={stats} />
          </div>
        )}

        <div className="mb-8">
          <LeaderboardTable
            data={leaderboardData}
            onSearch={handleSearch}
            onSort={handleSort}
            currentUserId={currentUserId}
          />
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            label="View My Results"
            variant="primary"
            size="lg"
            onClick={() => navigate('/student/result')}
          />
          <Button
            label="Download Certificate"
            variant="success"
            size="lg"
            onClick={() => navigate('/certificate')}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
