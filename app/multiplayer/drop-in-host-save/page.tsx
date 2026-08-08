import { permanentRedirect } from 'next/navigation';

export default function LegacyDropInHostSavePage() {
  permanentRedirect('/multiplayer/hosting-and-saves');
}
