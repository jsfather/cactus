import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/exams/[examId]/questions
export async function GET(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const examId = parseInt(params.examId);
    
    if (isNaN(examId)) {
      return Response.json({ message: 'شناسه آزمون نامعتبر است' }, { status: 400 });
    }

    // Simulate exam questions data
    const questions = [
      {
        id: 1,
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
      },
      {
        id: 2,
        exam_id: examId,
        text: 'سوال دوم ریاضی چیست؟',
        file: null,
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
        options: [
          {
            id: 5,
            text: 'گزینه اول',
            is_correct: true
          },
          {
            id: 6,
            text: 'گزینه دوم',
            is_correct: false
          },
          {
            id: 7,
            text: 'گزینه سوم',
            is_correct: false
          },
          {
            id: 8,
            text: 'گزینه چهارم',
            is_correct: false
          }
        ]
      }
    ];

    return Response.json({ data: questions });

  } catch (error) {
    console.error('Get exam questions error:', error);
    return Response.json({ message: 'خطا در دریافت سوالات آزمون' }, { status: 500 });
  }
}

// POST /api/admin/exams/[examId]/questions
export async function POST(
  request: Request,
  { params }: { params: { examId: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const examId = parseInt(params.examId);
    
    if (isNaN(examId)) {
      return Response.json({ message: 'شناسه آزمون نامعتبر است' }, { status: 400 });
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

    // In a real implementation, save to database
    const newQuestion = {
      id: Date.now(),
      exam_id: examId,
      text,
      file: file || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      options: options.map((option: any, index: number) => ({
        id: Date.now() + index,
        text: option.text,
        is_correct: option.is_correct || false
      }))
    };

    return Response.json({
      message: 'سوال با موفقیت ایجاد شد',
      data: newQuestion
    });

  } catch (error) {
    console.error('Create exam question error:', error);
    return Response.json({ message: 'خطا در ایجاد سوال' }, { status: 500 });
  }
}
