import Script from "next/script";
import type { Settings } from "@/lib/types";

const safe = (v: string) => v.replace(/[^A-Za-z0-9_\-/]/g, "");

export function Analytics({ s }: { s: Settings }) {
  const ga = safe(s.gaId), px = safe(s.pixelId), ads = safe(s.adsId);
  const adsBase = ads.split("/")[0];
  const gtagId = ga || adsBase;
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `window.__hml=${JSON.stringify({ adsId: ads })};` }} />
      {gtagId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`} strategy="afterInteractive" />
          <Script id="gtag" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());${ga ? `gtag('config','${ga}');` : ""}${ads ? `gtag('config','${adsBase}');` : ""}`}</Script>
        </>
      )}
      {px && (
        <Script id="fbq" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${px}');fbq('track','PageView');`}</Script>
      )}
    </>
  );
}
