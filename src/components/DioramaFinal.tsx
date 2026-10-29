import {memo} from 'react';
import {assetUrl} from '@/lib/public-assets.mjs';
import {finalGround} from '@/lib/diorama-stage4';
export default memo(function DioramaFinal({front=false}:{front?:boolean}){return <>{Object.entries(finalGround).filter(([id])=>front?id==='front':id!=='front').map(([id,g])=><img key={id} className="diorama-final" data-ground={id} src={assetUrl(`/assets/diorama-stage4/${g.file}.webp`)} alt={g.description} draggable={false} style={{left:g.x,top:g.y,width:g.width,height:g.height}}/>)}</>});
