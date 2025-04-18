import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function Paginate({ length = 3 }) {
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });
  const [page, setPage] = useState(Number(searchParams.get("page") || 1));
  const pages = Array.from({ length }, (_: undefined, i: number) => i + page);

  useEffect(() => {
    searchParams.set("page", String(page));
    setSearchParams(searchParams);
  }, [page, searchParams, setSearchParams]);

  function next() {
    setPage((currPage) => currPage + 1);
  }

  function prev() {
    if (page === 1) return;

    setPage((currPage) => currPage - 1);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => prev()} />
        </PaginationItem>
        {pages.map((num) => (
          <PaginationItem key={num}>
            <PaginationLink href={`?page=${num}`}>{num}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext onClick={() => next()} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
