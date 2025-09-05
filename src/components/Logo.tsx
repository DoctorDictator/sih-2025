import Link from "next/link";
import Image from "next/image";
// Logo component to display the site logo
export default function Logo() {
  return (
    <Link href="/">
      <div className="size-5 sm:size-8 relative shrink-0">
        <Image
          src="/globe.svg"
          fill
          alt="Portal"
          className="shrink-0 hover:opacity-75 transition"
        />
      </div>
    </Link>
  );
}
