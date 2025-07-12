import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/faqs
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate FAQ data
    const faqs = [
      {
        id: 1,
        question: 'چگونه می‌توانم در دوره‌ها ثبت‌نام کنم؟',
        answer: 'برای ثبت‌نام در دوره‌ها، ابتدا باید حساب کاربری خود را ایجاد کنید و سپس از طریق صفحه دوره‌ها اقدام به ثبت‌نام نمایید.',
        is_active: true,
        order: 1,
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        question: 'نحوه پرداخت هزینه دوره‌ها چگونه است؟',
        answer: 'پرداخت هزینه دوره‌ها از طریق درگاه‌های بانکی معتبر و آنلاین امکان‌پذیر است.',
        is_active: true,
        order: 2,
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
      }
    ];

    return Response.json({ data: faqs });

  } catch (error) {
    console.error('Get FAQs error:', error);
    return Response.json({ message: 'خطا در دریافت سوالات متداول' }, { status: 500 });
  }
}

// POST /api/admin/faqs
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { question, answer, is_active, order } = body;

    if (!question || !answer) {
      return Response.json(
        { message: 'سوال و پاسخ الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newFaq = {
      id: Date.now(),
      question,
      answer,
      is_active: is_active !== undefined ? is_active : true,
      order: order || 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'سوال متداول با موفقیت ایجاد شد',
      data: newFaq
    });

  } catch (error) {
    console.error('Create FAQ error:', error);
    return Response.json({ message: 'خطا در ایجاد سوال متداول' }, { status: 500 });
  }
}
