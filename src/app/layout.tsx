import type { Viewport } from 'next';
import {siteMetadata} from '@/lib/seo';
import './globals.css';
import './life.css';
import './refinements.css';
import './chapter3.css';
import './patrol-controls.css';
import './rabbit-life.css';
import './animal-life.css';
import './chapter5.css';
import './exploration.css';
import './field-guide.css';
import './mobile-experience.css';
import './diorama.css';
import './diorama-stage3.css';
import './diorama-stage4.css';
import './diorama-stage5.css';
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover',interactiveWidget:'resizes-content'};
export const metadata = siteMetadata;
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="zh-Hant"><body>{children}</body></html>}



