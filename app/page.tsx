"use client"

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
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

  const handleChange = (input:string) => {
    setContent(input);
    setMessage("Translating...")

    const params = new URLSearchParams({
      content : content, 
      input_language : inputLanguage,
      output_language : outputLanguage,
    });

    // console.log(params.get("content"));
    // console.log(params.get("input_language"));
    // console.log(params.get("output_langauge"));
    // console.log(outputLanguage);

    fetch(`flasktranslatera.duckdns.org/api/translate?${params}`).then(
      response => response.json()
    ).then(
      data => {
        // console.log(data);
        setMessage(data.message);
      }
    )
  }

  // so that we don't make requests on the user's every touch.
  useEffect(() => {
    const checkInput = () => {
      if(oldContent != content){
        handleChange(content);
        setOldContent(content);
      }
    }

    const timer = setInterval(checkInput, 2000);

    return () => clearInterval(timer);
  }, [content, oldContent, handleChange]);

  return (
    <main className='flex flex-row p-8 gap-2'>

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
                  <SelectItem value={language}>{language}</SelectItem>
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
                  <SelectItem value={language}>{language}</SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
    </main>
  )
}
