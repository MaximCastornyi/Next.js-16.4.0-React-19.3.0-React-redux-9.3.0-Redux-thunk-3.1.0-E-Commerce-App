import { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import axios from "axios";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { BiLeftArrowAlt } from "react-icons/bi";
import {
  getCsrfToken,
  getProviders,
  getSession,
  signIn,
} from "next-auth/react";

import Header from "../components/header";
import Footer from "../components/footer";
import LoginInput from "../components/inputs/loginInput";
import CircledIconBtn from "../components/buttons/circledIconBtn";
import DotLoaderSpinner from "../components/loaders/dotLoader";
import styles from "../styles/signin.module.scss";

const initialLoginValues = {
  login_email: "",
  login_password: "",
};

const initialRegisterValues = {
  name: "",
  email: "",
  password: "",
  conf_password: "",
};

export default function Signin({ providers, callbackUrl, csrfToken }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginError, setLoginError] = useState("");

  const loginValidation = Yup.object({
    login_email: Yup.string()
      .required("Email address is required.")
      .email("Please enter a valid email address."),
    login_password: Yup.string().required("Please enter a password"),
  });

  const registerValidation = Yup.object({
    name: Yup.string()
      .required("What's your name?")
      .min(2, "First name must be between 2 and 16 characters.")
      .max(16, "First name must be between 2 and 16 characters.")
      .matches(
        /^[a-zA-Z\s]+$/,
        "Numbers and special characters are not allowed."
      ),
    email: Yup.string()
      .required("Email is required.")
      .email("Enter a valid email address."),
    password: Yup.string()
      .required("Password is required.")
      .min(6, "Password must be at least 6 characters.")
      .max(36, "Password can't be more than 36 characters."),
    conf_password: Yup.string()
      .required("Confirm your password.")
      .oneOf([Yup.ref("password")], "Passwords must match."),
  });

  const signUpHandler = async (values) => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const { data } = await axios.post("/api/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      setSuccess(data.message);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const signInHandler = async (values) => {
    setLoading(true);
    setLoginError("");

    let options = {
      redirect: false,
      email: values.login_email,
      password: values.login_password,
    };

    const res = await signIn("credentials", options);
    setLoading(false);

    if (res?.error) {
      setLoginError(res.error);
    } else {
      Router.push(callbackUrl || "/");
    }
  };

  const country = {
    name: "Morocco",
    flag: "https://cdn-icons-png.flaticon.com/512/197/197551.png?w=360",
  };

  return (
    <>
      {loading && <DotLoaderSpinner loading={loading} />}
      <Header country={country} />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <div className={styles.back__svg}>
              <BiLeftArrowAlt />
            </div>
            <span>
              We'd be happy to join us ! <Link href="/">Go Store</Link>
            </span>
          </div>

          {/* SIGN IN */}
          <div className={styles.login__form}>
            <h1>Sign in</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>

            <Formik
              initialValues={initialLoginValues}
              validationSchema={loginValidation}
              onSubmit={(values) => signInHandler(values)}
            >
              {() => (
                <Form method="post" action="/api/auth/signin/email">
                  <input
                    type="hidden"
                    name="csrfToken"
                    defaultValue={csrfToken}
                  />
                  <LoginInput
                    type="text"
                    name="login_email"
                    icon="email"
                    placeholder="Email Address"
                  />
                  <LoginInput
                    type="password"
                    name="login_password"
                    icon="password"
                    placeholder="Password"
                  />
                  <CircledIconBtn type="submit" text="Sign in" />
                  {loginError && (
                    <span className={styles.error}>{loginError}</span>
                  )}
                  <div className={styles.forgot}>
                    <Link href="/auth/forgot">Forgot password ?</Link>
                  </div>
                </Form>
              )}
            </Formik>

            <div className={styles.login__socials}>
              <span className={styles.or}>Or continue with</span>
              <div className={styles.login__socials_wrap}>
                {providers?.map((provider) => {
                  if (provider.name === "Credentials") return null;
                  return (
                    <div key={provider.name}>
                      <button
                        className={styles.social__btn}
                        type="button"
                        onClick={() => signIn(provider.id)}
                      >
                        <img
                          src={`../../icons/${provider.name}.png`}
                          alt={provider.name}
                        />
                        Sign in with {provider.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SIGN UP */}
        <div className={styles.login__container}>
          <div className={styles.login__form}>
            <h1>Sign up</h1>
            <p>
              Get access to one of the best Eshopping services in the world.
            </p>

            <Formik
              initialValues={initialRegisterValues}
              validationSchema={registerValidation}
              onSubmit={(values) => signUpHandler(values)}
            >
              {() => (
                <Form>
                  <LoginInput
                    type="text"
                    name="name"
                    icon="user"
                    placeholder="Full Name"
                  />
                  <LoginInput
                    type="text"
                    name="email"
                    icon="email"
                    placeholder="Email Address"
                  />
                  <LoginInput
                    type="password"
                    name="password"
                    icon="password"
                    placeholder="Password"
                  />
                  <LoginInput
                    type="password"
                    name="conf_password"
                    icon="password"
                    placeholder="Re-Type Password"
                  />
                  <CircledIconBtn type="submit" text="Sign up" />
                </Form>
              )}
            </Formik>

            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <div>
              {error && <span className={styles.error}>{error}</span>}
            </div>
          </div>
        </div>
      </div>
      <Footer country="USA" />
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, query } = context;

  const session = await getSession({ req });
  const callbackUrl = query.callbackUrl || "/";

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  const csrfToken = (await getCsrfToken(context)) || null;
  const providersObj = await getProviders();
  const providers = providersObj ? Object.values(providersObj) : [];

  return {
    props: {
      providers,
      csrfToken,
      callbackUrl,
    },
  };
}