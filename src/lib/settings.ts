import { prisma } from "./prisma";

export interface SiteSettingsData {
  brandName: string;
  tagline: string;
  whatsappNumber: string;
  supportPhone: string;
  easypaisaNumber: string;
  jazzcashNumber: string;
  currency: string;
  currencySymbol: string;
  shippingFee: number;
  freeShippingThreshold: number;
  announcement: string;
}

export const DEFAULT_SETTINGS: SiteSettingsData = {
  brandName: "VELOURA",
  tagline: "Luxury Fashion & Beauty",
  whatsappNumber: "+92 321 9954325",
  supportPhone: "+92 321 9954325",
  easypaisaNumber: "+92 321 9954325",
  jazzcashNumber: "+92 321 9954325",
  currency: "PKR",
  currencySymbol: "Rs.",
  shippingFee: 200,
  freeShippingThreshold: 3000,
  announcement: "Complimentary Silk Packaging & Free Delivery on orders over Rs. 3,000",
};

export async function getSiteSettings(): Promise<SiteSettingsData> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "default" },
    });
    if (!settings) {
      return DEFAULT_SETTINGS;
    }
    return {
      brandName: settings.brandName || DEFAULT_SETTINGS.brandName,
      tagline: settings.tagline || DEFAULT_SETTINGS.tagline,
      whatsappNumber: settings.whatsappNumber || DEFAULT_SETTINGS.whatsappNumber,
      supportPhone: settings.supportPhone || DEFAULT_SETTINGS.supportPhone,
      easypaisaNumber: settings.easypaisaNumber || DEFAULT_SETTINGS.easypaisaNumber,
      jazzcashNumber: settings.jazzcashNumber || DEFAULT_SETTINGS.jazzcashNumber,
      currency: settings.currency || DEFAULT_SETTINGS.currency,
      currencySymbol: settings.currencySymbol || DEFAULT_SETTINGS.currencySymbol,
      shippingFee: settings.shippingFee ?? DEFAULT_SETTINGS.shippingFee,
      freeShippingThreshold: settings.freeShippingThreshold ?? DEFAULT_SETTINGS.freeShippingThreshold,
      announcement: settings.announcement || DEFAULT_SETTINGS.announcement,
    };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}
