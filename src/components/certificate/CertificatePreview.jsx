import React, { useState } from 'react';
import { Button, Card } from '../student-common';

/**
 * CertificatePreview Component - Certificate preview with template selection
 */
const CertificatePreview = ({ certificateData, onTemplateChange = () => {}, templates = [] }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]?.id || 'modern');

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
    onTemplateChange(templateId);
  };

  return (
    <Card title="Certificate Preview" subtitle="Choose your preferred certificate design">
      {/* Template Selector */}
      {templates.length > 0 && (
        <div className="mb-8">
          <p className="text-sm font-semibold text-gray-700 mb-4">Select Template Style:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  selectedTemplate === template.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div
                  className="w-full h-8 rounded mb-2"
                  style={{ backgroundColor: template.color }}
                />
                <p className="text-xs font-semibold text-gray-700">{template.name}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Certificate Info Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <p className="text-sm text-gray-600 mb-4">Your certificate will include:</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Student Name</p>
            <p className="text-sm font-bold text-blue-600">{certificateData.studentName}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Quiz/Course</p>
            <p className="text-sm font-bold text-blue-600">{certificateData.quizTitle}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Score</p>
            <p className="text-sm font-bold text-green-600">{certificateData.scorePercentage}%</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Grade</p>
            <p className="text-sm font-bold text-indigo-600">{certificateData.grade}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Issue Date</p>
            <p className="text-sm font-bold text-gray-700">{certificateData.completionDate}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-700">Validity</p>
            <p className="text-sm font-bold text-gray-700">{certificateData.validityPeriod}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CertificatePreview;
