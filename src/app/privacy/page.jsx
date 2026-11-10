import { PRIVACY } from '@/content'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata = {
  title: PRIVACY.title,
  description: PRIVACY.description,
  alternates: { canonical: PRIVACY.path },
  openGraph: { url: PRIVACY.path, title: PRIVACY.title, description: PRIVACY.description },
}

export default function PrivacyPage() {
  return <LegalPage doc={PRIVACY} />
}
