'use client';
import {createContext,useContext} from 'react';
export const ArtFinal=createContext(false);
export const useArtFinal=()=>useContext(ArtFinal);
