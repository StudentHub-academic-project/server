export interface CreatePostDto {
  title: string;
  content: string;
  userId: string;
  rating?: number;
}
