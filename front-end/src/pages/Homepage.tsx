import { useNavigate } from "react-router-dom";
import PrimaryButton from "../Components/buttons/PrimaryButton";
import "../styles/homepage.css";
import PageLink, { Page } from "../Components/PageLink";

const pages: Page[] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Login",
    link: "/login",
  },
  {
    label: "Dashboard",
    link: "/dashboard",
    protected: true,
  },
];

const Homepage = () => {
  return (
    <>
      <section>
        <h1>My App</h1>
        <p>A simple typescript/react project that implements routing</p>
      </section>

      <section>
        <h3>Index</h3>

        <ul>
          {pages.map((page, index) => (
            <PageLink label={page.label} link={page.link} />
          ))}
        </ul>
      </section>
    </>
  );
};

export default Homepage;
