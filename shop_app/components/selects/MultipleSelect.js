import { useState, useRef, useEffect } from "react";
import { ErrorMessage, useField } from "formik";
import styles from "./styles.module.scss";
import { MdArrowDropDown } from "react-icons/md";

export default function MultipleSelect({
  data,
  handleChange,
  value = [],
  name,
  header,
  disabled,
  ...rest
}) {
  const [field, meta, helpers] = useField({ name, ...rest });
  const { setValue } = helpers;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const result = data.length
    ? data.reduce((obj, cur) => ({ ...obj, [cur._id]: cur.name }), {})
    : {};

  const handleToggle = (id) => {
    if (disabled) return;
    const newValue = value.includes(id)
      ? value.filter((item) => item !== id)
      : [...value, id];

    setValue(newValue);
    if (handleChange) {
      handleChange({ target: { name, value: newValue } });
    }
  };

  return (
    <div className={styles.wrapper} ref={dropdownRef} style={{ marginBottom: "1rem", position: "relative" }}>
      {header && (
        <div
          className={`${styles.header} ${
            meta.error ? styles.header__error : ""
          }`}
        >
          <div className={styles.flex}>
            {meta.error && <img src="/images/warning.png" alt="" />}
            {header}
          </div>
        </div>
      )}

      {/* Кнопка-селект, которая открывает выпадающий список */}
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`${styles.selectBox} ${meta.touched && meta.error ? styles.error__select : ""}`}
        style={{
          width: "100%",
          padding: "0.75rem 1rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
          background: disabled ? "#f5f5f5" : "#fff",
          fontSize: "1rem",
          cursor: disabled ? "not-allowed" : "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
<span>
  {Array.isArray(value) && value.length > 0
    ? value.map((id) => result[id]).filter(Boolean).join(", ")
    : "Select SubCategories"}
</span>
        <MdArrowDropDown size={24} />
      </div>

      {/* Выпадающий список с чекбоксами */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            zIndex: 100,
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "4px",
          }}
        >
          {Object.keys(result).map((id) => {
            const isChecked = value.includes(id);
            return (
              <div
                key={id}
                onClick={() => handleToggle(id)}
                style={{
                  padding: "10px 15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  background: isChecked ? "#f0f4ff" : "transparent",
                  borderBottom: "1px solid #eee",
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // Управляется родительским div
                  style={{ cursor: "pointer" }}
                />
                <span>{result[id]}</span>
              </div>
            );
          })}
        </div>
      )}

      {meta.touched && meta.error && (
        <div className={styles.error__msg}>
          <ErrorMessage name={name} />
        </div>
      )}
    </div>
  );
}