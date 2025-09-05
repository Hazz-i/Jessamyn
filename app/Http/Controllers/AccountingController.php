<?php

namespace App\Http\Controllers;

use App\Models\Accounting;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\Coordinate;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccountingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load related account so the frontend can display the account name
        $records = Accounting::with(['account:id,name,reff'])->latest()->get();
        $accounts = Account::select('id', 'name', 'reff')->orderBy('name')->get();
        return inertia('Reporting/Index', [
            'records' => $records,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    
    }

    /**
     * Display the specified resource.
     */
    public function show(Accounting $accounting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Accounting $accounting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Accounting $accounting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Accounting $accounting)
    {
        //
    }

    /**
     * Export Kertas Kerja (worksheet) for a given year-month to Excel.
     */
    public function exportWorksheet(Request $request): StreamedResponse
    {
        $request->validate([
            'date' => ['nullable', 'date'],
        ]);

        $date = $request->input('date') ?: now()->toDateString();
        $dt = strtotime($date);
        $year = (int)date('Y', $dt);
        $month = (int)date('m', $dt);

        $records = Accounting::with(['account:id,name,reff'])
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->get();

        // Aggregate per account: net = debit - credit (positive => debit)
        $rows = [];
        foreach ($records as $r) {
            $id = (string)($r->account_id);
            if (!isset($rows[$id])) {
                $rows[$id] = [
                    'reff' => $r->account->reff ?? '',
                    'name' => $r->account->name ?? ('#'.$id),
                    'tbNet' => 0.0,
                ];
            }
            $rows[$id]['tbNet'] += (float)$r->debit - (float)$r->credit;
        }

        ksort($rows);

        $sheetData = [
            ['Reff', 'Akun', 'Neraca Saldo Debit', 'Neraca Saldo Kredit', 'Laba/Rugi Debit', 'Laba/Rugi Kredit', 'Neraca Debit', 'Neraca Kredit'],
        ];

        foreach ($rows as $row) {
            $nsDebit = $row['tbNet'] > 0 ? $row['tbNet'] : 0;
            $nsCredit = $row['tbNet'] < 0 ? abs($row['tbNet']) : 0;
            $isLR = preg_match('/^[4-7]/', (string)$row['reff']);
            $isNeraca = preg_match('/^[1-3]/', (string)$row['reff']);
            $sheetData[] = [
                $row['reff'],
                $row['name'],
                $nsDebit,
                $nsCredit,
                $isLR ? $nsDebit : 0,
                $isLR ? $nsCredit : 0,
                $isNeraca ? $nsDebit : 0,
                $isNeraca ? $nsCredit : 0,
            ];
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Kertas Kerja');

        $rowIdx = 1;
        foreach ($sheetData as $line) {
            $col = 1;
            foreach ($line as $val) {
                $colLetter = Coordinate::stringFromColumnIndex($col);
                $sheet->setCellValue($colLetter.$rowIdx, $val);
                $col++;
            }
            $rowIdx++;
        }

        // Autosize columns
        foreach (range('A', 'H') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $fileName = 'kertas-kerja_'.date('Y-m', $dt).'.xlsx';
        return new StreamedResponse(function () use ($spreadsheet) {
            $writer = new Xlsx($spreadsheet);
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="'.$fileName.'"',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}
