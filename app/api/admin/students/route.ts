import { requireAuth, requireRole } from '@/app/api/middleware/auth';

// GET /api/admin/students
export async function GET(request: Request) {
  try {
    const authResult = requireAuth(request);
    if (authResult instanceof Response) return authResult;

    if (!requireRole(authResult, ['admin'])) {
      return Response.json({ message: 'دسترسی غیرمجاز' }, { status: 403 });
    }

    // Simulate students data
    const students = [
      {
        id: 1,
        first_name: 'علی',
        last_name: 'احمدی',
        username: 'ali_ahmadi',
        phone: '09123456789',
        email: 'ali@example.com',
        national_code: '1234567890',
        father_name: 'محمد',
        mother_name: 'فاطمه',
        birth_date: '1385-05-15',
        has_allergy: false,
        allergy_details: null,
        interest_level: 85,
        focus_level: 78,
        status: 'active',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z',
      },
      {
        id: 2,
        first_name: 'سارا',
        last_name: 'محمدی',
        username: 'sara_mohammadi',
        phone: '09123456790',
        email: 'sara@example.com',
        national_code: '1234567891',
        father_name: 'احمد',
        mother_name: 'زهرا',
        birth_date: '1386-03-20',
        has_allergy: true,
        allergy_details: 'حساسیت به گرد و غبار',
        interest_level: 92,
        focus_level: 88,
        status: 'active',
        created_at: '2024-01-02T10:00:00Z',
        updated_at: '2024-01-02T10:00:00Z',
      }
    ];

    return Response.json({ data: students });

  } catch (error) {
    console.error('Get students error:', error);
    return Response.json({ message: 'خطا در دریافت دانش‌آموزان' }, { status: 500 });
  }
}

// POST /api/admin/students
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
      father_name,
      mother_name,
      birth_date,
      has_allergy,
      allergy_details,
      interest_level,
      focus_level,
      status 
    } = body;

    if (!first_name || !last_name || !username || !phone) {
      return Response.json(
        { message: 'نام، نام خانوادگی، نام کاربری و شماره تلفن الزامی است' },
        { status: 400 }
      );
    }

    // In a real implementation, save to database
    const newStudent = {
      id: Date.now(),
      first_name,
      last_name,
      username,
      phone,
      email: email || null,
      national_code: national_code || null,
      father_name: father_name || null,
      mother_name: mother_name || null,
      birth_date: birth_date || null,
      has_allergy: has_allergy || false,
      allergy_details: allergy_details || null,
      interest_level: interest_level || null,
      focus_level: focus_level || null,
      status: status || 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return Response.json({
      message: 'دانش‌آموز با موفقیت ایجاد شد',
      data: newStudent
    });

  } catch (error) {
    console.error('Create student error:', error);
    return Response.json({ message: 'خطا در ایجاد دانش‌آموز' }, { status: 500 });
  }
}
