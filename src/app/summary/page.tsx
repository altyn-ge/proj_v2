import { getDocBySlug } from "@/lib/convertDocs";
import { HtmlRenderer } from "../lists/[slug]/HtmlRenderer";

export default async function SummaryPage() {
  const content = (await getDocBySlug("сводная-таблица")).data?.content
  return (
    <div className="page-container page-section">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <HtmlRenderer
            html={content!}
          />
        </div>
      </div>
    </div>
  );
}
