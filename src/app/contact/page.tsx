import { ContactFormNew } from "./ContactForm";

export function generateMetadata() {
  return {
    title: "Cообщение | Казни женщин в России ",
    description: ``,
  };
}

export default async function ContactPage() {
  return (
    <div className="page-container mx-auto py-12 sm:py-16">
      <div className="flex flex-row items-start gap-x-[10rem]">
      <h1 className="h1">Оставьте <br/> сообщение</h1>
      <div className="max-w-5xl">
        <div className="mb-10">
          <ContactFormNew />
        </div>
      </div>
      </div>
    </div>
  );
}
