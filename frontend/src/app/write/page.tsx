'use client'

import BlogEditor from '@/components/BlogEditor'
import { useState } from 'react'

export default function Write() {


  return (
    <div className="max-w-3xl p-6 mx-10 w-full">
      <h1 className="text-3xl font-semibold mb-2">What&apos;s in your mind today!</h1>

      

      <BlogEditor />

      
    </div>
  )
}
