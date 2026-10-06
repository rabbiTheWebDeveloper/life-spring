'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useState, FormEvent, KeyboardEvent } from 'react'

interface Props {
  url: string;
  prop: string;
}

const Searcher = ({ url, prop }: Props) => {
  const [search, setSearch] = useState<string>("");
  const router = useRouter();

  const handleSearch = (event: FormEvent<HTMLInputElement>) => {
    const newSearch = event.currentTarget.value;
    setSearch(newSearch);
    updateURL(newSearch);
  }

  const updateURL = (searchValue: string) => {
    if (searchValue !== "") {
      router.push(`${url}&${prop}=${searchValue}` , {scroll : false});
    } else {
      router.push(`${url}`, {scroll : false});
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateURL(search);
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      updateURL(search);
    }
  }

  const handleReset = () => {
    setSearch("");
    router.push(`${url}`, {scroll : false});
  }

  return (
    <form onSubmit={handleSubmit} className='w-[200px] md:w-[300px]  h-8 rounded-md border border-primary flex gap-2 text-sm items-center p-[18px] relative'>
      <Image src='/search.svg' width={24} height={24} alt='search' />
      <input
        type="text"
        placeholder='Search'
        className='outline-none flex-grow'
        value={search}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      {search && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute right-2 text-red-500  focus:outline-none"
          aria-label="Reset search"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </form>
  )
}

export default Searcher
