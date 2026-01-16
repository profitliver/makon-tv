"use client";

import React, { useState } from "react";
import { Check, Star } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const plans = [
  {
    id: "basic",
    name: "Базовый",
    name_uz: "Asosiy",
    price: 99000,
    period: "month",
    features: [
      { ru: "HD качество", uz: "HD sifat" },
      { ru: "1 устройство", uz: "1 qurilma" },
      { ru: "Без рекламы", uz: "Reklamsiz" },
    ],
    popular: false,
  },
  {
    id: "standard",
    name: "Стандарт",
    name_uz: "Standart",
    price: 249000,
    period: "month",
    features: [
      { ru: "Full HD качество", uz: "Full HD sifat" },
      { ru: "2 устройства", uz: "2 qurilma" },
      { ru: "Без рекламы", uz: "Reklamsiz" },
      { ru: "Скачивание", uz: "Yuklab olish" },
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Премиум",
    name_uz: "Premium",
    price: 449000,
    period: "month",
    features: [
      { ru: "4K качество", uz: "4K sifat" },
      { ru: "4 устройства", uz: "4 qurilma" },
      { ru: "Без рекламы", uz: "Reklamsiz" },
      { ru: "Скачивание", uz: "Yuklab olish" },
      { ru: "Ранний доступ", uz: "Erta kirish" },
    ],
    popular: false,
  },
];

export default function SubscriptionPage() {
  const { t, locale } = useI18n();
  const { user } = useAuthStore();
  const [billingPeriod, setBillingPeriod] = useState<"month" | "6months" | "year">("month");

  const getPriceForPeriod = (basePrice: number) => {
    switch (billingPeriod) {
      case "6months":
        return basePrice * 5; // 1 month free
      case "year":
        return basePrice * 10; // 2 months free
      default:
        return basePrice;
    }
  };

  const getPeriodLabel = () => {
    switch (billingPeriod) {
      case "6months":
        return locale === "uz" ? "/ 6 oy" : "/ 6 месяцев";
      case "year":
        return locale === "uz" ? "/ yil" : "/ год";
      default:
        return locale === "uz" ? "/ oy" : "/ месяц";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("subscription.title")}
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto">
              Выберите подходящий тариф и получите доступ ко всему контенту
            </p>
          </div>

          {/* Billing period toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex p-1 bg-dark-50 rounded-lg">
              <button
                onClick={() => setBillingPeriod("month")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                  billingPeriod === "month"
                    ? "bg-primary text-dark-500"
                    : "text-white hover:bg-dark-100"
                )}
              >
                {locale === "uz" ? "Oylik" : "Месяц"}
              </button>
              <button
                onClick={() => setBillingPeriod("6months")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                  billingPeriod === "6months"
                    ? "bg-primary text-dark-500"
                    : "text-white hover:bg-dark-100"
                )}
              >
                {locale === "uz" ? "6 oy" : "6 месяцев"}
              </button>
              <button
                onClick={() => setBillingPeriod("year")}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm font-medium transition-colors relative",
                  billingPeriod === "year"
                    ? "bg-primary text-dark-500"
                    : "text-white hover:bg-dark-100"
                )}
              >
                {locale === "uz" ? "Yillik" : "Год"}
                <span className="absolute -top-2 -right-2 bg-error text-white text-xs px-1.5 py-0.5 rounded">
                  -17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl p-6 transition-all duration-300",
                  plan.popular
                    ? "bg-gradient-to-b from-primary/20 to-dark-300 border-2 border-primary scale-105"
                    : "bg-dark-300 border border-dark-50/20 hover:border-primary/50"
                )}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-dark-500 text-sm font-medium rounded-full">
                      <Star className="w-4 h-4" fill="currentColor" />
                      {t("subscription.popular")}
                    </span>
                  </div>
                )}

                {/* Plan name */}
                <h3 className="text-xl font-semibold text-white mb-2 mt-2">
                  {locale === "uz" ? plan.name_uz : plan.name}
                </h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">
                    {formatPrice(getPriceForPeriod(plan.price))}
                  </span>
                  <span className="text-muted ml-2">
                    {t("wallet.sum")} {getPeriodLabel()}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-white/80">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      {locale === "uz" ? feature.uz : feature.ru}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "secondary"}
                  size="lg"
                >
                  {user?.subscription_tier === plan.id
                    ? t("subscription.currentPlan")
                    : t("subscription.subscribe")}
                </Button>
              </div>
            ))}
          </div>

          {/* Note about payments */}
          <div className="text-center mt-12">
            <p className="text-muted text-sm">
              Платежные методы: PayMe, Click, Uzum Bank
              <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded">
                {t("common.comingSoon")}
              </span>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
