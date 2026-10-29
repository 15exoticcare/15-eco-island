import type {NextConfig} from 'next';
const basePath=process.env.NEXT_PUBLIC_BASE_PATH||'';
const config:NextConfig={devIndicators:false,output:'export',trailingSlash:true,basePath};
export default config;
