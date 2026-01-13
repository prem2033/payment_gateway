import { loadStripe } from "@stripe/stripe-js";

export const stripePromise = loadStripe(
  "pk_test_51SnDLfDioPWQA6DkjMNAKdzyXeVGnnZWqEacVTuFJXJAtKjGirRUcXrlTFimIqoHSGX7tjeud3iEDzIh6qiXC00fZkLENk7"
);