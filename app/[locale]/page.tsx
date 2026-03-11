"use client";

import { useState, useCallback } from "react";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Superpowers } from "@/components/sections/Superpowers";
import { Demo } from "@/components/sections/Demo";
import { SocialProof } from "@/components/sections/SocialProof";
import { Downloads } from "@/components/sections/Downloads";
import { Pricing } from "@/components/sections/Pricing";
import { TechDeepDive } from "@/components/sections/TechDeepDive";
import { CtaFinal } from "@/components/sections/CtaFinal";
import { AirtableForm } from "@/components/ui/AirtableForm";

export default function Home() {
  const [formOpen, setFormOpen] = useState(false);
  const onOpenForm = useCallback(() => setFormOpen(true), []);
  const onCloseForm = useCallback(() => setFormOpen(false), []);

  return (
    <main id="main-content" className="min-h-screen">
      <Hero />
      <Problem />
      <Superpowers />
      <Demo />
      <SocialProof />
      <Downloads />
      <Pricing onOpenForm={onOpenForm} />
      <TechDeepDive />
      <CtaFinal onOpenForm={onOpenForm} />
      <AirtableForm open={formOpen} onClose={onCloseForm} />
    </main>
  );
}
