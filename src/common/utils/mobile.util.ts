import { parsePhoneNumber } from "libphonenumber-js/max";

export function mobileValidation(mobile: string) {
  const result = parsePhoneNumber(mobile, "IR");
  const phoneNumber = result.formatNational().replace(/[\s\(\)\-]*/gim, "");
  const fullNumber = result.getURI().replace("tell:", "");
  return {
    country_code: result.country,
    phone_code: `+${result.countryCallingCode}`,
    phoneNumber,
    fullNumber,
  };
}
