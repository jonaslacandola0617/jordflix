import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string | undefined>;
};

export default function CompactPagination({ page, totalPages, basePath, query = {} }: Props) {
  const lastPage = Math.max(1, Math.min(totalPages, 500));
  if (lastPage <= 1) return null;

  const href = (nextPage: number) => ({
    pathname: basePath,
    query: { ...query, page: String(nextPage) },
  });

  return (
    <nav className="compact-pagination" aria-label="Top pagination">
      {page > 1 ? <Link className="compact-page-button" href={href(page - 1)} aria-label="Previous page">←</Link> : <span className="compact-page-button disabled" aria-hidden="true">←</span>}
      <span className="compact-page-status"><b>{page}</b><i>/</i>{lastPage}</span>
      {page < lastPage ? <Link className="compact-page-button" href={href(page + 1)} aria-label="Next page">→</Link> : <span className="compact-page-button disabled" aria-hidden="true">→</span>}
    </nav>
  );
}
