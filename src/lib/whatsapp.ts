export function cleanPhoneForWhatsApp(phone: string): string {
  // Cleans phone to digits only (e.g. "+92 321 9954325" -> "923219954325")
  return phone.replace(/[^0-9]/g, "");
}

export const OFFICIAL_WHATSAPP_NUMBER = "923219954325";

export function getBaseWhatsAppUrl(phone: string = OFFICIAL_WHATSAPP_NUMBER, message?: string): string {
  const cleanPhone = cleanPhoneForWhatsApp(phone) || OFFICIAL_WHATSAPP_NUMBER;
  if (!message) {
    return `https://wa.me/${cleanPhone}`;
  }
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function generateProductWhatsAppMessage(product: {
  name: string;
  price: number;
  url?: string;
}): string {
  const url = product.url || (typeof window !== "undefined" ? window.location.href : "");
  return `Hello VELOURA,
I am interested in:
${product.name}

Price:
Rs. ${product.price.toLocaleString()}

Product link:
${url}

Please share availability and details.`;
}

export function generateCartWhatsAppMessage(params: {
  customerName?: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
}): string {
  const itemsText = params.items
    .map((item) => `- ${item.name} x ${item.quantity} (Rs. ${(item.price * item.quantity).toLocaleString()})`)
    .join("\n");

  return `VELOURA Order Inquiry

Customer:
${params.customerName || "Valued Customer"}

Items:
${itemsText}

Total:
Rs. ${params.total.toLocaleString()}

Please assist me with placing this order.`;
}

export function generateOrderConfirmationWhatsAppMessage(params: {
  orderNumber: string;
  customerName: string;
  items: Array<{ productName: string; quantity: number }>;
  total: number;
  paymentMethod: string;
}): string {
  const itemsText = params.items
    .map((item) => `- ${item.productName} x ${item.quantity}`)
    .join("\n");

  return `Hello VELOURA,

I have placed an order.

Order Number:
${params.orderNumber}

Items:
${itemsText}

Total:
Rs. ${params.total.toLocaleString()}

Payment Method:
${params.paymentMethod}

Please confirm my order.`;
}
