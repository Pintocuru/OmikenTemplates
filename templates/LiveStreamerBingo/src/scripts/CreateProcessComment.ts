// createProcessComment.ts
import { ServiceVisitType } from '@common/subscribe/GetUserVisits';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

export function createProcessComment() {
 const processCommentUser = (comments: Comment[]) => {};

 const processCommentVisit = (visits: Record<string, ServiceVisitType>) => {};

 return {
  processCommentUser,
  processCommentVisit
 };
}
