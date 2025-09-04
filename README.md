# CuraAlert API

A Node.js API service for document analysis and processing, built with Express and TypeScript.

## Features

- Document processing and analysis
- Vector database integration with Pinecone
- PDF parsing capabilities
- TypeScript support
- Development server with hot-reloading

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Pinecone account and API key

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cura-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   PINECONE_API_KEY=your_pinecone_api_key
   PINECONE_ENVIRONMENT=your_pinecone_environment
   PORT=3000
   ```

## Development

Start the development server with hot-reloading:
```bash
npm run dev
```

The server will be available at `http://localhost:3000` by default.

## Building for Production

1. Build the project:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

```
src/
  routes/       # API route handlers
  services/     # Business logic and external service integrations
  index.ts      # Application entry point
data/          # Data files and documents
```

## Testing

Run tests using:
```bash
npm test
```

## Environment Variables

- `PORT` - Port to run the server on (default: 3000)
- `PINECONE_API_KEY` - Your Pinecone API key
- `PINECONE_ENVIRONMENT` - Your Pinecone environment

## Dependencies

- Express - Web framework
- Pinecone - Vector database
- LangChain - LLM application framework
- TypeScript - Type checking
- Vitest - Testing framework

## License

This project is private and confidential.
