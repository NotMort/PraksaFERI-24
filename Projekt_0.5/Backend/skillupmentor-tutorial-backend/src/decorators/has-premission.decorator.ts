import { SetMetadata } from "@nestjs/common";

export const HasPremission = (access: string) => SetMetadata('access',access)