import "./DateInput.scss";

type PropTypes = {
  label?: string;
  date: string;
  // setDate: React.Dispatch<React.SetStateAction<string>>;
  onChange: (date: string) => void;
};

const DateInput = ({
  label = "Select Date",
  // date,
  // setDate,
  onChange,
  ...props
}: PropTypes) => {
  return (
    <div className="date-input-container">
      {label && (
        <label className="date-input-label" htmlFor="date-input">
          {label}
        </label>
      )}
      <input
        type="date"
        id="date-input"
        className="date-input"
        // value={date}
        // defaultValue={date}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default DateInput;
