# ToastMyResume

A simple web app that scans your resume and generates an ATS-friendly, tailored version based on any job description — powered by Claude AI.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC?style=flat-square&logo=tailwind-css)
![Claude API](https://img.shields.io/badge/Claude-API-orange?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## What It Does

Upload your resume, paste a job description, and get back a professionally tailored resume that:

- Matches keywords from the job posting
- Uses ATS-friendly formatting
- Includes quantified achievements where possible
- Comes with improvement tips

## Why I Built This

Job hunting is tedious. Tailoring resumes manually for each application takes forever. This tool automates the boring part so you can focus on actually applying.

**Tech choices:**
- **Next.js App Router** — Modern React with server-side API routes
- **Claude API** — Better at nuanced writing tasks than alternatives
- **unpdf + mammoth** — Handle both PDF and DOCX uploads
- **docx** — Generate downloadable Word documents

## Features

- 📄 Upload PDF or DOCX resumes
- 📋 Paste any job description
- ✨ AI-generated tailored resume
- 💡 Personalized improvement tips
- 📥 Download as DOCX file

## Getting Started

### Prerequisites

- Node.js 18+ 
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

1. Clone the repo
   ```bash
   git clone https://github.com/abhinavsingh1311/resume-scanner.git
   cd resume-scanner
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout
│   ├── globals.css
│   ├── resume/
│   │   └── page.tsx          # Upload & generate page
│   └── api/
│       ├── upload/
│       │   └── route.js      # PDF/DOCX parsing
│       └── generate/
│           └── route.js      # Claude API integration
├── components/
│   └── document.js           # DOCX download handler
```

## Usage

1. Click "Upload Resume" on the home page
2. Select your PDF or DOCX resume file
3. Paste the job description you're applying for
4. Click "Extract Resume" to parse your file
5. Click "Generate Tailored Resume" 
6. Review your new resume and improvement tips
7. Download as DOCX

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Styling | Tailwind CSS |
| AI | Claude API (Anthropic) |
| PDF Parsing | unpdf |
| DOCX Parsing | mammoth |
| DOCX Generation | docx, file-saver |

## Roadmap

- [ ] Support for more file formats
- [ ] Save/load previous resumes
- [ ] Multiple resume templates
- [ ] Cover letter generation
- [ ] Side-by-side comparison view

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/cool-feature`)
3. Commit your changes (`git commit -m 'Add cool feature'`)
4. Push to the branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Credits

- Built by [Abhinav Singh](https://github.com/abhinavsingh1311)
- Powered by [Claude API](https://www.anthropic.com)

---

<p align="center">
  Made with 🍞 and a lot of job application frustration
</p>
