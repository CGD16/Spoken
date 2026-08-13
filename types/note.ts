export type Note = {
  id: string;
  raw_transcript: string | null;
  processed_text: string | null;
  title: string | null;
  tags: string[] | null;
  status: string;
  created_at: string;
  is_favorite: boolean | null;
};