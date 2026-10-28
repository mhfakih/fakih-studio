import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt wajib diisi' }, { status: 400 });
    }

    // 1. Generate Gambar via Pollinations.ai
    const encodedPrompt = encodeURIComponent(prompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true`;

    // 2. Inisialisasi Supabase di dalam handler
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('generation_history').insert([
        {
          prompt: prompt,
          video_url: imageUrl,
          status: 'completed',
        },
      ]);
    }

    return NextResponse.json({ 
      success: true, 
      videoUrl: imageUrl 
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Gagal membuat media' }, { status: 500 });
  }
}