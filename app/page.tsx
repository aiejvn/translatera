"use client"

import React, { useEffect, useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Home() {
  const [message, setMessage] = useState("");
  const [content, setContent] = useState("");
  const [oldContent, setOldContent] = useState(""); // to know if user changed input or not
  const [inputLanguage, setInputLanguage] = useState("English");
  const [outputLanguage, setOutputLanguage] = useState("French");

  const languages: string[] = [
    "English",
    "Mandarin Chinese",
    "Hindi",
    "Spanish",
    "French",
    "Arabic",
    "Bengali",
    "Portugese",
    "Russian",
    "Urdu",
    "Indonesian",
    "German",
    "Japanese",
    "Swahili",
    "Marathi",
    "Telugu",
    "Turkish",
    "Tamil",
    "Korean",
    "Vietnamese"
  ]

  // so that we don't make requests on the user's every touch.
  useEffect(() => {
    const handleChange = async (input:string) => {
      setContent(input);
      setMessage("Translating...");
      
      const payload = {
        "model": "llama3.1:8b",
        "messages": [{
            "role" : "user",
            "content" : `Translate ${content} from ${inputLanguage} to ${outputLanguage}. Output should contain words from ${outputLanguage} only.`
        }],
        "max_tokens": 120,
        "temperature": 0.9,
        "request_timeout_time": 240
      };
  
      try {
        const response = await fetch('/api/server', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        setMessage(data.choices[0].message.content);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    const checkInput = () => {
      if(oldContent != content){
        handleChange(content);
        setOldContent(content);
      }
    }

    const timer = setInterval(checkInput, 2000);

    return () => clearInterval(timer);
  }, [content, oldContent, inputLanguage, outputLanguage]);

  return (
    <div>
      {/* Header */}
      <div>
        <img
          src="./logov0.png"
          alt="translatera logo"
          className='w-[500]'
        />
        <hr className='h-1 bg-black border-0'></hr>
      </div>
      {/* Main translation section */}
      <main className='content-container flex flex-row p-8 gap-2'>
        
          <div className='flex flex-col'>
            <Textarea 
              placeholder='Enter some text to start...'
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className='w-[600px] h-[300px]'
            />

            <Select onValueChange={(language:string) => setInputLanguage(language)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="English" />
              </SelectTrigger>
              <SelectContent>
                {
                  languages.map(language => (
                    <SelectItem value={language} key={language}>{language}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>

          <div className='flex flex-col ml-[170px]'>
            <Textarea 
              placeholder=''
              value={message}
              readOnly
              className='w-[600px] h-[300px]'
            />
            

            <Select onValueChange={(language:string) => setOutputLanguage(language)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="French" />
              </SelectTrigger>
              <SelectContent>
                {
                  languages.map(language => (
                    <SelectItem value={language} key={language}>{language}</SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
          </div>
      </main>
      {/* Footer stuff */}
      <footer className="flex flex-row gap-4">
        <a href="https://github.com/aiejvn/translatera">
          <img
            src="./github-logo.png"
            alt="Github Repo Source"
            className="h-[40] w-[40] ml-3"
          />
        </a>
        <a href="https://www.infera.org/">
          <img
            src="./infera-logo.png"
            alt="infera.org"
            className="h-[40] w-[40] rounded-3xl"
          />
        </a>
      </footer>
    </div>
  )
}
