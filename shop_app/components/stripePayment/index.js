import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Form from "./Form"; // путь к вашей форме

// 1. Инициализируем loadStripe один раз НА УРОВНЕ МОДУЛЯ (вне компонента), 
// если ключ передается статично, ИЛИ используем useMemo, если ключ динамический.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || "ваш_pk_ключ");

export default function StripePayment({ total, order_id, stripe_public_key }) {
  // Либо, если ключ приходит динамически из пропсов, используем useMemo:
  // const stripePromise = useMemo(() => loadStripe(stripe_public_key), [stripe_public_key]);

  return (
    <Elements stripe={stripePromise}>
      <Form total={total} order_id={order_id} />
    </Elements>
  );
}