const { GoogleGenerativeAI } = require('@google/generative-ai');

async function main() {
  const apiKey = 'AIzaSyBNxQ6itvKRsfEXA-PvYxOYWG6AvcrW_1U';
  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    const result = await genAI.listModels();
    console.log('Available models:');
    result.models.forEach(model => {
      console.log(`- ${model.name} (${model.displayName})`);
    });
  } catch (error) {
    console.error('Error listing models:', error);
  }
}

main();
