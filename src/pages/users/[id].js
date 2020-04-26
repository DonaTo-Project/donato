import { useEffect } from "react";

import Layout from "../../components/Layout";

function UserProfile(props) {
  const { address } = props;

  useEffect(() => {
    (async () => {
      const profile = await Box.getProfile(address);
      console.log(profile);
    })();
  }, []);

  return <Layout>{address}</Layout>;
}

export async function getServerSideProps(context) {
  const { id: address } = context.params;

  return { props: { address } };
}

export default UserProfile;
