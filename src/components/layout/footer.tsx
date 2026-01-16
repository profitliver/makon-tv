"use client";

import React from "react";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-dark-400 border-t border-dark-50/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-dark-500 font-bold text-xl">M</span>
              </div>
              <span className="text-white font-bold text-xl">MAKON TV</span>
            </Link>
            <p className="mt-4 text-muted text-sm">
              Стриминговый сервис с лучшим контентом
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-medium mb-4">Навигация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.home")}
                </Link>
              </li>
              <li>
                <Link href="/browse" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.catalog")}
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.schedule")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-medium mb-4">Аккаунт</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.profile")}
                </Link>
              </li>
              <li>
                <Link href="/subscription" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.subscription")}
                </Link>
              </li>
              <li>
                <Link href="/wallet" className="text-muted hover:text-primary transition-colors text-sm">
                  {t("nav.wallet")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4">Контакты</h4>
            <ul className="space-y-2">
              <li className="text-muted text-sm">info@makontv.uz</li>
              <li className="text-muted text-sm">+998 71 123 45 67</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-dark-50/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Makon TV. Все права защищены.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted hover:text-primary transition-colors text-sm">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="text-muted hover:text-primary transition-colors text-sm">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
