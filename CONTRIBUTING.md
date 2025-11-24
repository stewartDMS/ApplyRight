# Contributing to ApplyRight

Thank you for your interest in contributing to ApplyRight! This document provides guidelines and instructions for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- OpenAI API key
- Git

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ApplyRight.git
   cd ApplyRight
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your OpenAI API key to `.env.local`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser

## Development Workflow

### Making Changes

1. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes, following the coding standards below

3. Test your changes thoroughly:
   - Run the dev server and test manually
   - Build the application: `npm run build`
   - Test the production build: `npm start`

4. Commit your changes with a clear commit message:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request on GitHub

## Coding Standards

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid using `any` type unless absolutely necessary
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Use client components (`'use client'`) only when necessary
- Prefer server components for static content

### Styling
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design (mobile, tablet, desktop)
- Support dark mode where applicable

### API Routes
- Validate input data
- Return appropriate HTTP status codes
- Handle errors gracefully
- Add timeout limits for long-running operations

### File Organization
```
app/
├── api/           # API routes
├── components/    # Reusable components (if needed)
├── [page]/        # Page-specific directories
└── page.tsx       # Root page
```

## Testing

Currently, the project relies on manual testing. When adding new features:

1. Test all input methods (file upload, text paste, URL)
2. Test error handling (missing inputs, invalid data)
3. Test the complete user flow
4. Verify downloads (DOCX and PDF)
5. Test copy to clipboard functionality
6. Test on different browsers and devices

## Documentation

When adding new features:
- Update the README.md if user-facing
- Update DEVELOPER_GUIDE.md for technical details
- Add JSDoc comments for complex functions
- Update this CONTRIBUTING.md if workflow changes

## Pull Request Guidelines

### Before Submitting
- [ ] Code builds successfully (`npm run build`)
- [ ] Changes tested manually
- [ ] Documentation updated if needed
- [ ] No sensitive data or API keys in code
- [ ] Git history is clean and logical

### PR Description Should Include
- What changes were made and why
- How to test the changes
- Screenshots for UI changes
- Any breaking changes or migration notes

### Review Process
1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged

## Common Issues and Solutions

### Build Errors
- **Tailwind CSS error**: Make sure you're using `@tailwindcss/postcss`
- **TypeScript errors**: Check type definitions and ensure proper imports
- **Module not found**: Run `npm install` to ensure all dependencies are installed

### API Issues
- **OpenAI timeout**: API route has 60s timeout; consider optimizing prompts
- **Rate limiting**: OpenAI has rate limits; implement retry logic if needed
- **Invalid API key**: Verify your key in `.env.local`

### PDF/DOCX Export Issues
- **PDF formatting**: Check text wrapping and pagination logic
- **DOCX styles**: Verify heading detection and paragraph formatting
- **Download not working**: Check browser console for errors

## Feature Requests

Have an idea for a new feature? Great! Here's how to proceed:

1. Check existing issues to see if it's already been suggested
2. Open a new issue with:
   - Clear description of the feature
   - Use case and benefits
   - Possible implementation approach
3. Wait for feedback from maintainers
4. If approved, follow the development workflow above

## Bug Reports

Found a bug? Please report it:

1. Check if the bug is already reported
2. Open a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable
   - Browser/OS information
3. Tag it with "bug" label

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other contributors

## Questions?

If you have questions about contributing:
- Open a discussion on GitHub
- Check existing documentation
- Review closed PRs for examples

Thank you for contributing to ApplyRight! 🎉
