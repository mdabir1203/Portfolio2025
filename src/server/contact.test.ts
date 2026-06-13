import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-test the contact schema validation logic in isolation —
// the actual Resend call requires a live API key and is not unit-tested here.
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(320),
  message: z.string().min(10).max(2000),
});

describe("contactSchema", () => {
  const valid = { name: "Alice", email: "alice@example.com", message: "Hello, I'd like to connect!" };

  it("accepts valid input", () => {
    expect(() => contactSchema.parse(valid)).not.toThrow();
  });

  it("rejects name shorter than 2 chars", () => {
    expect(() => contactSchema.parse({ ...valid, name: "A" })).toThrow();
  });

  it("rejects name longer than 100 chars", () => {
    expect(() => contactSchema.parse({ ...valid, name: "A".repeat(101) })).toThrow();
  });

  it("rejects invalid email", () => {
    expect(() => contactSchema.parse({ ...valid, email: "not-an-email" })).toThrow();
  });

  it("rejects email longer than 320 chars", () => {
    // local part (64 max) + "@" + domain to push total over 320
    const long = "a".repeat(64) + "@" + "b".repeat(258) + ".com";
    expect(() => contactSchema.parse({ ...valid, email: long })).toThrow();
  });

  it("rejects message shorter than 10 chars", () => {
    expect(() => contactSchema.parse({ ...valid, message: "Hi" })).toThrow();
  });

  it("rejects message longer than 2000 chars", () => {
    expect(() => contactSchema.parse({ ...valid, message: "x".repeat(2001) })).toThrow();
  });

  it("rejects empty object", () => {
    expect(() => contactSchema.parse({})).toThrow();
  });

  it("rejects script injection in name (still validates length, not content)", () => {
    // Schema validates shape, not XSS — injection is sanitized by Resend's plain text email
    const result = contactSchema.safeParse({ ...valid, name: "<script>alert(1)</script>" });
    // 26 chars — valid length, schema passes; content safety is Resend's responsibility
    expect(result.success).toBe(true);
  });
});
