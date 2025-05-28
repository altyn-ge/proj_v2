import { getImages } from "@/lib/getImages";
import { ImageGrid } from "./ImageGrid";
import { DeathSentenceList } from "./DeathSentenceList";
// import clsx from "clsx";
// import Link from "next/link";

export function generateMetadata() {
  return {
    title: "Главная | Казни женщин в России ",
    description: ``,
  };
}

export default async function Home() {
  const allImages = await getImages();
  return (
      <section className="bg-[#1b170f] grid md:grid-cols-2 h-[calc(100vh-var(--app-header-height)-var(--app-footer-height))]">
        <div className="text-layer px-4 sm:px-6 md:px-9 py-10 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-secondary text-center">
              Женщины казненные
            </h1>
            <h1 className="text-4xl mb-6 font-secondary text-center">
            советской властью
            </h1>
            <p className="text-center">
              Списки женщин расстрелянных и погибших в советских тюрьмах и лагерях
            </p>
            <p className="text-center">с 1918 по 1953 годы</p>
          </div>
          <div className="mb-10"></div>
          <h2 className="text-2xl font-secondary text-center mt-20 mb-3">
            Выдержки из смертных приговоров
          </h2>
          <DeathSentenceList />
        </div>
        <ImageGrid images={allImages} />
      </section>
  );
}

// type HomeTileProps = {
//   title: string;
//   href: string;
//   className?: string;
// };

// function HomeTile(props: HomeTileProps) {
//   const { title, href, className } = props;
//   return (
//     <Link className="text-foreground" href={href}>
//       <div
//         className={clsx(
//           "w-full border min-h-[150px] lg:min-h-[250px]",
//           className
//         )}
//       >
//         {title}
//       </div>
//     </Link>
//   );
// }
