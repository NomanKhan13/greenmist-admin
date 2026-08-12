export default function PageHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
    </>
  )
}
