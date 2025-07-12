import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/term-teachers/[id]
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

    const termTeacherId = parseInt(params.id);
    
    if (isNaN(termTeacherId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // Simulate finding term-teacher
    const termTeacher = {
      id: termTeacherId,
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
    };

    return Response.json({ data: termTeacher });

  } catch (error) {
    console.error('Get term teacher error:', error);
    return Response.json({ message: 'خطا در دریافت اطلاعات معلم ترم' }, { status: 500 });
  }
}

// PUT /api/admin/term-teachers/[id]
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

    const termTeacherId = parseInt(params.id);
    
    if (isNaN(termTeacherId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { term_id, teacher_id, course_name, schedule, max_students, status } = body;

    if (!term_id || !teacher_id || !course_name) {
      return Response.json(
        { message: 'شناسه ترم، معلم و نام دوره الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedTermTeacher = {
      id: termTeacherId,
      term_id,
      teacher_id,
      course_name,
      schedule: schedule || null,
      max_students: max_students || null,
      enrolled_students: 12, // Keep existing value in real implementation
      status: status || 'active',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'اطلاعات معلم ترم با موفقیت بروزرسانی شد',
      data: updatedTermTeacher
    });

  } catch (error) {
    console.error('Update term teacher error:', error);
    return Response.json({ message: 'خطا در بروزرسانی اطلاعات معلم ترم' }, { status: 500 });
  }
}

// DELETE /api/admin/term-teachers/[id]
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

    const termTeacherId = parseInt(params.id);
    
    if (isNaN(termTeacherId)) {
      return Response.json({ message: 'شناسه نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'تخصیص معلم از ترم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete term teacher error:', error);
    return Response.json({ message: 'خطا در حذف تخصیص معلم از ترم' }, { status: 500 });
  }
}
