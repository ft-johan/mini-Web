const projectId = 'lkkesknegtnajxfftnqf'; // Your Supabase project ID

interface SupabaseLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

export default function supabaseLoader({ src, width, quality = 75 }: SupabaseLoaderParams): string {
  return `https://${projectId}.supabase.co/storage/v1/render/image/public/${src}?width=${width}&quality=${quality}`;
}
