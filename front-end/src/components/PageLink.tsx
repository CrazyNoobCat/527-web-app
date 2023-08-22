import { Link } from "react-router-dom";

export type Page = {
  label: string;
  link: string;
  protected?: boolean;
};

const PageLink = ({ label, link }: Page) => {
  return (
    <li>
      <Link to={link}>
        {label}: <span>www.myapp.com{link}</span>
      </Link>
    </li>
  );
};

export default PageLink;
