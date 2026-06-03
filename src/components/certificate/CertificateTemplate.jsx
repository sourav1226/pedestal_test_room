import React, { useRef } from 'react';
import { Button } from '../student-common';
import { generateCertificatePDF, printCertificate, downloadCertificateAsImage } from '../../utils/generatePDF';
import { formatDate } from '../../utils/formatDate';

/**
 * CertificateTemplate Component - Professional certificate display
 */
const CertificateTemplate = ({ certificateData, templateId = 'modern' }) => {
  const certificateRef = useRef(null);
  const {
    studentName,
    quizTitle,
    finalScore,
    scorePercentage,
    grade,
    completionDate,
    expiryDate,
    instructorName,
    institution,
    verificationCode,
    achievements = [],
  } = certificateData;

  const handleDownloadPDF = async () => {
    if (certificateRef.current) {
      const result = await generateCertificatePDF(certificateRef.current, `${studentName}_certificate`);
      if (result.success) {
        alert('Certificate downloaded successfully!');
      } else {
        alert('Error downloading certificate: ' + result.error);
      }
    }
  };

  const handlePrint = () => {
    if (certificateRef.current) {
      printCertificate(certificateRef.current);
    }
  };

  const handleDownloadImage = async () => {
    if (certificateRef.current) {
      const result = await downloadCertificateAsImage(certificateRef.current, `${studentName}_certificate`);
      if (result.success) {
        alert('Certificate image downloaded successfully!');
      } else {
        alert('Error downloading image: ' + result.error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <Button
          label="Download PDF"
          variant="primary"
          size="md"
          onClick={handleDownloadPDF}
        />
        <Button
          label="Print Certificate"
          variant="secondary"
          size="md"
          onClick={handlePrint}
        />
        <Button
          label="Download Image"
          variant="secondary"
          size="md"
          onClick={handleDownloadImage}
        />
      </div>

      {/* Certificate Container - A4 Landscape */}
      <div
        ref={certificateRef}
        className="w-full max-w-5xl mx-auto bg-white border-4 border-blue-600 shadow-2xl flex flex-col"
        style={{ aspectRatio: '16 / 11' }}
      >
        {/* Certificate Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-6 text-center flex-shrink-0">
          <h1 className="text-4xl font-bold mb-1">Certificate of Completion</h1>
          <p className="text-blue-100 text-sm">Presented to acknowledge academic achievement</p>
        </div>

        {/* Certificate Body */}
        <div className="px-12 py-8 space-y-5 flex-1 flex flex-col justify-between overflow-hidden">
          {/* Recipient Name */}
          <div className="text-center border-b-2 border-blue-300 pb-4">
            <p className="text-gray-600 text-base mb-2">This is proudly presented to</p>
            <h2 className="text-4xl font-bold text-blue-700">{studentName}</h2>
          </div>

          {/* Achievement Text */}
          <div className="text-center space-y-3">
            <p className="text-gray-700 text-base leading-relaxed">
              For successfully completing the course and demonstrating outstanding performance in
            </p>
            <p className="text-2xl font-bold text-indigo-600">{quizTitle}</p>
            <p className="text-gray-700 text-base">
              with a score of <span className="font-bold text-blue-600">{finalScore} ({scorePercentage}%)</span> and achieving grade <span className="font-bold text-blue-600">{grade}</span>
            </p>
          </div>

          {/* Achievement Highlights */}
          {achievements.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
              <p className="font-semibold text-gray-800 text-sm mb-2">Special Achievements:</p>
              <ul className="space-y-1">
                {achievements.map((achievement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-600 font-bold">+</span>
                    <span className="text-gray-700">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Certificate Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-gray-300">
            <div>
              <p className="text-gray-600 text-xs mb-1">Issued on</p>
              <p className="text-gray-800 font-semibold text-sm">{formatDate(completionDate, 'long')}</p>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">Valid until</p>
              <p className="text-gray-800 font-semibold text-sm">{formatDate(expiryDate, 'long')}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 text-xs mb-1">Instructed by</p>
              <p className="text-gray-800 font-semibold text-sm">{instructorName}</p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-600 text-xs mb-1">Issued by</p>
              <p className="text-gray-800 font-semibold text-sm">{institution}</p>
            </div>
          </div>

          {/* Verification Code */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-3 rounded-lg text-center border border-gray-300">
            <p className="text-gray-600 text-xs mb-1">Certificate ID</p>
            <p className="font-mono text-gray-800 font-bold text-sm tracking-wider">{verificationCode}</p>
          </div>
        </div>

        {/* Certificate Footer */}
        <div className="bg-gray-50 border-t border-gray-300 px-12 py-3 flex justify-between items-center text-sm flex-shrink-0">
          <div className="text-center flex-1">
            <p className="text-gray-700 font-semibold text-xs">Digitally Verified</p>
            <p className="text-gray-500 text-xs">Authentic & Valid</p>
          </div>
          <div className="text-gray-400 text-xs text-right">
            <p>Verify at:</p>
            <p>academy.example.com/verify</p>
          </div>
        </div>
      </div>

      {/* Share Note */}
      <div className="text-center text-gray-600 text-sm">
        <p>Share your achievement or download your certificate</p>
      </div>
    </div>
  );
};

export default CertificateTemplate;
