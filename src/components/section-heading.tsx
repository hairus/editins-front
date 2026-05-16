export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? <p className="text-xs font-bold uppercase tracking-normal text-muted-foreground">{eyebrow}</p> : null}
      <h1 className="mt-2 text-2xl font-bold tracking-normal text-balance sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 text-sm font-medium leading-6 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
