'use client'
import React from "react";
import { FiPhone } from "react-icons/fi";
import { useRouter } from "next/navigation";

const HOTLINE_DISPLAY = "+88 09638505505";
const HOTLINE_TEL = "tel:+8809638505505";

const Custom404 = () => {
  const { push } = useRouter();
  const handleClicked = () => {
    push("/dashboard")
  }

  return (
    <div>
      <main className="grid min-h-full place-items-center bg-primary-default px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-3xl font-semibold text-primary-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-primary-500 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
						<button onClick={handleClicked}  className="relative overflow-visible rounded-full hover:-translate-y-1 px-12 shadow-xl bg-primary-100 after:content-[''] after:absolute after:rounded-full after:inset-0 after:bg-primary-200 after:z-[-1] after:transition after:!duration-500 hover:after:scale-150 hover:after:opacity-0">GO back home</button>
            <a
              href={HOTLINE_TEL}
              className="text-sm font-semibold text-primary-500 hover:underline"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* The hotline is spelled out rather than hidden behind the link, so it
              can be read off the screen and dialled from another phone. */}
          <a
            href={HOTLINE_TEL}
            className="mt-10 inline-flex items-center gap-3 rounded-full border border-primary-200 bg-white px-6 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-500 text-white">
              <FiPhone size={16} />
            </span>
            <span className="text-left">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                Hotline
              </span>
              <span className="block text-base font-bold text-primary-600">
                {HOTLINE_DISPLAY}
              </span>
            </span>
          </a>
        </div>
      </main>
    </div>
  );
};

export default Custom404;
