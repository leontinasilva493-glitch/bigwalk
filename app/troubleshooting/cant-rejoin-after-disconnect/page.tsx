import { permanentRedirect } from 'next/navigation';

export default function LegacyCantRejoinPage() {
  permanentRedirect('/troubleshooting/cant-connect-or-join');
}
