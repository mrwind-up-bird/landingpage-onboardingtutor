"use client";

import { useState } from "react";
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

  return (
    <main className="min-h-screen">
      <Hero />
      <Problem />
      <Superpowers />
      <Demo />
      <SocialProof />
      <Downloads />
      <Pricing onOpenForm={() => setFormOpen(true)} />
      <TechDeepDive />
      <CtaFinal onOpenForm={() => setFormOpen(true)} />
      <AirtableForm open={formOpen} onClose={() => setFormOpen(false)} />
    </main>
  );
}
