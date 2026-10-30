'use client';
import {createContext,useContext}from'react';
export const ArtExploration=createContext(false);
export const useArtExploration=()=>useContext(ArtExploration);
