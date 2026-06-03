import { useState } from 'react'
import TestInstruction from './TestInstruction'
import QuestionAttempt from './QuestionAttempt'
import TestResult from './TestResult'
import Leaderboard from './Leaderboard'

function StudentFlow() {
  const [currentScreen, setCurrentScreen] = useState('instruction')

  const navigateTo = (screen) => {
    setCurrentScreen(screen)
  }

  switch (currentScreen) {
    case 'instruction':
      return <TestInstruction onStartTest={() => navigateTo('question')} />
    case 'question':
      return <QuestionAttempt onSubmit={() => navigateTo('result')} />
    case 'result':
      return <TestResult onViewLeaderboard={() => navigateTo('leaderboard')} />
    case 'leaderboard':
      return <Leaderboard />
    default:
      return <TestInstruction onStartTest={() => navigateTo('question')} />
  }
}

export default StudentFlow
