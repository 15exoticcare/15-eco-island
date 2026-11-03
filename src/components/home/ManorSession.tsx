'use client';

import CampaignTrial from '@/components/chapter12/CampaignTrial';
import {SoundProvider} from '@/components/chapter12/Sound';

export default function ManorSession({initialMode, onHome}: {
  initialMode: 'explore' | 'defense';
  onHome: () => void;
}) {
  // Returning home unmounts the battle, patrol and their single audio provider.
  // Their existing cleanup handlers release the keeper and stop their clocks.
  return <SoundProvider><CampaignTrial initialMode={initialMode} production onHome={onHome}/></SoundProvider>;
}
