import {memo} from 'react';
import {assetUrl} from '@/lib/public-assets.mjs';
import {dioramaGround} from '@/lib/diorama';
export default memo(function DioramaGround(){return <>
 <img className="diorama-mainland" src={assetUrl('/assets/diorama-v1/three-zone-mainland.webp')} alt="連續草地與石板路串連壹伍照護中心、兔兔草地與鸚鵡樹屋" draggable={false} style={{left:dioramaGround.x,top:dioramaGround.y,width:dioramaGround.width,height:dioramaGround.height}}/>
 <div className="diorama-brand"><img src={assetUrl('/assets/logo-original.jpg')} alt="壹伍原始品牌商標"/><span>壹伍<small>非犬貓照護中心</small></span></div>
 </>});
