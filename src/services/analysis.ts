import { queryPinecone } from './pinecone.js';

interface AnalysisResult {
  status: string;
  data: {
    safetyScore: number;
    interactions: Array<{
      severity: string;
      description: string;
      recommendation: string;
      evidence: {
        source: string;
        page: number;
        confidence: number;
      };
    }>;
    alternatives: Array<{
      name: string;
      reason: string;
      safetyScore: number;
    }>;
  };
  metadata: {
    analysisTimestamp: string;
    dataVersion: string;
  };
}

export async function analyzeInteractions(data: any): Promise<AnalysisResult> {
  const { currentMedications, newItem } = data;
  
  // Construct query for each current medication
  const queries = currentMedications.map(med => 
    `${med.name} interaction with ${newItem.name}`
  );

  // Get relevant information from Pinecone for each query
  const results = await Promise.all(
    queries.map(query => queryPinecone(query))
  );

  // Process and analyze the results
  const interactions = results.flatMap((result, index) => {
    if (!result.length) return [];

    // Extract interaction information from the matched documents
    return {
      severity: determineSeverity(result[0].metadata.text),
      description: extractDescription(result[0].metadata.text),
      recommendation: generateRecommendation(result[0].metadata.text),
      evidence: {
        source: 'BNF 82',
        page: result[0].metadata.page,
        confidence: result[0].score,
      },
    };
  });

  return {
    status: 'success',
    data: {
      safetyScore: calculateSafetyScore(interactions),
      interactions,
      alternatives: await findAlternatives(newItem.name, interactions),
    },
    metadata: {
      analysisTimestamp: new Date().toISOString(),
      dataVersion: 'BNF-82',
    },
  };
}

export async function analyzeFoodCompatibility(data: any): Promise<AnalysisResult> {
  const { currentMedications, newItem } = data;
  
  // Similar to analyzeInteractions but focused on food interactions
  const queries = currentMedications.map(med => 
    `${med.name} interaction with ${newItem.name} food`
  );

  const results = await Promise.all(
    queries.map(query => queryPinecone(query))
  );

  const interactions = results.flatMap((result, index) => {
    if (!result.length) return [];

    return {
      severity: determineSeverity(result[0].metadata.text),
      description: extractDescription(result[0].metadata.text),
      recommendation: generateRecommendation(result[0].metadata.text),
      evidence: {
        source: 'BNF 82',
        page: result[0].metadata.page,
        confidence: result[0].score,
      },
    };
  });

  return {
    status: 'success',
    data: {
      safetyScore: calculateSafetyScore(interactions),
      interactions,
      alternatives: await findAlternativeFoods(newItem.name, interactions),
    },
    metadata: {
      analysisTimestamp: new Date().toISOString(),
      dataVersion: 'BNF-82',
    },
  };
}

// Helper functions
function determineSeverity(text: string): string {
  // Implement severity determination logic based on text analysis
  return 'moderate';
}

function extractDescription(text: string): string {
  // Implement description extraction logic
  return text.substring(0, 200);
}

function generateRecommendation(text: string): string {
  // Implement recommendation generation logic
  return 'Consult healthcare provider before use';
}

function calculateSafetyScore(interactions: any[]): number {
  // Implement safety score calculation logic
  return 0.5;
}

async function findAlternatives(item: string, interactions: any[]): Promise<any[]> {
  // Implement alternatives finding logic
  return [];
}

async function findAlternativeFoods(food: string, interactions: any[]): Promise<any[]> {
  // Implement food alternatives finding logic
  return [];
}