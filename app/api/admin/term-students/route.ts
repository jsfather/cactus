import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/term-students
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate term-student data
    const termStudents = [
      {
        id: 1,
        term_id: 1,
        student_id: 1,
        course_name: 'رباتیک مقدماتی',
        enrollment_date: '2024-09-15',
        status: 'active',
        grade: null,
        attendance_percentage: 85.5,
        created_at: '2024-09-15T10:00:00Z',
        updated_at: '2024-09-15T10:00:00Z',
        term: {
          id: 1,
          title: 'ترم پاییز 1403'
        },
        student: {
          id: 1,
          first_name: 'علی',
          last_name: 'احمدی',
          phone: '09123456789',
          email: 'ali@example.com'
        }
      },
      {
        id: 2,
        term_id: 1,
        student_id: 2,
        course_name: 'برنامه‌نویسی Arduino',
        enrollment_date: '2024-09-16',
        status: 'active',
        grade: 18.5,
        attendance_percentage: 92.3,
        created_at: '2024-09-16T10:00:00Z',
        updated_at: '2024-09-16T10:00:00Z',
        term: {
          id: 1,
          title: 'ترم پاییز 1403'
        },
        student: {
          id: 2,
          first_name: 'سارا',
          last_name: 'محمدی',
          phone: '09123456790',
          email: 'sara@example.com'
        }
      }
    ];

    return Response.json({ data: termStudents });

  } catch (error) {
    console.error('Get term students error:', error);
    return Response.json({ message: 'خطا در دریافت دانش‌آموزان ترم' }, { status: 500 });
  }
}

// POST /api/admin/term-students
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { term_id, student_id, course_name, enrollment_date, status } = body;

    if (!term_id || !student_id || !course_name) {
      return Response.json(
        { message: 'شناسه ترم، دانش‌آموز و نام دوره الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newTermStudent = {
      id: Date.now(),
      term_id,
      student_id,
      course_name,
      enrollment_date: enrollment_date || new Date().toISOString().split('T')[0],
      status: status || 'active',
      grade: null,
      attendance_percentage: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'ثبت‌نام دانش‌آموز در ترم با موفقیت انجام شد',
      data: newTermStudent
    });

  } catch (error) {
    console.error('Create term student error:', error);
    return Response.json({ message: 'خطا در ثبت‌نام دانش‌آموز در ترم' }, { status: 500 });
  }
}
