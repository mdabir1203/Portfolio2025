import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitContact } from "@/server/contact";
import { Loader2, Send } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isPending, setIsPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsPending(true);
    try {
      await submitContact({ data });
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bento bento-feature grain space-y-6"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50"
          >
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            placeholder="Your name"
            className="mt-1 w-full border-b border-white/10 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent-teal)]"
          />
          {errors.name && (
            <span className="mt-1 text-[10px] text-destructive">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50"
          >
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="your@email.com"
            className="mt-1 w-full border-b border-white/10 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent-teal)]"
          />
          {errors.email && (
            <span className="mt-1 text-[10px] text-destructive">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <label
            htmlFor="message"
            className="block font-mono text-[10px] uppercase tracking-widest text-foreground/50"
          >
            Message
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={4}
            placeholder="What's on your mind?"
            className="mt-1 w-full border-b border-white/10 bg-transparent py-2 text-sm outline-none transition-colors focus:border-[color:var(--accent-teal)] resize-none"
          />
          {errors.message && (
            <span className="mt-1 text-[10px] text-destructive">
              {errors.message.message}
            </span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[color:var(--accent-teal)] py-3 text-xs font-semibold uppercase tracking-widest text-[color:var(--ink)] hover:opacity-90 disabled:opacity-50 transition-all active:scale-[0.98]"
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            Send Message <Send className="h-3.5 w-3.5" />
          </>
        )}
      </button>
    </form>
  );
}
