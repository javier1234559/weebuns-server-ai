//writing_all
//writingDetail_6ebe618d-6c32-42ca-8df4-ee5f2c1bdfa8

/**
 * Extracts the UUID identifier from a comment identifier string
 * @param identifierId Format: "type" or "type_uuid" (e.g. "writing_all" or "writingDetail_6ebe618d-6c32-42ca-8df4-ee5f2c1bdfa8")
 * @returns The UUID portion if valid, undefined if invalid format or no UUID
 */
export const getCommentIdentifierId = (
  identifierId: string,
): string | undefined => {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  // If no underscore, there's no UUID
  if (!identifierId.includes('_')) {
    return undefined;
  }

  const uuid = identifierId.split('_')[1];
  if (uuid && uuidRegex.test(uuid)) {
    return uuid;
  }

  return undefined;
};

/**
 * Extracts the type prefix from a comment identifier string
 * @param identifierId Format: "type" or "type_uuid" (e.g. "writing_all" or "writingDetail_6ebe618d-6c32-42ca-8df4-ee5f2c1bdfa8")
 * @returns The type portion (e.g. "writing_all" or "writingDetail")
 */
export const getCommentIdentifierType = (identifierId: string): string => {
  return identifierId.split('_')[0];
};
