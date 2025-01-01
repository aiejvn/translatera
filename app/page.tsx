import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
    fetch("https://127.0.0.1:8000/api/translate")
  }, [])

  return (
    <main>
        <p></p>
    </main>
  )
}
