import { notFound } from "next/navigation";
import Link from "next/link";
import { getDocsList, getDocBySlug, DOCLISTS } from "@/lib/convertDocs";
import { ArrowRight } from "@/components/icons/ArrowRight";
import { HtmlRenderer } from "./HtmlRenderer";
import "./doc.css";

export const dynamic = "force-static";
export const dynamicParams = false;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const byYear = await getDocsList(DOCLISTS.YEAR);
  const byRegion = await getDocsList(DOCLISTS.REGION);
  const inGulag = await getDocsList(DOCLISTS.GULAG);
  const byNationality = await getDocsList(DOCLISTS.NATIONALITY);

  const list = [...byYear,...byRegion,...inGulag,...byNationality]
  return list.map(({ slug }) => ({
    slug:
      process.env.NODE_ENV === "production" ? slug : encodeURIComponent(slug), // production auto encodes
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);
  const result = await getDocBySlug(slug);

  if (!result.data) {
    return {
      title: "Казни женщин в России",
    };
  }

  return {
    title: `${result.data.title} | Казни женщин в России`,
    description: "",
  };
}

export default async function DocumentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug).normalize("NFC");
  const result = await getDocBySlug(slug);

  if (!result.data) {
    console.error(`Error loading document: ${result.error}`);
    notFound();
  }

  return (
    <div className="page-container page-section">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Link
            href="/lists"
            className="text-text-secondary hover:text-foreground transition-colors text-sm"
          >
            Списки убитых
          </Link>
          <ArrowRight className="text-text-secondary" />
          <h1 className="text-sm">{result.data.title}</h1>
        </div>

        <div id="doc-content">
          <HtmlRenderer
            html={result.data.content}
            className="flex flex-col gap-6"
          />
        </div>
      </div>
    </div>
  );
}
