"use client";

import React from "react";
import { ActionItems } from "./action-items";
import { KeyDecisions } from "./key-decisions";
import { OpenQuestions } from "./open-questions";

export function InsightsGrid() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Extracted Insights
        </h2>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          Categorized via Gemini 3.8 Flash
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
        <div className="h-full">
          <ActionItems />
        </div>
        <div className="h-full">
          <KeyDecisions />
        </div>
        <div className="h-full md:col-span-2 lg:col-span-1">
          <OpenQuestions />
        </div>
      </div>
    </section>
  );
}
