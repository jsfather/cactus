import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/term-teachers
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate term-teacher data
    const termTeachers = [
      {
        id: 1,
        term_id: 1,
        teacher_id: 1,
        course_name: 'رباتیک مقدماتی',
        schedule: 'شنبه و دوشنبه 14:00-16:00',
        max_students: 15,
        enrolled_students: 12,
        status: 'active',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
        term: {
          id: 1,
          title: 'ترم پاییز 1403'
        },
        teacher: {
          id: 1,
          first_name: 'احمد',
          last_name: 'محمدی',
          email: 'ahmad@example.com'
        }
      },
      {
        id: 2,
        term_id: 1,
        teacher_id: 2,
        course_name: 'برنامه‌نویسی Arduino',
        schedule: 'چهارشنبه و پنج‌شنبه 16:00-18:00',
        max_students: 20,
        enrolled_students: 18,
        status: 'active',
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
        term: {
          id: 1,
          title: 'ترم پاییز 1403'
        },
        teacher: {
          id: 2,
          first_name: 'فاطمه',
          last_name: 'احمدی',
          email: 'fateme@example.com'
        }
      }
    ];

    return Response.json({ data: termTeachers });

  } catch (error) {
    console.error('Get term teachers error:', error);
    return Response.json({ message: 'خطا در دریافت معلمان ترم' }, { status: 500 });
  }
}

// POST /api/admin/term-teachers
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { term_id, teacher_id, course_name, schedule, max_students, status } = body;

    if (!term_id || !teacher_id || !course_name) {
      return Response.json(
        { message: 'شناسه ترم، معلم و نام دوره الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newTermTeacher = {
      id: Date.now(),
      term_id,
      teacher_id,
      course_name,
      schedule: schedule || null,
      max_students: max_students || null,
      enrolled_students: 0,
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'تخصیص معلم به ترم با موفقیت انجام شد',
      data: newTermTeacher
    });

  } catch (error) {
    console.error('Create term teacher error:', error);
    return Response.json({ message: 'خطا در تخصیص معلم به ترم' }, { status: 500 });
  }
}
