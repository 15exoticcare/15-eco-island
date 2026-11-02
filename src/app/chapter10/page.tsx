import CampaignTrial from '@/components/campaign/CampaignTrial';
import {reviewMetadata} from '@/lib/seo';
import '../chapter8/defense.css';
import '../chapter9/connected.css';
import './campaign.css';
export const metadata=reviewMetadata('九大動物區守護戰・第十階段測試','chapter10/');
export default function Page(){return <CampaignTrial/>}
