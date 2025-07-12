import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/exams/[examId]/questions/[id]
export async function GET(
  request: Request,
  { params }: { params: { examId: string; id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const examId = parseInt(params.examId);
    const questionId = parseInt(params.id);
    
    if (isNaN(examId) || isNaN(questionId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // Simulate finding question
    const question = {
      id: questionId,
      exam_id: examId,
      text: 'سوال اول فیزیک چیست؟',
      file: null,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      options: [
        {
          id: 1,
          text: 'گزینه اول',
          is_correct: false
        },
        {
          id: 2,
          text: 'گزینه دوم',
          is_correct: true
        },
        {
          id: 3,
          text: 'گزینه سوم',
          is_correct: false
        },
        {
          id: 4,
          text: 'گزینه چهارم',
          is_correct: false
        }
      ]
    };

    return Response.json({ data: question });

  } catch (error) {
    console.error('Get exam question error:', error);
    return Response.json({ message: 'خطا در دریافت سوال' }, { status: 500 });
  }
}

// PUT /api/admin/exams/[examId]/questions/[id]
export async function PUT(
  request: Request,
  { params }: { params: { examId: string; id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const examId = parseInt(params.examId);
    const questionId = parseInt(params.id);
    
    if (isNaN(examId) || isNaN(questionId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { text, file, options } = body;

    if (!text || !options || !Array.isArray(options) || options.length === 0) {
      return Response.json(
        { message: 'متن سوال و گزینه‌ها الزامی است' },
        { status: 400 }
      );
    }

    // Validate options
    const hasCorrectAnswer = options.some((option: any) => option.is_correct);
    if (!hasCorrectAnswer) {
      return Response.json(
        { message: 'حداقل یک گزینه صحیح باید انتخاب شود' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedQuestion = {
      id: questionId,
      exam_id: examId,
      text,
      file: file || null,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString(),
      options: options.map((option: any) => ({
        id: option.id || Date.now(),
        text: option.text,
        is_correct: option.is_correct || false
      }))
    };

    return Response.json({
      message: 'سوال با موفقیت بروزرسانی شد',
      data: updatedQuestion
    });

  } catch (error) {
    console.error('Update exam question error:', error);
    return Response.json({ message: 'خطا در بروزرسانی سوال' }, { status: 500 });
  }
}

// DELETE /api/admin/exams/[examId]/questions/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { examId: string; id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const examId = parseInt(params.examId);
    const questionId = parseInt(params.id);
    
    if (isNaN(examId) || isNaN(questionId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'سوال با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete exam question error:', error);
    return Response.json({ message: 'خطا در حذف سوال' }, { status: 500 });
  }
}
