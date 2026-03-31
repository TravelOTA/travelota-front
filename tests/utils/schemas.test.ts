import { describe, it, expect } from 'vitest';
import { createLoginSchema, createRegisterSchema } from '~/utils/schemas';

// Mock translation function — returns the key so assertions are key-based
const t = (key: string) => key;

describe('createLoginSchema', () => {
  const schema = createLoginSchema(t);

  it('accepts a valid login input', () => {
    const result = schema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const result = schema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === 'email');
    expect(issue).toBeDefined();
    expect(issue?.message).toBe('validation.emailInvalid');
  });

  it('rejects a password shorter than 6 characters', () => {
    const result = schema.safeParse({
      email: 'user@example.com',
      password: 'abc',
    });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === 'password');
    expect(issue).toBeDefined();
  });

  it('accepts optional rememberMe field', () => {
    const result = schema.safeParse({
      email: 'user@example.com',
      password: 'secret123',
      rememberMe: true,
    });
    expect(result.success).toBe(true);
  });
});

describe('createRegisterSchema', () => {
  const schema = createRegisterSchema(t);

  const validInput = {
    nombreComercial: 'Mi Agencia',
    direccionRegistrada: 'Calle Falsa 123',
    nif: 'B12345678',
    telefono: '912345678',
    email: 'info@agencia.com',
    web: '',
    pais: 'España',
    nombreContacto: 'Juan García',
    aceptaPrivacidad: true,
  };

  it('accepts a fully valid registration input', () => {
    const result = schema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects when aceptaPrivacidad is false', () => {
    const result = schema.safeParse({ ...validInput, aceptaPrivacidad: false });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find(
      (i) => i.path[0] === 'aceptaPrivacidad',
    );
    expect(issue?.message).toBe('validation.privacyRequired');
  });

  it('rejects an invalid email', () => {
    const result = schema.safeParse({ ...validInput, email: 'bad-email' });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === 'email');
    expect(issue?.message).toBe('validation.emailInvalid');
  });

  it('rejects a NIF shorter than 5 characters', () => {
    const result = schema.safeParse({ ...validInput, nif: 'AB' });
    expect(result.success).toBe(false);
  });

  it('accepts an optional valid web URL', () => {
    const result = schema.safeParse({
      ...validInput,
      web: 'https://mi-agencia.com',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid web URL', () => {
    const result = schema.safeParse({ ...validInput, web: 'not-a-url' });
    expect(result.success).toBe(false);
    const issue = result.error?.issues.find((i) => i.path[0] === 'web');
    expect(issue?.message).toBe('validation.urlInvalid');
  });
});
