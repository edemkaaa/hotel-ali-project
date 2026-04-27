"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"
import { BookingForm } from "./booking-form"
import { WhatsAppIcon, TelegramIcon } from "./social-icons"
import { WHATSAPP_URL, TELEGRAM_URL } from "@/lib/contact"

const contactInfo = [
  {
    icon: MapPin,
    title: "Адрес",
    content: "р. Крым, г. Феодосия, п. Курортное, ул. Карадаг, 1",
    link: "https://yandex.ru/maps/?ll=35.2042%2C44.9148&z=17&pt=35.2042%2C44.9148%2Cpm2rdm&text=Курортное%20Кара-Даг%201%20Восток",
  },
  {
    icon: Phone,
    title: "Телефон",
    content: "+7 (978) 889-89-21",
    link: "tel:+79788898921",
  },
  {
    icon: Mail,
    title: "Email",
    content: "abdulgafarovnalilia@gmail.com",
    link: "mailto:abdulgafarovnalilia@gmail.com",
  },
  {
    icon: Clock,
    title: "Время работы",
    content: "Круглосуточно, 24/7",
    link: null,
  },
]

export function Contacts({ prices }: { prices?: Record<string, number> }) {
  return (
    <section id="contacts" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Связаться с нами</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Контакты
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Свяжитесь с нами или оставьте заявку на бронирование
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Info & Map */}
          <div>
            {/* Quick chat buttons */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <WhatsAppIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">WhatsApp</div>
                  <div className="text-xs text-white/85">Написать в WhatsApp</div>
                </div>
              </a>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <TelegramIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold leading-tight">Telegram</div>
                  <div className="text-xs text-white/85">Написать в Telegram</div>
                </div>
              </a>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              {contactInfo.map((item, index) => (
                <div 
                  key={item.title} 
                  className="flex gap-4 p-4 bg-card rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                        target={item.link.startsWith("http") ? "_blank" : undefined}
                        rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {item.content}
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm">{item.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=35.2042%2C44.9148&z=16&pt=35.2042%2C44.9148%2Cpm2rdm"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Расположение гостевого дома Восток на карте"
              />
            </div>
          </div>

          {/* Booking Form */}
          <div id="booking">
            <BookingForm prices={prices} />
          </div>
        </div>
      </div>
    </section>
  )
}

