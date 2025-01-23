import Hero from "./components/hero";
import SectionCarousel from "./components/sectionCarousel";
import HomePage from "./home/page";

export default async function Home() {
  return (
    <>
      <div>
        <Hero />
        <HomePage />
      </div>
    </>
  );
}
