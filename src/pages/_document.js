import Document, { Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);

    return { ...initialProps };
  }

  render() {
    return (
      <html lang="it" dir="ltr">
        <Head>
          <meta charSet="utf-8" />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta
            name="apple-mobile-web-app-title"
            content="Toduba Pastopay - area clienti"
          />
          <meta
            name="application-name"
            content="Toduba Pastopay - area clienti"
          />
          <meta
            name="description"
            content="Toduba Pastopay - il buono pasto facile, comodo e sicuro."
          />
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
