<?php

namespace App\Http\Controllers;

use App\Models\Accounting;
use App\Models\Account;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class JurnalUmumController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Load related account so the frontend can display the account name
        $accountings = Accounting::with(['account:id,name'])->latest()->get();
        $accounts = Account::select('id', 'name')->orderBy('name')->get();
        
        return inertia('JurnalUmum/Index', [
            'accountings' => $accountings,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'],

            'debits' => ['required', 'array', 'min:1'],
            'debits.*.account_id' => ['required', 'exists:account,id'],
            'debits.*.amount' => ['required', 'numeric', 'min:0'],

            'credits' => ['required', 'array', 'min:1'],
            'credits.*.account_id' => ['required', 'exists:account,id'],
            'credits.*.amount' => ['required', 'numeric', 'min:0'],
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('proofs', 'public');
        }

        // Create debit rows
        foreach ($validated['debits'] as $line) {
            Accounting::create([
                'description' => $validated['description'],
                'debit' => $line['amount'],
                'credit' => 0,
                'note' => $validated['note'] ?? null,
                'account_id' => $line['account_id'],
                'user_id' => Auth::id(),
                'image' => $imagePath,
            ]);
        }

        // Create credit rows
        foreach ($validated['credits'] as $line) {
            Accounting::create([
                'description' => $validated['description'],
                'debit' => 0,
                'credit' => $line['amount'],
                'note' => $validated['note'] ?? null,
                'account_id' => $line['account_id'],
                'user_id' => Auth::id(),
                'image' => $imagePath,
            ]);
        }

        return redirect()->route('jurnal-umum.index')->with('success', 'Journal entry created successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $accounting = Accounting::findOrFail($id);

        $validated = $request->validate([
            'description' => ['required', 'string', 'max:255'],
            'note' => ['nullable', 'string'],
            'account_id' => ['required', 'exists:account,id'],
            'side' => ['required', 'in:debit,credit'],
            'amount' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,gif', 'max:2048'],
        ]);

        // Handle optional image replacement
        if ($request->hasFile('image')) {
            if ($accounting->image) {
                $old = ltrim(str_replace('/storage/', '', $accounting->image), '/');
                if (Storage::disk('public')->exists($old)) {
                    Storage::disk('public')->delete($old);
                }
            }
            $accounting->image = $request->file('image')->store('proofs', 'public');
        }

        $accounting->description = $validated['description'];
        $accounting->note = $validated['note'] ?? null;
        $accounting->account_id = $validated['account_id'];
        if ($validated['side'] === 'debit') {
            $accounting->debit = $validated['amount'];
            $accounting->credit = 0;
        } else {
            $accounting->debit = 0;
            $accounting->credit = $validated['amount'];
        }
        $accounting->save();

        return redirect()->route('jurnal-umum.index')->with('success', 'Record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Accounting $accounting)
    {
        if ($accounting->image) {
            // Support both storage URLs ("/storage/...") and raw paths ("proofs/...")
            $path = ltrim(str_replace('/storage/', '', $accounting->image), '/');
            if (Storage::disk('public')->exists($path)) {
                Storage::disk('public')->delete($path);
            }
        }

        $accounting->delete();

        return redirect()->route('jurnal-umum.index')->with('success', 'Record deleted successfully.');
    }
}
