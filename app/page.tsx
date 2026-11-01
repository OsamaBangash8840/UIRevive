import { Palette, ScanSearch, Wand2, Type, LayoutGrid, Smartphone } from "lucide-react";
import { UrlForm } from "@/components/UrlForm";

const features = [
  { icon: ScanSearch, title: "Clear diagnosis", text: "A scored report across hierarchy, type, color, spacing, layout and mobile." },
  { icon: Wand2, title: "Practical fixes", text: "Each issue explains why it matters and exactly what to change." },
  { icon: Palette, title: "Keeps your identity", text: "Suggestions refine your existing brand instead of replacing it with a template." },
];

const steps = [
  { icon: LayoutGrid, title: "Paste your URL", text: "Enter the site you want to improve." },
  { icon: Type, title: "Review the report", text: "See scores, issues and severity at a glance." },
  { icon: Smartphone, title: "Compare before & after", text: "Preview how a section could look improved." },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
        <p className="fade-up mb-5 text-sm font-medium uppercase tracking-widest text-accent">UI review, with taste</p>
        <h1 className="font-display fade-up max-w-3xl text-4xl font-semibold leading-[1.05] sm:text-6xl">
          Make your website better without making it look like everyone else&apos;s.
        </h1>
        <p className="fade-up mt-6 max-w-xl text-lg text-muted">
          Paste a URL and get an understandable UI improvement report that respects your existing visual identity.
        </p>
        <div className="fade-up mt-9">
          <UrlForm />
        </div>
        <p className="mt-4 text-sm text-muted">
          Prototype: the report is an AI estimate based on the URL only. Your site isn&apos;t scanned.
        </p>
      </section>

      <section id="features" className="border-t border-line bg-card py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-3">
          {features.map((f) => (
            <div key={f.title}>
              <f.icon className="mb-4 text-accent" size={24} />
              <h2 className="font-display mb-2 text-xl font-semibold">{f.title}</h2>
              <p className="text-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="font-display mb-10 text-3xl font-semibold">How it works</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="rounded-xl border border-line bg-card p-6">
                <span className="font-display text-3xl text-accent">0{i + 1}</span>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
