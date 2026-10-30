<template>
  <svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="pt-sack" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#d8b07c" /><stop offset=".6" stop-color="#a77a48" /><stop offset="1" stop-color="#6e4b2a" /></radialGradient>
      <linearGradient id="pt-parch" x1="0" x2="1"><stop offset="0" stop-color="#fff5dc" /><stop offset=".7" stop-color="#ead6aa" /><stop offset="1" stop-color="#c9ad7a" /></linearGradient>
      <linearGradient id="pt-roll" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6e7c4" /><stop offset=".5" stop-color="#d2b27c" /><stop offset="1" stop-color="#8f6d42" /></linearGradient>
      <linearGradient id="pt-gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe2a0" /><stop offset=".45" stop-color="#E3A23B" /><stop offset="1" stop-color="#8f5e17" /></linearGradient>
      <linearGradient id="pt-steel" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#e8edf2" /><stop offset=".5" stop-color="#a9b4bf" /><stop offset="1" stop-color="#5f6b78" /></linearGradient>
      <linearGradient id="pt-wood" x1="0" x2="1"><stop offset="0" stop-color="#b98a55" /><stop offset=".5" stop-color="#8a5d33" /><stop offset="1" stop-color="#55361c" /></linearGradient>
      <radialGradient id="pt-stone" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#e9e2cf" /><stop offset=".55" stop-color="#b7ad93" /><stop offset="1" stop-color="#746b55" /></radialGradient>
      <linearGradient id="pt-mud" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a3f26" /><stop offset="1" stop-color="#8a6640" /></linearGradient>
      <radialGradient id="pt-vignette" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#7a5a3a" stop-opacity="0" /><stop offset="1" stop-color="#7a5a3a" stop-opacity=".35" /></radialGradient>
      <radialGradient id="pt-glow"><stop offset="0" stop-color="#fff6d8" stop-opacity=".95" /><stop offset=".6" stop-color="#E3A23B" stop-opacity=".35" /><stop offset="1" stop-color="#E3A23B" stop-opacity="0" /></radialGradient>
      <filter id="pt-wash"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="7" /><feColorMatrix values="0 0 0 0 .72  0 0 0 0 .58  0 0 0 0 .36  0 0 0 .35 0" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      <filter id="pt-grit" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3" /><feColorMatrix values="0 0 0 0 .2  0 0 0 0 .13  0 0 0 0 .07  0 0 0 1.6 -.75" /><feComposite in2="SourceGraphic" operator="in" /></filter>
      <clipPath id="pt-medal" clipPathUnits="objectBoundingBox"><circle cx=".5" cy=".5" r=".5" /></clipPath>
    </defs>
  </svg>
</template>
