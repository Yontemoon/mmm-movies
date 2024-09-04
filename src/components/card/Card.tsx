import "./Card.scss";

type PropTypes = {
  children: React.ReactNode;
};

const Card = ({ children }: PropTypes) => {
  return <div className="card-wrapper">{children}</div>;
};

export default Card;
