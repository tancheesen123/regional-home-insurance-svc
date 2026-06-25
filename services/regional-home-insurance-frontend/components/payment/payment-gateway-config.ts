export const PAYMENT_GATEWAYS = {
  KH: {
    name: "iPay88",
    merchantCode: process.env.NEXT_PUBLIC_IPAY88_MERCHANT_CODE || "",
    apiUrl:
      process.env.NODE_ENV === "production"
        ? "https://payment.ipay88.com.kh/epayment/entry.asp"
        : "https://sandbox.ipay88.com.kh/epayment/entry.asp",
    supportedMethods: ["fpx", "visa-master", "aba-bank", "acleda-bank"],
    currency: "KHR",
    logo: "/images/ipay88-logo.png",
  },

  PH: {
    name: "Paynamics",
    merchantId: process.env.NEXT_PUBLIC_PAYNAMICS_MERCHANT_ID || "",
    apiUrl:
      process.env.NODE_ENV === "production"
        ? "https://api.paynamics.net/paygate.aspx"
        : "https://testapi.paynamics.net/paygate.aspx",
    supportedMethods: ["visa-master", "gcash", "paymaya", "bpi", "bdo"],
    currency: "PHP",
    logo: "/images/paynamics-logo.png",
  },

  ID: {
    name: "DOKU",
    mallId: process.env.NEXT_PUBLIC_DOKU_MALL_ID || "",
    apiUrl: process.env.NODE_ENV === "production" ? "https://pay.doku.com" : "https://staging.doku.com",
    supportedMethods: ["visa-master", "mandiri-va", "bca-va", "bni-va", "gopay", "ovo"],
    currency: "IDR",
    logo: "/images/doku-logo.png",
  },
}

export type PaymentGateway = keyof typeof PAYMENT_GATEWAYS
export type PaymentMethod = string
