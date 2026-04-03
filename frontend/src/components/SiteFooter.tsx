const ESTUDIANTES = [
  "MARCOS ANTONIO PACHECO BAUTISTA",
  "RAFAEL ANTONIO RODRIGUEZ GAMARRA",
  "SERGIO ESTEBAN VELOZA GONZALEZ",
  "ADRIAN JOSE ORTIZ RUBIO",
] as const;

export function SiteFooter() {
  return (
    <footer
      className="mt-auto border-t border-border/40 bg-muted/20 py-6 px-4"
      aria-label="Créditos del proyecto"
    >
      <div className="container mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        <img
          src="/pageHeaderLogoImage_es_ES.png"
          alt="Corporación Unificada Nacional de Educación Superior — CUN"
          className="mx-auto h-14 w-auto max-w-[min(100%,380px)] object-contain mix-blend-screen"
          loading="lazy"
          decoding="async"
        />
        <ul className="space-y-1 text-[11px] leading-snug tracking-wide text-muted-foreground/90">
          {ESTUDIANTES.map((nombre) => (
            <li key={nombre}>{nombre}</li>
          ))}
        </ul>
        <p className="max-w-md text-[10px] leading-relaxed text-muted-foreground/70">
          Estudiantes de Ingenieria de Sistemas — Sincelejo, Sucre 2026
        </p>
      </div>
    </footer>
  );
}
