import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/terms
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate terms data
    const terms = [
      {
        id: 1,
        title: 'ترم پاییز 1403',
        description: 'ترم پاییز سال تحصیلی 1403-1404',
        start_date: '2024-09-22',
        end_date: '2025-01-20',
        is_active: true,
        registration_start: '2024-09-01',
        registration_end: '2024-09-20',
        created_at: '2024-08-01T10:00:00Z',
        updated_at: '2024-08-01T10:00:00Z',
      },
      {
        id: 2,
        title: 'ترم زمستان 1403',
        description: 'ترم زمستان سال تحصیلی 1403-1404',
        start_date: '2025-01-21',
        end_date: '2025-05-21',
        is_active: false,
        registration_start: '2025-01-01',
        registration_end: '2025-01-19',
        created_at: '2024-12-01T10:00:00Z',
        updated_at: '2024-12-01T10:00:00Z',
      }
    ];

    return Response.json({ data: terms });

  } catch (error) {
    console.error('Get terms error:', error);
    return Response.json({ message: 'خطا در دریافت ترم‌ها' }, { status: 500 });
  }
}

// POST /api/admin/terms
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, start_date, end_date, is_active, registration_start, registration_end } = body;

    if (!title || !description || !start_date || !end_date) {
      return Response.json(
        { message: 'عنوان، توضیحات، تاریخ شروع و پایان الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newTerm = {
      id: Date.now(),
      title,
      description,
      start_date,
      end_date,
      is_active: is_active !== undefined ? is_active : true,
      registration_start: registration_start || null,
      registration_end: registration_end || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'ترم با موفقیت ایجاد شد',
      data: newTerm
    });

  } catch (error) {
    console.error('Create term error:', error);
    return Response.json({ message: 'خطا در ایجاد ترم' }, { status: 500 });
  }
}
