import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/" aria-label="Editins">
      <span className="grid h-8 w-[76px] place-items-center overflow-hidden rounded-ui border border-border/35 bg-[linear-gradient(135deg,rgba(255,255,255,.96),rgba(241,247,255,.82))] px-1.5 shadow-soft dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(255,255,255,.14),rgba(255,255,255,.05))] dark:shadow-none">
        <Image
          src="/logo-cropped.png"
          alt="Editins"
          width={1364}
          height={1040}
          priority
          className="h-7 w-auto object-contain drop-shadow-sm dark:brightness-110 dark:contrast-95"
        />
      </span>
      <span className="sr-only">Editins</span>
    </Link>
  );
}
