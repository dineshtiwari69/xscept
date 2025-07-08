'use client';




import {  QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

interface RootProviderProps {
  children: React.ReactNode;
 
}

export default function RootProviders({
  children,
  
}: RootProviderProps) {
  

  return (
    
      <QueryClientProvider client={queryClient}>
         {children}
      </QueryClientProvider>
    
  );
}
