import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { VercelToolbar } from '@vercel/toolbar/next'
import type { Metadata } from 'next'
import { Author } from 'next/dist/lib/metadata/types/metadata-types'
import dynamic from 'next/dynamic'
import { draftMode } from 'next/headers'
import { ThemeProvider } from 'next-themes'
import { Suspense } from 'react'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { loadHomePage } from '@/sanity/loader/loadQuery'

const LiveVisualEditing = dynamic(
  () => import('@/sanity/loader/LiveVisualEditing'),
)

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await loadHomePage()

  return {
    metadataBase: new URL(
      `https://${process?.env?.VERCEL_PROJECT_PRODUCTION_URL}`,
    ),
    title: data?.metadataBase?.title,
    description: data?.metadataBase?.description,
    keywords: data?.metadataBase?.keywords,
    authors: data?.metadataBase?.authors,
    publisher: data?.metadataBase?.publisher,
    openGraph: {
      title: data?.metadataBase?.opengraph?.title,
      description: data?.metadataBase?.opengraph?.description,
      url: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`),
      images: [
        {
          url:
            '/api/og?title=' +
            encodeURIComponent(data?.metadataBase?.title?.toString() ?? ''),
        },
      ],
    },
  }
}

export default function IndexRoute({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SiteHeader />
      <div className="pb-8 px-4 max-w-7xl mx-auto">{children}</div>
      <SiteFooter />
      {draftMode().isEnabled && <LiveVisualEditing />}
      <Suspense>
        <VercelToolbar />
      </Suspense>
      <SpeedInsights />
      <Analytics />
    </ThemeProvider>
  )
}
