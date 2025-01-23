import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative w-full h-64 md:h-96">
      <Image
        src="/berzdorf-lake-6105849_1280-55e58a62.webp"
        alt="Hero"
        className="object-cover"
        fill
        priority
      />
    </div>
  );
}
