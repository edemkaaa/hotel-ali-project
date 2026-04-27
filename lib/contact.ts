export const PHONE_DISPLAY = "+7 (978) 889-89-21"
export const PHONE_DIGITS = "79788898921"
export const PHONE_TEL = `+${PHONE_DIGITS}`
export const BOOKING_MESSAGE =
  'Здравствуйте, хочу забронировать у вас номер в гостевом доме "Восток"'

export const WHATSAPP_URL = `https://wa.me/${PHONE_DIGITS}?text=${encodeURIComponent(BOOKING_MESSAGE)}`
export const TELEGRAM_PHONE_DIGITS = "79788898929"
export const TELEGRAM_URL = `https://t.me/+${TELEGRAM_PHONE_DIGITS}?text=${encodeURIComponent(BOOKING_MESSAGE)}`
