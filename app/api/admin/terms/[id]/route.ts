import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/terms/[id]
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

    const termId = parseInt(params.id);
    
    if (isNaN(termId)) {
      return Response.json({ message: 'شناسه ترم نامعتبر است' }, { status: 400 });
    }

    // Simulate finding term
    const term = {
      id: termId,
      title: 'ترم پاییز 1403',
      description: 'ترم پاییز سال تحصیلی 1403-1404',
      start_date: '2024-09-22',
      end_date: '2025-01-20',
      is_active: true,
      registration_start: '2024-09-01',
      registration_end: '2024-09-20',
      created_at: '2024-08-01T10:00:00Z',
      updated_at: '2024-08-01T10:00:00Z',
    };

    return Response.json({ data: term });

  } catch (error) {
    console.error('Get term error:', error);
    return Response.json({ message: 'خطا در دریافت ترم' }, { status: 500 });
  }
}

// PUT /api/admin/terms/[id]
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

    const termId = parseInt(params.id);
    
    if (isNaN(termId)) {
      return Response.json({ message: 'شناسه ترم نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, start_date, end_date, is_active, registration_start, registration_end } = body;

    if (!title || !description || !start_date || !end_date) {
      return Response.json(
        { message: 'عنوان، توضیحات، تاریخ شروع و پایان الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedTerm = {
      id: termId,
      title,
      description,
      start_date,
      end_date,
      is_active: is_active !== undefined ? is_active : true,
      registration_start: registration_start || null,
      registration_end: registration_end || null,
      created_at: '2024-08-01T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'ترم با موفقیت بروزرسانی شد',
      data: updatedTerm
    });

  } catch (error) {
    console.error('Update term error:', error);
    return Response.json({ message: 'خطا در بروزرسانی ترم' }, { status: 500 });
  }
}

// DELETE /api/admin/terms/[id]
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

    const termId = parseInt(params.id);
    
    if (isNaN(termId)) {
      return Response.json({ message: 'شناسه ترم نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'ترم با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete term error:', error);
    return Response.json({ message: 'خطا در حذف ترم' }, { status: 500 });
  }
}
