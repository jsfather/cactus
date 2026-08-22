ALTER TABLE "exam_question_options" ADD CONSTRAINT "exam_question_options_sort_order_check" CHECK ("exam_question_options"."sort_order" > 0);--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_points_check" CHECK ("exam_questions"."points" between 1 and 1000);--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_sort_order_check" CHECK ("exam_questions"."sort_order" > 0);--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_answer_shape_check" CHECK ((
        ("exam_questions"."type" in ('single_choice', 'multiple_choice') and "exam_questions"."correct_boolean" is null and "exam_questions"."correct_answer_fa" is null and "exam_questions"."correct_answer_en" is null)
        or ("exam_questions"."type" = 'true_false' and "exam_questions"."correct_boolean" is not null and "exam_questions"."correct_answer_fa" is null and "exam_questions"."correct_answer_en" is null)
        or ("exam_questions"."type" = 'short_answer' and "exam_questions"."correct_boolean" is null and nullif(btrim("exam_questions"."correct_answer_fa"), '') is not null)
      ));--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_duration_minutes_check" CHECK ("exams"."duration_minutes" is null or "exams"."duration_minutes" between 1 and 600);--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_passing_score_check" CHECK ("exams"."passing_score" between 0 and 100);