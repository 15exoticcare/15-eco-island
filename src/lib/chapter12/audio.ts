import {AudioManager as BaseManager,defaults as oldDefaults,parseAudio as parseSaved,type Preferences} from '../chapter11/audio.ts';import {bosses,isBoss} from './bosses.ts';export {audioKey,type Preferences} from '../chapter11/audio.ts';
export const defaults=():Preferences=>({...oldDefaults(),music:true,effects:true,musicVolume:.35,effectsVolume:.65});
export function parseAudio(raw:string|null):Preferences{try{const v=JSON.parse(raw??'null');if(v?.version===1)return parseSaved(raw)}catch{}return defaults()}
// Reuse the same context, compressor, voice cap, preferences and rate limiter.
export class AudioManager extends BaseManager{
 preferences=defaults();
 private fading:{source:AudioBufferSourceNode;gain:GainNode}|null=null;
 // Fade the outgoing loop to silence before starting another track. Keep only
 // one context and use source.onended, never a wall-clock retry timer.
 apply(){
  if(this.fading){
   if(this.disposed||this.paused||this.preferences.muted||!this.preferences.music){const old=this.fading;this.fading=null;old.source.onended=null;try{old.source.stop()}catch{}old.source.disconnect();old.gain.disconnect();super.apply()}
   return;
  }
  const track=this.previewTrack??this.track;
  if(this.music&&this.unlocked&&!this.disposed&&!this.paused&&!this.preferences.muted&&this.preferences.music&&this.music.source.buffer!==this.buffers.get(track)){
   const old=this.music;this.fading=old;super.stopMusic();old.source.onended=()=>{old.source.disconnect();old.gain.disconnect();this.fading=null;if(!this.disposed)this.apply()};return;
  }
  super.apply();
 }
 dispose(){if(this.fading){this.fading.source.onended=null;try{this.fading.source.stop()}catch{}this.fading.source.disconnect();this.fading.gain.disconnect();this.fading=null}super.dispose()}
 stopMusic(){
  if(this.music&&this.context&&(this.disposed||this.paused||this.preferences.muted||!this.preferences.music)){
   const old=this.music;this.music=null;old.source.onended=null;try{old.source.stop()}catch{}old.source.disconnect();old.gain.disconnect();return;
  }
  super.stopMusic();
 }
 play(type:string,kind=''){const before=new Set(this.voices),boss=isBoss(kind)?bosses[kind]:null,mapped=type==='boss-warning'?'charge':type==='boss-phase'?'shield':type==='boss-skill'?'support-impact':type==='guards'?'split':type==='royal-shield'?'shield':type;const ok=super.play(mapped,kind);if(ok&&boss&&this.context)for(const voice of this.voices)if(!before.has(voice))voice.osc.detune.setValueAtTime((boss.cue-4)*75,this.context.currentTime);return ok}}
