import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export default function EntryForm({
  entry,
}: {
  entry?: { text: string; date: string; type: string };
}) {
  const fetcher = useFetcher();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data !== undefined &&
      textareaRef.current
    ) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <fetcher.Form method="post" className="mt-4">
      <fieldset
        className="disabled:opacity-70"
        disabled={fetcher.state !== "idle"}
      >
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:order-2">
            <input
              type="date"
              name="date"
              style={{ colorScheme: "dark" }}
              className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              required
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="mt-6 flex space-x-4 text-sm lg:mt-0 lg:space-x-6 lg:text-base">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block text-white">
                <input
                  className="mr-2 border-gray-700 bg-gray-800 text-sky-600 focus:ring-sky-600 focus:ring-offset-gray-900"
                  type="radio"
                  name="type"
                  value={option.value}
                  required
                  defaultChecked={option.value === (entry?.type ?? "work")}
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <textarea
            ref={textareaRef}
            name="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
            placeholder="Write something..."
            rows={3}
            required
            defaultValue={entry?.text}
          />
        </div>

        <div className="mt-6 text-right">
          <button
            className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900 lg:w-auto lg:py-1.5"
            type="submit"
          >
            {fetcher.state !== "idle" ? "Saving..." : "Save"}
          </button>
        </div>
      </fieldset>
    </fetcher.Form>
  );
}
