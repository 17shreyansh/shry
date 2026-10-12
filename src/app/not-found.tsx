import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container flex min-h-[80svh] flex-col justify-center py-32">
      <p className="label">404</p>
      <h1 className="display mt-6 text-[clamp(3.5rem,12vw,12rem)]">This page isn&apos;t connected.</h1>
      <p className="lead mt-6 max-w-md">The page you wanted doesn&apos;t exist or has moved.</p>
      <Link href="/" className="mt-10 inline-flex w-fit rounded-full bg-accent px-7 py-3.5 font-medium text-obsidian">Back to home</Link>
    </section>
  );
}
