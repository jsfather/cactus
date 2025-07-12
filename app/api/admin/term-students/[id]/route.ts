import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/term-students/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const termStudentId = parseInt(params.id);
    
    if (isNaN(termStudentId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // Simulate finding term-student
    const termStudent = {
      id: termStudentId,
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
    };

    return Response.json({ data: termStudent });

  } catch (error) {
    console.error('Get term student error:', error);
    return Response.json({ message: 'خطا در دریافت اطلاعات دانش‌آموز ترم' }, { status: 500 });
  }
}

// PUT /api/admin/term-students/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const termStudentId = parseInt(params.id);
    
    if (isNaN(termStudentId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { term_id, student_id, course_name, enrollment_date, status, grade, attendance_percentage } = body;

    if (!term_id || !student_id || !course_name) {
      return Response.json(
        { message: 'شناسه ترم، دانش‌آموز و نام دوره الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedTermStudent = {
      id: termStudentId,
      term_id,
      student_id,
      course_name,
      enrollment_date: enrollment_date || '2024-09-15',
      status: status || 'active',
      grade: grade || null,
      attendance_percentage: attendance_percentage || 0,
      created_at: '2024-09-15T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'اطلاعات دانش‌آموز ترم با موفقیت بروزرسانی شد',
      data: updatedTermStudent
    });

  } catch (error) {
    console.error('Update term student error:', error);
    return Response.json({ message: 'خطا در بروزرسانی اطلاعات دانش‌آموز ترم' }, { status: 500 });
  }
}

// DELETE /api/admin/term-students/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const termStudentId = parseInt(params.id);
    
    if (isNaN(termStudentId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'ثبت‌نام دانش‌آموز از ترم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete term student error:', error);
    return Response.json({ message: 'خطا در حذف ثبت‌نام دانش‌آموز از ترم' }, { status: 500 });
  }
}
