# ApplyRight - Developer Guide

## Architecture Overview

### Project Structure
```
ApplyRight/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for LangChain integration
│   ├── results/
│   │   └── page.tsx              # Results page with tabs
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main input form page
├── .env.example                  # Environment variables template
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Components

### 1. Main Input Page (`app/page.tsx`)
- Handles three types of input for each document type (CV, Cover Letter, Job Description):
  - File upload (supports .txt, .doc, .docx, .pdf)
  - Text paste (textarea)
  - URL fetch (for remote documents)
- Validates that CV and Job Description are provided
- Sends data to API endpoint
- Stores results in sessionStorage
- Redirects to results page

### 2. API Route (`app/api/generate/route.ts`)
- Uses OpenAI GPT-3.5-turbo model
- Implements LangChain with prompt templates
- Two separate chains:
  - CV tailoring chain
  - Cover letter generation chain
- Timeout set to 60 seconds for Vercel compatibility
- Returns tailored documents as JSON

### 3. Results Page (`app/results/page.tsx`)
- Retrieves generated documents from sessionStorage
- Tabbed interface for CV and Cover Letter
- Three action buttons:
  - **Copy to Clipboard**: Uses Navigator API
  - **Download as DOCX**: Uses `docx` library with proper formatting
  - **Download as PDF**: Uses `pdf-lib` with text wrapping and pagination
- "Generate New Documents" button to start over

## LangChain Integration

The application uses LangChain to create intelligent document tailoring:

### CV Prompt Template
The CV prompt instructs the AI to:
1. Emphasize relevant skills and experiences
2. Use keywords from the job description
3. Maintain professional formatting
4. Highlight matching achievements
5. Reorganize content without changing facts

### Cover Letter Prompt Template
The cover letter prompt instructs the AI to:
1. Show enthusiasm for the specific role
2. Highlight relevant qualifications from CV
3. Use job description keywords
4. Align experience with requirements
5. Maintain professional yet personable tone
6. Include proper structure (opening, body, closing)

## Document Export Implementation

### DOCX Export
- Uses the `docx` library
- Automatically detects headings based on formatting patterns
- Preserves paragraph structure
- Creates properly formatted Word documents

### PDF Export
- Uses `pdf-lib` for PDF generation
- Implements text wrapping for long lines
- Handles pagination automatically
- Uses Times Roman font family
- Distinguishes headings with bold font and larger size
- Maintains 50pt margins

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-3.5-turbo access |

## Development Tips

### Running Locally
```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your OpenAI API key

# Run development server
npm run dev
```

### Building for Production
```bash
# Build the application
npm run build

# Start production server
npm start
```

### Common Issues

**Build Error: Tailwind CSS PostCSS plugin**
- Make sure you're using `@tailwindcss/postcss` instead of the legacy `tailwindcss` plugin
- Check `postcss.config.mjs` configuration

**API Timeout**
- The API route has a 60-second timeout for Vercel
- If generation takes too long, consider using a streaming response or queue system

**PDF Generation Issues**
- The PDF library uses Uint8Array which needs proper type handling
- Use `new Uint8Array(pdfBytes)` when creating Blob

## Deployment to Vercel

1. Push code to GitHub
2. Import repository in Vercel dashboard
3. Configure environment variables:
   - Add `OPENAI_API_KEY` in project settings
4. Deploy!

Vercel will automatically:
- Install dependencies
- Run build command
- Deploy to global CDN
- Enable serverless functions for API routes

## Future Enhancements

Potential improvements:
- Add authentication for user accounts
- Store generation history in a database
- Support more document formats (ODT, RTF)
- Add resume templates/themes
- Implement streaming for real-time generation feedback
- Add document preview before download
- Support multiple languages
- Add ATS (Applicant Tracking System) optimization
- Implement usage analytics
