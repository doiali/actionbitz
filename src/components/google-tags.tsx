/* eslint-disable @next/next/no-before-interactive-script-outside-document */
import Script from 'next/script'

export default function GoogleTags() {
  return process.env.NODE_ENV === 'production' ? (
    <>
      <Script id="google-tag-manager"
        strategy="beforeInteractive"
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-0CN2FBL626"
      />
      <Script id="google-tag" strategy="beforeInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-0CN2FBL626');
        `}
      </Script>
    </>
  ) : null
}