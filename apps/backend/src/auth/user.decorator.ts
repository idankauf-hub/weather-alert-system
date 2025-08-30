import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export interface ReqUser {
  userId: string;
  email: string;
  name?: string;
}
export const User = createParamDecorator(
  (_data, ctx: ExecutionContext): ReqUser | undefined => {
    const req = ctx.switchToHttp().getRequest();
    return (req as any).user;
  },
);
