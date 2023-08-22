import "../../styles/buttons.css";

export type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
};

const PrimaryButton = ({ label, className, onClick }: ButtonProps) => {
  return (
    <button onClick={onClick} className={"primary " + className}>
      {label}
    </button>
  );
};

export default PrimaryButton;
