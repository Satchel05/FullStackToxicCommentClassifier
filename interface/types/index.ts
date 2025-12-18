export type Comment = {
  id: number;
  comment: string;
  toxicityPrediction: boolean;
  timestamp: Date;
  author: string;
  profileImgPath: string;
};
