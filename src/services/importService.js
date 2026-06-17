import { apiClient, handleApiError } from './ApiService';
import Papa from 'papaparse';

class ImportService {
  async parseCSV(file) {
    return new Promise((resolve) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            return resolve({ success: false, error: 'Error parsing CSV file', data: results.errors });
          }
          resolve({ success: true, data: results.data });
        },
        error: (error) => {
          resolve({ success: false, error: error.message });
        },
      });
    });
  }

  async parseJSON(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result;
          const data = JSON.parse(content);
          if (!Array.isArray(data)) {
            return resolve({ success: false, error: 'JSON file must contain an array of questions' });
          }
          resolve({ success: true, data });
        } catch {
          resolve({ success: false, error: 'Invalid JSON file format' });
        }
      };
      reader.onerror = () => resolve({ success: false, error: 'Error reading file' });
      reader.readAsText(file);
    });
  }

  validateFile(file, maxSize = 5 * 1024 * 1024) {
    if (file.size > maxSize) {
      return { success: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit` };
    }
    const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'File type not supported. Please use CSV or JSON.' };
    }
    return { success: true, data: true };
  }

  rowToQuestion(row, rowIndex) {
    const errors = [];
    if (!row.text || row.text.trim() === '') {
      errors.push({ rowIndex, field: 'text', error: 'Question text is required' });
    }
    if (!row.type) {
      errors.push({ rowIndex, field: 'type', error: 'Question type is required' });
    }
    if (!row.category) {
      errors.push({ rowIndex, field: 'category', error: 'Category is required' });
    }
    const validDifficulties = ['easy', 'medium', 'hard'];
    if (!validDifficulties.includes(row.difficulty)) {
      errors.push({ rowIndex, field: 'difficulty', error: `Difficulty must be one of: ${validDifficulties.join(', ')}` });
    }
    const marks = parseInt(row.marks) || 1;
    if (marks < 1 || marks > 1000) {
      errors.push({ rowIndex, field: 'marks', error: 'Marks must be between 1 and 1000' });
    }
    if (errors.length > 0) {
      return { question: null, errors };
    }
    const typeMap = {
      'multiple-choice': 'mcq',
      'true-false': 'true_false',
      'short-answer': 'fill_blanks',
    };
    const options = this.parseOptions(row);
    const question = {
      question_type: typeMap[row.type] || 'mcq',
      question_text: row.text.trim(),
      marks,
      difficulty: row.difficulty || 'medium',
      explanation: row.explanation || '',
      options,
    };
    return { question, errors };
  }

  parseOptions(row) {
    const optionsStr = row.options || '';
    if (!optionsStr || optionsStr.trim() === '') return [];
    return optionsStr.split('|').map((opt) => ({
      option_text: opt.trim(),
      is_correct: opt.trim() === row.correctAnswer,
    }));
  }

  async importQuestions(file, quizId) {
    const validation = this.validateFile(file);
    if (!validation.success) {
      return { success: false, error: validation.error };
    }
    const isJSON = file.type === 'application/json' || file.name.endsWith('.json');
    const parseResult = await (isJSON ? this.parseJSON(file) : this.parseCSV(file));
    if (!parseResult.success) {
      return { success: false, error: parseResult.error };
    }
    const questions = [];
    const allErrors = [];
    let successCount = 0;
    let failCount = 0;
    (parseResult.data || []).forEach((row, index) => {
      const { question, errors } = this.rowToQuestion(row, index + 1);
      if (question) {
        questions.push(question);
        successCount++;
      } else {
        failCount++;
        allErrors.push(...errors);
      }
    });
    if (questions.length > 0 && quizId) {
      try {
        const response = await apiClient.post('/questions/bulk', { quiz_id: parseInt(quizId), questions });
        return {
          success: true,
          data: {
            success: successCount,
            failed: failCount,
            errors: allErrors,
            questions: response.data.imported || [],
          },
        };
      } catch (error) {
        return handleApiError(error);
      }
    }
    return {
      success: true,
      data: { success: successCount, failed: failCount, errors: allErrors, questions },
    };
  }

  async generatePreview(file, maxRows = 5) {
    const isJSON = file.type === 'application/json' || file.name.endsWith('.json');
    const parseResult = await (isJSON ? this.parseJSON(file) : this.parseCSV(file));
    if (!parseResult.success) return parseResult;
    const rows = (parseResult.data || []).slice(0, maxRows);
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return { success: true, data: { columns, rows, totalRows: (parseResult.data || []).length } };
  }

  getImportTemplate(format) {
    if (format === 'json') {
      return JSON.stringify([
        {
          text: 'What is the capital of France?',
          type: 'multiple-choice',
          difficulty: 'easy',
          marks: 1,
          category: 'Geography',
          tags: 'capitals,europe',
          options: 'London|Paris|Berlin|Madrid',
          correctAnswer: 'Paris',
          explanation: 'Paris is the capital and largest city of France.',
        },
      ], null, 2);
    }
    return `text,type,difficulty,marks,category,tags,options,correctAnswer,explanation
What is the capital of France?,multiple-choice,easy,1,Geography,capitals|europe,London|Paris|Berlin|Madrid,Paris,Paris is the capital and largest city of France.
Is JavaScript a programming language?,true-false,easy,1,Programming,javascript|programming,True|False,True,Yes JavaScript is a high-level interpreted programming language.`;
  }
}

export const importService = new ImportService();
