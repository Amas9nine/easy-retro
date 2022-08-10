import css from "./RegisterPage.module.scss";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import firebase from "firebase/compat/app";
import { Link } from "react-router-dom";
export default function RegisterPage() {
  const { t } = useTranslation();
  const [credintials, setCredintials] = useState({ email: "", name: "", password: "" });
  const auth = firebase.auth();
  const [err, setErr] = useState(false);
  const [check, setCheck] = useState(false);
  const handleSignUpRequest = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(credintials.email, credintials.password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log(user);
        user
          .updateProfile({
            displayName: credintials.name
          })
          .then(() => {
            user.sendEmailVerification();
          })
          .catch((err) => {
            console.log(err.message);
          });
      })
      .catch(() => {
        setErr(true);
      });
  };
  const handleUserInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setCredintials((prev) => {
      return { ...prev, [name]: value };
    });
  };
  const signUpwithGoogle = () => {
    let google_provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(google_provider)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={css.global}>
      <Link to="/">
        <img
          className={css.easy_retro}
          src="./images/registerPage/easy_retro_logo.svg"
          alt="easy retro logo"
        />
      </Link>
      <form className={css.main}>
        <h5>{t("register.register")}</h5>
        {err ? (
          <div className={css.error}>
            <p>{t("errorMassage")}</p>
          </div>
        ) : (
          ""
        )}
        <label>
          {t("register.name")}
          <input
            type="text"
            required
            placeholder={t("register.name")}
            name="name"
            value={credintials.name}
            onChange={handleUserInputChange}
          />
          {credintials.name.length < 4 ? <p id={css.formErr}>{t("nameLo")}</p> : ""}
        </label>
        <label>
          {t("register.email")}
          <input
            type="email"
            placeholder={t("register.placeholder_email")}
            name="email"
            onClick={() => setErr(false)}
            value={credintials.email}
            onChange={handleUserInputChange}
          />
          {credintials.email.includes("@") ? "" : <p id={css.formErr}>{t("email")}</p>}
        </label>
        <label>
          {t("register.password")}
          <input
            type="password"
            placeholder={t("register.placeholder_password")}
            name="password"
            value={credintials.password}
            onChange={handleUserInputChange}
          />
        </label>
        {credintials.password.length <= 8 ? (
          <p id={css.formErr}>{t("register.password_requirements")}</p>
        ) : (
          ""
        )}
        <div className={css.checkbox}>
          <input onClick={() => setCheck(!check)} type="checkbox" />
          <span>
            {t("register.checkbox")}
            <a href=""> {t("register.terms")} </a>
            {t("register.and")}
            <a href=""> {t("register.privacy")} </a>
          </span>
        </div>
        <div className={css.checkbox}>
          <input type="checkbox" />
          <span>{t("register.checkbox2")} </span>
        </div>
        <button onClick={handleSignUpRequest} className={check ? css.createAc : css.createAV}>
          {t("register.create_account")}
        </button>
        <button onClick={signUpwithGoogle} className={css.signInBtn}>
          <img src="./images/registerPage/google_icon.png" alt="google icon" />
          <span>{t("register.sign_in")}</span>
        </button>
        <hr />
        <span className={css.spanAccount}>
          {t("register.account")}
          <Link to="/login"> {t("register.login")}</Link>
        </span>
      </form>
    </div>
  );
}
