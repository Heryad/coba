'use client'

import { useState } from 'react'
import { ChevronUpDownIcon, TrashIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'

export interface Column<T> {
  key: keyof T
  title: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  type?: 'date' | 'text' | 'number'
}

interface TableProps<T> {
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void
  onDelete?: (item: T) => void
  showDelete?: boolean
  onRowClick?: (item: T) => void
  actionButton?: (props: { item: T }) => React.ReactNode
  actionColumnTitle?: string
}

export default function Table<T>({ 
  data, 
  columns, 
  isLoading, 
  onSort,
  onDelete,
  showDelete = false,
  onRowClick,
  actionButton,
  actionColumnTitle = 'Actions'
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null
    direction: 'asc' | 'desc'
  }>({ key: null, direction: 'asc' })

  const handleSort = (key: keyof T) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const formatCellValue = (value: any, column: Column<T>) => {
    if (!value) return '-'
    
    if (column.type === 'date') {
      try {
        return format(new Date(value), 'MMM dd, yyyy HH:mm')
      } catch (error) {
        return value
      }
    }
    
    return column.render ? column.render(value, data[0]) : String(value)
  }

  if (isLoading) {
    return (
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow sm:rounded-lg">
              <div className="min-h-[300px] bg-white flex items-center justify-center">
                <div className="animate-pulse flex space-x-4">
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-blue-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={String(column.key)}
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-blue-900"
                    >
                      <div className="group inline-flex">
                        {column.title}
                        {column.sortable && (
                          <span
                            className="ml-2 flex-none rounded cursor-pointer text-blue-400 hover:text-blue-600"
                            onClick={() => handleSort(column.key)}
                          >
                            <ChevronUpDownIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {(showDelete || actionButton) && (
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-blue-900">
                      {actionColumnTitle}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {data.map((item, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onRowClick?.(item)}
                  >
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="whitespace-nowrap px-3 py-4 text-sm text-gray-600"
                      >
                        {formatCellValue(item[column.key], column)}
                      </td>
                    ))}
                    {(showDelete || actionButton) && (
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        {showDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onDelete?.(item)
                            }}
                            className="text-red-600 hover:text-red-900 transition-colors duration-200"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                        {actionButton && actionButton({ item })}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
} 