import {memo} from 'react';
import {assetUrl} from '@/lib/public-assets.mjs';
import {expansionGround} from '@/lib/diorama-stage3';
export default memo(function DioramaExpansion(){return <>
 <img className="diorama-expansion" src={assetUrl('/assets/diorama-stage3/left-mainland.webp')} alt="天竺鼠草地與狐獴丘陵之間的自然步道及溪流短橋" draggable={false} style={{left:expansionGround.left.x,top:expansionGround.left.y,width:expansionGround.left.width,height:expansionGround.left.height}}/>
 <img className="diorama-expansion" src={assetUrl('/assets/diorama-stage3/ferret-garden.webp')} alt="雪貂隧道與休憩小屋，草地接向鸚鵡區外側" draggable={false} style={{left:expansionGround.ferret.x,top:expansionGround.ferret.y,width:expansionGround.ferret.width,height:expansionGround.ferret.height}}/>
 </>});
