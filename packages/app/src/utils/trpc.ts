import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@test/www/api/root';
//     👆 **type-only** import

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000',
      fetch(url, options) {
        return fetch(url, {
          ...options,
          // credentials: 'include',
        });
      },
    }),
  ],
});
