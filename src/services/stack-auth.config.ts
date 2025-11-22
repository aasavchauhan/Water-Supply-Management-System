import { StackProvider, StackTheme } from '@stackframe/stack';

const stackConfig = {
  projectId: import.meta.env.NEXT_PUBLIC_STACK_PROJECT_ID || 'b4a20c72-500e-45f1-b15a-a2ceeba1bae7',
  publishableClientKey: import.meta.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY || 'pck_qy4k4e76c3pyrmt8snhngktx15pdwv8wcpq5qadsbk5vg',
};

export { stackConfig, StackProvider, StackTheme };
