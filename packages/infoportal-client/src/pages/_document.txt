import * as React from 'react'
import {DocumentContext, DocumentProps, Head, Html, Main, NextScript} from 'next/document'
import {appConfig} from '@/conf/AppConfig'
import {Txt} from '@/shared'
import {Box} from '@mui/material'
import {IpAlert} from '@/shared/Alert'
import {documentGetInitialProps, DocumentHeadTags, DocumentHeadTagsProps} from '@mui/material-nextjs/v15-pagesRouter'
import MuiXLicense from '@/core/MuiXLicense'

const isStupidMicrosoftBrowser =
  typeof window !== 'undefined' &&
  (window.navigator.userAgent.includes('Edg') ||
    window.navigator.userAgent.includes('MSIE') ||
    window.navigator.userAgent.includes('Trident'))

export default function MyDocument(props: DocumentProps & DocumentHeadTagsProps) {
  return (
    <Html lang="en" suppressHydrationWarning>
      <MuiXLicense />
      <Head>
        <meta charSet="utf-8" />
        <base href="/" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/*<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />*/}
        <link rel="icon" type="image/x-icon" href="/static/favicon.svg" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .material-icons {
                font-family: 'Material Icons';
                font-weight: normal;
                font-style: normal;
                font-size: 24px;
                line-height: 1;
                letter-spacing: normal;
                text-transform: none;
                display: inline-block;
                white-space: nowrap;
                word-wrap: normal;
                direction: ltr;
                -webkit-font-feature-settings: "liga";
                -webkit-font-smoothing: antialiased;
              }
            `,
          }}
        />
        <meta name="emotion-insertion-point" content="" />
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        {isStupidMicrosoftBrowser && (
          <IpAlert deletable="transient" color="warning" sx={{minHeight: 30, height: 30}}>
            This app may not working well on Edge and IE. Please install a
            <Txt link sx={{textDecoration: 'underline'}}>
              <a href="https://www.mozilla.org/en-US/firefox/new/">real browser</a>
            </Txt>
            , not a Microsoft one.
          </IpAlert>
        )}
        {process.env.NODE_ENV === 'development' && (
          <Box
            sx={{
              '@media print': {display: 'none'},
              zIndex: 1000,
              height: 2,
              background: 'blue',
              position: 'fixed',
              top: 0,
              right: 0,
              left: 0,
            }}
          />
        )}
        <Main />
        <NextScript />
        <script async type="text/javascript" src="https://www.gstatic.com/charts/loader.js" />
        <script async defer src={`https://maps.googleapis.com/maps/api/js?key=${appConfig.gooogle.apiKey}`} />
      </body>
    </Html>
  )
}

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const finalProps = await documentGetInitialProps(ctx)
  return finalProps
}
