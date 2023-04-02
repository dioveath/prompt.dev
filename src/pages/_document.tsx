import Document, { Html, Head, Main, NextScript, DocumentProps, DocumentContext } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance'
import { AppType } from 'next/app';
import createEmotionCache from '@/lib/createEmotionCache';
import React from 'react';
import { MyAppProps } from './_app';

interface MyDocumentProps extends DocumentProps {
  emotionStyleTags: JSX.Element[];
}

class MyDocument extends Document {

  constructor(props: MyDocumentProps) {
    super(props);
  }

  static async getInitialProps(ctx : DocumentContext) {
    const originalRenderPage = ctx.renderPage;
    const cache = createEmotionCache();
    const { extractCriticalToChunks } = createEmotionServer(cache);

    ctx.renderPage = () => originalRenderPage({
      enhanceApp: (App: React.ComponentType<React.ComponentProps<AppType> & MyAppProps>) => (props) => <App emotionCache={cache} {...props} /> 
    });

    const initialProps = await Document.getInitialProps(ctx);
    const emotionStyles = extractCriticalToChunks(initialProps.html);
    const emotionStyleTags = emotionStyles.styles.map(style => (
      <style
        data-emotion={`${style.key} ${style.ids.join(' ')}`}
        key={style.key}
        dangerouslySetInnerHTML={{ __html: style.css }}
      />
    ));

    return {
      ...initialProps,
      emotionStyleTags
    };
  }

  render() {
    const { emotionStyleTags } = this.props as MyDocumentProps;
    return (
      <Html>
        <Head>
          {/* <meta name='theme-color' content={theme.palette.primary.main}/> */}
          <link rel="shortcut ico" href="/favicon.ico" />
          <meta name='emotion-insertion-point' content=''/>
          { emotionStyleTags }
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;