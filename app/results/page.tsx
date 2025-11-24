'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function Results() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cv' | 'coverLetter'>('cv');
  const [cv, setCv] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get results from sessionStorage
    const storedCV = sessionStorage.getItem('generatedCV');
    const storedCoverLetter = sessionStorage.getItem('generatedCoverLetter');

    if (!storedCV || !storedCoverLetter) {
      router.push('/');
      return;
    }

    setCv(storedCV);
    setCoverLetter(storedCoverLetter);
  }, [router]);

  const handleCopy = async () => {
    const content = activeTab === 'cv' ? cv : coverLetter;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateDocx = async () => {
    const content = activeTab === 'cv' ? cv : coverLetter;
    const lines = content.split('\n');
    
    const paragraphs = lines.map(line => {
      if (!line.trim()) {
        return new Paragraph({ text: '' });
      }
      
      // Check if line looks like a heading (simple heuristic)
      const isHeading = line.length < 50 && (
        line.trim().endsWith(':') || 
        line === line.toUpperCase() ||
        /^[A-Z][a-z]+( [A-Z][a-z]+)*$/.test(line.trim())
      );
      
      if (isHeading) {
        return new Paragraph({
          text: line,
          heading: HeadingLevel.HEADING_2,
        });
      }
      
      return new Paragraph({
        children: [new TextRun(line)],
      });
    });

    const doc = new Document({
      sections: [{
        properties: {},
        children: paragraphs,
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab === 'cv' ? 'tailored-cv' : 'tailored-cover-letter'}.docx`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePdf = async () => {
    const content = activeTab === 'cv' ? cv : coverLetter;
    
    const pdfDoc = await PDFDocument.create();
    const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesRomanBoldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    
    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 11;
    const lineHeight = fontSize * 1.5;
    const margin = 50;
    let y = height - margin;
    
    const lines = content.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) {
        y -= lineHeight / 2;
        continue;
      }
      
      // Check if we need a new page
      if (y < margin) {
        page = pdfDoc.addPage();
        y = height - margin;
      }
      
      // Check if line looks like a heading
      const isHeading = line.length < 50 && (
        line.trim().endsWith(':') || 
        line === line.toUpperCase() ||
        /^[A-Z][a-z]+( [A-Z][a-z]+)*$/.test(line.trim())
      );
      
      const font = isHeading ? timesRomanBoldFont : timesRomanFont;
      const size = isHeading ? fontSize + 2 : fontSize;
      
      // Handle text wrapping
      const maxWidth = width - 2 * margin;
      const words = line.split(' ');
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const textWidth = font.widthOfTextAtSize(testLine, size);
        
        if (textWidth > maxWidth && currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y,
            size,
            font,
            color: rgb(0, 0, 0),
          });
          y -= lineHeight;
          currentLine = word;
          
          // Check if we need a new page
          if (y < margin) {
            page = pdfDoc.addPage();
            y = height - margin;
          }
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine) {
        page.drawText(currentLine, {
          x: margin,
          y,
          size,
          font,
          color: rgb(0, 0, 0),
        });
        y -= lineHeight;
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeTab === 'cv' ? 'tailored-cv' : 'tailored-cover-letter'}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!cv || !coverLetter) {
    return null; // Will redirect in useEffect
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Your Tailored Documents
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Review, copy, or download your customized CV and cover letter
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('cv')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'cv'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tailored CV
              </button>
              <button
                onClick={() => setActiveTab('coverLetter')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'coverLetter'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Tailored Cover Letter
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <pre className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                {activeTab === 'cv' ? cv : coverLetter}
              </pre>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleCopy}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copied ? 'Copied!' : 'Copy to Clipboard'}
              </button>

              <button
                onClick={generateDocx}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download as DOCX
              </button>

              <button
                onClick={generatePdf}
                className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Download as PDF
              </button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
              >
                ← Generate New Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
