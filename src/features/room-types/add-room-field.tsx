import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function AddRoomField({
  name,
  label,
  placeholder,
  description,
  type,
  defaultFieldValue,
}: {
  name: string
  label: string
  placeholder: string
  description: string
  type?: string
  defaultFieldValue?: string | number | undefined
}) {
  return (
    <Field>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        name={name}
        type={type || "text"}
        placeholder={placeholder}
        required
        defaultValue={defaultFieldValue}
        min={type === "number" ? 0 : undefined}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  )
}
