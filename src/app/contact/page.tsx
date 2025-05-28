import { ContactFormNew } from "./ContactForm";

export function generateMetadata() {
  return {
    title: "Cообщение | Казни женщин в России ",
    description: ``,
  };
}

export default async function ContactPage() {
  return (
    <section>
      <div className="page-container py-12 sm:py-16 bg-layer">
        <div className="max-w-6xl mx-auto">
          <h1 className="h1 mb-5">Оставьте сообщение</h1>
          <p className="max-w-[500px]">
            
          </p>
        </div>
      </div>

      <div className="page-container py-16">
        <div className="max-w-6xl mx-auto">
          <ContactFormNew />
          {/* <ContactForm /> */}
        </div>
      </div>
    </section>
  );
}
