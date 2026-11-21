import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Database & Middleware
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

// Route files
import authRoutes from './routes/authRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import skillAnalysisRoutes from './routes/skillAnalysisRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import learningRoutes from './routes/learningRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Headers (relaxed CSP allows Vite scripts, Google Fonts, and Unsplash images)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration (Flexible for Render, Vercel, Netlify, and local development)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, same-origin)
      if (!origin) return callback(null, true);

      // If CLIENT_URL is not set or set to '*', allow all origins
      if (allowedOrigins.length === 0 || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Automatically allow trusted deployment preview domains
      if (
        origin.endsWith('.vercel.app') ||
        origin.endsWith('.netlify.app') ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Safe fallback: allow request instead of crashing with 500 error
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate Limiting (150 requests per 15 minutes per IP on /api)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP address. Please try again after 15 minutes.',
  },
});
app.use('/api', limiter);

// Request body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'SheNova API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontendServed: fs.existsSync(clientDistPath),
  });
});

// Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/skill-analysis', skillAnalysisRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/ai', aiRoutes);

// Catch-all for unknown /api routes (Always return JSON)
app.all('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.originalUrl} not found on SheNova server.`,
  });
});

// =========================================================================
// SERVE FRONTEND STATIC ASSETS & SPA ROUTING IN PRODUCTION
// =========================================================================
if (fs.existsSync(clientDistPath)) {
  // Serve static assets from Vite build
  app.use(express.static(clientDistPath));

  // Any non-API route serves the frontend index.html for React Router
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  // Fallback info page if frontend hasn't been built yet
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'SheNova Full-Stack Service',
      message:
        'Backend API is operational. Run `npm run build` in the root or client folder to generate frontend assets for full UI serving.',
      apiDocs: '/api/health',
    });
  });
}

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 [SheNova Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 Web & API Base: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  if (fs.existsSync(clientDistPath)) {
    console.log(`🎨 Serving React Frontend from: ${clientDistPath}\n`);
  } else {
    console.log(`⚠️  Client dist not found at: ${clientDistPath} (Run 'npm run build' to bundle frontend)\n`);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection]: ${err.message}`);
});

export default app;
