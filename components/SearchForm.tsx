"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("q") || "").trim();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    const search = params.toString();
    router.replace(search ? `/search?${search}` : "/search");
  }

  return (
    <form className="search-form" action="/search" onSubmit={handleSubmit}>
      <input autoFocus name="q" defaultValue={defaultQuery} placeholder="Movie or series" aria-label="Search movies and TV series" />
      <button type="submit" aria-label="Submit search">→</button>
    </form>
  );
}
