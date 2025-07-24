import React from 'react';

interface IncludeTodoProps {
  include: string;
}

export default function IncludeTodo({ include }: IncludeTodoProps): JSX.Element {
  return (
    <div style={{
      border: '2px solid #ff6b6b',
      borderRadius: '8px',
      padding: '16px',
      margin: '16px 0',
      backgroundColor: '#fff5f5'
    }}>
      <div style={{
        fontWeight: 'bold',
        color: '#d63031',
        marginBottom: '8px'
      }}>
        ⚠️ This include is not yet migrated
      </div>
      <div style={{
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#2d3436',
        backgroundColor: '#f8f9fa',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #dee2e6'
      }}>
        {include}
      </div>
    </div>
  );
} 