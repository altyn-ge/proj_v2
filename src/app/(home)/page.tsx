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
      <section className="bg-[#1b170f] grid md:grid-cols-2 h-[calc(100vh-var(--app-header-height))]">
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
          <div className="flex-col space-y-2 items-end">
          <div className="">
            <h2 className="text-[1.375rem] font-secondary text-center ml-10 mt-5">
            Выдержки из смертных приговоров
          </h2>
          <div className="mt-3 mr-7">
            <p className="text-right font-secondary text-gray-400 ">
              И упало каменное слово <br/>
              На мою еще живую грудь <br/>
              <i>A. Ахматова </i></p>
          </div>
          </div>
          <DeathSentenceList />
          <div className="page-container text-xs text-foreground">
            © {new Date().getFullYear()} Licensed under MIT.
          </div>
        </div>
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
