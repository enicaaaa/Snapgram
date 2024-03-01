import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgo(dateString: string): string {
  const date: Date = new Date(dateString);
  const now: Date = new Date();
  const timeDifference: number = now.getTime() - date.getTime();
  const seconds: number = Math.floor(timeDifference / 1000);
  const minutes: number = Math.floor(seconds / 60);
  const hours: number = Math.floor(minutes / 60);
  const days: number = Math.floor(hours / 24);

  if (days > 0) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
  } else if (hours > 0) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  } else if (minutes > 0) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
  } else {
      return 'Just now';
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
}
