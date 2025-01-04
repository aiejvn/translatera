import { NextApiRequest, NextApiResponse } from 'next';

require('dotenv').config();

const apiKey = process.env.INFERA_API_KEY;
if(typeof(window) == 'undefined'){
  console.log("This is a server-side component");
}else{
  console.log("This is a client-side component.");
}

async function makePostRequest(payload: {
  "model": string;
  "messages": { "role": string; "content": string }[];
  "max_tokens": number;
  "temperature": number;
  "request_timeout_time": number;
}) {
  const headers = {
    "accept": "application/json",
    "api_key": apiKey || "key not found",
    "Content-Type": "application/json"
  };

  try {
    const response = await fetch(`https://api.infera.org/chat/completions`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error making API request:", error);
    throw error;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const payload = req.body;

    try {
      const response = await makePostRequest(payload);
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Error processing the request' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

