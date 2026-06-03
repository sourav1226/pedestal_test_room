import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import batchRoutes from './routes/batch.routes.js';
import quizRoutes from './routes/quiz.routes.js';
import questionRoutes from './routes/question.routes.js';
import attemptRoutes from './routes/attempt.routes.js';
import resultRoutes from './routes/result.routes.js';
import certificateRoutes from './routes/certificate.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/leaderboards', leaderboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Quiz App API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
