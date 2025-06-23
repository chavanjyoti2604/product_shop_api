import "./InputField.css";

export default function InputField({ label, type, value, onChange, name }) {
  return (
    <div className="input-field">
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        required
      />
    </div>
  );
}
