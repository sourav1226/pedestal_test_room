import React from 'react';
import { Card } from '../student-common';

/**
 * CertificateInfo Component - Displays certificate metadata and details
 */
const CertificateInfo = ({ certificateData }) => {
  const {
    certificateId,
    studentName,
    studentEmail,
    quizTitle,
    finalScore,
    scorePercentage,
    grade,
    completionDate,
    expiryDate,
    validityPeriod,
    instructorName,
    institution,
    verificationCode,
  } = certificateData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Student Information */}
      <Card title="Student Information" variant="primary">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-1">Name</p>
            <p className="text-lg font-bold text-gray-800">{studentName}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-1">Email</p>
            <p className="text-sm text-gray-700 break-all">{studentEmail}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Student ID</p>
            <p className="font-mono text-sm text-gray-700">{certificateData.studentId}</p>
          </div>
        </div>
      </Card>

      {/* Performance Information */}
      <Card title="Performance Details" variant="success">
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <p className="text-gray-600">Score</p>
            <p className="text-2xl font-bold text-green-600">{finalScore}</p>
          </div>
          <div className="flex justify-between items-center pb-4 border-b">
            <p className="text-gray-600">Percentage</p>
            <p className="text-2xl font-bold text-blue-600">{scorePercentage}%</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Grade</p>
            <p className="text-2xl font-bold text-indigo-600">{grade}</p>
          </div>
        </div>
      </Card>

      {/* Course Information */}
      <Card title="Course Information">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-1">Course/Quiz Title</p>
            <p className="text-lg font-bold text-gray-800">{quizTitle}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Institution</p>
            <p className="text-gray-700">{institution}</p>
          </div>
        </div>
      </Card>

      {/* Dates & Validity */}
      <Card title="Validity & Dates">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-1">Issued Date</p>
            <p className="font-semibold text-gray-800">{completionDate}</p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-1">Expiry Date</p>
            <p className="font-semibold text-gray-800">{expiryDate}</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">Valid For</p>
            <p className="text-lg font-bold text-blue-600">{validityPeriod}</p>
          </div>
        </div>
      </Card>

      {/* Verification Information */}
      <Card title="Verification" className="md:col-span-2">
        <div className="space-y-4">
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-2">Certificate ID</p>
            <p className="font-mono text-sm bg-gray-100 p-3 rounded border border-gray-300 break-all">
              {certificateId}
            </p>
          </div>
          <div className="border-b pb-4">
            <p className="text-gray-600 text-xs mb-2">Verification Code</p>
            <p className="font-mono text-sm bg-gray-100 p-3 rounded border border-gray-300 tracking-wider">
              {verificationCode}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-2">Issued By</p>
            <p className="font-semibold text-gray-800">{instructorName}</p>
            <p className="text-sm text-gray-600">{institution}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CertificateInfo;
