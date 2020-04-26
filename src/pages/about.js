import Layout from "../components/Layout";

function About() {
  return (
    <Layout>
      <div className="flex flex-col md:flex-row">
        <div>
          {[
            {
              heading: `What is Donato?`,
              body: `Donation project`,
            },
          ].map((section, i) => (
            <div key={i}>
              <h2 className="mb-3 text-xl font-bold">{section.heading}</h2>
              <p className="mb-6">{section.body}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default About;
