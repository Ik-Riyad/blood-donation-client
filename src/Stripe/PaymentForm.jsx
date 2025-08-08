// PaymentForm.jsx
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import toast from "react-hot-toast";

const PaymentForm = ({ donateAmount, setModalOpen, setTotalFundsData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosInstanceIntercept = useAxios();
  const { user } = useAuth();

  // const [amount, setAmount] = useState(1000); // $10.00
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const statusNotify = () =>
    toast.success('Your Donation is successfully Done.', {
      theme: "colored",
    });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const amount = parseInt(donateAmount)
    const { data } = await axiosInstanceIntercept.post("/create-payment-intent", { amount, userName: user.displayName, userEmail: user.email }
      // { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } }
    );

    const clientSecret = data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      setError(result.error.message);
      setSuccess(null);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setSuccess("Payment successful!");
        setError(null);
        const currentDate = new Date();
        axiosInstanceIntercept.post('/paymant-success-data', { amount, currentDate, userName: user.displayName, userEmail: user.email })
          .then(res => {
            if (res.data.insertedId) {
              statusNotify()
              setModalOpen(false)
              setTotalFundsData((prev) => [...prev, { amount, currentDate, userName: user.displayName, userEmail: user.email }]);
            }
          })
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <CardElement className="border p-3 rounded w-full" />
      <button
        type="submit"
        disabled={!stripe}
        className={`py-2 px-4 transition rounded-md font-semibold text-red-600 border border-red-600 cursor-pointer hover:shadow-[0_0_0_1px_#f00,0_5px_0_0_#f01]`}
      >
        Donate ${donateAmount}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
    </form>
  );
};

export default PaymentForm;
