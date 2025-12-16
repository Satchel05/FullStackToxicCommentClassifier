import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { CheckIcon } from 'lucide-react';

export default function CommentBlock({ toxicityPrediction, comment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>{new Date().toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{comment}</p>
      </CardContent>
      <CardFooter>
        <Badge>{toxicityPrediction ? 'Toxic!' : 'Not Toxic'}</Badge>
      </CardFooter>
    </Card>
  );
}
