/**
 * API Validation Helper
 * Utility functions for validating API requests with Zod
 */

import { NextRequest, NextResponse } from "next/server";
import { z, ZodSchema } from "zod";
import { HTTP_STATUS, ERROR_MESSAGE } from "@/constants";

/**
 * Valida o body de uma requisição usando um schema Zod
 */
export async function validateRequestBody<T>(
 request: NextRequest,
 schema: ZodSchema<T>
): Promise<{ data: T } | { error: NextResponse }> {
 try {
  const body = await request.json();
  const data = schema.parse(body);
  return { data };
 } catch (error) {
  if (error instanceof z.ZodError) {
   return {
    error: NextResponse.json(
     {
      error: ERROR_MESSAGE.VALIDATION,
      details: error.errors.map((e) => ({
       path: e.path.join("."),
       message: e.message,
      })),
     },
     { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
    ),
   };
  }

  return {
   error: NextResponse.json(
    { error: ERROR_MESSAGE.GENERIC },
    { status: HTTP_STATUS.BAD_REQUEST }
   ),
  };
 }
}

/**
 * Valida query parameters usando um schema Zod
 */
export function validateQueryParams<T>(
 request: NextRequest,
 schema: ZodSchema<T>
): { data: T } | { error: NextResponse } {
 try {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const data = schema.parse(searchParams);
  return { data };
 } catch (error) {
  if (error instanceof z.ZodError) {
   return {
    error: NextResponse.json(
     {
      error: ERROR_MESSAGE.VALIDATION,
      details: error.errors.map((e) => ({
       path: e.path.join("."),
       message: e.message,
      })),
     },
     { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
    ),
   };
  }

  return {
   error: NextResponse.json(
    { error: ERROR_MESSAGE.GENERIC },
    { status: HTTP_STATUS.BAD_REQUEST }
   ),
  };
 }
}

/**
 * Valida route params usando um schema Zod
 */
export function validateParams<T>(
 params: unknown,
 schema: ZodSchema<T>
): { data: T } | { error: NextResponse } {
 try {
  const data = schema.parse(params);
  return { data };
 } catch (error) {
  if (error instanceof z.ZodError) {
   return {
    error: NextResponse.json(
     {
      error: ERROR_MESSAGE.VALIDATION,
      details: error.errors.map((e) => ({
       path: e.path.join("."),
       message: e.message,
      })),
     },
     { status: HTTP_STATUS.UNPROCESSABLE_ENTITY }
    ),
   };
  }

  return {
   error: NextResponse.json(
    { error: ERROR_MESSAGE.GENERIC },
    { status: HTTP_STATUS.BAD_REQUEST }
   ),
  };
 }
}

/**
 * Type guard para verificar se o resultado é um erro
 */
export function isValidationError<T>(
 result: { data: T } | { error: NextResponse }
): result is { error: NextResponse } {
 return "error" in result;
}
