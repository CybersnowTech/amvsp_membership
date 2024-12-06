export async function uploadPhoto(file: File) {
  const { supabase } = await import('./supabase');
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `photos/${fileName}`;

  const { error, data } = await supabase.storage
    .from('applications')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('applications')
    .getPublicUrl(filePath);

  return publicUrl;
}

export async function getNextId() {
  const { supabase } = await import('./supabase');
  const { data } = await supabase
    .from('applications')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1);

  const lastId = data?.[0]?.id || '0000';
  const nextNum = (parseInt(lastId) + 1).toString().padStart(4, '0');
  return nextNum;
}

export function formatDate(date: string) {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}