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
    public function index(Request $request)
    {
        // Parse optional month filter: accepts 'YYYY-MM' or full date 'YYYY-MM-DD'. Defaults to current month.
        $raw = $request->input('date');
        if ($raw && preg_match('/^\d{4}-\d{2}$/', (string) $raw)) {
            $year = (int) substr($raw, 0, 4);
            $month = (int) substr($raw, 5, 2);
        } else {
            $ts = $raw ? strtotime((string) $raw) : time();
            $year = (int) date('Y', $ts);
            $month = (int) date('m', $ts);
        }
        $selectedPeriod = sprintf('%04d-%02d', $year, $month);

        // Load records for the selected period and all accounts for lookup
        $records = Accounting::with(['account:id,name,reff'])
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date')
            ->get();

        $accounts = Account::select('id', 'name', 'reff')->orderBy('name')->get();
        $accountsById = $accounts->keyBy('id');

        // Aggregate per account: net = debit - credit (positive => debit column, negative => credit column)
        $agg = [];
        foreach ($records as $r) {
            $id = (int) $r->account_id;
            if (!isset($agg[$id])) {
                $acc = $r->account ?: $accountsById->get($id);
                $agg[$id] = [
                    'account_id' => (string) $id,
                    'name' => $acc->name ?? ('#'.$id),
                    'reff' => $acc->reff ?? '',
                    'debitSum' => 0.0,
                    'creditSum' => 0.0,
                ];
            }
            $agg[$id]['debitSum'] += (float) ($r->debit ?? 0);
            $agg[$id]['creditSum'] += (float) ($r->credit ?? 0);
        }

        $neracaSaldo = [];
        $labaRugi = [];
        $neraca = [];

        foreach ($agg as $row) {
            $net = (float) $row['debitSum'] - (float) $row['creditSum'];
            $entry = [
                'account_id' => $row['account_id'],
                'reff' => $row['reff'],
                'name' => $row['name'],
                'debitAmount' => $net > 0 ? $net : 0,
                'creditAmount' => $net < 0 ? abs($net) : 0,
            ];

            $reff = (string) ($row['reff'] ?? '');
            if (preg_match('/^[1-3]/', $reff)) {
                $neracaSaldo[] = $entry; // trial balance subset for 1,2,3
                $neraca[] = $entry;      // balance sheet uses same accounts
            } elseif (preg_match('/^[4-7]/', $reff)) {
                $labaRugi[] = $entry;    // income statement subset for 4-7
            }
        }

        // Sort consistently by reff then name
        $sorter = function ($a, $b) {
            $ra = $a['reff'] ?? '';
            $rb = $b['reff'] ?? '';
            if ($ra === $rb) {
                return strcmp((string) ($a['name'] ?? ''), (string) ($b['name'] ?? ''));
            }
            return strcmp($ra, $rb);
        };
        usort($neracaSaldo, $sorter);
        usort($labaRugi, $sorter);
        usort($neraca, $sorter);

        return inertia('Reporting/Index', [
            'records' => $records, // already filtered by month
            'accounts' => $accounts,
            'reporting' => [
                'period' => $selectedPeriod,
                'neraca_saldo' => $neracaSaldo,
                'laba_rugi' => $labaRugi,
                'neraca' => $neraca,
            ],
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
        // Accept both YYYY-MM and YYYY-MM-DD formats
        $request->validate([
            'date' => ['nullable', 'string'],
        ]);

        $raw = $request->input('date');
        if ($raw && preg_match('/^\d{4}-\d{2}$/', (string) $raw)) {
            $year = (int) substr($raw, 0, 4);
            $month = (int) substr($raw, 5, 2);
            $dt = strtotime($raw.'-01');
        } else {
            $dt = strtotime($raw ?: now()->toDateString());
            $year = (int)date('Y', $dt);
            $month = (int)date('m', $dt);
        }

        $records = Accounting::with(['account:id,name,reff'])
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
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
