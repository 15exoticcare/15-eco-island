// Arrival policy used by the existing life controllers; no timers, travel or second event bus.
export const keeperPolicies={
 rabbit:{preferred:['white','grey'],radius:650,limit:2,protected:['lop','cream'],purpose:'觀察活動狀態，拿平板記錄',labels:['抬頭觀察','動耳聆聽']},
 guinea:{preferred:['guinea-2','guinea-3'],radius:500,limit:2,purpose:'查看牧草與飲食區',labels:['躲藏區前抬頭','短暫觀察']},
 hamster:{preferred:['hamster-1','hamster-3'],radius:500,limit:1,quiet:true,chance:.55,protected:['hamster-4'],purpose:'安靜查看環境',labels:['洞口附近探看']},
 parrot:{preferred:['sun','cockatiel'],radius:550,limit:2,purpose:'在安全步道觀察並記錄',labels:['好奇轉頭','輕輕整理羽冠']},
 hedgehog:{preferred:['hedgehog-2','hedgehog-1'],radius:500,limit:1,quiet:true,chance:.4,protected:['hedgehog-3'],purpose:'安靜查看環境，不驚擾休息',labels:['輕輕探頭']},
 ferret:{preferred:['ferret-1','ferret-2'],radius:500,limit:1,purpose:'查看活動區與休息區',labels:['好奇探看']},
 meerkat:{preferred:['meerkat-1','meerkat-2'],radius:500,limit:2,purpose:'從安全位置觀察警戒與活動',labels:['留意四周','安坐觀察']},
 chinchilla:{preferred:['chinchilla-1','chinchilla-2'],radius:500,limit:1,purpose:'查看環境與活動空間',labels:['輕輕整理毛髮','轉頭觀察']},
 glider:{preferred:['glider-2'],radius:500,limit:1,quiet:true,chance:.4,protected:['glider-3'],purpose:'保留夜行性作息，安靜觀察',labels:['抱枝探頭']}
};
export function planKeeperReactions({island,residents,point,clock,random}){
 const policy=keeperPolicies[island];if(!policy)return [];
 const group=residents.filter(r=>!r.island||r.island===island),attentive=group.filter(r=>['observe','listen'].includes(r.state)||r.noticeIn!==null&&r.noticeIn!==undefined||r.attention||r.reaction);
 const capacity=Math.max(0,Math.min(policy.limit,group.length-1)-attentive.length);
 if(!capacity||policy.quiet&&random()>policy.chance)return [];
 // Curled / sleeping portraits are protected. Open-eyed idle portraits may briefly
 // notice a visitor; that is different from waking every nocturnal resident.
 const candidates=group.filter(r=>!attentive.includes(r)&&!r.sleeping&&!policy.protected?.includes(r.id)&&clock-(r.lastNotice??-Infinity)>35000&&!(island==='rabbit'&&['graze','groom'].includes(r.state)))
  .map(r=>({r,d:Math.hypot(r.position.x-point.x,r.position.y-point.y)})).filter(a=>a.d<policy.radius)
  .map(a=>({...a,rank:a.d-(policy.preferred.includes(a.r.id)?360:0)+random()*110})).sort((a,b)=>a.rank-b.rank);
 return candidates.slice(0,capacity).map(({r},n)=>{
  const variant=r.lastVisitVariant===0?1:r.lastVisitVariant===1?0:Math.floor(random()*2);
  let state='observe',sequence=variant?[0,1,0,1,0]:[0,1,1,0],label=policy.labels[n%policy.labels.length];
  if(island==='rabbit'){state=r.id==='grey'?'listen':'observe';label=state==='listen'?'動耳聆聽':'抬頭觀察';sequence=state==='listen'?(variant?[0,2,0,3,0]:[0,2,3,2,0]):sequence;}
  if(r.id==='sun')label='好奇轉頭';
  if(r.id==='cockatiel'||r.id==='chinchilla-1'){state='care';label=r.id==='cockatiel'?'羽冠微動':'輕輕洗臉';sequence=variant?[0,2,0,3,0]:[0,2,3,2,0];}
  if(r.id==='meerkat-1'){state='care';sequence=variant?[0,1,0]:[0,1,1,0];label='高處留意四周';}
  if(r.id==='glider-1')sequence=variant?[8,9,8]:[8,9,9,8];
  return {id:r.id,state,sequence,label,variant,delay:250+n*900+random()*180,duration:3400+random()*900};
 });
}
