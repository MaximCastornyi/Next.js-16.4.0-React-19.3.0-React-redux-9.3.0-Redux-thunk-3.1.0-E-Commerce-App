import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import styles from "./styles.module.scss";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#000",
      color: "#000",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#000" },
      "::placeholder": { color: "#000" },
    },
    invalid: {
      iconColor: "#fd010169",
      color: "#fd010169",
    },
  },
};

export default function Form({ total, order_id }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Кнопка PAY нажата");

    // Защита от вызова, если stripe или elements еще не загрузились
    if (!stripe || !elements) {
      console.log("Stripe или Elements еще не загрузились");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error("CardElement не найден в DOM");
      }

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (stripeError) {
        console.log("Ошибка Stripe:", stripeError.message);
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      console.log("PaymentMethod успешно создан:", paymentMethod.id);

      const res = await axios.post(`/api/order/${order_id}/payWithStripe`, {
        amount: total,
        id: paymentMethod.id,
      });

      console.log("Ответ от бэкенда:", res.data);

      if (res.data.success) {
        window.location.reload(false);
      }
    } catch (err) {
      console.error("Ошибка при оплате:", err);
      setError(err.response?.data?.message || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.stripe}>
      <form onSubmit={handleSubmit}>
        <CardElement options={CARD_OPTIONS} />
        {/* Кнопка блокируется, пока Stripe не загрузится или идет отправка */}
        <button type="submit" disabled={!stripe || loading}>
          {loading ? "Processing..." : "PAY"}
        </button>
        {error && <span className={styles.error}>{error}</span>}
      </form>
    </div>
  );
}