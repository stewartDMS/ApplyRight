import { NextRequest, NextResponse } from 'next/server';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

export const maxDuration = 60; // Set timeout to 60 seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    const { cv, coverLetter, jobDescription } = await request.json();

    if (!cv || !jobDescription) {
      return NextResponse.json(
        { error: 'CV and Job Description are required' },
        { status: 400 }
      );
    }

    // Initialize OpenAI model
    const model = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      temperature: 0.7,
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Create prompt template for CV
    const cvPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert career advisor and resume writer. Given the following CV and job description, create a tailored CV that highlights the most relevant skills, experiences, and achievements for this specific role.

Original CV:
{cv}

Job Description:
{jobDescription}

Please provide a tailored CV that:
1. Emphasizes relevant skills and experiences from the original CV
2. Uses keywords from the job description
3. Maintains professional formatting
4. Highlights achievements that match the role requirements
5. Keeps the same factual information but reorganizes and emphasizes differently

Tailored CV:
`);

    // Create prompt template for Cover Letter
    const coverLetterPromptTemplate = PromptTemplate.fromTemplate(`
You are an expert career advisor and cover letter writer. Given the following CV, optional cover letter, and job description, create a compelling tailored cover letter for this specific role.

CV:
{cv}

Original Cover Letter (if provided):
{coverLetter}

Job Description:
{jobDescription}

Please provide a tailored cover letter that:
1. Demonstrates enthusiasm for the specific role and company
2. Highlights the most relevant qualifications from the CV
3. Uses keywords from the job description
4. Shows how the candidate's experience aligns with the role requirements
5. Maintains a professional yet personable tone
6. Includes an opening, 2-3 body paragraphs, and a closing

Tailored Cover Letter:
`);

    // Create chains
    const cvChain = cvPromptTemplate.pipe(model).pipe(new StringOutputParser());
    const coverLetterChain = coverLetterPromptTemplate.pipe(model).pipe(new StringOutputParser());

    // Generate tailored CV
    const tailoredCV = await cvChain.invoke({
      cv,
      jobDescription,
    });

    // Generate tailored Cover Letter
    const tailoredCoverLetter = await coverLetterChain.invoke({
      cv,
      coverLetter: coverLetter || 'No cover letter provided',
      jobDescription,
    });

    return NextResponse.json({
      tailoredCV,
      tailoredCoverLetter,
    });
  } catch (error: any) {
    console.error('Error generating documents:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate documents' },
      { status: 500 }
    );
  }
}
