import { ErrorMessage, useField } from "formik";
import styles from "./styles.module.scss";

export default function SingularSelect({
  data,
  handleChange,
  placeholder,
  header,
  disabled,
  ...rest
}) {
  const [field, meta, helpers] = useField(rest);
  const { setValue } = helpers;

  return (
    <div style={{ marginBottom: "1rem" }}>
      {header && (
        <div
          className={`${styles.header} ${
            meta.error ? styles.header__error : ""
          }`}
        >
          <div className={styles.flex}>
            {meta.error && (
              <img src="/images/warning.png" alt="warning" />
            )}
            {header}
          </div>
        </div>
      )}
      
      {/* Используем стандартный select вместо MUI TextField, чтобы избежать ошибок findDOMNode */}
      <select
        {...field}
        disabled={disabled}
        onChange={(e) => {
          if (handleChange) {
            handleChange(e);
          }
          setValue(e.target.value);
        }}
        className={`${styles.select} ${
          meta.touched && meta.error && styles.error__select
        }`}
        style={{
          width: "100%",
          padding: "1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          background: "#fff",
          fontSize: "1rem",
          outline: "none",
          cursor: "pointer",
        }}
      >
        <option value="">{placeholder || "No Selected / Or Empty"}</option>
        {data.map((option) => (
          <option key={option._id} value={option._id || option.name}>
            {option.name}
          </option>
        ))}
      </select>

      {meta.touched && meta.error && (
        <p className={styles.error__msg}>
          <ErrorMessage name={field.name} />
        </p>
      )}
    </div>
  );
}