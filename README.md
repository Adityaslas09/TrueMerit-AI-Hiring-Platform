# TrueMerit - AI-Powered Merit-Based Hiring Platform

TrueMerit is a disruptive full-stack platform designed to revolutionize recruitment by evaluating candidates based on objective, merit-driven data rather than just traditional resumes. It leverages AI to verify certifications and integrates real-world signals like GitHub activity and project complexity.

## 🚀 Key Features

- **AI-Driven Certificate Verification**: Integrated Gemini-powered AI forensics (Agent 7) to detect fraudulent or tampered certifications, ensuring platform integrity.
- **Dynamic Merit Scoring**: A weighted algorithm that calculates a candidate's "Merit Score" by analyzing:
  - GitHub Activity & Repository Quality
  - Project Complexity & Tech Stack
  - Academic Performance
  - Verified Industry Certifications
- **Multi-Role Dashboards**: 
  - **Students**: Upload projects, verify certificates, and track merit growth.
  - **Recruiters**: Browse pre-verified, high-scoring talent with deep insights into their technical abilities.
- **Robust File Management**: Production-grade handling of resumes and sensitive documents.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS, Heroicons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **AI/ML**: Google Gemini AI (for certificate forensics)
- **Authentication**: JWT & Secure Cookie-based auth

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- Gemini API Key

### Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## 📜 License
This project is for educational and portfolio purposes.

---
*Created by [Your Name]*  
*Connect with me on [LinkedIn](https://linkedin.com) | [GitHub](https://github.com)*
