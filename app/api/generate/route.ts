import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Request tidak valid' }, { status: 400 });
    }

    const prompt =
      typeof body === 'object' && body !== null && 'prompt' in body
        ? body.prompt
        : undefined;

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json({ error: 'Prompt wajib diisi' }, { status: 400 });
    }

    // Menggunakan Pollinations API gratis (Text-to-Image)
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true`;

    if (supabase) {
      const { error } = await supabase.from('generation_history').insert({
        prompt: prompt.trim(),
        video_url: imageUrl,
        status: 'completed',
      });

      if (error) {
        return NextResponse.json(
          { error: 'Gagal menyimpan riwayat media' },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      videoUrl: imageUrl,
    });
  } catch {
    return NextResponse.json({ error: 'Gagal membuat media' }, { status: 500 });
  }
}