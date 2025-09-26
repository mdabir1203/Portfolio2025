import { FC, memo } from 'react';

const palette = [
  { name: 'Primary Teal', hex: '#009688', description: 'Buttons, emphasis, call-to-action states.' },
  { name: 'Dark Teal', hex: '#00695C', description: 'Backgrounds, overlays, and depth.' },
  { name: 'Light Aqua', hex: '#4DB6AC', description: 'Highlights, borders, interactive accents.' },
  { name: 'Soft Off-white', hex: '#FAFAFA', description: 'Text legibility, cards, and neutral space.' },
  { name: 'Coral Accent', hex: '#FF7043', description: 'Alerts, highlights, and cheerful pops.' }
];

const TealPalettePreview: FC = () => (
  <section className="mb-16">
    <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#00695C] to-[#4DB6AC] bg-clip-text text-transparent">
      Teal Palette Preview
    </h2>
    <p className="text-center text-[#E0F2F1] max-w-3xl mx-auto mb-10">
      A quick mockup illustrating how the refreshed teal system feels across swatches, form elements, and interactive UI.
    </p>

    <div className="grid gap-6 md:grid-cols-5">
      {palette.map((color) => (
        <div
          key={color.hex}
          className="rounded-xl overflow-hidden shadow-lg shadow-[0_10px_30px_rgba(0,105,92,0.35)] border border-[#4DB6AC]/30"
        >
          <div className="h-24" style={{ backgroundColor: color.hex }}></div>
          <div className="p-4 bg-[#00695C]/40">
            <h3 className="text-lg font-semibold text-[#FAFAFA]">{color.name}</h3>
            <p className="text-sm text-[#B2DFDB]">{color.hex}</p>
            <p className="mt-2 text-xs text-[rgba(224,242,241,0.8)] leading-relaxed">{color.description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-12 grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl bg-[#00695C]/60 border border-[#4DB6AC]/40 p-6 backdrop-blur">
        <h3 className="text-xl font-semibold text-[#FAFAFA] mb-4">Palette-powered form</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#B2DFDB] mb-2">Name</label>
            <input
              className="w-full rounded-lg border border-[#4DB6AC]/40 bg-[#00695C]/40 p-3 text-[#FAFAFA] placeholder-[#B2DFDB] focus:outline-none focus:ring-2 focus:ring-[#4DB6AC]"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#B2DFDB] mb-2">Email</label>
            <input
              className="w-full rounded-lg border border-[#4DB6AC]/40 bg-[#00695C]/40 p-3 text-[#FAFAFA] placeholder-[#B2DFDB] focus:outline-none focus:ring-2 focus:ring-[#4DB6AC]"
              placeholder="ada@analyticalengine.ai"
              type="email"
            />
          </div>
          <button className="w-full rounded-lg bg-gradient-to-r from-[#009688] to-[#4DB6AC] px-4 py-3 font-semibold text-[#FAFAFA] shadow-[0_12px_30px_rgba(0,150,136,0.4)] transition-transform duration-300 hover:scale-[1.02]">
            Send request
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-[#4DB6AC]/40 bg-[#00695C]/40 p-6 backdrop-blur">
        <h3 className="text-xl font-semibold text-[#FAFAFA] mb-4">Alerts & states</h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-[#4DB6AC]/50 bg-[rgba(77,182,172,0.15)] px-4 py-3 text-sm text-[#E0F2F1]">
            <span className="font-semibold text-[#4DB6AC]">Success:</span> Form submitted successfully!
          </div>
          <div className="rounded-lg border border-[#FF7043]/40 bg-[rgba(255,112,67,0.15)] px-4 py-3 text-sm text-[#FAFAFA]">
            <span className="font-semibold text-[#FF7043]">Warning:</span> Double-check your API credentials.
          </div>
          <div className="rounded-lg border border-[#009688]/40 bg-[rgba(0,150,136,0.15)] px-4 py-3 text-sm text-[#FAFAFA]">
            <span className="font-semibold text-[#009688]">Info:</span> Next sprint planning starts Monday.
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default memo(TealPalettePreview);
