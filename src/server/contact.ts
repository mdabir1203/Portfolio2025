import { createServerFn } from "@tanstack/react-start";
import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator(contactSchema)
  .handler(async ({ data }) => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { data: resData, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["abir.abbas@proton.me"],
        subject: `New Contact from ${data.name}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`,
        replyTo: data.email,
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error("Failed to send email");
      }

      return { success: true, id: resData?.id };
    } catch (err) {
      console.error("Server function error:", err);
      throw new Error("Internal server error");
    }
  });
