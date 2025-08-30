export type DiscountCode = {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  active: boolean;
};

export const discountCodes: DiscountCode[] = [
  {
    id: "welcome10",
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    minAmount: 5000, // $50
    maxUses: 1000,
    usedCount: 0,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
  },
  {
    id: "save20",
    code: "SAVE20",
    type: "percentage",
    value: 20,
    minAmount: 10000, // $100
    maxUses: 500,
    usedCount: 0,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
  },
  {
    id: "freeship",
    code: "FREESHIP",
    type: "fixed",
    value: 500, // $5 off
    minAmount: 2500, // $25
    maxUses: 2000,
    usedCount: 0,
    validFrom: "2024-01-01",
    validUntil: "2024-12-31",
    active: true,
  },
];

export function validateDiscountCode(code: string, subtotal: number): { valid: boolean; discount?: DiscountCode; error?: string } {
  const discount = discountCodes.find(d => d.code.toUpperCase() === code.toUpperCase() && d.active);
  
  if (!discount) {
    return { valid: false, error: "Invalid discount code" };
  }
  
  const now = new Date();
  const validFrom = new Date(discount.validFrom);
  const validUntil = new Date(discount.validUntil);
  
  if (now < validFrom || now > validUntil) {
    return { valid: false, error: "Discount code has expired or is not yet valid" };
  }
  
  if (discount.usedCount >= discount.maxUses) {
    return { valid: false, error: "Discount code usage limit reached" };
  }
  
  if (subtotal < discount.minAmount) {
    return { valid: false, error: `Minimum order amount of $${(discount.minAmount / 100).toFixed(2)} required` };
  }
  
  return { valid: true, discount };
}

export function calculateDiscount(discount: DiscountCode, subtotal: number): number {
  if (discount.type === "percentage") {
    return Math.round(subtotal * (discount.value / 100));
  } else {
    return Math.min(discount.value, subtotal);
  }
}
