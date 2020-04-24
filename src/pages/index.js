import { UserContext } from "./_app";
import Layout from "../components/layout";
import { useContext } from "react";

function Home() {
  const user = useContext(UserContext);

  console.log(user);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center">
        <div className="flex justify-between w-full px-2 py-4 border-2 border-gray-200 rounded">
          <h2>I'm a recipient, please donate!</h2>
          <button>Donate</button>
        </div>
      </div>
    </Layout>
  );
}

export default Home;
