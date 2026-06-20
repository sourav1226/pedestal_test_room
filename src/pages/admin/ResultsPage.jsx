import { useState, useEffect } from 'react'
import { apiClient } from '../../services/ApiService'

function ResultsPage() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState('')

  useEffect(() => {
    apiClient.get('/quizzes?limit=100').then(({ data }) => {
      setQuizzes(data.quizzes || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = selectedQuiz ? { quiz_id: selectedQuiz } : {}
    apiClient.get('/results', { params })
      .then(({ data }) => setResults(data.results || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false))
  }, [selectedQuiz])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Results</h1>
          <p className="text-gray-600 mt-2">View student quiz results and performance</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm bg-white"
        >
          <option value="">All Quizzes</option>
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>{q.title}</option>
          ))}
        </select>
        <span className="text-sm text-gray-500">{results.length} result{results.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading...</div>
      ) : results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <p className="text-4xl mb-4">📊</p>
          <p className="text-gray-600 text-lg">No results found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Quiz</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Score</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Percentage</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{r.student_name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.quiz_title}</td>
                  <td className="px-4 py-3 text-center">{r.final_score}</td>
                  <td className="px-4 py-3 text-center">{parseFloat(r.percentage).toFixed(1)}%</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      r.result_status === 'pass' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {r.result_status === 'pass' ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export { ResultsPage }
