import React, { useEffect, useState } from 'react';
import { Button, Card } from '../components/student-common';
import {
  CertificateTemplate,
  CertificatePreview,
  CertificateInfo,
} from '../components/certificate';
import certificateService from '../services/certificateService';

/**
 * CertificatePage - Main page for displaying and downloading certificate
 */
const CertificatePage = () => {
  const [certificateData, setCertificateData] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('certificate');

  useEffect(() => {
    const fetchCertificateData = async () => {
      try {
        setLoading(true);
        const quizId = 'quiz_001';
        const studentId = 'student_123';

        const [certData, certTemplates] = await Promise.all([
          certificateService.getCertificateData(quizId, studentId),
          certificateService.getAvailableTemplates(),
        ]);

        setCertificateData(certData);
        setTemplates(certTemplates);
        setError(null);
      } catch (err) {
        setError('Failed to load certificate data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificateData();
  }, []);

  const handleTemplateChange = (templateId) => {
    setSelectedTemplate(templateId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Loading your certificate...</p>
        </div>
      </div>
    );
  }

  if (error || !certificateData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="danger">
            <p className="text-red-700 font-semibold mb-4">Error</p>
            <p className="text-red-600 mb-4">{error || 'Certificate data not found'}</p>
            <Button label="Retry" variant="primary" onClick={() => window.location.reload()} />
          </Card>
        </div>
      </div>
    );
  }

  // Check eligibility
  const isEligible = certificateService.isCertificateEligible(certificateData.scorePercentage);

  if (!isEligible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <Card variant="warning">
            <div className="text-center">
              <p className="text-yellow-700 font-bold text-2xl mb-4">Certificate Not Available</p>
              <p className="text-yellow-600 mb-4">
                You need to score at least 60% to earn a certificate. Your current score: {certificateData.scorePercentage}%
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button
                  label="View Results"
                  variant="primary"
                  onClick={() => window.location.href = '/student/result'}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Certificate of Achievement</h1>
          <p className="text-gray-600">Congratulations! You have earned your certificate.</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {['certificate', 'preview', 'details'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {tab === 'certificate' && 'Certificate'}
              {tab === 'preview' && 'Preview'}
              {tab === 'details' && 'Details'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Certificate Tab */}
          {activeTab === 'certificate' && (
            <CertificateTemplate certificateData={certificateData} templateId={selectedTemplate} />
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <CertificatePreview
              certificateData={certificateData}
              templates={templates}
              onTemplateChange={handleTemplateChange}
            />
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <CertificateInfo certificateData={certificateData} />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Button
            label="View My Results"
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/student/result'}
          />
          <Button
            label="View Leaderboard"
            variant="primary"
            size="lg"
            onClick={() => window.location.href = '/student/leaderboard'}
          />
        </div>

        {/* Share Section */}
        <div className="mt-12 text-center">
          <Card variant="primary">
            <div className="space-y-4">
              <p className="text-lg font-semibold text-gray-800">Share Your Achievement</p>
              <p className="text-gray-700">You can share your certificate using the verification code below:</p>
              <div className="bg-white p-4 rounded-lg border-2 border-blue-300">
                <p className="text-gray-600 text-sm mb-2">Verification Code</p>
                <p className="font-mono text-lg font-bold text-blue-600 tracking-wider">
                  {certificateData.verificationCode}
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Share this code with others to let them verify your certificate at <span className="font-semibold">{certificateData.certificateURL}</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;
