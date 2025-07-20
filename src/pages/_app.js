import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster 
        position="bottom-center" 
        reverseOrder={false} 
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          error: {
            style: {
              background: '#FF4B4B',
              color: '#fff',
            },
          },
        }}
      />
    </>
  );
}
