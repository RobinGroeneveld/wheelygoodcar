"use client";
import { color } from 'motion/react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TagStatsTable() {
  const { data, error, isLoading } = useSWR('/api/admin/tag-stats', fetcher);

  if (isLoading) return <div>Bezig met laden...</div>;
  if (error) return <div>Fout bij laden van data</div>;
  if (!data) return null;

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 16, borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', color: '#111' }}>
        <thead>
          <tr style={{ background: '#222', color: '#fff' }}>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc', padding: 8 }}>Tag</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: 8 }}>Totaal</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: 8 }}>Verkocht</th>
            <th style={{ textAlign: 'right', borderBottom: '1px solid #ccc', padding: 8 }}>Niet verkocht</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row: any) => (
            <tr key={row.id} style={{ background: '#fff', color: '#111' }}>
              <td style={{ padding: 8, color: '#111' }}>{row.name || <em>Onbekend</em>}</td>
              <td style={{ textAlign: 'right', padding: 8, color: '#111' }}>{row.total}</td>
              <td style={{ textAlign: 'right', padding: 8, color: '#111' }}>{row.sold}</td>
              <td style={{ textAlign: 'right', padding: 8, color: '#111' }}>{row.available}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}