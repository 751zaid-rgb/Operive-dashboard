const express = require('express');
const { VertexAI } = require('@google-cloud/vertexai');

const app = express();
app.use(express.json());

// Serve all your existing static HTML/CSS files
app.use(express.static(__dirname)); 

// Step 2: Initialize Vertex AI
const vertex_ai = new VertexAI({
    project: 'project-5a308b74-70e6-4bc7-a12', 
    location: 'us-central1' // Using us-central1 for broader Gemini availability
});
const model = 'gemini-1.5-flash';

// Create a backend endpoint for your website to call
app.post('/api/generate-task', async (req, res) => {
  try {
    const userPrompt = req.body.prompt;
    const generativeModel = vertex_ai.getGenerativeModel({ model: model });
    
    const request = {
      contents: [{role: 'user', parts: [{text: userPrompt}]}],
    };

    const streamingResp = await generativeModel.generateContentStream(request);
    let fullText = '';
    
    for await (const item of streamingResp.stream) {
      if (item.text) fullText += item.text();
    }

    res.json({ success: true, text: fullText });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ success: false, error: 'Failed to generate response' });
  }
});

// Start the server using Cloud Run's default port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Operive Web App listening on port ${PORT}`);
});
