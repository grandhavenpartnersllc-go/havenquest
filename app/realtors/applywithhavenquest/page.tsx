import type { Metadata } from 'next'
import { Suspense } from 'react'
import Header from '../../../components/shared/Header'
import Footer from '../../../components/shared/Footer'
import FullApplicationClient from '../../../components/realtors/FullApplicationClient'

export const metadata: Metadata = {
  title: 'Partner Application — HavenQuest',
  robots: { index: false, follow: false },
}

export default function FullApplicationPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-surface">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading your application…</p>
          </div>
        }>
          <FullApplicationClient />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
