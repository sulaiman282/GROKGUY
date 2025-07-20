import React from 'react'
import Head from 'next/head';
import Navbar from "@/components/organisms/Navbar";
import HomeSection from "@/components/organisms/Home";
import ImageSlider from "@/components/organisms/ImageSlider";
import Footer from "@/components/organisms/Footer";
import MusicPlayer from "@/components/atoms/MusicPlayer";

export default function Home() {
  return (
    <main>
      <Head>
        <title>GROKGUY</title>
      </Head>
      <Navbar />
      <HomeSection />

    
      <Footer />
      <MusicPlayer />
    </main>
  )
}
