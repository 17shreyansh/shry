import Link from "next/link";
import { HeroScene } from "@/components/HeroScene";

export default function NotFound() {
  return (
    <section data-world="off" className="relative overflow-hidden bg-obsidian">
      <HeroScene variant="page" shape="ring" />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,11,0.88)_0%,rgba(8,9,11,0.45)_50%,transparent_75%)] max-md:bg-[linear-gradient(0deg,rgba(8,9,11,0.96)_30%,rgba(8,9,11,0.5)_75%,transparent)]" />
      <div className="container relative z-10 flex min-h-[90svh] flex-col justify-end py-32">
        <p className="label flex items-center gap-3"><span className="h-px w-10 bg-accent" aria-hidden />Error 404</p>
        <h1 className="display mt-6 max-w-[12ch] text-[clamp(3.5rem,10vw,10rem)]">This page isn&apos;t <em className="serif text-accent">connected.</em></h1>
        <p className="lead mt-6 max-w-md">The page you wanted doesn&apos;t exist or has moved.</p>
        <Link href="/" className="mt-10 inline-flex w-fit rounded-full bg-accent px-7 py-3.5 font-medium text-obsidian transition-colors hover:bg-ink">Back to home</Link>
      </div>
    </section>
  );
}
