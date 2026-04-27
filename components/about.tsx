"use client"

import Image from "next/image"
import { Wifi, Car, UtensilsCrossed, Flame, TreePine, Shirt, Cigarette, Sparkles, Clock, Ban, Wine } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const amenitiesForAll = [
  { icon: Wifi, title: "Wi-Fi интернет", description: "Бесплатный скоростной интернет на всей территории" },
  { icon: TreePine, title: "Беседка", description: "Уютная беседка для отдыха" },
  { icon: Flame, title: "Мангал и барбекю", description: "Зона для приготовления шашлыка" },
  { icon: Shirt, title: "Гладильная", description: "Утюг и гладильная доска" },
  { icon: Shirt, title: "Стиральная машина", description: "За небольшую оплату" },
  { icon: Cigarette, title: "Места для курения", description: "Оборудованные зоны" },
]

const freeAmenities = [
  { icon: Car, title: "Бесплатная парковка", description: "Охраняемая парковка на территории" },
  {
    icon: UtensilsCrossed,
    title: "Столовая и кухня",
    description: "Оборудованная общая кухня для гостей",
    badge: "Halal",
  },
]

const houseRules = [
  { icon: Clock, title: "Заезд в 14:00", description: "Выезд до 12:00" },
  { icon: Ban, title: "Без животных", description: "Проживание с питомцами не допускается" },
  { icon: Wine, title: "Без спиртного", description: "Распитие алкоголя на территории не допускается" },
  {
    image: "/images/halal.png",
    title: "Кухня халяль",
    description: "Гостевой дом следует традициям халяль — на общей кухне просим не готовить блюда из свинины. Благодарим за понимание!",
  },
]

export function About() {
  return (
    <section id="amenities" className="pt-10 pb-16 md:pt-12 md:pb-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-16">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">Инфраструктура</span>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Удобства и услуги
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Всё необходимое для комфортного отдыха
          </p>
        </div>

        {/* Для всех гостей */}
        <div className="mb-12 md:mb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {amenitiesForAll.map((item) => (
              <div
                key={item.title}
                className="group bg-card rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <item.icon className="h-7 w-7" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Бесплатно */}
        <div>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold text-foreground">Бесплатно для всех гостей</span>
            <Sparkles className="h-5 w-5 text-accent" />
          </div>
          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {freeAmenities.map((item) => (
              <div
                key={item.title}
                className="group relative bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl p-6 text-center border-2 border-accent/20 hover:border-accent/50 transition-all duration-300"
              >
                {item.badge && (
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Что такое халяль"
                          className="absolute top-3 right-3 flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-full text-xs font-semibold shadow-sm cursor-help hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                        >
                          <Image src="/images/halal.png" alt="" width={16} height={16} className="object-contain" />
                          <span>{item.badge}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-xs text-left">
                        <p className="font-semibold mb-1">Кухня халяль</p>
                        <p className="text-xs leading-relaxed opacity-90">
                          Халяль — пища, разрешённая по нормам ислама. На общей кухне просим не готовить блюда из свинины. Все остальные продукты — без ограничений.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/20 text-accent mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{item.title}</h4>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Условия проживания */}
        <div className="mt-12 md:mt-16">
          <div className="text-center mb-8">
            <span className="text-primary text-sm font-medium tracking-wider uppercase">Правила</span>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mt-2">
              Условия проживания
            </h3>
            <p className="text-muted-foreground text-sm mt-3 max-w-xl mx-auto">
              Несколько простых правил, чтобы всем гостям было комфортно
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {houseRules.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 bg-card rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary overflow-hidden">
                  {"image" in item && item.image ? (
                    <Image src={item.image} alt="" width={28} height={28} className="object-contain" />
                  ) : item.icon ? (
                    <item.icon className="h-6 w-6" />
                  ) : null}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
