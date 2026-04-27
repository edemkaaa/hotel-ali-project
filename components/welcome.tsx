import { Heart, Home, Waves } from "lucide-react"

export function Welcome() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-primary text-sm font-medium tracking-wider uppercase">
            О гостевом доме
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6 leading-tight">
            Гостевой дом «Восток» —{" "}
            <span className="text-primary">отличный выбор для спокойного семейного отдыха</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Мы находимся в посёлке Курортное, в стороне от шумных туристических мест, в окружении
            крымских гор и моря. Здесь нет шумных вечеринок и суеты — только размеренный отдых,
            тёплая домашняя атмосфера и забота о каждом госте, особенно о тех, кто приехал с детьми.
          </p>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Семейная атмосфера</h3>
              <p className="text-sm text-muted-foreground">
                Тихо, безопасно и комфортно для отдыха с детьми
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <Waves className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Море рядом</h3>
              <p className="text-sm text-muted-foreground">
                Галечный пляж и набережная в 10 минутах пешком
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-secondary/40">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                <Home className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Как дома</h3>
              <p className="text-sm text-muted-foreground">
                Уютные номера, своя кухня, беседки и тихий двор
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
