import z from "zod";

const publicacionSchema = z.object({
  pu_titulo: z
    .string({
      required_error: "El título es requerido",
      invalid_type_error: "El título debe ser un string",
    })
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(126),

  pu_descripcion: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser un string",
    })
    .min(10, "La descripción debe tener al menos 10 caracteres")
    .max(254),

  pu_image: z
    .string()
    .url("Debe ser una URL válida")
    .max(254)
    .optional()
    .nullable(),

  pu_fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)")
    .optional(),

  pu_eliminacion: z.boolean().optional().default(false),

  pu_estado: z.boolean().optional().default(false),

  us_id: z
    .number({
      required_error: "El ID del usuario es requerido",
      invalid_type_error: "El ID del usuario debe ser un número",
    })
    .int()
    .positive(),

  fo_id: z
    .number({
      required_error: "El ID del foro es requerido",
      invalid_type_error: "El ID del foro debe ser un número",
    })
    .int()
    .positive(),
});

export function validatePublicacion(object) {
  return publicacionSchema.safeParse(object);
}

export function validatePartialPublicacion(object) {
  return publicacionSchema.partial().safeParse(object);
}
