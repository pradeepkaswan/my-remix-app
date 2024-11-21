import {
  Form,
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { redirect } from "@remix-run/node";

import { destroySession, getSession } from "./session";
import "./tailwind.css";

import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // {
  //   rel: "stylesheet",
  //   href: stylesheet,
  // },
  // {
  //   rel: "stylesheet",
  //   href: "/fonts/inter/inter.css",
  // },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="mx-auto max-w-xl p-4 lg:max-w-7xl">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return redirect("/", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("cookie"));

  return { session: session.data };
}

export default function App() {
  const { session } = useLoaderData<typeof loader>();

  return (
    <>
      <header>
        <div className="flex items-center justify-between lg:border-b lg:border-gray-800 lg:pb-5 lg:pt-1">
          <p className="text-sm uppercase lg:text-lg">
            <span className="text-gray-500">Pradeep</span>
            <span className="font-semibold italic text-gray-200">Kaswan</span>
          </p>

          <div className="text-sm font-medium text-gray-500 hover:text-gray-200">
            {session.isAdmin ? (
              <Form method="post">
                <button className="text-red-500">Log out</button>
              </Form>
            ) : (
              // TODO: fix this redirect, it's not working
              <Link to="/login">Log in</Link>
            )}
          </div>
        </div>

        <div className="my-20 lg:my-28">
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-white lg:text-7xl">
              <Link to="/">Work Journal</Link>
            </h1>

            <p className="mt-2 tracking-tighter text-gray-500 lg:mt-4 lg:text-xl">
              Doings and learnings. Updated weekly.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl">
        <Outlet />
      </main>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <p className="text-3xl">Something went wrong!</p>
      {isRouteErrorResponse(error) ? (
        <p>
          {error.status} - {error.statusText}
        </p>
      ) : error instanceof Error ? (
        <pre>{error.message}</pre>
      ) : (
        <p>Something happened.</p>
      )}
    </div>
  );
}
