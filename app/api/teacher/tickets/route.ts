import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/teacher/tickets
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['teacher'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate teacher tickets data
    const tickets = [
      {
        id: 1,
        title: 'مشکل در تجهیزات کلاس',
        description: 'پروژکتور کلاس ۲ کار نمی‌کند',
        status: 'open',
        priority: 'high',
        category: 'technical',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
        teacher: {
          id: authResult.id,
          name: 'احمد محمدی'
        }
      },
      {
        id: 2,
        title: 'درخواست تجهیزات جدید',
        description: 'نیاز به Arduino بیشتر برای کلاس رباتیک',
        status: 'in_progress',
        priority: 'medium',
        category: 'equipment',
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
        teacher: {
          id: authResult.id,
          name: 'احمد محمدی'
        }
      }
    ];

    return Response.json({ data: tickets });

  } catch (error) {
    console.error('Get teacher tickets error:', error);
    return Response.json({ message: 'خطا در دریافت تیکت‌های معلم' }, { status: 500 });
  }
}

// POST /api/teacher/tickets
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['teacher'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, priority, category } = body;

    if (!title || !description) {
      return Response.json(
        { message: 'عنوان و توضیحات الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newTicket = {
      id: Date.now(),
      title,
      description,
      status: 'open',
      priority: priority || 'medium',
      category: category || 'general',
      teacher_id: authResult.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'تیکت با موفقیت ایجاد شد',
      data: newTicket
    });

  } catch (error) {
    console.error('Create teacher ticket error:', error);
    return Response.json({ message: 'خطا در ایجاد تیکت' }, { status: 500 });
  }
}
