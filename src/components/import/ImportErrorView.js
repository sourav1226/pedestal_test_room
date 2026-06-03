import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Table, Card, Alert } from '@components/common';
export const ImportErrorView = ({ errors }) => {
    if (errors.length === 0)
        return null;
    const columns = [
        {
            key: 'rowIndex',
            header: 'Row',
            width: '80px',
        },
        {
            key: 'field',
            header: 'Field',
            width: '120px',
        },
        {
            key: 'error',
            header: 'Error',
        },
    ];
    return (_jsxs(Card, { title: `Errors Found (${errors.length})`, className: "border-red-200 bg-red-50", children: [_jsx(Alert, { type: "error", title: "Import Issues", children: "Please fix the following errors before retrying the import." }), _jsx("div", { className: "mt-4", children: _jsx(Table, { columns: columns, data: errors }) })] }));
};
