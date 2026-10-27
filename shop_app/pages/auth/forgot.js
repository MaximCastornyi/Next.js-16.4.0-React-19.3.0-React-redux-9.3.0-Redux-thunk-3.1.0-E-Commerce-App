import styles from "../../styles/forgot.module.scss";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledIconBtn from "../../components/buttons/circledIconBtn";
import LoginInput from "../../components/inputs/loginInput";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { MoonLoader } from "react-spinners";
import axios from "axios";

export default function Forgot() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const emailValidation = Yup.object({
    email: Yup.string()
      .required(
        "You'll need this when you log in and if you ever need to reset your password."
      )
      .email("Enter a valid email address."),
  });

  const forgotHandler = async (email, resetForm) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await axios.post("/api/auth/forgot", {
        email,
      });

      setSuccess(data.message);
      setLoading(false);
      resetForm();
    } catch (err) {
      setLoading(false);
      setSuccess("");
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      {/* Оверлей спиннера по центру с уменьшением прозрачности заднего фона */}
      {loading && (
        <div className={styles.loading__overlay}>
          <MoonLoader color="#2f82ff" loading={loading} size={60} />
        </div>
      )}

      <Header country="" />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              Forgot your password ? <Link href="/">Login instead</Link>
            </span>
          </div>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={emailValidation}
            onSubmit={(values, { resetForm }) => {
              forgotHandler(values.email, resetForm);
            }}
          >
            {({ values, handleChange }) => (
              <Form>
                <LoginInput
                  type="text"
                  name="email"
                  icon="email"
                  placeholder="Email Address"
                  value={values.email}
                  onChange={handleChange}
                />

                <CircledIconBtn type="submit" text="Send link" />

                <div style={{ marginTop: "10px" }}>
                  {error && <span className={styles.error}>{error}</span>}
                  {success && <span className={styles.success}>{success}</span>}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <Footer country="USA" />
    </>
  );
}