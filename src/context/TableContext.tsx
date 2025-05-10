
import React, { createContext, useState, useContext } from 'react';
import { Table } from '../types';
import { toast } from 'sonner';

interface TableContextType {
  tables: Table[];
  updateTableStatus: (tableNumber: number, status: 'available' | 'occupied', orderId?: string) => void;
  getTableByNumber: (tableNumber: number) => Table | undefined;
}

const TableContext = createContext<TableContextType>({
  tables: [],
  updateTableStatus: () => {},
  getTableByNumber: () => undefined,
});

// Initial tables
const initialTables: Table[] = [
  { number: 1, seats: 2, status: 'occupied', currentOrderId: '1' },
  { number: 2, seats: 2, status: 'available' },
  { number: 3, seats: 4, status: 'occupied', currentOrderId: '2' },
  { number: 4, seats: 4, status: 'available' },
  { number: 5, seats: 6, status: 'available' },
  { number: 6, seats: 6, status: 'available' },
];

export const TableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(initialTables);

  const updateTableStatus = (tableNumber: number, status: 'available' | 'occupied', orderId?: string) => {
    setTables(tables.map(table => {
      if (table.number === tableNumber) {
        return { 
          ...table, 
          status, 
          currentOrderId: status === 'occupied' ? orderId : undefined 
        };
      }
      return table;
    }));

    toast.success(`Table ${tableNumber} updated to ${status}`);
  };

  const getTableByNumber = (tableNumber: number) => {
    return tables.find(table => table.number === tableNumber);
  };

  return (
    <TableContext.Provider value={{
      tables,
      updateTableStatus,
      getTableByNumber
    }}>
      {children}
    </TableContext.Provider>
  );
};

export const useTables = () => useContext(TableContext);
