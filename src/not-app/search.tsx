'use client';
import React from 'react'
import { Input } from '@nextui-org/react';
import Button from '@/ui/button';

export default function Search() {
  return (
    <div className='flex gap-2 sm:px-8 md:px-16 lg:px-24'>
        <Input placeholder="What do you want to improve from AI..." css={{width: '100%'}}/>
        <Button> Search </Button>
    </div>
    

  )
}
