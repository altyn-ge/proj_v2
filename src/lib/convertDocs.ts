import path from "path";
import { glob } from "glob";
import nodePandoc from "node-pandoc";
import nextConfig from "../../next.config";

export enum DOCLISTS {
  ROOT = "docs",
  NATIONALITY = "docs/BYNATIONALITY",
  YEAR = "docs/BYYEAR",
  REGION = "docs/BYREGION"
}

export async function getDocsList(dir: string): Promise<DocumentInfo[]> {
  const docsDirectory = path.resolve(process.cwd(), dir);
  const files = await glob("*.docx", { cwd: docsDirectory });
  return files
    .map((filename) => ({
      filename,
      directory: dir,
      title: formatTitle(filename),
      slug: formatSlug(filename),
    }))
    .sort(sortDocsList);
}

function formatTitle(filename: string) {
  return filename.replace(".docx", "").replace(/_/g, " ").trim();
}

function formatSlug(filename: string) {
  return filename
    .replace(/\.docx$/i, "")
    .trim()
    .replace(/\s+/g, "-")
    .toLocaleLowerCase("ru");
}

function sortDocsList(a: DocumentInfo, b: DocumentInfo) {
  return a.title.localeCompare(b.title, "ru", { sensitivity: "base" });
}

export async function getDocBySlug(slug: string): Promise<ConversionResult> {
  let docInfo = undefined;
  
  for(const dir of Object.values(DOCLISTS)) {
    const list = await getDocsList(dir);
    docInfo = findDocInfoBySlug(slug, list);
    if(docInfo) break;
  }

  if (!docInfo) {
    throw new Error(`No document found for slug: ${slug}`);
  }

  const docsDirectory = path.resolve(process.cwd(), docInfo.directory);
  const filePath = path.resolve(docsDirectory, docInfo.filename);
  const content = await new Promise<string>((resolve, reject) => {
    nodePandoc(filePath, `-f docx -t html5 --extract-media=public/docx/${docInfo.slug}`, (error, result) => {
      if (error) reject(error);
      const adjustedHtml = result.replace(/src="public\/docx/g, `src="${nextConfig.basePath}/docx`);
      resolve(adjustedHtml);
    });
  });

  return {
    data: {
      ...docInfo,
      content: content,
      createdAt: new Date(),
    },
  };
}

function findDocInfoBySlug(slug: string, list: DocumentInfo[]) {
  return list.find((doc) => doc.slug === slug);
}

export interface DocumentInfo {
  filename: string;
  directory: string;
  slug: string;
  title: string;
}

export interface ConvertedDocument extends DocumentInfo {
  content: string;
  createdAt: Date;
}

export interface ConversionResult {
  data: ConvertedDocument | null;
  error?: string;
}
