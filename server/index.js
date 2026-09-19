const express = require("express");
const multer = require("multer");
const cors = require("cors");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { GoogleGenAI } = require('@google/genai');
const { QdrantClient } = require('@qdrant/js-client-rest');

require('dotenv').config();

console.log("API key exists:", !!process.env.GEMINI_API_KEY);


const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: "uploads/" });

app.use(
  cors({
    origin: "https://pdf-rag-backend-740v.onrender.com/",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
const ai = new GoogleGenAI({
   apiKey: process.env.GEMINI_API_KEY
});

async function createEmbedding(text){
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-2',
    contents: text,
  });
  return response.embeddings[0].values;
};

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API,
});

app.get("/", (req, res) => {
  res.send("you are in Root directory");
});

app.get("/create-collection", async (req,res)=>{
  try{
    await qdrant.createCollection('pdf-docs',{
      vectors: {
        size: 3072,
        distance: "Cosine",
      }
    })
    res.send(`collection is created`);
  }catch(e){
    console.error(e);
    res.status(500).send("Failed to create collection");
  }
});

app.post("/upload", upload.single("pdf"), async (req, res) => {
  console.log(req.file);
  try{
    const dataBuffer = fs.readFileSync(req.file.path);
    const pdfData = await pdfParse(dataBuffer);
    const text = pdfData.text;
    const chunks = text.split("\n\n").filter((chunk)=> chunk.trim() != '');


    const chunkEmbedding = [];
    for(const chunk of chunks){
      const embedding = await createEmbedding(chunk);

      chunkEmbedding.push({
        text: chunk,
        embedding
      });
    }

    //vectorDB store points--->
    const points = chunkEmbedding.map((item, index)=>({
      id: index+1,
      vector: item.embedding,
      payload: {
        text: item.text
      },

    }));

    await qdrant.upsert("pdf-docs", {
      points,
    });


    const question = req.body.question;
    const quetsionEmbedding = await createEmbedding(question);


    const searchResult = await qdrant.query('pdf-docs', {
      vector: quetsionEmbedding,
      limit: 1,
      with_payload: true,
    });


    const bestChunk = searchResult.points[0].payload.text;
 
    
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      // contents: `Explain this pdf in single text ${chunks[0]}`
      contents: `Answer the question using the context: ${bestChunk} ans Question is: ${question}`
    })
    res.send(response.text);

  }catch(err){
   console.log(err);
   res.status(500).send(err);
  }

});

app.listen(port, () => {
  console.log(`app is listening on port: ${port}`);
});
