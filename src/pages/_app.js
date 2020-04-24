import { Provider } from "react-redux";

import "../style.css";

function MyApp({ Component, pageProps }) {
  const { Component, pageProps, reduxStore, router } = this.props;

  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  );
}

export { MyApp as default, UserContext };
