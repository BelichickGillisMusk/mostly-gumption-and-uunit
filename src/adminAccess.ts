const OWNER_ADMIN_PASSWORD = '1225';

export const canAccessOwnerAdmin = (password: string | null | undefined) => {
  return password?.trim() === OWNER_ADMIN_PASSWORD;
};
