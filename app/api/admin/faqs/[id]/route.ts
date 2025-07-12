import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/faqs/[id]
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

    const faqId = parseInt(params.id);
    
    if (isNaN(faqId)) {
      return Response.json({ message: 'شناسه سوال متداول نامعتبر است' }, { status: 400 });
    }

    // Simulate finding FAQ
    const faq = {
      id: faqId,
      question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
      answer: 'برای ثبت‌نام در دوره‌ها، ابتدا باید حساب کاربری خود را ایجاد کنید و سپس از طریق صفحه دوره‌ها اقدام به ثبت‌نام نمایید.',
      is_active: true,
      order: 1,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: '2024-01-01T10:00:00Z',
    };

    return Response.json({ data: faq });

  } catch (error) {
    console.error('Get FAQ error:', error);
    return Response.json({ message: 'خطا در دریافت سوال متداول' }, { status: 500 });
  }
}

// PUT /api/admin/faqs/[id]
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

    const faqId = parseInt(params.id);
    
    if (isNaN(faqId)) {
      return Response.json({ message: 'شناسه سوال متداول نامعتبر است' }, { status: 400 });
    }

    const body = await request.json();
    const { question, answer, is_active, order } = body;

    if (!question || !answer) {
      return Response.json(
        { message: 'سوال و پاسخ الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, update in database
    const updatedFaq = {
      id: faqId,
      question,
      answer,
      is_active: is_active !== undefined ? is_active : true,
      order: order || 1,
      created_at: '2024-01-01T10:00:00Z',
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'سوال متداول با موفقیت بروزرسانی شد',
      data: updatedFaq
    });

  } catch (error) {
    console.error('Update FAQ error:', error);
    return Response.json({ message: 'خطا در بروزرسانی سوال متداول' }, { status: 500 });
  }
}

// DELETE /api/admin/faqs/[id]
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

    const faqId = parseInt(params.id);
    
    if (isNaN(faqId)) {
      return Response.json({ message: 'شناسه سوال متداول نامعتبر است' }, { status: 400 });
    }

    // In a real implementation, delete from database
    return Response.json({
      message: 'سوال متداول با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete FAQ error:', error);
    return Response.json({ message: 'خطا در حذف سوال متداول' }, { status: 500 });
  }
}
