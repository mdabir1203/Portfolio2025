import { createFileRoute } from "@tanstack/react-router";
import { CinematicLanding } from "@/components/cinematic/CinematicLanding";

export const Route = createFileRoute("/")({
  component: CinematicLanding,
  head: () => ({
    meta: [
      { title: "Mohammad Abir Abbas — Creative Technologist & AI Architect" },
      {
        name: "description",
        content:
          "Mohammad Abir Abbas — Creative Technologist & AI Architect. Built AbaYa-Track's Delivery Module: a value-weighted production dashboard that surfaced AED 111,246 of trapped backlog in 30 days (11.1:1 V:C). Based in the GCC.",
      },
      { property: "og:title", content: "Mohammad Abir Abbas — Creative Technologist & AI Architect" },
      {
        property: "og:description",
        content:
          "AbaYa-Track's Delivery Module: AED 111K backlog recovered, 11.1:1 V:C. Real case study, real testimonials.",
      },
    ],
  }),
});
