import Image from "next/image";
import Link from "next/link";

export function Brand() {
  return (
    <Link className="flex items-center gap-3" href="/" aria-label="Editins">
      <span className="grid h-8 w-[76px] place-items-center overflow-hidden rounded-ui border border-white/10 bg-white px-1.5 shadow-panel">
        <Image
          src="/logo-cropped.png"
          alt="Editins"
          width={1364}
          height={1040}
          priority
          className="h-7 w-auto object-contain"
        />
      </span>
      <span className="sr-only">Editins</span>
    </Link>
  );
}
