'use client';

import CampaignTrial from '@/components/chapter12/CampaignTrial';

export default function ManorSession({initialMode, onHome}: {
  initialMode: 'explore' | 'defense';
  onHome: () => void;
}) {
  // Returning home unmounts battle and patrol; the parent owns one audio provider.
  // Their existing cleanup handlers release the keeper and stop their clocks.
  return <CampaignTrial initialMode={initialMode} production onHome={onHome}/>;
}
