import express from 'express';
import dotenv from 'dotenv';
import { router as analysisRouter } from './routes/analysis.js';
import { initializePineconeIndex } from './services/pinecone.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3090;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Analysis routes
app.use('/api/v1/analyze', analysisRouter);

// Initialize Pinecone and start server
async function startServer() {
  try {
    await initializePineconeIndex();
    app.listen(port, () => {
      console.log(`CuraAlert API running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();