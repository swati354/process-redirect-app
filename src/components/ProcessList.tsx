import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Processes } from '@uipath/uipath-typescript/processes';
import type { ProcessGetResponse } from '@uipath/uipath-typescript/processes';
import { UiPathError } from '@uipath/uipath-typescript/core';

const PAGE_SIZE = 20;

export function ProcessList() {
  const { sdk, logout } = useAuth();
  const processes = useMemo(() => new Processes(sdk), [sdk]);

  const [items, setItems] = useState<ProcessGetResponse[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    processes
      .getAll({ pageSize: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE })
      .then((result) => {
        if (cancelled) return;
        setItems(result.items);
        setTotal('totalCount' in result ? (result as { totalCount?: number }).totalCount ?? null : null);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof UiPathError ? err.message : 'Failed to load processes');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [processes, page]);

  const filtered = search.trim()
    ? items.filter(
        (p) =>
          p.name?.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase()) ||
          p.folderName?.toLowerCase().includes(search.toLowerCase()),
      )
    : items;

  const totalPages = total != null ? Math.ceil(total / PAGE_SIZE) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Orchestrator Processes</h1>
            <p className="text-xs text-gray-500">UiPath Automation Cloud</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded border border-gray-200 hover:border-gray-300 transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="relative flex-1 max-w-sm">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="search"
              placeholder="Filter by name, description or folder…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            />
          </div>
          {total != null && (
            <span className="text-sm text-gray-500 whitespace-nowrap">{total} process{total !== 1 ? 'es' : ''}</span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-white rounded-lg border border-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Process table */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-sm">
                {search ? 'No processes match your filter.' : 'No processes found.'}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-left">
                      <th className="px-4 py-3 font-medium text-gray-600 w-1/3">Name</th>
                      <th className="px-4 py-3 font-medium text-gray-600 w-1/4">Folder</th>
                      <th className="px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Version</th>
                      <th className="px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Type</th>
                      <th className="px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Framework</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((p) => (
                      <tr key={p.id ?? p.key} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-start gap-2">
                            <div className="mt-0.5 w-6 h-6 rounded bg-orange-100 flex items-center justify-center shrink-0">
                              <svg className="w-3.5 h-3.5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{p.name ?? '—'}</p>
                              {p.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{p.description}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.folderName ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">
                          {p.packageVersion ?? '—'}
                          {p.isLatestVersion && (
                            <span className="ml-1.5 inline-block px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-[10px] font-sans font-medium">
                              latest
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {p.packageType != null ? (
                            <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                              {String(p.packageType)}
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">
                          {p.targetFramework != null ? String(p.targetFramework) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages != null && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between text-sm text-gray-600">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-3 py-1.5 rounded border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages!, p + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1.5 rounded border border-gray-200 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}