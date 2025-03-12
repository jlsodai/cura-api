import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX || 'mynewindex';

let pinecone: Pinecone;

export async function initializePineconeIndex() {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY not found in environment variables');
  }

  pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const index = pinecone.Index(PINECONE_INDEX_NAME);

  // Check if index needs to be populated
  const indexStats = await index.describeIndexStats();
  if (indexStats.totalRecordCount === 0) {
    await populateIndex(index);
  }

  return index;
}

async function populateIndex(index: any) {
  // Load and process the BNF PDF
  const loader = new PDFLoader('./data/bnf.pdf');
  const docs = await loader.load();

  // Split documents into chunks
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await textSplitter.splitDocuments(docs);

  // Create embeddings
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  // Batch process documents and upsert to Pinecone
  const batchSize = 100;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const vectors = await Promise.all(
      batch.map(async (doc) => {
        const embedding = await embeddings.embedQuery(doc.pageContent);
        return {
          id: `doc_${i}_${doc.metadata.page}`,
          values: embedding,
          metadata: {
            text: doc.pageContent,
            page: doc.metadata.page,
          },
        };
      })
    );
    await index.upsert(vectors);
  }
}

export async function queryPinecone(query: string, topK: number = 5) {
  const index = pinecone.Index(PINECONE_INDEX_NAME);
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const queryEmbedding = await embeddings.embedQuery(query);
  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return results.matches;
}