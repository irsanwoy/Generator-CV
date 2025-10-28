'use client';

import { useState } from 'react';

export default function Home() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<any>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    education: '',
    experienceLevel: 'fresh-graduate',
    experienceField: '',
    jobDescription: '',
    apiKey: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.location;
      case 2:
        return formData.education;
      case 3:
        return formData.experienceLevel && formData.jobDescription;
      case 4:
        return formData.apiKey;
      default:
        return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate CV');
      }

      setGeneratedCV(data.data);
      setStep(5); // Move to results page
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setStep(1);
    setGeneratedCV(null);
    setError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      location: '',
      education: '',
      experienceLevel: 'fresh-graduate',
      experienceField: '',
      jobDescription: '',
      apiKey: '',
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 no-print">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            AI CV Optimizer
          </h1>
          <p className="text-gray-600">
            Generate ATS-friendly CV tailored to your job description
          </p>
        </div>

        {/* Form or Results */}
        {step <= 4 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                {[1, 2, 3, 4].map((s) => (
                  <div
                    key={s}
                    className={`flex-1 h-2 mx-1 rounded-full transition-all ${
                      s <= step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 text-center">
                Step {step} of 4
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+62 812 3456 7890"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => updateField('location', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Jakarta, Indonesia"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Education */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Education</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Education Details *
                    </label>
                    <textarea
                      value={formData.education}
                      onChange={(e) => updateField('education', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="e.g., Bachelor of Computer Science, University of Indonesia, 2020-2024"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Include degree, institution, and graduation year
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Experience & Job Description */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">Experience & Target Job</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Level *
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) => updateField('experienceLevel', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="fresh-graduate">Fresh Graduate</option>
                      <option value="junior">Junior (1-2 years)</option>
                      <option value="mid">Mid-Level (3-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience Field (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.experienceField}
                      onChange={(e) => updateField('experienceField', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Marketing, Sales, Software Development"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Leave blank if fresh graduate or changing career
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Description *
                    </label>
                    <textarea
                      value={formData.jobDescription}
                      onChange={(e) => updateField('jobDescription', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={8}
                      placeholder="Paste the complete job description here..."
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Include requirements, responsibilities, and qualifications
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: API Key */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold mb-4">API Configuration</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Google Gemini API Key *
                    </label>
                    <input
                      type="password"
                      value={formData.apiKey}
                      onChange={(e) => updateField('apiKey', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your Gemini API key"
                      required
                    />
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Get your free API key:</strong>
                      </p>
                      <ol className="text-sm text-blue-700 mt-1 ml-4 list-decimal">
                        <li>Visit <a href="https://ai.google.dev" target="_blank" className="underline">ai.google.dev</a></li>
                        <li>Click "Get API Key"</li>
                        <li>Free tier: 1,500 requests/day</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                    className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!isStepValid() || isLoading}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Generating...
                      </>
                    ) : (
                      'Generate CV'
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        ) : (
          /* Results Page */
          <div>
            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-6 no-print">
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Print / Save PDF
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Create Another CV
              </button>
            </div>

            {/* Warnings */}
            {generatedCV?.warnings && generatedCV.warnings.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-6 rounded-lg no-print">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  ⚠️ Important Notes
                </h3>
                {generatedCV.warnings.map((warning: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <p className="text-yellow-800 font-medium">{warning.message}</p>
                    {warning.recommendations && warning.recommendations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-yellow-700 font-medium">Recommendations:</p>
                        <ul className="text-sm text-yellow-700 ml-4 list-disc">
                          {warning.recommendations.map((rec: string, i: number) => (
                            <li key={i}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ATS Score */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ATS Match Score</h3>
                  <p className="text-sm text-gray-600">How well your CV matches the job</p>
                </div>
                <div className="text-4xl font-bold text-green-600">
                  {generatedCV?.atsScore || 0}%
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all"
                    style={{ width: `${generatedCV?.atsScore || 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* CV Preview */}
            <div className="bg-white rounded-lg shadow-xl p-12 cv-print">
              {/* Header */}
              <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {formData.name}
                </h1>
                <div className="text-gray-600 space-y-1">
                  <p>{formData.email} | {formData.phone}</p>
                  <p>{formData.location}</p>
                </div>
              </div>

              {/* Professional Summary */}
              {generatedCV?.summary && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                    PROFESSIONAL SUMMARY
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {generatedCV.summary}
                  </p>
                </section>
              )}

              {/* Work Experience */}
              {generatedCV?.experience && generatedCV.experience.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                    WORK EXPERIENCE
                  </h2>
                  {generatedCV.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="mb-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-700">{exp.company} | {exp.location}</p>
                        </div>
                        <p className="text-gray-600 text-sm">{exp.period}</p>
                      </div>
                      <ul className="list-disc ml-5 space-y-1">
                        {exp.achievements.map((achievement: string, i: number) => (
                          <li key={i} className="text-gray-700">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}

              {/* Education */}
              <section className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                  EDUCATION
                </h2>
                <p className="text-gray-700">{formData.education}</p>
              </section>

              {/* Skills */}
              {generatedCV?.skills && generatedCV.skills.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-2">
                    SKILLS
                  </h2>
                  {generatedCV.skills.map((skillCat: any, idx: number) => (
                    <div key={idx} className="mb-3">
                      <p className="font-semibold text-gray-900">{skillCat.category}:</p>
                      <p className="text-gray-700">{skillCat.skills.join(', ')}</p>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .cv-print {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </main>
  );
}