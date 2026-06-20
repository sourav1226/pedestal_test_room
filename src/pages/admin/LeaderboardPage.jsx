import { useState, useEffect } from 'react'
import { apiClient } from '../../services/ApiService'

function LeaderboardPage() {
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [quizInfo, setQuizInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    apiClient.get('/quizzes?limit=100').then(({ data }) => {
      setQuizzes(data.quizzes || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedQuiz) {
      setLeaderboard([])
      setQuizInfo(null)
      return
    }
    setLoading(true)
    apiClient.get(`/leaderboards/quiz/${selectedQuiz}`)
      .then(({ data }) => {
        setLeaderboard(data.leaderboard || [])
        setQuizInfo(data.quiz || null)
      })
      .catch(() => {
        setLeaderboard([])
        setQuizInfo(null)
      })
      .finally(() => setLoading(false))
  }, [selectedQuiz])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-gray-600 mt-2">View rankings and scores for each quiz</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm bg-white"
        >
          <option value="">Select a Quiz</option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>{q.title}</option>
          ))}
        </select>
      </div>

      {!selectedQuiz && (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-4xl mb-4">🏆</p>
          <p className="text-gray-600 text-lg">Select a quiz to view the leaderboard.</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      )}

      {selectedQuiz && !loading && quizInfo && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-xl font-bold text-gray-800">{quizInfo.title}</h2>
            <p className="text-sm text-gray-500">Total Marks: {quizInfo.total_marks} | Participants: {leaderboard.length}</p>
          </div>
          {leaderboard.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-center px-4 py-3 font-semibold text-gray-600 w-16">Rank</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry) => (
                  <tr key={entry.student_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        entry.rank_position === 1 ? 'bg-yellow-100 text-yellow-700' :
                        entry.rank_position === 2 ? 'bg-gray-200 text-gray-700' :
                        entry.rank_position === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.rank_position}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">{entry.student_name}</td>
                    <td className="px-4 py-3 text-center font-semibold">{entry.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No leaderboard data available for this quiz.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export { LeaderboardPage }
