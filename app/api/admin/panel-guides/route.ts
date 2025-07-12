import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/panel-guides
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate panel guides data
    const panelGuides = [
      {
        id: 1,
        title: 'راهنمای استفاده از پنل مدیریت',
        description: 'آموزش کامل استفاده از پنل مدیریت سیستم',
        content: 'محتوای کامل راهنما...',
        is_active: true,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        title: 'راهنمای مدیریت دانش‌آموزان',
        description: 'نحوه مدیریت دانش‌آموزان در سیستم',
        content: 'محتوای کامل راهنما...',
        is_active: true,
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
      }
    ];

    return Response.json({ data: panelGuides });

  } catch (error) {
    console.error('Get panel guides error:', error);
    return Response.json({ message: 'خطا در دریافت راهنماها' }, { status: 500 });
  }
}

// POST /api/admin/panel-guides
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, content, is_active } = body;

    if (!title || !description || !content) {
      return Response.json(
        { message: 'عنوان، توضیحات و محتوا الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newGuide = {
      id: Date.now(),
      title,
      description,
      content,
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'راهنما با موفقیت ایجاد شد',
      data: newGuide
    });

  } catch (error) {
    console.error('Create panel guide error:', error);
    return Response.json({ message: 'خطا در ایجاد راهنما' }, { status: 500 });
  }
}
