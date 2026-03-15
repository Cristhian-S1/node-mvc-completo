import z from "zod";

const usuarioSchema = z.object({
  us_nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser un string",
    })
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(56),

  us_apellido: z
    .string({
      required_error: "El apellido es requerido",
      invalid_type_error: "El apellido debe ser un string",
    })
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(56),

  us_email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser un string",
    })
    .email("Debe ser un email válido")
    .max(126),

  us_contrasena: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser un string",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(254),

  us_contacto: z
    .number({
      required_error: "El contacto es requerido",
      invalid_type_error: "El contacto debe ser un número",
    })
    .int()
    .positive()
    .optional()
    .nullable(),
});

const loginSchema = z.object({
  us_email: z
    .string({
      required_error: "El email es requerido",
    })
    .email("Debe ser un email válido"),

  us_contrasena: z
    .string({
      required_error: "La contraseña es requerida",
    })
    .min(1, "La contraseña es requerida"),
});

export function validateUsuario(object) {
  return usuarioSchema.safeParse(object);
}

export function validatePartialUsuario(object) {
  return usuarioSchema.partial().safeParse(object);
}

export function validateLogin(object) {
  return loginSchema.safeParse(object);
}
