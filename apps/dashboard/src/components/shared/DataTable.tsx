import React, { useState, useMemo } from 'react';
import { 
  MoreHorizontal, 
  ChevronUp, 
  ChevronDown, 
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import './DataTable.css';

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  actions?: React.ReactNode;
}

type SortConfig<T> = {
  key: keyof T | string;
  direction: 'asc' | 'desc';
} | null;

const DataTable = <T extends object>({ 
  columns, 
  data, 
  title, 
  onRowClick,
  pageSize = 10,
  searchPlaceholder = "Pesquisar...",
  enableSearch = true,
  actions
}: DataTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting Logic
  const handleSort = (key: keyof T | string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and Sort Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchTerm) {
      result = result.filter(row => 
        Object.values(row).some(val => 
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortConfig.key];
        const bValue = (b as any)[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchTerm, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="data-table-container glass animate-fade-in">
      <div className="table-controls">
        <div className="table-title-group">
          {title && <h3 className="table-title">{title}</h3>}
          <span className="table-badge">{processedData.length} itens</span>
        </div>
        
        <div className="table-actions">
          {enableSearch && (
            <div className="table-search">
              <Search size={16} />
              <input 
                type="text" 
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          {actions}
          <button className="table-action-btn" title="Filtrar">
            <Filter size={18} />
          </button>
          <button className="table-action-btn" title="Exportar">
            <Download size={18} />
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => col.sortable !== false && handleSort(col.accessor)}
                  className={col.sortable !== false ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {col.header}
                    {col.sortable !== false && sortConfig?.key === col.accessor && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="actions-cell"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={rowIdx} onClick={() => onRowClick?.(row)} className={onRowClick ? 'clickable' : ''}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {col.render ? col.render(row) : ((row as any)[col.accessor] as unknown as React.ReactNode)}
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
                  <div className="empty-state-content">
                    <Search size={40} />
                    <p>Nenhum registro encontrado para "{searchTerm}"</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <span className="table-count">
            Mostrando {Math.min(processedData.length, (currentPage - 1) * pageSize + 1)} a {Math.min(processedData.length, currentPage * pageSize)} de {processedData.length} registros
          </span>
          <div className="table-pagination">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default DataTable;
