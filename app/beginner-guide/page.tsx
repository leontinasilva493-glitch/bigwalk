import { BeginnerGuideArticle, type BeginnerPage } from '../../components/beginner-guide';
import { evidenceMetadata } from '../../components/evidence-page';
import { siteSectionBySlug } from '../../lib/content.mjs';

const page = siteSectionBySlug('beginner-guide')!;
export const metadata = evidenceMetadata(page);
export default function BeginnerGuidePage() { return <BeginnerGuideArticle page={page as BeginnerPage} />; }
