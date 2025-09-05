<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GeminiService
{
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    public function analyzeShopeePreview(array $preview, array $sum): array
    {
        $prompt = "Analisis transaksi Shopee berikut:\n".
                  "Summary: ".json_encode($sum)."\n\n".
                  "Sample: ".json_encode($preview);

        $resp = Http::withHeaders([
            'Authorization' => 'Bearer '.$this->apiKey,
            'Content-Type'  => 'application/json',
        ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', [
            'contents' => [
                ['parts' => [['text' => $prompt]]]
            ]
        ]);

        if (!$resp->ok()) {
            return ['summary_text'=>'Gagal memanggil Gemini','alerts'=>[]];
        }

        $out = $resp->json();
        $text = $out['candidates'][0]['content']['parts'][0]['text'] ?? '(no response)';

        return [
            'summary_text' => $text,
            'alerts'       => explode("\n", $text),
        ];
    }
}
