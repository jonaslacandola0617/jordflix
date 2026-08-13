import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

export default function Pagination({ page, totalPages, basePath, query = {} }: Props) {
  const lastPage = Math.max(1, Math.min(totalPages, 500));
  if (lastPage <= 1) return null;

  const href = (nextPage: number) => ({
    pathname: basePath,
    query: { ...query, page: String(nextPage) },
  });

  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 ? <Link replace className="pagination-link" href={href(page - 1)}>← Previous</Link> : <span />}
      <span className="pagination-status">Page {page} <i>/</i> {lastPage}</span>
      {page < lastPage ? <Link replace className="pagination-link" href={href(page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}
