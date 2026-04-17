import { createFileRoute } from "@tanstack/react-router";
import Bento from "@/components/Bento";

export const Route = createFileRoute("/")({
  component: Bento,
  head: () => ({
    meta: [
      { title: "Mohammad Abir Abbas — Creative Technologist & AI Architect" },
      {
        name: "description",
        content:
          "AI workflows that recapture engineering hours and protect enterprise assets. Wavelink CTA, ex-Deep Blue Digital. Bento portfolio.",
      },
      { property: "og:title", content: "Mohammad Abir Abbas — Creative Technologist" },
      {
        property: "og:description",
        content: "Scaling AI safely. Predictable ROI. Bento portfolio.",
      },
    ],
  }),
});
