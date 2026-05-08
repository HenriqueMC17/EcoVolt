import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import './DataTable.css';

interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onRowClick?: (row: T) => void;
}

const DataTable = <T extends Record<string, unknown>>({ columns, data, title, onRowClick }: DataTableProps<T>) => {
  return (
    <div className="data-table-container glass animate-fade-in">
      <div className="table-controls">
        {title && <h3 className="table-title">{title}</h3>}
        <div className="table-actions">
          {/* Espaço para filtros ou botões extras */}
        </div>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx}>
                  <div className="th-content">
                    {col.header}
                  </div>
                </th>
              ))}
              <th className="actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIdx) => (
                <tr key={rowIdx} onClick={() => onRowClick?.(row)} className={onRowClick ? 'clickable' : ''}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : (row[col.accessor] as unknown as React.ReactNode)}
                    </td>
                  ))}
                  <td className="actions-cell">
                    <button className="action-dot-btn">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="empty-state">
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <span className="table-count">Mostrando {data.length} registros</span>
        <div className="table-pagination">
          <button className="page-btn" disabled>&lt;</button>
          <button className="page-btn active">1</button>
          <button className="page-btn" disabled>&gt;</button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
