"use client";

import React from "react";
import Link from "next/link";
import { Lock, CreditCard, Wallet } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { t } = useI18n();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">{t("paywall.title")}</DialogTitle>
          <DialogDescription className="text-base mt-2">
            {t("paywall.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-3">
          <Link href="/subscription" onClick={onClose} className="block">
            <Button className="w-full" size="lg">
              <CreditCard className="w-5 h-5 mr-2" />
              {t("paywall.choosePlan")}
            </Button>
          </Link>
          
          <Link href="/wallet" onClick={onClose} className="block">
            <Button variant="secondary" className="w-full" size="lg">
              <Wallet className="w-5 h-5 mr-2" />
              {t("paywall.topUpBalance")}
            </Button>
          </Link>
        </div>

        {/* Quick preview of plans */}
        <div className="mt-6 pt-6 border-t border-dark-50/20">
          <p className="text-muted text-sm text-center mb-4">Тарифы от</p>
          <div className="flex justify-center gap-4">
            <div className="text-center">
              <p className="text-white font-semibold">99 000</p>
              <p className="text-muted text-xs">сум/мес</p>
            </div>
            <div className="text-center px-4 py-1 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-primary font-semibold">249 000</p>
              <p className="text-primary/70 text-xs">сум/мес</p>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">449 000</p>
              <p className="text-muted text-xs">сум/мес</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
