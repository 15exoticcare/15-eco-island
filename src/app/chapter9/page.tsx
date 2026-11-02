import DefenseTrial from '@/components/defense/DefenseTrial';
import {reviewMetadata} from '@/lib/seo';
import '../chapter8/defense.css';
import './connected.css';
export const metadata=reviewMetadata('莊園防衛戰・第九階段連通測試','chapter9/');
export default function Page(){return <DefenseTrial edition={9}/>}
