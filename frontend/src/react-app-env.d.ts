/// <reference types="react-scripts" />

declare module 'react-hot-toast' {
  export default function toast(message: string): void;
  export interface Toast {
    success: (message: string) => void;
    error: (message: string) => void;
  }
  export const toast: Toast;
}