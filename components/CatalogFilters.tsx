"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { TmdbCountry, TmdbGenre } from "@/lib/tmdb";

type Props = {
  basePath: string;
  sort: string;
  genre?: string;
  country?: string;
  genres: TmdbGenre[];
  countries: TmdbCountry[];
};

type Option = { value: string; label: string };

const MAJOR_FILM_COUNTRIES = [
  "US", "GB", "KR", "JP", "IN", "CN", "HK", "FR", "DE", "ES",
  "IT", "CA", "AU", "PH", "TH", "MX", "BR", "TR", "NG",
] as const;

function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: Option[]; onChange: (value: string) => void }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.value === value) || options[0];

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className={`catalog-dropdown ${open ? "open" : ""}`} ref={rootRef}>
      <button className="catalog-dropdown-trigger" type="button" onClick={() => setOpen(current => !current)} aria-haspopup="listbox" aria-expanded={open}>
        <span className="catalog-dropdown-label">{label}</span>
        <span className="catalog-dropdown-value">{selected.label}</span>
        <span className="catalog-dropdown-chevron" aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="catalog-dropdown-menu" role="listbox" aria-label={`Filter by ${label.toLowerCase()}`}>
          {options.map(option => (
            <button
              key={option.value || "all"}
              className={`catalog-dropdown-option ${option.value === value ? "active" : ""}`}
              type="button"
              role="option"
              aria-selected={option.value === value}
              onClick={() => { onChange(option.value); setOpen(false); }}
            >
              <span>{option.label}</span>
              {option.value === value && <span className="catalog-option-mark" aria-hidden="true">•</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CatalogFilters({ basePath, sort, genre = "", country = "", genres, countries }: Props) {
  const router = useRouter();
  const [selectedGenre, setSelectedGenre] = useState(genre);
  const [selectedCountry, setSelectedCountry] = useState(country);
  const hasFilters = Boolean(selectedGenre || selectedCountry);

  const genreOptions: Option[] = [
    { value: "", label: "All genres" },
    ...genres.map(item => ({ value: String(item.id), label: item.name })),
  ];

  const countryMap = new Map(countries.map(item => [item.iso_3166_1, item.english_name]));
  const countryOptions: Option[] = [
    { value: "", label: "All countries" },
    ...MAJOR_FILM_COUNTRIES.map(code => ({ value: code, label: countryMap.get(code) || code })),
  ];

  function applyFilters() {
    const params = new URLSearchParams();
    if (sort) params.set("sort", sort);
    if (selectedGenre) params.set("genre", selectedGenre);
    if (selectedCountry) params.set("country", selectedCountry);
    const query = params.toString();
    router.replace(query ? `${basePath}?${query}` : basePath);
  }

  return (
    <div className="catalog-filter-form">
      <div className="catalog-filter-intro" aria-hidden="true">
        <span className="catalog-filter-dot" />
        <span>Refine</span>
      </div>
      <Dropdown label="Genre" value={selectedGenre} options={genreOptions} onChange={setSelectedGenre} />
      <Dropdown label="Country" value={selectedCountry} options={countryOptions} onChange={setSelectedCountry} />
      <button className="catalog-apply" type="button" onClick={applyFilters}>Apply</button>
      {hasFilters && <Link replace className="catalog-clear" href={{ pathname: basePath, query: { sort } }}>Reset</Link>}
    </div>
  );
}
