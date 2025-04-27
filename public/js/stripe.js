/* eslint-disable*/

import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51RIA0uFa51gH8U9hcNOJlkTRK999Dy4iU3n1FZhnTG8lPua10G5BT20edaLp95cZoHLt1oYxNjh6Ctusk6DMQPoo00mgwgIimv',
    );
    // 1- get session from the server
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    console.log(session);

    // 2- create checkout from + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
