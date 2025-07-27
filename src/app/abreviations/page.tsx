import { getDocBySlug } from "@/lib/convertDocs";
import { HtmlRenderer } from "../lists/[slug]/HtmlRenderer";

export default async function SummaryPage() {
  const content = (await getDocBySlug("список-сокращений")).data?.content
  return (
    <div className="page-container mx-auto py-12 sm:py-16">
      <div className="flex flex-row items-start gap-x-[10rem]">
        <h1 className="h1">Список <br/> сокращений</h1>
        <div className="max-w-5xl">
          <div className="mb-6">
            <HtmlRenderer
              html={content!}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
