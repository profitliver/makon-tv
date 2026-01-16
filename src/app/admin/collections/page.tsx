"use client";

import React from "react";
import { FolderOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminCollectionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Подборки</h1>
          <p className="text-muted mt-1">Управление кураторскими подборками</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Создать подборку
        </Button>
      </div>

      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Подборки</h3>
            <p className="text-muted mb-4">
              Здесь будут отображаться созданные подборки контента
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Создать первую подборку
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
