import { COOKIES } from '@/content'
import { LegalPage } from '@/components/layout/LegalPage'

export const metadata = {
  title: COOKIES.title,
  description: COOKIES.description,
  alternates: { canonical: COOKIES.path },
  openGraph: { url: COOKIES.path, title: COOKIES.title, description: COOKIES.description },
}

export default function CookiePolicyPage() {
  return <LegalPage doc={COOKIES} />
}
