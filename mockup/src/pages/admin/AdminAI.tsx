import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Database } from "lucide-react";
import { Card, CardBody } from "../../components/Card";
import { Badge } from "../../components/Badge";
import { adminAIInsights } from "../../data/aiInsights";

export function AdminAI() {
  const variantByType = (t: string) =>
    t === "positive" ? "success" : t === "warning" ? "warning" : "info";
  const iconByType = (t: string) =>
    t === "positive" ? <TrendingUp size={18} /> : t === "warning" ? <AlertTriangle size={18} /> : <Lightbulb size={18} />;

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-stadio-black to-gray-800 dark:from-red-900/60 dark:to-stadio-black p-5 sm:p-6">
          <div className="flex items-center gap-2 text-white/70">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">STADIO AI · Analítica avanzada</span>
          </div>
          <p className="mt-3 text-lg sm:text-xl font-extrabold leading-snug text-white">
            Inteligencia artificial para optimizar la gestión del gimnasio.
          </p>
          <p className="mt-2 text-sm text-white/50">
            Detección de patrones de ocupación, clases populares y oportunidades para aumentar ingresos.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {adminAIInsights.map((i) => {
          const Icon = iconByType(i.type);
          return (
            <Card key={i.id} className={i.type === "warning" ? "border-amber-200 dark:border-amber-900/40" : ""}>
              <CardBody className="p-5">
                <div className="flex items-start gap-3">
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                      i.type === "positive"
                        ? "bg-stadio-green-bg text-stadio-green dark:bg-green-950/50"
                        : i.type === "warning"
                        ? "bg-stadio-amber-bg text-stadio-amber dark:bg-amber-950/50"
                        : "bg-stadio-blue-bg text-stadio-blue dark:bg-blue-950/50"
                    }`}
                  >
                    {Icon}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-extrabold text-stadio-black dark:text-white">{i.title}</h3>
                      <Badge variant={variantByType(i.type) as "success" | "warning" | "info"}>
                        {i.type === "positive" ? "Positivo" : i.type === "warning" ? "Atención" : "Dato"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-stadio-gray-dark dark:text-white/70">{i.description}</p>

                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-stadio-gray-light/70 dark:bg-white/5 px-3 py-2 text-xs font-semibold text-stadio-gray-dark dark:text-white/50">
                      <Database size={13} className="shrink-0" />
                      {i.data}
                    </div>

                    <div className="mt-3 rounded-lg border border-stadio-red/20 bg-stadio-red/5 px-3 py-2">
                      <p className="text-xs font-semibold text-stadio-black dark:text-white">
                        <span className="text-stadio-red">Recomendación:</span> {i.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}