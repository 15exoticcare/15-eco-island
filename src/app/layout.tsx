import type { Metadata, Viewport } from 'next';
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
export const metadata: Metadata = {title:'壹伍生態島｜每一種特別，都值得被溫柔對待',description:'探索壹伍非犬貓旅宿的微縮浮島世界，與寵物保母一起認識兔兔與鸚鵡。'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="zh-Hant"><body>{children}</body></html>}



