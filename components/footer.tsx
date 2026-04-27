import { Phone, Mail, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-10 md:mb-12">
          {/* Logo & Description */}
          <div>
            <a href="#" className="inline-block mb-4">
              <span className="text-3xl font-bold tracking-wide">ВОСТОК</span>
              <span className="block text-xs tracking-[0.3em] text-background/60 uppercase mt-1">гостевой дом</span>
            </a>
            <p className="text-background/70 text-sm leading-relaxed">
              Уютный гостевой дом в Крыму, п. Курортное. Комфортные номера в 10 минутах от моря, тёплая семейная атмосфера.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Навигация</h3>
            <ul className="space-y-3">
              <li>
                <a href="#rooms" className="text-background/70 hover:text-background transition-colors text-sm">
                  Номера
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-background/70 hover:text-background transition-colors text-sm">
                  Галерея
                </a>
              </li>
              <li>
                <a href="#amenities" className="text-background/70 hover:text-background transition-colors text-sm">
                  Удобства
                </a>
              </li>
              <li>
                <a href="#location" className="text-background/70 hover:text-background transition-colors text-sm">
                  Расположение
                </a>
              </li>
              <li>
                <a href="#contacts" className="text-background/70 hover:text-background transition-colors text-sm">
                  Контакты
                </a>
              </li>
              <li>
                <a href="#booking" className="text-background/70 hover:text-background transition-colors text-sm">
                  Бронирование
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-6 text-lg">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>р. Крым, г. Феодосия, п. Курортное, ул. Карадаг, 1</span>
              </li>
              <li>
                <a 
                  href="tel:+79788898921" 
                  className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Phone className="h-5 w-5 flex-shrink-0" />
                  <span>+7 (978) 889-89-21</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:abdulgafarovnalilia@gmail.com" 
                  className="flex items-center gap-3 text-sm text-background/70 hover:text-background transition-colors"
                >
                  <Mail className="h-5 w-5 flex-shrink-0" />
                  <span>abdulgafarovnalilia@gmail.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/50 text-sm">
            © {new Date().getFullYear()} Гостевой дом «Восток». Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}

