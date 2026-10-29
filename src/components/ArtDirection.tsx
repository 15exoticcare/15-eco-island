'use client';
import {createContext,useContext} from 'react';
export const ArtDirection=createContext(false);
export const useDiorama=()=>useContext(ArtDirection);
