import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/panel-guides/[id]
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

    const guideId = parseInt(params.id);
    
    if (isNaN(guideId)) {
      return Response.json({ message: 'شناسه راهنما نامعتبر است' }, { status: 400 });
    }

    // Simulate finding guide
    const guide = {
      id: guideId,
      title: 'راهنمای استفاده از پنل مدیریت',
      description: 'آموزش کامل استفاده از پنل مدیریت سیستم',
      content: 'محتوای کامل راهنما...',
      is_active: true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    };

    return Response.json({ data: guide });

  } catch (error) {
    console.error('Get panel guide error:', error);
    return Response.json({ message: 'خطا در دریافت راهنما' }, { status: 500 });
  }
}

// PUT /api/admin/panel-guides/[id]
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

    const guideId = parseInt(params.id);
    
    if (isNaN(guideId)) {
      return Response.json({ message: 'شناسه راهنما نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, content, is_active } = body;

    if (!title || !description || !content) {
      return Response.json(
        { message: 'عنوان، توضیحات و محتوا الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedGuide = {
      id: guideId,
      title,
      description,
      content,
      is_active: is_active !== undefined ? is_active : true,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'راهنما با موفقیت بروزرسانی شد',
      data: updatedGuide
    });

  } catch (error) {
    console.error('Update panel guide error:', error);
    return Response.json({ message: 'خطا در بروزرسانی راهنما' }, { status: 500 });
  }
}

// DELETE /api/admin/panel-guides/[id]
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

    const guideId = parseInt(params.id);
    
    if (isNaN(guideId)) {
      return Response.json({ message: 'شناسه راهنما نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'راهنما با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete panel guide error:', error);
    return Response.json({ message: 'خطا در حذف راهنما' }, { status: 500 });
  }
}
