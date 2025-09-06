import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Row = {
    account_id?: string | number;
    name?: string;
    debitAmount?: number;
    creditAmount?: number;
};

type ReportingTableProps = {
    data: Row[];
    showTotals?: boolean;
    emptyText?: string;
};

const currency = (n?: number) =>
    typeof n === "number" && !isNaN(n)
        ? `Rp ${n.toLocaleString("id-ID")}`
        : "-";

const ReportingTable = ({ data, showTotals = true, emptyText = "No Record Available." }: ReportingTableProps) => {
    const rows = Array.isArray(data) ? data : [];
    const totals = rows.reduce(
        (acc, r) => {
            acc.debit += Number(r?.debitAmount ?? 0);
            acc.credit += Number(r?.creditAmount ?? 0);
            return acc;
        },
        { debit: 0, credit: 0 }
    );

    return (
        <Table>
            <TableHeader className="bg-muted">
                <TableRow>
                    <TableHead className="w-[100px] text-center">Account</TableHead>
                    <TableHead className="text-center">Debits</TableHead>
                    <TableHead className="text-center">Credits</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {rows.length ? (
                    <>
                        {rows.map((item, index) => (
                            <TableRow key={`${item.account_id ?? 'row'}-${index}`}>
                                <TableCell className="text-center">{item?.name ?? `#${item?.account_id ?? index + 1}`}</TableCell>
                                <TableCell className="text-center">{currency(item?.debitAmount)}</TableCell>
                                <TableCell className="text-center">{currency(item?.creditAmount)}</TableCell>
                            </TableRow>
                        ))}
                        {showTotals && (
                            <TableRow>
                                <TableCell className="text-right font-medium">Total</TableCell>
                                <TableCell className="text-center font-medium">{currency(totals.debit)}</TableCell>
                                <TableCell className="text-center font-medium">{currency(totals.credit)}</TableCell>
                            </TableRow>
                        )}
                    </>
                ) : (
                    <TableRow>
                        <TableCell colSpan={3} className="text-center text-gray-400">
                            {emptyText}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};

export default ReportingTable;