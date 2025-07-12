import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/teacher/ticket/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['teacher'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const ticketId = parseInt(params.id);
    
    if (isNaN(ticketId)) {
      return Response.json({ message: 'شناسه تیکت نامعتبر است' }, { status: 400 });
    }

    // Simulate finding ticket
    const ticket = {
      id: ticketId,
      title: 'مشکل در تجهیزات کلاس',
      description: 'پروژکتور کلاس ۲ کار نمی‌کند',
      status: 'open',
      priority: 'high',
      category: 'technical',
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
      teacher: {
        id: authResult.id,
        name: `${authResult.first_name} ${authResult.last_name}`
      },
      replies: [
        {
          id: 1,
          message: 'تیکت شما دریافت شد و در حال بررسی است',
          sender: 'admin',
          created_at: '2024-01-01T11:00:00Z'
        }
      ]
    };

    return Response.json({ data: ticket });

  } catch (error) {
    console.error('Get teacher ticket error:', error);
    return Response.json({ message: 'خطا در دریافت تیکت' }, { status: 500 });
  }
}

// PUT /api/teacher/ticket/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['teacher'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const ticketId = parseInt(params.id);
    
    if (isNaN(ticketId)) {
      return Response.json({ message: 'شناسه تیکت نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, priority, category } = body;

    if (!title || !description) {
      return Response.json(
        { message: 'عنوان و توضیحات الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, verify ownership and update in database
    const updatedTicket = {
      id: ticketId,
      title,
      description,
      priority: priority || 'medium',
      category: category || 'general',
      status: 'open', // Keep existing status
      teacher_id: authResult.id,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'تیکت با موفقیت بروزرسانی شد',
      data: updatedTicket
    });

  } catch (error) {
    console.error('Update teacher ticket error:', error);
    return Response.json({ message: 'خطا در بروزرسانی تیکت' }, { status: 500 });
  }
}
