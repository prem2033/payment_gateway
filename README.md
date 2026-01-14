# payment_gateway

## Customer session :   
A Customer Session authorizes client-side Stripe SDKs to read and act on a customer’s saved payment methods and related data.

    Display saved cards
    Allow card selection
    Allow card deletion
    Reuse saved payment methods
    Use Payment Element or Customer Portal-like flows
### How Customer session works?
    1. Backend creates Customer Session (secret key)
    2. Session returns a client_secret
    3. Frontend uses client_secret with Stripe.js
    4. Session expires (minutes)


Card number	| Scenario	| How to test |
--------------|-----------|-------------|
4242424242424242|	The card payment succeeds and doesn’t require authentication.	|Fill out the credit card form using the credit card number with any expiration, CVC, and postal code.
4000002500003155|	The card payment requires authentication.	|Fill out the credit card form using the credit card number with any expiration, CVC, and postal code.
4000000000009995|	The card is declined with a decline code like insufficient_funds.|	Fill out the credit card form using the credit card number with any expiration, CVC, and postal code.
6205500000000000004|	The UnionPay card has a variable length of 13-19 digits.|	Fill out the credit card form using the credit card number with any expiration, CVC, and postal code.