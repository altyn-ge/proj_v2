import Link from "next/link";
import { DOCLISTS, DocumentInfo, getDocsList } from "@/lib/convertDocs";
// import { partition } from "lodash-es";
import clsx from "clsx";

export const dynamic = "force-static";

export function generateMetadata() {
  return {
    title: "Списки | Казни женщин в России ",
    description: ``,
  };
}

export default async function ListsPage() {
  const byYear = await getDocsList(DOCLISTS.YEAR);
  const byRegion = await getDocsList(DOCLISTS.REGION);
  const byNationality = await getDocsList(DOCLISTS.NATIONALITY);
  // const list = await getDocsList();

  // const [byYearTemp, rest] = partition(list, (doc) => /19\d{2}/.test(doc.title));
  // byYearTemp.filter((val) => val.title.startsWith("Русские")).forEach((val) => rest.push(val))
  // const byYear = byYearTemp.filter((val) => !val.title.startsWith("Русские"))

  // rest.sort((a,b) => a.title.localeCompare(b.title))

  // const [byRegion, byNationality] = partition(rest, (doc) =>
  //   doc.slug.startsWith("женщины")
  // );

  return (
    <section className="page-container">
      <div className="grid sm:grid-cols-3 py-12 sm:py-16 gap-6">
        <h1 className="h1">Списки убитых</h1>
        <div className="sm:col-span-2">
          <ListSection 
            byNationality={byNationality}
            byRegion={byRegion}
            byYear={byYear}
          />
        </div>
        {/* <div>
          <h2 className="mb-5 font-semibold">Списки по национальностям</h2>
          <ListSection list={byNationality} />
        </div>
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="mb-5 font-semibold">Списки по область</h2>
            <ListSection list={byRegion} />
          </div>
          <div>
            <h2 className="mb-5 font-semibold">Списки по годам</h2>
            <ListSection list={byYear} />
          </div>
        </div> */}
      </div>
    </section>
  );
}


function ListSection({
  byNationality,
  byRegion,
  byYear,
  className,
}: {
  byNationality: DocumentInfo[],
  byRegion: DocumentInfo[],
  byYear: DocumentInfo[],
  className?: string;
}) {

  const listItem = (doc: DocumentInfo) => (
        <li key={doc.slug} className="mb-2">
          <Link
            href={`/lists/${doc.slug}`}
            prefetch={false}
            className="whitespace-nowrap hover:underline text-text-secondary"
          >
            {doc.title}
          </Link>
        </li>
      )

  return (
    <ul className={clsx("columns-3",className)}>
      {[<li className="text-1xl font-semibold tracking-tight pb-4" key="by_nationality_title">Списки по национальностям</li>,
      ...byNationality.map(listItem),
      <li className="text-1xl font-semibold tracking-tight pt-8 pb-4" key="by_region_title">Списки по регионам</li>,
      ...byRegion.map(listItem),
      <li className="text-1xl font-semibold tracking-tight pt-8 pb-4" key="by_year_title">Списки по годам</li>,
      ...byYear.map(listItem),
    ]
      }
    </ul>
  );
}
