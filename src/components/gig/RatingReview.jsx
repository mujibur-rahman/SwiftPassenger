// @/components/gig/RatingReview.jsx
// Backward-compatible re-export of the global RateReviewForm (stars + tags + text only).
import React from "react";
import RateReviewForm, {
  DEFAULT_REVIEW_TAGS,
} from "@/components/shared/RateReviewForm";

export const REVIEW_TAGS = DEFAULT_REVIEW_TAGS;

export default function RatingReview({
  rating = 0,
  onRatingChange,
  text = "",
  onTextChange,
  tags = [],
  onTagsChange,
  className = "",
}) {
  return (
    <RateReviewForm
      rating={rating}
      onRatingChange={onRatingChange}
      text={text}
      onTextChange={onTextChange}
      tags={tags}
      onTagsChange={onTagsChange}
      showTags
      showText
      className={className}
      // no onSubmit — parent screen owns the button (legacy Gig layout)
    />
  );
}
