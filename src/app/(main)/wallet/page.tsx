"use client";

import React from "react";
import Image from "next/image";
import { Wallet, Plus, CreditCard, Clock, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { useAuthStore } from "@/lib/auth-store";
import { formatPrice } from "@/lib/utils";

const paymentMethods = [
  {
    id: "payme",
    name: "PayMe",
    logo: "https://cdn.payme.uz/logo/payme_logo_full.png",
    color: "#00CCCC",
    available: false,
  },
  {
    id: "click",
    name: "Click",
    logo: "https://click.uz/click/images/logo.svg",
    color: "#27AE60",
    available: false,
  },
  {
    id: "uzum",
    name: "Uzum Bank",
    logo: "https://uzumbank.uz/assets/images/logo.svg",
    color: "#7B61FF",
    available: false,
  },
  {
    id: "card",
    name: "Банковская карта",
    nameUz: "Bank kartasi",
    icon: CreditCard,
    color: "#888888",
    available: false,
  },
];

export default function WalletPage() {
  const { t, locale } = useI18n();
  const { user, isAuthenticated } = useAuthStore();

  const balance = user?.wallet_balance || 0;

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {t("wallet.title")}
            </h1>
          </div>

          {/* Balance Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/20 to-dark-300 border-primary/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted text-sm mb-1">{t("wallet.balance")}</p>
                  <p className="text-4xl font-bold text-white">
                    {formatPrice(balance)}{" "}
                    <span className="text-lg text-muted">{t("wallet.sum")}</span>
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Up Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                {t("wallet.topUp")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted mb-6">
                {locale === "uz" 
                  ? "To'lov usulini tanlang"
                  : "Выберите способ оплаты"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    disabled={!method.available}
                    className="relative flex items-center gap-4 p-4 bg-dark-50 rounded-xl border border-dark-50 hover:border-primary/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${method.color}20` }}
                    >
                      {method.icon ? (
                        <method.icon className="w-6 h-6" style={{ color: method.color }} />
                      ) : (
                        <span 
                          className="font-bold text-lg"
                          style={{ color: method.color }}
                        >
                          {method.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">
                        {locale === "uz" && method.nameUz ? method.nameUz : method.name}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                      {t("common.comingSoon")}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t("wallet.transactions")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-50 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-muted" />
                </div>
                <p className="text-muted">{t("wallet.noTransactions")}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
