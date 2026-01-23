import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

// Schema para validar la información del cliente
const customerInfoSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "El teléfono debe tener al menos 9 dígitos"),
  rut: z.string().min(8, "El RUT debe tener al menos 8 caracteres"),
  region: z.string().min(3, "La región es requerida"),
  comuna: z.string().min(3, "La comuna debe tener al menos 3 caracteres"),
  address: z.string().optional(),
  note: z.string().optional(),
});

// Schema para una figura
const figureSelectionSchema = z.object({
  hair: z.number().nullable(),
  face: z.number().nullable(),
  body: z.number().nullable(),
  legs: z.number().nullable(),
  accs: z.array(z.number()),
});

// Schema para el plan
const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  maxFigures: z.number(),
  maxAccsPerFigure: z.number(),
  accExtraCost: z.number(),
});

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        plan: planSchema,
        selections: z.object({
          fig1: figureSelectionSchema,
          fig2: figureSelectionSchema,
          fig3: figureSelectionSchema,
          fig4: figureSelectionSchema,
        }),
        totalPrice: z.number(),
        extraAccessoriesCount: z.number(),
        customerInfo: customerInfoSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { plan, selections, totalPrice, extraAccessoriesCount, customerInfo } = input;

      // Extraer figuras configuradas
      const figures = Object.entries(selections)
        .map(([_key, config], index) => {
          // Verificar si la figura está completa
          if (
            config.hair &&
            config.face &&
            config.body &&
            config.legs &&
            config.accs &&
            config.accs.length > 0
          ) {
            return {
              figureNumber: index + 1,
              hairId: config.hair,
              faceId: config.face,
              bodyId: config.body,
              legsId: config.legs,
              accessories: JSON.stringify(config.accs),
            };
          }
          return null;
        })
        .filter((fig): fig is NonNullable<typeof fig> => fig !== null);

      if (figures.length === 0) {
        throw new Error("No hay figuras configuradas");
      }

      // Crear el pedido en la base de datos
      const order = await ctx.db.legoOrder.create({
        data: {
          planType: plan.id,
          planName: plan.name,
          planPrice: plan.price,
          totalPrice,
          extraAccessoriesCount,
          status: "pending",
          customerName: customerInfo.name,
          customerEmail: customerInfo.email,
          customerPhone: customerInfo.phone,
          customerRut: customerInfo.rut,
          customerRegion: customerInfo.region,
          customerComuna: customerInfo.comuna,
          customerAddress: customerInfo.address ?? null,
          customerNote: customerInfo.note ?? null,
          figures: {
            create: figures,
          },
        },
        include: {
          figures: true,
        },
      });

      return {
        success: true,
        id: order.id,
        order,
      };
    }),

  // Obtener todos los pedidos (opcional, para admin)
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.legoOrder.findMany({
      include: {
        figures: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  // Obtener un pedido por ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.legoOrder.findUnique({
        where: { id: input.id },
        include: {
          figures: true,
        },
      });
    }),

    updateStatus: publicProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "processing", "completed", "cancelled"])
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.legoOrder.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),
});
