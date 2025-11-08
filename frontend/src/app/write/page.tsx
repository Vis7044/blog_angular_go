'use client'

import BlogEditor from '@/components/BlogEditor'
import { UnsavedChangesProvider } from '@/context/UnsavedChangesContext'
import { useState } from 'react'

export default function Write() {


  return (
    
    <UnsavedChangesProvider>
      <div className="">
        <BlogEditor id="" InitialcoverPhoto='' IntialTitle='' IntitialContent='' Intialtags={[]}  />
      </div>
    </UnsavedChangesProvider>
  )
}
