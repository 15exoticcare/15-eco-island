'use client';
import {createContext,useContext} from 'react';
export const ArtExpansion=createContext(false);
export const useArtExpansion=()=>useContext(ArtExpansion);
