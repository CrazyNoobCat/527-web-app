const SubmitButton = ({ label }: { label: string }) => {
  return (
    <button type="submit" className="submit">
      {label}
    </button>
  );
};

export default SubmitButton;
