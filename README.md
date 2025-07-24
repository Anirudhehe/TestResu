# TestResu

TestResu is a full-stack React application that provides AI-powered feedback and scoring for resumes, helping users optimize their applications for their dream jobs. It leverages [React Router](https://reactrouter.com/) for routing, [TailwindCSS](https://tailwindcss.com/) for styling, and integrates with the [Puter.js](https://puter.com/) API for file storage, authentication, and AI analysis.

## Features

- **Resume Upload**: Users can upload their resume in PDF format.
- **AI Analysis**: The app analyzes resumes using AI, providing detailed feedback and ATS (Applicant Tracking System) scores.
- **Job Context**: Users can specify the job title and description for more targeted feedback.
- **Score Breakdown**: Feedback includes scores for Tone & Style, Content, Structure, Skills, and ATS suitability.
- **History Tracking**: Users can view all their previous resume submissions and feedback.
- **Authentication**: Secure login and logout via Puter.js.
- **File Management**: Uploaded files and images are managed in the user's Puter.js storage.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20+
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

### Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/yourusername/testresu.git
cd testresu
npm install
```

### Development

Start the development server:

```sh
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

Create a production build:

```sh
npm run build
```

### Deployment

#### Docker

Build and run the app using Docker:

```sh
docker build -t resumind .
docker run -p 3000:3000 resumind
```

#### Manual Deployment

Deploy the contents of the `build/` directory to your preferred Node.js hosting platform.

## Usage

1. **Sign In**: Log in using the Puter.js authentication.
2. **Upload Resume**: Go to the upload page, fill in job details, and upload your PDF resume.
3. **View Feedback**: After analysis, view detailed feedback and scores for your resume.
4. **Track Submissions**: Access the home page to review all your previous resume submissions and feedback.
5. **Wipe Data**: Use the `/wipe` route to delete all stored files and feedback (for testing or resetting).

## Project Structure

```
app/
  components/      # Reusable UI components
  lib/             # Utility libraries (Puter.js integration, PDF conversion, etc.)
  routes/          # Route components (home, upload, resume, auth, wipe)
  app.css          # Global styles
constants/         # Static data and helper constants
types/             # TypeScript type definitions
public/            # Static assets (images, icons, PDF worker)
.react-router/     # React Router generated types
```

## Technologies

- **React** & **React Router**
- **TypeScript**
- **TailwindCSS**
- **Zustand** (state management)
- **Puter.js** (cloud API for storage, AI, and authentication)
- **Vite** (build tool)

## License

MIT

---

Built with ❤️ using React Router and [Puter.js](https://puter.com/).
