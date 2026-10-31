import type {Metadata} from 'next';

export const siteUrl='https://island.15exoticanimalhotel.com.tw/';
export const siteTitle='壹伍特寵小知識莊園｜互動式特寵探索地圖與動物圖鑑';
export const siteDescription='走進壹伍非犬貓旅宿打造的線上特寵知識莊園！探索九大特寵生活區、尋找七種隱藏彩蛋，跟著保母巡視，收集16種動物圖鑑，認識不同動物的生活習性與有趣知識。';
const image={url:new URL('assets/seo/eco-island-share.jpg',siteUrl).href,width:1200,height:630,alt:'壹伍特寵小知識莊園的立體微縮動物探索地圖與壹伍原始品牌 Logo'};
export const siteMetadata:Metadata={
 metadataBase:new URL(siteUrl),title:siteTitle,description:siteDescription,applicationName:'壹伍特寵小知識莊園',
 openGraph:{type:'website',locale:'zh_TW',siteName:'壹伍特寵小知識莊園',title:siteTitle,description:siteDescription,url:siteUrl,images:[image]},
 twitter:{card:'summary_large_image',title:siteTitle,description:siteDescription,images:[{url:image.url,alt:image.alt}]}
};
export const homeMetadata:Metadata={alternates:{canonical:siteUrl},robots:{index:true,follow:true}};
export function reviewMetadata(label:string,path:string):Metadata{
 const title=`${label}（審閱頁）｜壹伍特寵小知識莊園`,url=new URL(path,siteUrl).href;
 return{title,robots:{index:false,follow:true},alternates:{canonical:url},openGraph:{...siteMetadata.openGraph,title,url}};
}
