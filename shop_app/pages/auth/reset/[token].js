import styles from "../../../styles/forgot.module.scss";
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledIconBtn from "../../../components/buttons/circledIconBtn";
import LoginInput from "../../../components/inputs/loginInput";
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import DotLoaderSpinner from "../../../components/loaders/dotLoader";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import jwt from "jsonwebtoken";

export default function Reset({ user_id }) {

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordValidation = Yup.object({
    password: Yup.string()
      .required("Please enter your new password.")
      .min(6, "Password must be at least 6 characters.")
      .max(36, "Password can't be more than 36 characters."),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const resetHandler = async (password) => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.put("/api/auth/reset", {
        user_id,
        password,
      });

      const options = {
        redirect: false,
        email: data.email,
        password: password,
      };

      const res = await signIn("credentials", options);
      setLoading(false);

      if (res?.error) {
        setError(res.error);
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country="" />
      <div className={styles.forgot}>
        <div>
          <div className={styles.forgot__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              Reset your password ? <Link href="/signin">Login instead</Link>
            </span>
          </div>

          <Formik
            initialValues={{
              password: "",
              conf_password: "",
            }}
            validationSchema={passwordValidation}
            onSubmit={(values) => {
              resetHandler(values.password);
            }}
          >
            {({ values, handleChange }) => (
              <Form>
                <LoginInput
                  type="password"
                  name="password"
                  icon="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
                <LoginInput
                  type="password"
                  name="conf_password"
                  icon="password"
                  placeholder="Confirm Password"
                  value={values.conf_password}
                  onChange={handleChange}
                />

                <CircledIconBtn type="submit" text="Submit" />

                <div style={{ marginTop: "10px" }}>
                  {error && <span className={styles.error}>{error}</span>}
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

export async function getServerSideProps(context) {
  const { query, req } = context;
  const session = await getSession({ req });

  // Если пользователь уже авторизован, перенаправляем на главную
  if (session) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const { token } = query;

  if (!token) {
    return {
      redirect: {
        destination: "/signin",
      },
    };
  }

  try {
    // Декодируем передаваемый URL-токен
    const user_id = jwt.verify(token, process.env.RESET_TOKEN_SECRET);

    return {
      props: {
        user_id: user_id.id,
      },
    };
  } catch (error) {
    // В случае недействительного или истекшего токена редиректим на запуск сброса
    return {
      redirect: {
        destination: "/auth/forgot",
      },
    };
  }
}