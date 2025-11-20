import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { userRepository } from "@/infrastructure/persistence/prisma/repositories/PrismaUserRepository";
import { userPreferencesSchema } from "@/lib/validations";
import { validateRequestBody, isValidationError } from "@/lib/api-validation";
import { HTTP_STATUS, ERROR_MESSAGE } from "@/constants";

export async function GET(request: NextRequest) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json(
    { error: ERROR_MESSAGE.UNAUTHORIZED },
    { status: HTTP_STATUS.UNAUTHORIZED }
   );
  }

  const preferences = await userRepository.getUserPreferences(session.user.id);

  return NextResponse.json(preferences || {}, { status: HTTP_STATUS.OK });
 } catch (error) {
  console.error("Error fetching user preferences:", error);
  return NextResponse.json(
   { error: ERROR_MESSAGE.GENERIC },
   { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
 }
}

export async function PATCH(request: NextRequest) {
 try {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
   return NextResponse.json(
    { error: ERROR_MESSAGE.UNAUTHORIZED },
    { status: HTTP_STATUS.UNAUTHORIZED }
   );
  }

  const validation = await validateRequestBody(request, userPreferencesSchema);

  if (isValidationError(validation)) {
   return validation.error;
  }

  await userRepository.updateUserPreferences(session.user.id, validation.data);

  return NextResponse.json({ success: true }, { status: HTTP_STATUS.OK });
 } catch (error) {
  console.error("Error updating user preferences:", error);
  return NextResponse.json(
   { error: ERROR_MESSAGE.GENERIC },
   { status: HTTP_STATUS.INTERNAL_SERVER_ERROR }
  );
 }
}
