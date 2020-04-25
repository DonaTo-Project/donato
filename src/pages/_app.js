import { Provider } from "react-redux";

import withReduxStore from "../lib/withReduxStore";

import "../style.css";

function DonatoApp({ Component, pageProps, reduxStore }) {
  return (
    <Provider store={reduxStore}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default withReduxStore(DonatoApp);
