# ApplyRight

A Next.js application that generates tailored CVs and cover letters for job applications using AI-powered LangChain agents.

## Features

- 📄 **Multiple Input Methods**: Upload files, paste text, or fetch from URLs
- 🤖 **AI-Powered**: Uses OpenAI and LangChain to generate tailored documents
- 📑 **Dual Output**: Creates both tailored CV and cover letter
- 💾 **Multiple Export Formats**: Download as DOCX or PDF
- 📋 **Quick Copy**: Copy to clipboard with one click
- 🎨 **Modern UI**: Beautiful, responsive interface with dark mode support

## Getting Started

### Prerequisites

- Node.js 18.x or later
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/stewartDMS/ApplyRight.git
cd ApplyRight
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

This application is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add your `OPENAI_API_KEY` environment variable in Vercel project settings
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/stewartDMS/ApplyRight)

## Usage

1. **Input Your Documents**:
   - Upload your CV (or paste/provide URL)
   - Optionally upload your cover letter (or paste/provide URL)
   - Upload the job description (or paste/provide URL)

2. **Generate**:
   - Click "Generate Tailored Documents"
   - Wait for the AI to process your documents

3. **Review and Download**:
   - Review your tailored CV and cover letter in separate tabs
   - Copy to clipboard or download as DOCX/PDF

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-3.5 + LangChain
- **Document Generation**: docx, pdf-lib

## License

ISC

