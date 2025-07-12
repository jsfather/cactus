import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/teachers
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate teachers data
    const teachers = [
      {
        id: 1,
        first_name: 'احمد',
        last_name: 'محمدی',
        username: 'ahmad_mohammadi',
        phone: '09123456789',
        email: 'ahmad@example.com',
        national_code: '1234567890',
        expertise: 'رباتیک و هوش مصنوعی',
        experience_years: 5,
        education: 'کارشناسی ارشد مهندسی کامپیوتر',
        status: 'active',
        join_date: '2023-01-15',
        created_at: '2023-01-15T10:00:00Z',
        updated_at: '2023-01-15T10:00:00Z',
      },
      {
        id: 2,
        first_name: 'فاطمه',
        last_name: 'احمدی',
        username: 'fateme_ahmadi',
        phone: '09123456790',
        email: 'fateme@example.com',
        national_code: '1234567891',
        expertise: 'برنامه‌نویسی و الکترونیک',
        experience_years: 3,
        education: 'کارشناسی مهندسی برق',
        status: 'active',
        join_date: '2023-05-20',
        created_at: '2023-05-20T10:00:00Z',
        updated_at: '2023-05-20T10:00:00Z',
      }
    ];

    return Response.json({ data: teachers });

  } catch (error) {
    console.error('Get teachers error:', error);
    return Response.json({ message: 'خطا در دریافت معلمان' }, { status: 500 });
  }
}

// POST /api/admin/teachers
export async function POST(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    const body = await request.json();
    const { 
      first_name, 
      last_name, 
      username, 
      phone, 
      email, 
      national_code,
      expertise,
      experience_years,
      education,
      status,
      join_date
    } = body;

    if (!first_name || !last_name || !username || !phone) {
      return Response.json(
        { message: 'نام، نام خانوادگی، نام کاربری و شماره تلفن الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newTeacher = {
      id: Date.now(),
      first_name,
      last_name,
      username,
      phone,
      email: email || null,
      national_code: national_code || null,
      expertise: expertise || null,
      experience_years: experience_years || 0,
      education: education || null,
      status: status || 'active',
      join_date: join_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'معلم با موفقیت ایجاد شد',
      data: newTeacher
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    return Response.json({ message: 'خطا در ایجاد معلم' }, { status: 500 });
  }
}
