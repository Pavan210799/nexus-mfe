import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function TextField(props) {
  const [show, setShow] = useState(false);
  const isPassword = props.type === "password";
  let type = props.type || "text";

  if (isPassword && show) {
    type = "text";
  }

  return (
    <label className="field-label">
      {props.label}
      <span className="field-wrap">
        <input
          className={isPassword ? "field has-toggle" : "field"}
          type={type}
          value={props.value}
          onChange={props.onChange}
          placeholder={props.placeholder}
          required={props.required}
          autoComplete={props.autoComplete}
        />
        {isPassword ? (
          <button
            type="button"
            className="field-toggle"
            aria-label={show ? "Hide password" : "Show password"}
            title={show ? "Hide password" : "Show password"}
            onClick={function () {
              setShow(!show);
            }}
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        ) : null}
      </span>
    </label>
  );
}
