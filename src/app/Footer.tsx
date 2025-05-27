export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex items-center w-full border-t theme-dark bg-background h-[var(--app-footer-height)]">
      <div className="page-container text-xs py-3 text-foreground">
        © {year} Licensed under MIT.
      </div>
    </footer>
  );
}
