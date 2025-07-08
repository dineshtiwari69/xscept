"use client"
import { useEffect, useState } from "react";
import { invoke } from '@tauri-apps/api/core';
import HomePage from "../components/HomePage";


export default function Home() {
  // Listen for user key inputs and set full screen.
  useEffect(() => {
    const listener = (event: any) => {
      if (event.key === 'F11') {
        event.preventDefault(); // Prevent browser default behavior
        invoke('toggle_fullscreen');
      }
    }
    window.addEventListener('keydown', listener);
    // Cleanup
    return () => {
      window.removeEventListener('keydown', listener);
    }
  }, [])




  return (
    <>
    <HomePage/>
    </> 
  );
}
